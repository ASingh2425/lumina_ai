from fastapi import APIRouter

from schemas import ProgressPayload

router = APIRouter(prefix="/progress", tags=["progress"])

# In-memory store for MVP — replace with PostgreSQL in production
_progress_store: dict[str, ProgressPayload] = {}


@router.get("/{user_id}", response_model=ProgressPayload)
def get_progress(user_id: str) -> ProgressPayload:
    return _progress_store.get(user_id, ProgressPayload(user_id=user_id))


@router.put("/{user_id}", response_model=ProgressPayload)
def save_progress(user_id: str, body: ProgressPayload) -> ProgressPayload:
    body.user_id = user_id
    _progress_store[user_id] = body
    return body
