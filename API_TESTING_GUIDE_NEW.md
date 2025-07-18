# API Testing Guide

## 🎯 Overview
This guide provides comprehensive instructions for testing all API endpoints of the authentication system, including regular authentication, Google SSO, and admin functionality.

## 🛠️ Available Test Files

### HTTP Test Files (VS Code REST Client)
- **`api_tests.http`** - General authentication endpoints
- **`admin_api_tests.http`** - Admin-only endpoints  
- **`google_sso_tests.http`** - Google SSO integration tests

### How to Use HTTP Files
1. **Install VS Code Extension**: REST Client
2. **Open any .http file** in VS Code
3. **Click "Send Request"** above each endpoint
4. **View responses** in VS Code

## 🔐 Authentication Testing

### 1. Regular Authentication Flow

#### User Registration
```http
POST http://localhost:8000/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123"
}
```

#### User Login
```http
POST http://localhost:8000/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "test123"
}
```

#### Get Current User (Protected)
```http
GET http://localhost:8000/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### User Logout
```http
POST http://localhost:8000/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. Google SSO Testing

⚠️ **Note**: Requires Google OAuth setup (see GOOGLE_SSO_GUIDE.md)

#### Google Authentication
```http
POST http://localhost:8000/auth/google
Content-Type: application/json

{
  "token": "GOOGLE_ID_TOKEN_HERE"
}
```

**Getting Google ID Token:**
1. Use Google Sign-In on frontend
2. Capture token from browser network tab
3. Use token in API test

## 👑 Admin Testing

### Prerequisites
- Have admin user created (first user or username "admin")
- Get JWT token from login
- Replace `YOUR_TOKEN` in examples with actual JWT

### 1. Admin Statistics
```http
GET http://localhost:8000/admin/stats
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "total_users": 5,
  "active_users": 4,
  "inactive_users": 1
}
```

### 2. Get All Users
```http
GET http://localhost:8000/admin/users
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00",
    "last_login": "2024-01-01T15:30:00",
    "google_id": null,
    "profile_picture": null,
    "auth_provider": "local"
  }
]
```

### 3. Get Specific User
```http
GET http://localhost:8000/admin/users/2
Authorization: Bearer YOUR_TOKEN
```

### 4. Update User Status
```http
PUT http://localhost:8000/admin/users/2/status
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "is_active": false
}
```

### 5. Delete User
```http
DELETE http://localhost:8000/admin/users/2
Authorization: Bearer YOUR_TOKEN
```

⚠️ **Note**: Cannot delete your own admin account

## 🧪 Complete Testing Workflow

### Step 1: Setup
1. **Start Backend**: `.\start-backend.bat`
2. **Verify API**: http://localhost:8000/docs
3. **Check Health**: `GET http://localhost:8000/`

### Step 2: Create Admin User
```http
POST http://localhost:8000/signup
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com", 
  "password": "admin123"
}
```

### Step 3: Login as Admin
```http
POST http://localhost:8000/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Copy the `access_token` from response for next steps**

### Step 4: Test Admin Endpoints
Replace `YOUR_TOKEN` with the token from Step 3:

1. **Get Stats**: `GET /admin/stats`
2. **List Users**: `GET /admin/users`
3. **Create Test User**: Use signup endpoint
4. **Manage Test User**: Update status, delete

### Step 5: Test Google SSO (Optional)
1. **Configure Google OAuth** (see GOOGLE_SSO_GUIDE.md)
2. **Get Google ID Token** from frontend
3. **Test Google Auth**: `POST /auth/google`

## 🔍 PowerShell Testing

### Setup Variables
```powershell
$baseUrl = "http://localhost:8000"
$headers = @{ "Content-Type" = "application/json" }
```

### Register User
```powershell
$signupBody = @{
    username = "testuser"
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/signup" -Method POST -Body $signupBody -Headers $headers
```

### Login and Get Token
```powershell
$loginBody = @{
    username = "testuser"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body $loginBody -Headers $headers
$token = $response.access_token
```

### Use Protected Endpoints
```powershell
$authHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get user profile
Invoke-RestMethod -Uri "$baseUrl/me" -Method GET -Headers $authHeaders

# Admin: Get all users (if admin user)
Invoke-RestMethod -Uri "$baseUrl/admin/users" -Method GET -Headers $authHeaders
```

## ❌ Common Issues & Solutions

### 1. 401 Unauthorized
- **Cause**: Invalid or expired JWT token
- **Solution**: Login again to get fresh token

### 2. 403 Forbidden (Admin endpoints)
- **Cause**: User doesn't have admin privileges
- **Solution**: Use admin user (first user or username "admin")

### 3. 422 Validation Error
- **Cause**: Invalid request body format
- **Solution**: Check JSON syntax and required fields

### 4. CORS Error
- **Cause**: Backend not running or wrong port
- **Solution**: Ensure backend runs on http://localhost:8000

### 5. Google SSO Errors
- **Cause**: Invalid Google token or configuration
- **Solution**: Verify Google OAuth setup and token validity

## 🛡️ Security Testing

### Test Invalid Access
```http
# Test without token (should fail)
GET http://localhost:8000/me

# Test with invalid token (should fail)
GET http://localhost:8000/me
Authorization: Bearer invalid_token

# Test admin endpoint as regular user (should fail)
GET http://localhost:8000/admin/users
Authorization: Bearer REGULAR_USER_TOKEN
```

## 📊 Using Postman Collection

A Postman collection is also provided in `postman_collection.json`:

1. **Import Collection**: Import the JSON file into Postman
2. **Set Environment**: Create environment variable for base URL
3. **Run Tests**: Execute the collection or individual requests

This comprehensive testing approach ensures all functionality works correctly across all user types and authentication methods.
