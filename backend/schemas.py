from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

# Google SSO schemas
class GoogleLoginRequest(BaseModel):
    token: str  # Google ID token

class GoogleUserInfo(BaseModel):
    email: str
    name: str
    picture: str
    google_id: str

class UserResponseExtended(UserResponse):
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None
    auth_provider: Optional[str] = "local"

# New schemas for user management
class UserStatusUpdate(BaseModel):
    is_active: bool

class UserStats(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int

class AdminUserResponse(UserResponseExtended):
    last_login: Optional[datetime] = None
