import os
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext

from database import get_db, User, Progress

router = APIRouter(prefix="/api/auth", tags=["auth"])

JWT_SECRET = os.getenv("JWT_SECRET", "luminasupersecretkeytoken")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterSchema(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

class VerifyEmailSchema(BaseModel):
    email: EmailStr
    otp: str

class LoginSchema(BaseModel):
    username_or_email: str
    password: str

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# Helper: Hash passwords
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Helper: Verify passwords
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Helper: Create Access Token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

# Helper: Send email with OTP (runs SMTP with mock fallback)
def send_email_otp(to_email: str, subject: str, otp: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", "noreply@lumina.ai")

    body_text = f"Your Lumina AI security verification code is: {otp}\n\nPlease enter this code to complete the verification step."

    # Fallback to local logs if SMTP parameters are missing
    if not smtp_host or not smtp_username or not smtp_password:
        print(f"\n========================================\n[SMTP MOCK] To: {to_email}\n[SMTP MOCK] Subject: {subject}\n[SMTP MOCK] Code: {otp}\n========================================\n")
        return

    try:
        msg = MIMEText(body_text)
        msg['Subject'] = subject
        msg['From'] = smtp_from
        msg['To'] = to_email

        server = smtplib.SMTP(smtp_host, int(smtp_port or "587"))
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(smtp_from, [to_email], msg.as_string())
        server.quit()
    except Exception as e:
        print(f"SMTP Failed: {e}. Falling back to terminal log:\n[SMTP MOCK] To: {to_email} | Code: {otp}")

@router.post("/register")
def register(payload: RegisterSchema, db: Session = Depends(get_db)):
    # Check duplicate username
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username is already taken.")

    # Check duplicate email
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered.")

    # Create user
    otp = f"{random.randint(100000, 999999)}"
    db_user = User(
        name=payload.name,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        verification_otp=otp
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Initialize empty progress entry linked to user
    db_progress = Progress(user_id=db_user.id)
    db.add(db_progress)
    db.commit()

    # Send verification email
    send_email_otp(db_user.email, "Verify your Lumina AI Email", otp)

    return {"status": "ok", "message": "Verification email sent. Please check your inbox (or backend logs)."}

@router.post("/verify-email")
def verify_email(payload: VerifyEmailSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    if user.verification_otp != payload.otp:
        raise HTTPException(status_code=400, detail="Incorrect verification code.")

    user.is_verified = True
    user.verification_otp = None
    db.commit()

    return {"status": "ok", "message": "Email verified successfully. You can now log in."}

@router.post("/login")
def login(payload: LoginSchema, db: Session = Depends(get_db)):
    # Lookup by username or email
    user = db.query(User).filter((User.username == payload.username_or_email) | (User.email == payload.username_or_email)).first()
    
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect username, email, or password.")

    if not user.is_verified:
        # Re-send verification OTP
        otp = f"{random.randint(100000, 999999)}"
        user.verification_otp = otp
        db.commit()
        send_email_otp(user.email, "Verify your Lumina AI Email", otp)
        raise HTTPException(status_code=403, detail="Email not verified. A new code has been sent to your email.")

    token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "is_admin": user.is_admin},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    }

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email is not registered.")

    otp = f"{random.randint(100000, 999999)}"
    user.forgot_otp = otp
    db.commit()

    send_email_otp(user.email, "Reset your Lumina AI Password", otp)

    return {"status": "ok", "message": "Password reset code sent. Please check your inbox."}

@router.post("/reset-password")
def reset_password(payload: ResetPasswordSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email is not registered.")

    if user.forgot_otp != payload.otp:
        raise HTTPException(status_code=400, detail="Incorrect reset code.")

    user.password_hash = hash_password(payload.new_password)
    user.forgot_otp = None
    db.commit()

    return {"status": "ok", "message": "Password reset successfully. You can now log in."}
