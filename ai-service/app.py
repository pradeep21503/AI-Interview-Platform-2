import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Import the routes
from routes import interview_router

# Initialize FastAPI App
app = FastAPI(
    title="AI Interview Platform - AI Reasoning Service",
    description="Stateless FastAPI service built with LangGraph and LangChain for generating interview questions and evaluations.",
    version="1.0.0"
)

# Configure CORS Middleware (allows requests from Express and external APIs if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app.get("/health", status_code=200, tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "ai-reasoning-service"}

# Register Router at root prefix (to match /generate-first-question, etc.)
app.include_router(interview_router, tags=["Interview"])

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    print(f"Starting server on {host}:{port}...")
    uvicorn.run("app:app", host=host, port=port, reload=True)
