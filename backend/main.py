from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import List
import schemas
import auth
from database import get_db, User, create_tables
from google_oauth import GoogleOAuth

app = FastAPI(title="Auth API", description="Authentication API with JWT")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
create_tables()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    username = auth.verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Admin check function
def get_current_admin_user(current_user: User = Depends(get_current_user)):
    # For demo purposes, make the first user or user with username 'admin' an admin
    # In production, you should have a proper role-based system
    if current_user.id == 1 or current_user.username.lower() == "admin":
        return current_user
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Not enough permissions. Admin access required."
    )

@app.post("/signup", response_model=schemas.UserResponseExtended)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        auth_provider="local"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_credentials.username).first()
    
    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Google SSO endpoints
@app.post("/auth/google", response_model=schemas.Token)
def google_auth(google_request: schemas.GoogleLoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with Google OAuth"""
    
    # Verify Google token
    user_info = GoogleOAuth.verify_google_token(google_request.token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    if not user_info.get('email_verified', False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email not verified"
        )
    
    # First check if user exists by email (for existing users who want to link Google)
    user = db.query(User).filter(User.email == user_info['email']).first()
    
    if user:
        # Existing user - update with Google info
        user.google_id = user_info['google_id']
        user.profile_picture = user_info['picture']
        user.auth_provider = "google"
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)
    else:
        # Check if Google ID already exists (shouldn't happen, but safety check)
        existing_google_user = db.query(User).filter(User.google_id == user_info['google_id']).first()
        if existing_google_user:
            user = existing_google_user
            user.last_login = datetime.utcnow()
            db.commit()
            db.refresh(user)
        else:
            # Create new user from Google account
            username = GoogleOAuth.generate_username_from_email(user_info['email'])
            
            # Ensure username is unique
            base_username = username
            counter = 1
            while db.query(User).filter(User.username == username).first():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User(
                username=username,
                email=user_info['email'],
                google_id=user_info['google_id'],
                profile_picture=user_info['picture'],
                auth_provider="google",
                hashed_password=None,  # No password for Google users
                last_login=datetime.utcnow()
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    
    # Generate JWT token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserResponseExtended)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/logout")
def logout():
    # In a real application, you might want to blacklist the token
    return {"message": "Successfully logged out"}

# Admin endpoints for user management
@app.get("/admin/users", response_model=List[schemas.AdminUserResponse])
def get_all_users(
    skip: int = 0, 
    limit: int = 100,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.get("/admin/users/{user_id}", response_model=schemas.AdminUserResponse)
def get_user_by_id(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get user by ID (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/admin/users/{user_id}/status", response_model=schemas.AdminUserResponse)
def update_user_status(
    user_id: int,
    status_update: schemas.UserStatusUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update user status (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = status_update.is_active
    db.commit()
    db.refresh(user)
    return user

@app.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.get("/admin/stats", response_model=schemas.UserStats)
def get_user_stats(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get user statistics (admin only)"""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = total_users - active_users
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users
    }

@app.get("/")
def read_root():
    return {"message": "Auth API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
