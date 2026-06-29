import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db, Progress
from schemas import ProgressPayload

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/{user_id}", response_model=ProgressPayload)
def get_progress(user_id: str, db: Session = Depends(get_db)) -> ProgressPayload:
    # If user_id is 'local', return empty payload
    if user_id == "local":
        return ProgressPayload(user_id="local")
        
    try:
        u_id = int(user_id)
    except ValueError:
        return ProgressPayload(user_id=user_id)

    db_progress = db.query(Progress).filter(Progress.user_id == u_id).first()
    if not db_progress:
        # Create default entry
        db_progress = Progress(user_id=u_id)
        db.add(db_progress)
        db.commit()
        db.refresh(db_progress)

    return ProgressPayload(
        user_id=str(db_progress.user_id),
        xp=db_progress.xp,
        completed_lessons=json.loads(db_progress.completed_lessons),
        completed_steps=json.loads(db_progress.completed_steps)
    )

@router.put("/{user_id}", response_model=ProgressPayload)
def save_progress(user_id: str, body: ProgressPayload, db: Session = Depends(get_db)) -> ProgressPayload:
    try:
        u_id = int(user_id)
    except ValueError:
        return body

    db_progress = db.query(Progress).filter(Progress.user_id == u_id).first()
    if not db_progress:
        db_progress = Progress(user_id=u_id)
        db.add(db_progress)

    db_progress.xp = body.xp
    db_progress.completed_lessons = json.dumps(body.completed_lessons)
    db_progress.completed_steps = json.dumps(body.completed_steps)
    db.commit()

    return body
