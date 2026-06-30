import os
import time
import hmac
import hashlib
import razorpay
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db, User, PaymentRequest
from schemas import CreateOrderRequest, VerifyPaymentRequest
from routers.admin import get_current_user

router = APIRouter(prefix="/api", tags=["payment"])

from dotenv import load_dotenv
load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@router.post("/create-order")
def create_order(payload: CreateOrderRequest, user: User = Depends(get_current_user)):
    # Validate amount >= 100 paise
    if payload.amount < 100:
        raise HTTPException(status_code=400, detail="Amount must be at least 100 paise.")

    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET or not client:
        raise HTTPException(status_code=500, detail="Razorpay API credentials not configured on server.")

    try:
        order_data = {
            "amount": payload.amount,
            "currency": payload.currency,
            "receipt": payload.receipt or f"receipt_{user.id}_{int(time.time())}"
        }
        order = client.order.create(data=order_data)
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay Order Creation Failed: {str(e)}")

@router.post("/verify-payment")
def verify_payment(payload: VerifyPaymentRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Validate missing fields
    if not payload.razorpay_payment_id or not payload.razorpay_order_id or not payload.razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing required payment verification fields.")

    if not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay API secret not configured on server.")

    # HMAC-SHA256 signature verification
    msg = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode("utf-8")
    secret = RAZORPAY_KEY_SECRET.encode("utf-8")
    generated_signature = hmac.new(secret, msg, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(generated_signature, payload.razorpay_signature):
        raise HTTPException(status_code=400, detail="Payment verification failed: Signature mismatch.")

    # Mark user as Premium (which maps to is_admin=True in this project)
    user.is_admin = True

    # Record the approved payment in the database
    payment = PaymentRequest(
        user_id=user.id,
        username=user.username,
        utr_number=payload.razorpay_payment_id,
        amount=99,
        status="approved"
    )
    db.add(payment)
    db.commit()

    return {"status": "ok", "message": "Payment verified successfully. Account upgraded to Premium!"}
