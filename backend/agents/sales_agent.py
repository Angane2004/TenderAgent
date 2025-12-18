from fastapi import APIRouter, HTTPException
from models import RFPDiscoveryRequest, RFPSummary
from typing import List
import os
import requests
from config import config

router = APIRouter()

@router.post("/discover", response_model=List[RFPSummary])
async def discover_rfps(request: RFPDiscoveryRequest):
    """
    Search for active RFPs using Tavily API.
    """
    if not config.TAVILY_API_KEY:
        raise HTTPException(status_code=500, detail="TAVILY_API_KEY not configured")
    
    # Construct query
    query = " OR ".join(request.keywords) + " tender RFP"
    
    try:
        # Call Tavily Search API
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": config.TAVILY_API_KEY,
                "query": query,
                "search_depth": "basic",
                "include_answer": False,
                "max_results": request.num_results
            }
        )
        response.raise_for_status()
        data = response.json()
        
        results = []
        for result in data.get("results", []):
            results.append(RFPSummary(
                title=result.get("title"),
                url=result.get("url"),
                source=result.get("url"), # Domain as source for now
                description=result.get("content"),
                status="discovered"
            ))
            
        return results

    except Exception as e:
        print(f"Error searching Tavily: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/mock_discover", response_model=List[RFPSummary])
async def mock_discover_rfps():
    """
    Return dummy data for testing without API keys.
    """
    return [
        RFPSummary(
            title="Supply of 11kV XLPE Cables for State Electricity Board",
            url="https://example.com/tender1",
            source="TendersInfo",
            deadline="2025-01-15",
            description="Requirement for 50km of 3-core 11kV XLPE Cable."
        ),
        RFPSummary(
            title="Annual Contract for Paint Supply - Municipal Corp",
            url="https://example.com/tender2",
            source="GovTenders",
            deadline="2025-02-01",
            description="Supply of exterior and interior emulsion paints for government buildings."
        )
    ]
