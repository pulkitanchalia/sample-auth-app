# Google SSO Integration Guide

## Overview
This guide explains how to set up and use Google Single Sign-On (SSO) with the authentication application.

## Google Cloud Console Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Identity and Access Management (IAM) API

### 2. Configure OAuth 2.0
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Set the following:
   - **Name**: Your app name (e.g., "Auth App")
   - **Authorized JavaScript origins**: 
     - `http://localhost:4200` (for development)
     - Your production domain
   - **Authorized redirect URIs**: 
     - `http://localhost:4200` (for development)
     - Your production domain

### 3. Get Client Credentials
1. Copy the **Client ID** from the credentials page
2. Update the following files with your Client ID:
   - `backend/.env`: Set `GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`
   - `frontend/auth-app/src/app/services/google-signin.service.ts`: Update the client_id
   - `frontend/auth-app/src/app/components/login/login.component.ts`: Update the client_id
   - `frontend/auth-app/src/app/components/signup/signup.component.ts`: Update the client_id

## Backend Configuration

### Environment Variables
Update your `backend/.env` file:
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Database Migration
The database has been updated to support Google SSO. If you have existing data, run:
```bash
python migrate_db.py
```

### New API Endpoints
- `POST /auth/google` - Authenticate with Google ID token
- User model now includes:
  - `google_id`: Google user identifier
  - `profile_picture`: Google profile picture URL
  - `auth_provider`: "local" or "google"

## Frontend Integration

### Google Sign-In Components
The login and signup components now include:
- Google Sign-In button
- Automatic user creation/login
- Profile picture display
- Provider information

### New Services
- `GoogleSignInService`: Handles Google Sign-In API integration
- Updated `AuthService`: Includes `googleAuth()` method

## Features Added

### User Experience
1. **Google Sign-In Button**: One-click authentication
2. **Seamless Registration**: Automatic account creation for new Google users
3. **Profile Pictures**: Display Google profile pictures
4. **Provider Information**: Shows whether user signed up with Google or locally
5. **Username Generation**: Automatic username creation from email

### Security Features
1. **Token Verification**: Server-side Google ID token validation
2. **Email Verification**: Only verified Google accounts accepted
3. **Unique Constraints**: Prevents duplicate accounts
4. **JWT Integration**: Same token system for all authentication methods

### Admin Dashboard Updates
- User management shows auth provider
- Profile pictures in user lists
- Google user identification

## Usage Instructions

### For Users
1. **Sign Up with Google**:
   - Click "Sign in with Google" on signup page
   - Authorize the application
   - Automatic account creation and login

2. **Login with Google**:
   - Click "Sign in with Google" on login page
   - Automatic authentication for existing users

3. **Regular Login**:
   - Traditional username/password login still available
   - Works for both local and Google users

### For Developers
1. **Testing Locally**:
   - Ensure both backend and frontend are running
   - Use `http://localhost:4200` for testing
   - Check browser console for any Google API errors

2. **Production Deployment**:
   - Update Google OAuth settings with production domain
   - Set production environment variables
   - Ensure HTTPS for security

## Troubleshooting

### Common Issues
1. **"Invalid Google token"**:
   - Check if Client ID matches in all files
   - Verify domain is authorized in Google Console

2. **"Google account email not verified"**:
   - User must verify their Google account email
   - This is a security requirement

3. **Button not rendering**:
   - Check browser console for JavaScript errors
   - Ensure Google APIs are loaded

### Error Codes
- `401 Unauthorized`: Invalid or expired Google token
- `400 Bad Request`: Email not verified or already registered

## Security Considerations

### Data Protection
- Google ID tokens are verified server-side
- No passwords stored for Google users
- Profile pictures loaded from Google's CDN

### Privacy
- Only basic profile information is accessed
- Email, name, and profile picture
- No access to Google account data

### Best Practices
- Always verify tokens server-side
- Use HTTPS in production
- Implement proper error handling
- Regular security updates

## File Structure
```
backend/
├── google_oauth.py (new)
├── main.py (updated with Google endpoints)
├── database.py (updated User model)
├── schemas.py (new Google schemas)
└── .env (Google credentials)

frontend/auth-app/src/app/
├── services/
│   ├── google-signin.service.ts (new)
│   └── auth.service.ts (updated)
├── components/
│   ├── login/ (updated with Google)
│   ├── signup/ (updated with Google)
│   └── dashboard/ (shows profile pictures)
└── models/
    └── user.model.ts (updated)
```

This integration provides a complete Google SSO solution with proper security, user experience, and administrative features.
