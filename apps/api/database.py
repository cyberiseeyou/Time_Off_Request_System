import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Date, Text, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
from typing import Generator

# Load environment variables from .env file
load_dotenv()

# Database URL - supports both SQLite and MySQL
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./database/time_off_system.db"
)

# Create engine with appropriate configuration for SQLite
if DATABASE_URL.startswith('sqlite'):
    engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, echo=True)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

class Manager(Base):
    __tablename__ = "managers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class TimeOffRequest(Base):
    __tablename__ = "time_off_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, nullable=False)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)
    reason = Column(String)
    manager_id = Column(Integer, ForeignKey("managers.id"), nullable=False, index=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

# Dependency to get database session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Test database connectivity
def test_db_connection():
    try:
        db = SessionLocal()
        # Simple test query
        result = db.execute("SELECT 1").fetchone()
        db.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False