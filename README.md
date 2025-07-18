# Auth App - Angular & FastAPI Authentication System

A modern full-stack authentication application built with Angular frontend and FastAPI backend, featuring JWT authentication, Google SSO, and comprehensive admin dashboard.

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication system
- **Google SSO Integration**: One-click sign-in with Google accounts
- **Dual Authentication Support**: Both local and Google authentication
- **Password Security**: bcrypt hashing for local passwords
- **Token Verification**: Server-side Google ID token validation
- **Email Verification**: Only verified Google accounts accepted

### 👤 User Management
- **User Registration**: Email-validated signup with unique constraints
- **Profile Management**: User profiles with profile pictures
- **Authentication Provider Tracking**: Local vs Google user identification
- **Account Linking**: Existing users can link Google accounts

### 🛡️ Admin Dashboard
- **User Statistics**: Real-time counts of total, active, and inactive users
- **User Management Table**: Comprehensive user listing with details
- **User Actions**: Activate/deactivate and delete users (with protection)
- **Admin Protection**: Role-based access control
- **Audit Information**: Creation dates and last login tracking

### 🎨 Modern Frontend (Angular)
- **Responsive Design**: Modern, mobile-friendly interface
- **Component Architecture**: Standalone Angular 17+ components
- **Route Guards**: Protected routes with auth and admin guards
- **Error Handling**: Comprehensive error display and handling
- **Google Integration**: Native Google Sign-In buttons
- **Real-time Updates**: Dynamic UI updates based on user state

### 🚀 Backend (FastAPI)
- **RESTful API**: Clean, documented API endpoints
- **SQLite Database**: Lightweight database with SQLAlchemy ORM
- **CORS Support**: Enabled for frontend integration
- **Environment Configuration**: Secure credential management
- **API Documentation**: Auto-generated Swagger/ReDoc documentation

### 🔌 MCP Server Integration
- **AI Integration**: Model Context Protocol server for AI applications
- **Tool Exposure**: Backend APIs available as MCP tools
- **TypeScript Implementation**: Modern Node.js MCP server

## 📁 Project Structure

```
test/
├── 📄 README.md                    # Project documentation
├── 📄 GOOGLE_SSO_GUIDE.md         # Google SSO setup guide
├── 📄 ADMIN_DASHBOARD_GUIDE.md    # Admin features guide
├── 📄 API_TESTING_GUIDE.md        # API testing documentation
├── 🔧 start-backend.bat           # Backend startup (Windows)
├── 🔧 start-frontend.bat          # Frontend startup (Windows)
├── 🔧 start-admin-demo.bat        # Full demo startup
├── 📁 backend/                     # FastAPI Backend
│   ├── 🐍 main.py                 # Main FastAPI application with all endpoints
│   ├── 🔐 auth.py                 # JWT authentication utilities
│   ├── 🗄️ database.py             # SQLAlchemy models and database setup
│   ├── 📋 schemas.py              # Pydantic schemas for API
│   ├── 🌐 google_oauth.py         # Google OAuth integration
│   ├── 🔄 migrate_db.py           # Database migration script
│   ├── 📦 requirements.txt        # Python dependencies
│   ├── ⚙️ .env                    # Environment variables
│   └── 🗄️ test.db                 # SQLite database
├── 📁 frontend/                    # Angular Frontend
│   └── auth-app/
│       ├── 📦 package.json         # NPM dependencies
│       ├── ⚙️ angular.json         # Angular configuration
│       ├── ⚙️ tsconfig.json        # TypeScript configuration
│       └── 📁 src/
│           ├── 🌐 index.html       # Main HTML file
│           ├── 🎨 styles.css       # Global styles
│           ├── 🚀 main.ts          # Angular bootstrap
│           └── 📁 app/
│               ├── 🏠 app.component.ts     # Root component
│               ├── ⚙️ app.config.ts        # App configuration
│               ├── 🛣️ app.routes.ts         # Routing configuration
│               ├── 📁 models/
│               │   └── 👤 user.model.ts    # TypeScript interfaces
│               ├── 📁 services/
│               │   ├── 🔐 auth.service.ts  # Authentication service
│               │   └── 🌐 google-signin.service.ts # Google SSO service
│               ├── 📁 guards/
│               │   ├── 🛡️ auth.guard.ts    # Route protection
│               │   └── 👑 admin.guard.ts   # Admin route protection
│               └── 📁 components/
│                   ├── 🏡 landing/         # Landing page
│                   ├── 🔑 login/           # Login form with Google SSO
│                   ├── 📝 signup/          # Registration with Google SSO
│                   ├── 📊 dashboard/       # User dashboard
│                   └── 👑 admin-dashboard/ # Admin user management
└── 📁 mcp-server/                  # Model Context Protocol Server
    ├── 📦 package.json             # Node.js dependencies
    ├── ⚙️ tsconfig.json            # TypeScript configuration
    ├── 📄 README.md                # MCP server documentation
    └── 📁 src/
        └── 🔧 index.ts             # MCP server implementation
```
│       └── angular.json            # Angular configuration
└── mcp-server/             # MCP Server for AI Integration
    ├── src/
    │   └── index.ts        # MCP server implementation
    ├── package.json        # Node.js dependencies
    ├── tsconfig.json       # TypeScript configuration
    └── README.md           # MCP server documentation
