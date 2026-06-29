import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lumina.db")

# Fix for standard cloud Postgres connection string mappings
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary key=True, index=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    verification_otp = Column(String, nullable=True)
    forgot_otp = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)

    progress = relationship("Progress", back_populates="user", uselist=False)

class Progress(Base):
    __tablename__ = "progress"

    user_id = Column(Integer, ForeignKey("users.id"), primary key=True)
    xp = Column(Integer, default=0)
    completed_lessons = Column(Text, default="[]")  # Serialized JSON list
    completed_steps = Column(Text, default="[]")    # Serialized JSON list
    unlocked_achievements = Column(Text, default="[]") # Serialized JSON list

    user = relationship("User", back_populates="progress")

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
