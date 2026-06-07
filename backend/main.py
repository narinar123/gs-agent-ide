import os
from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from dotenv import load_dotenv
from agent_service import stream_agent_chat

load_dotenv()

app = FastAPI(title="Antigravity IDE Backend API with Arena.ai Integration")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database for demonstration
ARENA_LEADERBOARD = [
    {"rank": 1, "model": "Gemini 1.5 Pro (Google)", "elo": 1260, "success_rate": "92.4%", "tool_reliability": "95.1%", "coding_score": 90.2},
    {"rank": 2, "model": "Claude 3.5 Sonnet (Anthropic)", "elo": 1255, "success_rate": "91.8%", "tool_reliability": "94.6%", "coding_score": 89.8},
    {"rank": 3, "model": "GPT-4o (OpenAI)", "elo": 1248, "success_rate": "89.5%", "tool_reliability": "92.2%", "coding_score": 88.5},
    {"rank": 4, "model": "Llama 3 70b Instruct (Meta)", "elo": 1180, "success_rate": "81.2%", "tool_reliability": "84.5%", "coding_score": 79.1},
    {"rank": 5, "model": "Gemma 2 27b (Google)", "elo": 1150, "success_rate": "77.4%", "tool_reliability": "81.0%", "coding_score": 75.4}
]

class ChatRequest(BaseModel):
    message: str
    api_key: str = None

class LoginRequest(BaseModel):
    email: str

class WebhookPayload(BaseModel):
    model: str
    elo: int
    success_rate: str
    tool_reliability: str
    coding_score: float

@app.get("/")
def read_root():
    return {"status": "running", "agent": "Antigravity Active"}

@app.post("/api/auth/login")
def login(request: LoginRequest):
    email = request.email.strip().lower()
    
    # Authenticate and set rights
    if email == "pranu21m@gmail.com":
        return {
            "email": email,
            "role": "admin",
            "access_rights": "all_features",
            "subscription": "active_pro",
            "token": "admin_session_token_pranu21m"
        }
    else:
        # Standard user (starts with payment required)
        return {
            "email": email,
            "role": "user",
            "access_rights": "restricted",
            "subscription": "payment_required",
            "token": f"user_session_token_{email}"
        }

@app.get("/api/arena/leaderboard")
def get_leaderboard(authorization: Optional[str] = Header(None)):
    # Simple check for Admin / Paid user rights
    if not authorization or "restricted" in authorization:
        raise HTTPException(status_code=403, detail="Payment Required: Please upgrade to Pro or login as Admin to view Arena.ai features.")
    
    return {"leaderboard": ARENA_LEADERBOARD}

@app.post("/api/arena/webhook")
def arena_webhook(payload: WebhookPayload, authorization: Optional[str] = Header(None)):
    # Webhook restricted strictly to Admin
    if not authorization or "admin" not in authorization:
        raise HTTPException(status_code=403, detail="Unauthorized: Webhook receiver is restricted to Admin (pranu21m@gmail.com).")
    
    # Update or add new agent score
    for item in ARENA_LEADERBOARD:
        if item["model"].lower() == payload.model.lower():
            item["elo"] = payload.elo
            item["success_rate"] = payload.success_rate
            item["tool_reliability"] = payload.tool_reliability
            item["coding_score"] = payload.coding_score
            return {"status": "success", "message": f"Updated {payload.model}"}
            
    # If new model, append
    new_rank = len(ARENA_LEADERBOARD) + 1
    new_item = {
        "rank": new_rank,
        "model": payload.model,
        "elo": payload.elo,
        "success_rate": payload.success_rate,
        "tool_reliability": payload.tool_reliability,
        "coding_score": payload.coding_score
    }
    ARENA_LEADERBOARD.append(new_item)
    return {"status": "success", "message": f"Added new model {payload.model}"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    async def event_generator():
        async for token in stream_agent_chat(request.message, request.api_key):
            yield token

    return StreamingResponse(event_generator(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
