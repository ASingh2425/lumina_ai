from pydantic import BaseModel, Field


class AskWhyRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    level: str = Field(default="beginner", pattern="^(age_10|beginner|college|interview|mathematical)$")
    context: str = Field(default="", max_length=200)


class AskWhyResponse(BaseModel):
    answer: str
    level: str


class ProgressPayload(BaseModel):
    user_id: str = "local"
    xp: int = 0
    streak: int = 0
    completed_lessons: list[str] = []
    completed_steps: dict[str, list[str]] = {}

class SubmitPaymentRequest(BaseModel):
    utr_number: str = Field(..., min_length=12, max_length=12)

class VerifyRazorpayRequest(BaseModel):
    razorpay_payment_id: str = Field(..., min_length=1)

class CreateOrderRequest(BaseModel):
    amount: int
    currency: str = "INR"
    receipt: str | None = None

class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

