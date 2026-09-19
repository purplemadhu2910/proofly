from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    newPassword: str = Field(..., min_length=6, max_length=100)

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    isVerified: bool = True
    role: str = "owner"
    createdAt: Optional[datetime] = None

class TokenResponse(BaseModel):
    user: UserResponse
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    message: str
