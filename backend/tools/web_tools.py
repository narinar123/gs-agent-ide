import os
import urllib.request
import json

def firecrawl_scrape(url: str) -> str:
    """Scrapes any website URL and returns clean markdown. Use this for reading web pages.
    
    Args:
        url: The web page URL to scrape, e.g. "https://example.com"
    """
    api_key = os.getenv("FIRECRAWL_API_KEY", "")
    if not api_key:
        return f"[Simulated Firecrawl Scrape for {url}]: Web content successfully retrieved and cleaned into markdown. (Set FIRECRAWL_API_KEY in your env to use live scraping)."
    
    # Live API call to Firecrawl endpoint
    try:
        req = urllib.request.Request(
            "https://api.firecrawl.dev/v0/scrape",
            data=json.dumps({"url": url}).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            return res.get("data", {}).get("markdown", "No markdown content returned.")
    except Exception as e:
        return f"Error scraping with Firecrawl: {str(e)}"

def genspark_search(query: str) -> str:
    """Performs an AI-synthesized web search using Genspark.ai. Use this for research.
    
    Args:
        query: The search query, e.g. "latest trends in AI agents 2026"
    """
    # Genspark is an AI search engine. We implement a clean request wrapper here.
    api_key = os.getenv("GENSPARK_API_KEY", "")
    if not api_key:
        return f"[Simulated Genspark Search for '{query}']: Top results returned. AI Summary: Agentic workflows and local LLMs are dominating the space. (Set GENSPARK_API_KEY to connect to live Genspark API)."

    try:
        # Mocking live request structure for Genspark AI Search API
        req = urllib.request.Request(
            "https://api.genspark.ai/v1/search",
            data=json.dumps({"query": query}).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            return res.get("summary", "No summary returned.")
    except Exception as e:
        return f"Error searching with Genspark: {str(e)}"
