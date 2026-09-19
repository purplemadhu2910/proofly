from fastapi import APIRouter, HTTPException, status, Response, Request, Depends
from datetime import datetime, timezone
import secrets
from app.database import get_database
from app.schemas.user import (
    UserSignup, UserLogin, ForgotPasswordRequest, ResetPasswordRequest,
    UserResponse, TokenResponse
)
from app.utils.security import (
    hash_password, verify_password, create_access_token, create_refresh_token,
    decode_refresh_token, extract_token_from_request
)
from app.utils.helpers import simulate_send_email
from app.models.user import user_helper
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# Store password reset tokens in memory or DB
reset_token_store = {}

@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup, response: Response):
    db = get_database()
    
    existing_user = await db.users.find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
        
    now = datetime.now(timezone.utc)
    new_user_dict = {
        "name": user_data.name,
        "email": user_data.email.lower(),
        "passwordHash": hash_password(user_data.password),
        "isVerified": True,  # Simulated email verification auto-completes
        "role": "owner",
        "createdAt": now
    }
    
    result = await db.users.insert_one(new_user_dict)
    user_id = str(result.inserted_id)
    new_user_dict["_id"] = result.inserted_id
    
    user_resp = user_helper(new_user_dict)
    
    access_token = create_access_token({"sub": user_id, "email": user_resp["email"]})
    refresh_token = create_refresh_token({"sub": user_id, "email": user_resp["email"]})
    
    # Set httpOnly cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=15 * 60,
        samesite="lax"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax"
    )
    
    # Simulate verification email sending
    simulate_send_email(
        user_resp["email"],
        "Welcome to Proofly - Verify Your Account",
        f"Hi {user_resp['name']},\n\nThank you for signing up for Proofly! Your account has been created and simulated verification is complete.\n\nBest regards,\nThe Proofly Team"
    )
    
    return TokenResponse(
        user=UserResponse(**user_resp),
        accessToken=access_token,
        refreshToken=refresh_token,
        message="Account created successfully! Simulated verification email sent."
    )

@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, response: Response):
    db = get_database()
    user = await db.users.find_one({"email": login_data.email.lower()})
    
    if not user or not verify_password(login_data.password, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    user_resp = user_helper(user)
    user_id = user_resp["id"]
    
    access_token = create_access_token({"sub": user_id, "email": user_resp["email"]})
    refresh_token = create_refresh_token({"sub": user_id, "email": user_resp["email"]})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=15 * 60,
        samesite="lax"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax"
    )
    
    return TokenResponse(
        user=UserResponse(**user_resp),
        accessToken=access_token,
        refreshToken=refresh_token,
        message="Logged in successfully."
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token_endpoint(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        # Check header or body fallback
        try:
            body = await request.json()
            refresh_token = body.get("refreshToken")
        except Exception:
            pass
            
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
        
    payload = decode_refresh_token(refresh_token)
    user_id = payload.get("sub")
    
    db = get_database()
    from bson import ObjectId
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = await db.users.find_one({"_id": user_id})
        
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
    user_resp = user_helper(user)
    new_access_token = create_access_token({"sub": user_id, "email": user_resp["email"]})
    new_refresh_token = create_refresh_token({"sub": user_id, "email": user_resp["email"]})
    
    response.set_cookie(key="access_token", value=new_access_token, httponly=True, max_age=15 * 60, samesite="lax")
    response.set_cookie(key="refresh_token", value=new_refresh_token, httponly=True, max_age=7 * 24 * 60 * 60, samesite="lax")
    
    return TokenResponse(
        user=UserResponse(**user_resp),
        accessToken=new_access_token,
        refreshToken=new_refresh_token,
        message="Token refreshed successfully."
    )

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully."}

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    db = get_database()
    user = await db.users.find_one({"email": req.email.lower()})
    
    if user:
        reset_token = secrets.token_urlsafe(32)
        reset_token_store[reset_token] = user["email"].lower()
        simulate_send_email(
            user["email"],
            "Proofly Password Reset Request",
            f"You requested a password reset. Use this token to reset your password:\n\n{reset_token}\n\nIf you did not request this, please ignore."
        )
        return {"message": "Password reset email sent (simulated). Check console/logs.", "resetToken": reset_token}
    
    # Return standard message even if user not found for security
    return {"message": "If an account exists with this email, password reset instructions have been sent."}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    email = reset_token_store.get(req.token)
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")
        
    db = get_database()
    new_hash = hash_password(req.newPassword)
    await db.users.update_one({"email": email}, {"$set": {"passwordHash": new_hash}})
    
    # Delete token from store
    reset_token_store.pop(req.token, None)
    return {"message": "Password has been reset successfully. You may now log in with your new password."}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)
