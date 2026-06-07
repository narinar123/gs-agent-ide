# GS Agentic IDE (Antigravity SDK Powered)

This is a complete containerized template of the Antigravity IDE, featuring a frontend interface mirroring the screenshotted workspace layouts, and a Python FastAPI backend integrated with the **Google Antigravity SDK** to run local/cloud agent workflows.

Because it runs entirely inside **Docker**, it is 100% compatible with:
1. **Intel Macs** (Bypasses the lack of native `google-antigravity` wheels for macOS x86_64).
2. **Linux VPS** (Runs natively on standard VPS servers).
3. **Cloud PaaS** (Railway, Render, Fly.io).

---

## Quick Start (Local & VPS Setup)

### Prerequisites
- Install **Docker** and **Docker Compose** on your Mac or VPS.

### Running the App
1. Set your Gemini API Key in the environment (or create a `.env` file in the root):
   ```bash
   export GEMINI_API_KEY="your_actual_gemini_api_key"
   ```
2. Start the application:
   ```bash
   docker compose up --build
   ```
3. Open your browser:
   - **Frontend UI:** `http://localhost:3000`
   - **FastAPI API:** `http://localhost:8000`

---

## Folder Structure
- `frontend/` - React application built with Vite + Tailwind CSS + Lucide Icons.
- `backend/` - Python FastAPI backend containing the `agent_service.py` running the `google-antigravity` SDK.
- `docker-compose.yml` - Launches both containers concurrently.

---

## Integration with Local LLMs (Ollama)
If you want to use local models like Llama 3 or Gemma 2:
1. Download and run **Ollama** locally on your Mac or VPS.
2. In `backend/agent_service.py`, you can configure the Antigravity `LocalAgentConfig` to route requests to Ollama's local endpoints instead of the Gemini Cloud API.
