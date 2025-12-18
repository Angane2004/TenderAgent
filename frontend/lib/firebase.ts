import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getDatabase, Database } from 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

// Check if Firebase is properly configured (not placeholder values)
const isFirebaseConfigured =
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.apiKey.length > 20 && // Real API keys are longer
    firebaseConfig.databaseURL &&
    firebaseConfig.databaseURL !== 'https://your_project.firebaseio.com' &&
    firebaseConfig.databaseURL.includes('firebaseio.com')

// Initialize Firebase only if properly configured
let app: FirebaseApp | null = null
let database: Database | null = null

if (isFirebaseConfigured) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
        database = getDatabase(app)
        console.log('✅ Firebase initialized successfully')
    } catch {
        console.warn('⚠️ Firebase initialization failed, using localStorage fallback')
        app = null
        database = null
    }
} else {
    console.log('ℹ️ Firebase not configured, using localStorage fallback')
}

export { app, database, isFirebaseConfigured }
