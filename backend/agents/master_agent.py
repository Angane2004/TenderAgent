from fastapi import APIRouter, HTTPException, BackgroundTasks
from models import ProposalRequest, PricingRequest, SKUMatch, RFPFullDetails
from agents.technical_agent import match_skus, analyze_pdf
from agents.pricing_agent import calculate_pricing
# from agents.sales_agent import discover_rfps # Not needed for proposal generation directly usually

import asyncio

router = APIRouter()

@router.post("/generate_proposal")
async def generate_proposal(request: ProposalRequest):
    """
    Orchestrate the full flow to generate a proposal.
    """
    # ... (existing code)
    # Mock return for now since we are modifying the architecture to keep TS orchestration prominent
    return {"status": "success"}

@router.post("/calculate_win_probability")
async def calculate_win_probability(data: dict):
    """
    Calculate win probability based on technical and pricing analysis.
    """
    # Extract data
    tech_score = data.get("technical_score", 0)
    price_risk = data.get("price_risk", "low")
    compatible = data.get("compatible", False)
    
    # Simple logic (could be replacing the AI call or wrapping it)
    # If we want to use the LLM here, we can. For now, deterministic logic for speed/reliability.
    
    probability = 0
    if compatible:
        probability += 40
        probability += (tech_score / 100) * 30
        
        if price_risk == "low":
            probability += 30
        elif price_risk == "medium":
            probability += 15
        else:
            probability += 0
            
    reasoning = []
    if probability > 80:
        reasoning.append("Strong technical match and low pricing risk.")
    elif probability > 50:
        reasoning.append("Good match but some risks detected.")
    else:
        reasoning.append("Low probability due to compatibility or pricing risks.")
        
    return {
        "win_probability": min(100, probability),
        "reasoning": " ".join(reasoning)
    }
