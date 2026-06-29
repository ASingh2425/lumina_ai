from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.progress import router as progress_router
from routers.tutor import router as tutor_router

load_dotenv()

app = FastAPI(title="Lumina AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor_router)
app.include_router(progress_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "lumina-api"}
