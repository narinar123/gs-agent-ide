import os
import asyncio
from typing import AsyncGenerator

# Graceful import fallback for architectures that do not support the SDK wheel natively (e.g. Intel macOS)
try:
    from google.antigravity import Agent, LocalAgentConfig
    HAS_SDK = True
except ImportError:
    HAS_SDK = False
    print("[WARNING] google-antigravity SDK not installed or not supported on this platform tag. Operating in Simulation Mode.")
    
    # Dummy classes to prevent syntax errors
    class LocalAgentConfig:
        def __init__(self, *args, **kwargs):
            pass
    class Agent:
        def __init__(self, *args, **kwargs):
            pass
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass
        async def chat(self, prompt: str):
            class MockResponse:
                def __aiter__(self):
                    return self
                async def __anext__(self):
                    # Yield a simulated token
                    raise StopAsyncIteration
            return MockResponse()

# Import all modular tools from registry
from tools import (
    firecrawl_scrape,
    genspark_search,
    zapier_nla_action,
    trigger_n8n_webhook,
    manage_ecommerce_store,
    python_interpreter,
    add_document_to_vector_store,
    semantic_search_memory
)

# Workspace tool
def read_workspace_files() -> str:
    """Reads the files in the active workspace.
    
    Returns:
        A summary list of files in the current project directory.
    """
    try:
        files = os.listdir('.')
        return f"Workspace files: {', '.join(files)}"
    except Exception as e:
        return f"Error reading workspace: {str(e)}"

# Setup config with all agentic tools loaded
def get_agent_config(api_key: str = None) -> LocalAgentConfig:
    key = api_key or os.getenv("GEMINI_API_KEY", "")
    
    # Exposing all worker/agent skills to the Antigravity Agent
    all_tools = [
        read_workspace_files,
        firecrawl_scrape,
        genspark_search,
        zapier_nla_action,
        trigger_n8n_webhook,
        manage_ecommerce_store,
        python_interpreter,
        add_document_to_vector_store,
        semantic_search_memory
    ]
    
    return LocalAgentConfig(
        api_key=key,
        system_instructions=(
            "You are Antigravity, an advanced AI software engineering agent. "
            "You help developers build projects. You have access to local workspace tools "
            "and external agentic/worker toolkits. "
            "You can execute Python code using python_interpreter, run searches using genspark_search, "
            "scrape URLs using firecrawl_scrape, run automations via zapier_nla_action and trigger_n8n_webhook, "
            "and handle database/memory RAG tasks using semantic_search_memory.\n\n"
            "Be precise, clean, and write code in markdown formatting."
        ),
        tools=all_tools
    )

async def stream_agent_chat(prompt: str, api_key: str = None) -> AsyncGenerator[str, None]:
    """Streams responses from the Antigravity Agent.
    
    If the API Key or the SDK is missing, it falls back to a descriptive mock agent to allow testing.
    """
    key = api_key or os.getenv("GEMINI_API_KEY", "")
    
    if not HAS_SDK:
        yield "[SYSTEM: Operating in Platform Simulation Mode (SDK wheel not supported on Intel Mac natively).]\n\n"
        mock_response = (
            f"Hello! I am the simulated Antigravity Agent running on your Intel Mac.\n\n"
            f"I received your prompt: \"{prompt}\"\n\n"
            f"I have successfully registered the following tools and can simulate them:\n"
            f"- 🌐 Firecrawl Scraper (`firecrawl_scrape`)\n"
            f"- 🔍 Genspark AI Search (`genspark_search`)\n"
            f"- ⚡ Zapier NLA (`zapier_nla_action`)\n"
            f"- 🤖 n8n Webhook (`trigger_n8n_webhook`)\n"
            f"- 💻 Python Interpreter (`python_interpreter`)\n"
            f"- 🧠 Vector memory store (`semantic_search_memory`)\n\n"
            f"To run with live cloud models and native SDK execution, run this project inside a Docker container "
            f"or deploy it to your Linux VPS where the `google-antigravity` wheel installs natively."
        )
        for char in mock_response:
            yield char
            await asyncio.sleep(0.01)
        return
        
    if not key:
        yield "[SYSTEM: GEMINI_API_KEY is missing. Operating in Mock Demo Mode.]\n\n"
        mock_response = (
            f"Hello! I am the Antigravity Agent running in Mock Mode.\n\n"
            f"I received your prompt: \"{prompt}\"\n\n"
            f"Once you set your `GEMINI_API_KEY` in the backend environment, I will connect "
            f"directly to the Google Gemini models using the native Antigravity SDK."
        )
        for char in mock_response:
            yield char
            await asyncio.sleep(0.01)
        return

    try:
        config = get_agent_config(key)
        async with Agent(config) as agent:
            response = await agent.chat(prompt)
            async for token in response:
                yield token
    except Exception as e:
        yield f"Error running Antigravity Agent: {str(e)}"
