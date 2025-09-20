from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from database import init_db, test_db_connection

app = FastAPI(
    title="Time Off System API",
    description="FastAPI backend for time-off request management system",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("Database initialized successfully")

@app.get("/health")
async def health_check():
    """Health check endpoint for application monitoring"""
    db_healthy = test_db_connection()
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "service": "time-off-api",
        "version": "1.0.0",
        "database": "connected" if db_healthy else "disconnected"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Time Off System API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)