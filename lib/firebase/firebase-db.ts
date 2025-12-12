import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    onSnapshot,
    QuerySnapshot,
    DocumentData,
    addDoc
} from 'firebase/firestore';
import { RFP } from '@/types';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

export const db = getFirestore(app);

// Collections
export const COLLECTIONS = {
    RFPS: 'rfps',
    USERS: 'users',
    COMPANIES: 'companies',
    PRODUCTS: 'products',
    AGENT_LOGS: 'agentLogs',
    SCANNED_RFPS: 'scannedRfps',
};

/**
 * Firebase Database Service for TenderAI
 */
export class FirebaseDBService {
    /**
     * Get all RFPs for a company
     */
    async getRFPs(companyId?: string): Promise<RFP[]> {
        try {
            const rfpsRef = collection(db, COLLECTIONS.RFPS);
            let q;

            if (companyId) {
                // When filtering by companyId/userId, don't use orderBy to avoid needing composite index
                // We'll sort in memory instead
                q = query(rfpsRef, where('userId', '==', companyId));
            } else {
                // Only use orderBy when not filtering
                q = query(rfpsRef, orderBy('deadline', 'asc'));
            }

            const querySnapshot = await getDocs(q);
            const rfps: RFP[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                rfps.push({
                    id: doc.id,
                    ...data,
                    // Convert Firestore timestamps to strings
                    deadline: data.deadline instanceof Timestamp ? data.deadline.toDate().toISOString() : data.deadline,
                    submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate().toISOString() : data.submittedAt,
                } as RFP);
            });

            // Sort in memory if we filtered by companyId
            if (companyId && rfps.length > 0) {
                rfps.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
            }

            return rfps;
        } catch (error) {
            console.error('Error fetching RFPs from Firebase:', error);
            return [];
        }
    }

    /**
     * Get a single RFP by ID
     */
    async getRFP(id: string): Promise<RFP | null> {
        try {
            const rfpRef = doc(db, COLLECTIONS.RFPS, id);
            const rfpDoc = await getDoc(rfpRef);

            if (rfpDoc.exists()) {
                const data = rfpDoc.data();
                return {
                    id: rfpDoc.id,
                    ...data,
                    deadline: data.deadline instanceof Timestamp ? data.deadline.toDate().toISOString() : data.deadline,
                    submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate().toISOString() : data.submittedAt,
                } as RFP;
            }

            return null;
        } catch (error) {
            console.error('Error fetching RFP from Firebase:', error);
            return null;
        }
    }

    /**
     * Create or update an RFP
     */
    async saveRFP(rfp: RFP, userId?: string): Promise<void> {
        try {
            // Remove undefined fields to prevent Firebase errors
            const cleanRfpData = Object.entries(rfp).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as any);

            const rfpData = {
                ...cleanRfpData,
                userId: userId || cleanRfpData.userId, // Associate with user
                updatedAt: Timestamp.now(),
            };

            if (rfp.id) {
                const rfpRef = doc(db, COLLECTIONS.RFPS, rfp.id);
                await setDoc(rfpRef, rfpData, { merge: true });
            } else {
                await addDoc(collection(db, COLLECTIONS.RFPS), {
                    ...rfpData,
                    createdAt: Timestamp.now(),
                });
            }
        } catch (error) {
            console.error('Error saving RFP to Firebase:', error);
            throw error;
        }
    }

    /**
     * Update specific fields of an RFP
     */
    async updateRFP(id: string, updates: Partial<RFP>): Promise<void> {
        try {
            const rfpRef = doc(db, COLLECTIONS.RFPS, id);
            await updateDoc(rfpRef, {
                ...updates,
                updatedAt: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error updating RFP in Firebase:', error);
            throw error;
        }
    }

    /**
     * Delete an RFP
     */
    async deleteRFP(id: string): Promise<void> {
        try {
            const rfpRef = doc(db, COLLECTIONS.RFPS, id);
            await deleteDoc(rfpRef);
        } catch (error) {
            console.error('Error deleting RFP from Firebase:', error);
            throw error;
        }
    }

    /**
     * Subscribe to RFP changes (real-time updates)
     */
    subscribeToRFPs(
        companyId: string | undefined,
        callback: (rfps: RFP[]) => void
    ): () => void {
        const rfpsRef = collection(db, COLLECTIONS.RFPS);
        let q = query(rfpsRef, orderBy('deadline', 'asc'));

        if (companyId) {
            q = query(rfpsRef, where('companyId', '==', companyId), orderBy('deadline', 'asc'));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
            const rfps: RFP[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                rfps.push({
                    id: doc.id,
                    ...data,
                    deadline: data.deadline instanceof Timestamp ? data.deadline.toDate().toISOString() : data.deadline,
                    submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate().toISOString() : data.submittedAt,
                } as RFP);
            });
            callback(rfps);
        });

        return unsubscribe;
    }

    /**
     * Save scanned RFP for tracking
     */
    async saveScannedRFP(rfpData: any): Promise<void> {
        try {
            await addDoc(collection(db, COLLECTIONS.SCANNED_RFPS), {
                ...rfpData,
                scannedAt: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error saving scanned RFP:', error);
        }
    }

    /**
     * Save agent log
     */
    async saveAgentLog(log: any): Promise<void> {
        try {
            await addDoc(collection(db, COLLECTIONS.AGENT_LOGS), {
                ...log,
                timestamp: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error saving agent log:', error);
        }
    }

    /**
     * Get company profile
     */
    async getCompanyProfile(userId: string): Promise<any | null> {
        try {
            const userRef = doc(db, COLLECTIONS.USERS, userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.companyId) {
                    const companyRef = doc(db, COLLECTIONS.COMPANIES, userData.companyId);
                    const companyDoc = await getDoc(companyRef);
                    return companyDoc.exists() ? companyDoc.data() : null;
                }
            }

            return null;
        } catch (error) {
            console.error('Error fetching company profile:', error);
            return null;
        }
    }

    /**
     * Save company profile
     */
    async saveCompanyProfile(userId: string, companyData: any): Promise<void> {
        try {
            // First, save or update company
            let companyId = companyData.id;
            if (!companyId) {
                const companyRef = await addDoc(collection(db, COLLECTIONS.COMPANIES), {
                    ...companyData,
                    createdAt: Timestamp.now(),
                });
                companyId = companyRef.id;
            } else {
                const companyRef = doc(db, COLLECTIONS.COMPANIES, companyId);
                await setDoc(companyRef, companyData, { merge: true });
            }

            // Link user to company
            const userRef = doc(db, COLLECTIONS.USERS, userId);
            await setDoc(userRef, {
                companyId,
                updatedAt: Timestamp.now(),
            }, { merge: true });
        } catch (error) {
            console.error('Error saving company profile:', error);
            throw error;
        }
    }

    /**
     * Initialize demo data for a company
     */
    async initializeDemoData(companyId: string): Promise<void> {
        try {
            // Import demo data
            const demoRFPs = require('@/data/rfps.json');

            // Add demo RFPs to Firebase with company ID
            const batch: Promise<void>[] = [];
            demoRFPs.forEach((rfp: any) => {
                batch.push(
                    addDoc(collection(db, COLLECTIONS.RFPS), {
                        ...rfp,
                        companyId,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    })
                );
            });

            await Promise.all(batch);
            console.log('Demo data initialized successfully');
        } catch (error) {
            console.error('Error initializing demo data:', error);
        }
    }
}

export const firebaseDB = new FirebaseDBService();
