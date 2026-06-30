import os
import sys
# Add backend directory to path for Vercel serverless resolution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.progress import router as progress_router
from routers.tutor import router as tutor_router
from routers.github import router as github_router
from routers.auth import router as auth_router
from routers.admin import router as admin_router

load_dotenv()

app = FastAPI(title="Lumina AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(github_router)
app.include_router(auth_router)
app.include_router(admin_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "lumina-api"}