```

## 🚀 Quick Start

### Option 1: Complete Demo (Recommended)
```bash
# Start both backend and frontend
.\start-admin-demo.bat
```
**What this does:**
- Starts FastAPI backend on http://localhost:8000
- Starts Angular frontend on http://localhost:4200
- Sets up admin demo environment

### Option 2: Individual Components

#### Backend Only
```bash
.\start-backend.bat
# OR
cd backend && python main.py
```

#### Frontend Only
```bash
.\start-frontend.bat
# OR
cd frontend/auth-app && npm start
```

### Option 3: Manual Setup
1. **Backend Setup**: 
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend/auth-app
   npm install
   npm start
   ```

## 🌐 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Main application interface |
| **Landing Page** | http://localhost:4200 | Public landing page |
| **Login** | http://localhost:4200/login | User authentication |
| **Signup** | http://localhost:4200/signup | User registration |
| **Dashboard** | http://localhost:4200/dashboard | User dashboard (protected) |
| **Admin Panel** | http://localhost:4200/admin | Admin dashboard (admin only) |
| **Backend API** | http://localhost:8000 | FastAPI REST endpoints |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **ReDoc** | http://localhost:8000/redoc | Alternative API documentation |

## 📊 API Endpoints

### Authentication Endpoints
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /auth/google` - Google SSO authentication
- `GET /me` - Get current user profile
- `POST /logout` - User logout

### Admin Endpoints (Admin Only)
- `GET /admin/users` - Get all users with pagination
- `GET /admin/users/{id}` - Get specific user details
- `PUT /admin/users/{id}/status` - Update user status
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/stats` - Get user statistics

## 👤 User Roles & Access

### Admin Users
- **First User**: Automatically gets admin privileges
- **Username "admin"**: Users with username "admin" get admin access
- **Permissions**: Can manage all users, view statistics, access admin dashboard

### Regular Users
- **Access**: Own profile, dashboard, standard features
- **Restrictions**: Cannot access admin functions

## 🔧 Configuration

### Google SSO Setup
1. **Google Cloud Console**: Create OAuth 2.0 credentials
2. **Environment Variables**: Set `GOOGLE_CLIENT_ID` in backend/.env
3. **Frontend Configuration**: Update client IDs in components
4. **Documentation**: See `GOOGLE_SSO_GUIDE.md` for detailed setup

### Environment Variables (.env)
```env
# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database Configuration
DATABASE_URL=sqlite:///./test.db
```

## 🧪 Testing

### API Testing
- Use `admin_api_tests.http` for admin endpoint testing
- Use `google_sso_tests.http` for Google SSO testing
- Use `api_tests.http` for general API testing

### Frontend Testing
1. Navigate to http://localhost:4200
2. Test user registration and login
3. Test Google SSO (requires setup)
4. Create admin user and test admin features

## 📚 Documentation

| File | Description |
|------|-------------|
| `README.md` | Main project documentation (this file) |
| `GOOGLE_SSO_GUIDE.md` | Complete Google SSO integration guide |
| `ADMIN_DASHBOARD_GUIDE.md` | Admin features and user management guide |
| `API_TESTING_GUIDE.md` | API testing instructions and examples |
| `PROJECT_SUMMARY.md` | Project overview and quick reference |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Google Token Verification**: Server-side token validation
- **Route Protection**: Frontend guards for protected routes
- **Admin Authorization**: Additional checks for admin endpoints
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Pydantic schemas for API validation

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Google Auth**: Google OAuth integration
- **Pydantic**: Data validation and serialization

### Frontend
- **Angular 17+**: Modern web framework
- **TypeScript**: Type-safe JavaScript
- **Standalone Components**: Modern Angular architecture
- **RxJS**: Reactive programming
- **Google Sign-In**: Google SSO integration
- **CSS3**: Modern styling and responsive design

### Development Tools
- **VS Code**: Recommended IDE
- **Angular CLI**: Development tools
- **Uvicorn**: ASGI server for FastAPI
- **npm**: Package management

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Use secure production values
2. **Database**: Consider PostgreSQL for production
3. **HTTPS**: Enable SSL/TLS for security
4. **Google OAuth**: Update authorized domains
5. **Security**: Review and harden security settings

### Docker Support (Future)
```dockerfile
# Example Dockerfile structure (to be implemented)
FROM python:3.9-slim
COPY backend/ /app/backend/
WORKDIR /app/backend
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

This authentication system provides a complete, production-ready foundation for modern web applications with comprehensive user management and Google SSO integration.
   DATABASE_URL=sqlite:///./test.db
   ```

5. Run the FastAPI server:
   ```bash
   python main.py
   ```

   The API will be available at: `http://localhost:8000`
   API documentation at: `http://localhost:8000/docs`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/auth-app
   ```

2. Install dependencies:
   ```bash
   npm install

