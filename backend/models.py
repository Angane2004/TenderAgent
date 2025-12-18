from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class RFPDiscoveryRequest(BaseModel):
    keywords: List[str] = Field(..., description="Keywords to search for")
    num_results: int = 5

class RFPSummary(BaseModel):
    title: str
    url: str
    source: str
    published_date: Optional[str] = None
    deadline: Optional[str] = None
    description: Optional[str] = None
    status: str = "discovered" # discovered, analyzed, ignored

class RFPFullDetails(RFPSummary):
    id: Optional[str] = None
    content_text: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    
class SKU(BaseModel):
    id: str
    name: str
    description: str
    specifications: Dict[str, Any]
    price: float

class SKUMatch(BaseModel):
    sku_id: str
    match_score: float
    reasoning: str
    sku_details: Optional[SKU] = None

class PricingRequest(BaseModel):
    rfp_id: str
    sku_matches: List[SKUMatch]

class PricingResult(BaseModel):
    total_cost: float
    breakdown: Dict[str, Any]
    margin: float
    final_price: float

class ProposalRequest(BaseModel):
    rfp_id: str
    pricing_id: str
