# Auth App - Angular & FastAPI Authentication System

A modern full-stack authentication application built with Angular frontend and FastAPI backend, featuring JWT authentication.

## Features

- **Frontend (Angular)**:
  - Landing page with modern UI
  - User signup and login forms
  - Protected dashboard
  - JWT token management
  - Route guards for protected routes
  - Responsive design

- **Backend (FastAPI)**:
  - JWT-based authentication
  - User registration and login
  - Password hashing with bcrypt
  - SQLite database for user storage
  - CORS enabled for frontend integration
  - RESTful API endpoints

- **MCP Server**:
  - Model Context Protocol server for AI integration
  - Exposes backend APIs as MCP tools
  - Built with TypeScript and Node.js
  - Provides auth_signup, auth_login, auth_logout, auth_get_current_user tools

## Project Structure

```
test/
├── backend/                 # FastAPI Backend
│   ├── main.py             # Main FastAPI application
│   ├── auth.py             # Authentication utilities
│   ├── database.py         # Database models and connection
│   ├── schemas.py          # Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # Angular Frontend
│   └── auth-app/
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/     # Angular components
│       │   │   ├── services/       # Angular services
│       │   │   ├── guards/         # Route guards
│       │   │   └── models/         # TypeScript interfaces
│       │   ├── styles.css          # Global styles
│       │   └── index.html          # Main HTML file
│       ├── package.json            # NPM dependencies
│       └── angular.json            # Angular configuration
└── mcp-server/             # MCP Server for AI Integration
    ├── src/
    │   └── index.ts        # MCP server implementation
    ├── package.json        # Node.js dependencies
    ├── tsconfig.json       # TypeScript configuration
    └── README.md           # MCP server documentation
```

## Prerequisites

- Python 3.8+
- Node.js 16+ (for both Angular frontend and MCP server)
- npm

## Quick Start

### Option 1: Use the provided scripts
1. **Backend**: Run `start-backend.bat` or `start-backend.ps1`
2. **Frontend**: Run `start-frontend.bat` or `start-frontend.ps1`
3. **MCP Server**: Install Node.js first, then run `start-mcp-server.bat` or `start-mcp-server.ps1`

### Option 2: Manual setup (detailed below)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On Mac/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Update the `.env` file with your preferred settings:
   ```
   SECRET_KEY=your-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
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
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The application will be available at: `http://localhost:4200`

## MCP Server Setup

The MCP (Model Context Protocol) server exposes the backend APIs as tools that can be used by AI assistants.

### Prerequisites
1. Ensure Node.js and npm are installed
2. Backend server must be running on `http://localhost:8000`

### Setup Steps

1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Use the LTS version for Windows

2. **Quick setup with script**:
   ```bash
   # Run the setup script
   start-mcp-server.bat  # or start-mcp-server.ps1
   ```

3. **Manual setup**:
   ```bash
   cd mcp-server
   npm install
   npm run build
   npm start
   ```

### Available MCP Tools

Once running, the MCP server exposes these tools:
- `auth_health_check` - Check if the authentication API is running
- `auth_signup` - Register a new user account
- `auth_login` - Login with username and password to get JWT token
- `auth_get_current_user` - Get current user information using JWT token
- `auth_logout` - Logout current user session

### Testing the Setup

Run the comprehensive test script:
```bash
# Test both API and MCP functionality
test-api-and-mcp.ps1
```

## API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Login user and get JWT token
- `POST /logout` - Logout user
- `GET /me` - Get current user information (requires authentication)

### Example API Usage

#### Register a new user:
```bash
curl -X POST "http://localhost:8000/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login:
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### Get user information (with token):
```bash
curl -X GET "http://localhost:8000/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Routes

- `/` - Landing page
- `/login` - Login form
- `/signup` - Registration form
- `/dashboard` - Protected dashboard (requires authentication)

## Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **SQLite** - Database
- **Uvicorn** - ASGI server

### Frontend
- **Angular 17** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing
- **Angular HTTP Client** - HTTP communication

### MCP Server
- **Model Context Protocol SDK** - MCP implementation
- **TypeScript** - Programming language
- **Node.js** - Runtime environment
- **Axios** - HTTP client for API calls
- **Zod** - Schema validation

## Development Notes

- The backend uses SQLite for simplicity in development
- JWT tokens expire after 30 minutes (configurable)
- CORS is enabled for `http://localhost:4200` (Angular dev server)
- All passwords are hashed using bcrypt
- The frontend uses standalone components (Angular 17+ feature)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with route guards
- Token expiration handling
- CORS configuration
- Input validation on both frontend and backend

## Troubleshooting

1. **CORS errors**: Make sure the backend is running on port 8000 and frontend on port 4200
2. **Database errors**: The SQLite database will be created automatically when you first run the backend
3. **Token errors**: Make sure the SECRET_KEY in .env is set properly
4. **Module errors**: Ensure all dependencies are installed correctly

## License

This project is for demonstration purposes.
