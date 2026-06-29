from fastapi import APIRouter

from schemas import AskWhyRequest, AskWhyResponse
from services.tutor import ask_tutor

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/ask", response_model=AskWhyResponse)
def ask_why(body: AskWhyRequest) -> AskWhyResponse:
    answer = ask_tutor(body.question, body.level, body.context)
    return AskWhyResponse(answer=answer, level=body.level)
