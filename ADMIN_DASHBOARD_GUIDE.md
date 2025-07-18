# Admin Dashboard & User Management Guide

## 🎯 Overview
This authentication application includes a comprehensive admin dashboard for managing users, with real-time statistics, user management capabilities, and Google SSO integration. Admin users can view all registered users, their authentication providers, and perform administrative actions.

## ✨ Key Features

### 👑 Admin Dashboard Interface
- **📊 User Statistics Cards**: Real-time display of total, active, and inactive users
- **📋 User Management Table**: Comprehensive listing of all users with details
- **🔄 Real-time Updates**: Refresh functionality to get latest user data
- **🎨 Modern UI**: Clean, responsive design with professional styling
- **🔒 Protected Access**: Admin-only routes with proper authentication

### 🛠️ User Management Actions
- **✅ Activate Users**: Enable user accounts
- **❌ Deactivate Users**: Disable user accounts without deletion
- **🗑️ Delete Users**: Permanently remove users (with confirmation)
- **👁️ View Details**: Display comprehensive user information
- **🛡️ Self-Protection**: Admins cannot delete their own accounts

### 📊 User Information Display
- **Basic Info**: ID, username, email, status
- **📅 Timestamps**: Account creation date, last login
- **🔐 Authentication**: Provider (local/Google), password status
- **🖼️ Profile**: Google profile pictures when available
- **📈 Statistics**: User count analytics

## 🔧 Implementation Details

### Backend API Endpoints

#### Admin User Management
- **GET /admin/users** - Get all users with pagination support
- **GET /admin/users/{user_id}** - Get specific user details
- **PUT /admin/users/{user_id}/status** - Update user active/inactive status
- **DELETE /admin/users/{user_id}** - Delete a user (cannot delete yourself)
- **GET /admin/stats** - Get user statistics (total, active, inactive counts)

#### Admin Authentication & Authorization
- **Admin Privileges**: Granted to first user created (ID = 1) OR any user with username "admin"
- **JWT Required**: All admin endpoints require valid JWT token
- **Role Check**: Additional admin privilege verification
- **Self-Protection**: Prevents admins from deleting their own accounts

### Frontend Components

#### Admin Dashboard Component (`/admin`)
- **📊 Statistics Dashboard**: Three cards showing user metrics
  - Total Users: All registered users
  - Active Users: Currently active accounts
  - Inactive Users: Deactivated accounts
- **📋 User Management Table**: Sortable table with user information
  - User ID, Username, Email, Status
  - Authentication Provider (Local/Google)
  - Profile Pictures (for Google users)
  - Creation Date, Last Login
  - Action buttons for each user

#### Enhanced User Dashboard
- **Admin Button**: Admin users see "Admin Dashboard" navigation button
- **Profile Integration**: Shows Google profile pictures when available
- **Provider Display**: Indicates authentication method used

### Database Schema (Updated)
```sql
-- Updated User table with new fields
users:
  id INTEGER PRIMARY KEY
  username TEXT UNIQUE NOT NULL
  email TEXT UNIQUE NOT NULL
  hashed_password TEXT NULL  -- Nullable for Google users
  is_active BOOLEAN DEFAULT 1
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  last_login TIMESTAMP NULL
  google_id TEXT UNIQUE NULL  -- Google user identifier
  profile_picture TEXT NULL  -- Google profile picture URL
  auth_provider TEXT DEFAULT "local"  -- "local" or "google"
```

## 🚀 Getting Started

### 1. Quick Start
```bash
# Start the complete application with admin features
.\start-admin-demo.bat
```

This starts both backend (port 8000) and frontend (port 4200) with admin functionality enabled.

### 2. Create Admin User

#### Option A: First User (Automatic Admin)
1. Go to http://localhost:4200/signup
2. Register any username - **first user becomes admin automatically**
3. Complete signup and login

#### Option B: Username "admin" (Instant Admin)
1. Go to http://localhost:4200/signup  
2. Use username: **"admin"** (gets admin privileges immediately)
3. Add email and password
4. Complete signup and login

### 3. Access Admin Features
1. **Login** with your admin credentials
2. **Navigate** to user dashboard - you'll see "Admin Dashboard" button
3. **Click** "Admin Dashboard" to access admin interface
4. **Direct URL**: http://localhost:4200/admin

### 4. Test Admin Functions

#### View Statistics
- See real-time user counts in dashboard cards
- Total users, active users, inactive users

#### Manage Users
1. **Create Test Users**: Go back to signup and create additional users
2. **View User Table**: See all users with complete information
3. **Toggle Status**: Click "Deactivate" or "Activate" buttons
4. **Delete Users**: Click "Delete" (with confirmation dialog)
5. **Refresh Data**: Use "Refresh" button to update information

#### Test Google Integration (if configured)
- Users who sign up with Google show "Google" as auth provider
- Profile pictures are displayed in the user table
- Google users show nullable password status

## 🧪 API Testing

### HTTP Test Files
Use the provided `admin_api_tests.http` file to test admin endpoints directly:

#### Test Workflow
1. **Create Admin User** via signup endpoint
2. **Login** to get JWT authentication token  
3. **Copy Token** from login response
4. **Update Test File** - Replace `YOUR_TOKEN` with actual JWT
5. **Test Endpoints** - Run each API call

#### Available Tests
```http
# Create admin user
POST /signup

# Login and get token
POST /login  

# Get all users (admin only)
GET /admin/users

# Get user statistics
GET /admin/stats

# Update user status
PUT /admin/users/{id}/status

# Delete user
DELETE /admin/users/{id}
```

### Manual API Testing
```bash
# Get user statistics (replace YOUR_TOKEN)
curl -X GET "http://localhost:8000/admin/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all users
curl -X GET "http://localhost:8000/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Deactivate user ID 2
curl -X PUT "http://localhost:8000/admin/users/2/status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

## Security Features

### Admin Protection
- Admin endpoints require valid JWT token
- Additional admin privilege check
- Cannot delete your own account
- Error handling for unauthorized access

### Frontend Guards
- `AuthGuard`: Protects authenticated routes
- `AdminGuard`: Protects admin-only routes
- Automatic redirection for non-admin users

## Customization

### Admin Role Assignment
Modify the `get_current_admin_user` function in `backend/main.py` to implement your own admin logic:

```python
def get_current_admin_user(current_user: User = Depends(get_current_user)):
    # Add your custom admin logic here
    # Example: check a role field, admin flag, etc.
    if current_user.is_admin:  # If you add an is_admin field
        return current_user
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Not enough permissions"
    )
```

### Styling
The admin dashboard uses modern CSS with:
- Responsive grid layout for statistics cards
- Clean table design for user management
- Status badges for user states
- Hover effects and disabled states

## Error Handling
- Network errors are displayed to users
- Invalid operations show appropriate messages
- Authentication failures redirect to login
- Admin privilege checks prevent unauthorized access

## File Structure
```
backend/
├── main.py (added admin endpoints)
├── schemas.py (added admin schemas)
├── database.py (updated User model)
└── requirements.txt

frontend/auth-app/src/app/
├── components/
│   ├── admin-dashboard/ (new)
│   └── dashboard/ (updated)
├── guards/
│   └── admin.guard.ts (new)
├── models/
│   └── user.model.ts (updated)
├── services/
│   └── auth.service.ts (updated with admin methods)
└── app.routes.ts (updated)
```

This implementation provides a complete user management system with proper security, error handling, and a modern user interface.
