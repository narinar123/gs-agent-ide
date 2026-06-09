import os
from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from dotenv import load_dotenv
from agent_service import stream_agent_chat
from tools.code_tools import python_interpreter

load_dotenv()

app = FastAPI(title="Antigravity IDE Backend API with Dynamic Workspace")

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

class ExecuteRequest(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"status": "running", "agent": "Antigravity Active"}

@app.post("/api/auth/login")
def login(request: LoginRequest):
    email = request.email.strip().lower()
    
    if email == "pranu21m@gmail.com":
        return {
            "email": email,
            "role": "admin",
            "access_rights": "all_features",
            "subscription": "active_pro",
            "token": "admin_session_token_pranu21m"
        }
    else:
        return {
            "email": email,
            "role": "user",
            "access_rights": "restricted",
            "subscription": "payment_required",
            "token": f"user_session_token_{email}"
        }

@app.get("/api/arena/leaderboard")
def get_leaderboard(authorization: Optional[str] = Header(None)):
    if not authorization or "restricted" in authorization:
        raise HTTPException(status_code=403, detail="Payment Required: Please upgrade to Pro or login as Admin to view Arena.ai features.")
    return {"leaderboard": ARENA_LEADERBOARD}

@app.post("/api/arena/webhook")
def arena_webhook(payload: WebhookPayload, authorization: Optional[str] = Header(None)):
    if not authorization or "admin" not in authorization:
        raise HTTPException(status_code=403, detail="Unauthorized: Webhook receiver is restricted to Admin (pranu21m@gmail.com).")
    
    for item in ARENA_LEADERBOARD:
        if item["model"].lower() == payload.model.lower():
            item["elo"] = payload.elo
            item["success_rate"] = payload.success_rate
            item["tool_reliability"] = payload.tool_reliability
            item["coding_score"] = payload.coding_score
            return {"status": "success", "message": f"Updated {payload.model}"}
            
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

# Direct code execution endpoint
@app.post("/api/execute")
def execute_code(request: ExecuteRequest):
    output = python_interpreter(request.code)
    return {"output": output}

# DYNAMIC: Fetch list of folders on Desktop
@app.get("/api/projects")
def get_desktop_projects():
    try:
        desktop_path = os.path.expanduser("~/Desktop")
        if not os.path.exists(desktop_path):
            return {"projects": ["gsgpt", "gs01", "LMPROJECTS"]}
        
        projects = []
        for name in os.listdir(desktop_path):
            full_path = os.path.join(desktop_path, name)
            if os.path.isdir(full_path) and not name.startswith("."):
                projects.append(name)
        
        # Sort for display consistency
        projects.sort()
        return {"projects": projects if projects else ["gsgpt", "gs01", "LMPROJECTS"]}
    except Exception:
        return {"projects": ["gsgpt", "gs01", "LMPROJECTS"]}

# DYNAMIC: Fetch changed files in workspace
@app.get("/api/files-changed")
def get_changed_files():
    # Return a real list of project files for the IDE
    try:
        files = []
        # Return key files in our project
        project_dir = os.path.expanduser("~/scratch/gs-agent-ide")
        if os.path.exists(project_dir):
            for root, dirs, filenames in os.walk(project_dir):
                if ".git" in root or "node_modules" in root:
                    continue
                for f in filenames:
                    rel_path = os.path.relpath(os.path.join(root, f), project_dir)
                    files.append(rel_path)
        return {"files": files[:8] if files else ["App.jsx", "main.py", "agent_service.py"]}
    except Exception:
        return {"files": ["App.jsx", "main.py", "agent_service.py"]}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    async def event_generator():
        async for token in stream_agent_chat(request.message, request.api_key):
            yield token

    return StreamingResponse(event_generator(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
