import json
from typing import Dict, List

# Simple in-memory document store simulating a local vector store/RAG
DOCUMENT_STORE: List[Dict[str, str]] = []

def add_document_to_vector_store(title: str, content: str) -> str:
    """Adds a document or snippet to the local vector memory store for semantic search.
    
    Args:
        title: The title or identifier of the document.
        content: The text content to store.
    """
    DOCUMENT_STORE.append({"title": title, "content": content})
    return f"Successfully index document: '{title}' into semantic memory store."

def semantic_search_memory(query: str) -> str:
    """Searches stored documents in semantic memory using keyword/context matching.
    
    Args:
        query: The search term or query.
    """
    if not DOCUMENT_STORE:
        return "Memory store is currently empty. Add documents first."

    # Simple TF-IDF or keyword matching simulation
    matches = []
    query_words = set(query.lower().split())
    
    for doc in DOCUMENT_STORE:
        score = 0
        doc_text = (doc["title"] + " " + doc["content"]).lower()
        for word in query_words:
            if word in doc_text:
                score += 1
        if score > 0:
            matches.append((score, doc))
            
    # Sort matches by score descending
    matches.sort(key=lambda x: x[0], reverse=True)
    
    if not matches:
        return f"No matches found in memory for query: '{query}'"
        
    results = []
    for score, doc in matches[:3]:
        results.append(f"Match Score {score} - Title: {doc['title']}\nContent: {doc['content']}")
        
    return "\n\n".join(results)
