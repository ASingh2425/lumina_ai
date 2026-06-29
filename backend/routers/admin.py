import os
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from jose import jwt

from database import get_db, User, Progress

router = APIRouter(prefix="/api/admin", tags=["admin"])

JWT_SECRET = os.getenv("JWT_SECRET", "luminasupersecretkeytoken")
JWT_ALGORITHM = "HS256"

# Dependency: Verify token is Admin
def get_current_admin(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token.")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        is_admin = payload.get("is_admin", False)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication failed: missing user ID.")
            
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_admin:
            raise HTTPException(status_code=403, detail="Admin permissions required to access this resource.")
        
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed: session invalid or expired.")

@router.get("/users")
def list_users(admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    results = []
    
    for u in users:
        # Get progress
        progress_info = db.query(Progress).filter(Progress.user_id == u.id).first()
        xp = progress_info.xp if progress_info else 0
        
        results.append({
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "email": u.email,
            "is_verified": u.is_verified,
            "is_admin": u.is_admin,
            "xp": xp
        })
        
    return results

@router.post("/promote/{user_id}")
def promote_user(user_id: int, admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    user.is_admin = True
    db.commit()
    return {"status": "ok", "message": f"Successfully promoted {user.username} to Admin status."}
