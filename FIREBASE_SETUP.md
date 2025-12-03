# Firebase Setup Instructions

## Firebase Realtime Database Security Rules

The permission denied error occurs because Firebase Realtime Database has default security rules that deny all read/write access. You need to update your Firebase security rules.

### Step 1: Go to Firebase Console
1. Visit https://console.firebase.google.com/
2. Select your project
3. Click on "Realtime Database" in the left sidebar
4. Click on the "Rules" tab

### Step 2: Update Security Rules

Replace the existing rules with the following:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

**What this does:**
- Allows each user to read and write only their own data
- Data is stored under `users/{userId}/`
- Authenticated users can access their own profile, settings, and RFPs

### Step 3: For Development/Testing (Optional)

If you want to allow all authenticated users to read/write (NOT recommended for production):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Step 4: For Admin Access

If you need admin users to access all data:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()",
        ".write": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()"
      }
    },
    "admins": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "root.child('admins').child(auth.uid).exists()"
    }
  }
}
```

## Important Notes

1. **Authentication Required**: Firebase rules require authentication. Make sure users are logged in with Clerk before accessing Firebase.

2. **Clerk + Firebase Integration**: The current implementation uses Clerk for authentication but Firebase expects Firebase Auth. You have two options:

   **Option A: Use Custom Tokens (Recommended)**
   - Create a Firebase custom token using Clerk user ID
   - Sign in to Firebase with the custom token
   - This requires a backend endpoint

   **Option B: Use Firebase Auth Directly**
   - Replace Clerk with Firebase Authentication
   - Or use both (Clerk for UI, Firebase for data)

3. **Current Fallback**: The app currently uses localStorage as a fallback when Firebase permission is denied. This works but data won't sync across devices.

## Quick Fix for Testing

For immediate testing, use these permissive rules (⚠️ NOT for production):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**WARNING**: This allows anyone to read/write all data. Only use for testing!

## Recommended Production Setup

1. Set up Firebase Cloud Functions to create custom tokens
2. Use Clerk webhooks to sync user data
3. Implement proper security rules as shown above
4. Test thoroughly before deployment

## Current App Behavior

- ✅ If Firebase is configured and rules allow access: Data saves to Firebase
- ✅ If Firebase permission denied: Data saves to localStorage (fallback)
- ✅ Settings persist across sessions using localStorage
- ✅ No errors shown to user (graceful degradation)
