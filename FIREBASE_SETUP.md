# Firebase Setup Guide

## Overview
The profile feature has been implemented with Firebase Authentication (Google) and Realtime Database integration.

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Google Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Add your project's support email
5. Click **Save**

### 3. Set Up Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click **Create Database**
3. Choose a location (e.g., us-central1)
4. Start in **Test mode** (for development)
   - You can configure security rules later
5. Click **Enable**

### 4. Configure Firebase in Your Project

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Grommet Web")
5. Copy the Firebase configuration object

### 5. Create .env.local File

1. Copy the `.env.local.example` file to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase credentials from the config object:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

3. Make sure `.env.local` is in your `.gitignore` (it should be by default)

### 6. Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your development domain:
   - `localhost` (should be there by default)
3. For production, add your production domain (e.g., `yourdomain.com`)

### 7. Run the Application

```bash
npm run dev
```

Navigate to `http://localhost:3000/profile` to test the login flow.

## Features Implemented

### Profile Page (`/profile`)
- ✅ Firebase authentication state detection using `onAuthStateChanged`
- ✅ Google Sign-in with popup
- ✅ User profile display (name, email, photo)
- ✅ Logout functionality
- ✅ Loading states during auth operations
- ✅ Error handling for popup closed and auth errors

### Database Integration
- ✅ User creation/update in Realtime Database at `users/{uid}`
- ✅ Stores: `uid`, `name`, `email`, `photoURL`, `provider`, `createdAt`, `lastLoginAt`
- ✅ Idempotent user creation (doesn't overwrite `createdAt`)
- ✅ Updates `lastLoginAt` on every login

### Navbar
- ✅ Profile icon navigates to `/profile`
- ✅ Integrated with existing navigation

### State Management
- ✅ Clean React hooks (`useState`, `useEffect`)
- ✅ Proper cleanup of auth listeners
- ✅ Loading and error states

## Database Structure

```json
{
  "users": {
    "{uid}": {
      "uid": "firebase_user_id",
      "name": "User Name",
      "email": "user@example.com",
      "photoURL": "https://...",
      "provider": "google",
      "createdAt": 1234567890,
      "lastLoginAt": 1234567890
    }
  }
}
```

## Security Considerations (Production)

### Realtime Database Rules
Before deploying to production, update your Realtime Database rules:

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

This ensures:
- Users can only read their own data
- Users can only write to their own record

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Authorized domains in Firebase Console

### "Permission denied" in Realtime Database
- Check your database rules
- Ensure you're in Test mode during development

### "Firebase not configured"
- Verify all environment variables in `.env.local`
- Restart the dev server after adding env variables

### Popup blocked
- Allow popups for localhost in your browser
- Try a different browser if the issue persists

## Testing the Flow

1. Navigate to `/profile`
2. Click "Login with Google"
3. Select a Google account
4. After login, you should see your profile info
5. Check Firebase Console > Realtime Database to see the user record
6. Click "Logout" to sign out
7. You should return to the login screen

## Next Steps (Optional Enhancements)

- Add email/password authentication
- Add user profile editing
- Add profile photo upload
- Implement protected routes
- Add email verification
- Add password reset functionality
