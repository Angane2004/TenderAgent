from fastapi import APIRouter
from models import PricingRequest, PricingResult

router = APIRouter()

@router.post("/calculate", response_model=PricingResult)
async def calculate_pricing(request: PricingRequest):
    """
    Calculate final pricing based on matched SKUs + Overheads.
    """
    base_cost = 0.0
    breakdown = {}
    
    for match in request.sku_matches:
        if match.sku_details:
             # Assume quantity 100 for basic logic if not in request
             sku_price = match.sku_details.price * 100 
             base_cost += sku_price
             breakdown[match.sku_details.name] = sku_price
    
    # Add dummy overheads
    testing_charges = 5000.0
    transport = 2000.0
    
    total_cost = base_cost + testing_charges + transport
    
    # Margin 20%
    margin_percent = 0.20
    margin_amount = total_cost * margin_percent
    
    final_price = total_cost + margin_amount
    
    breakdown["Testing Charges"] = testing_charges
    breakdown["Transport"] = transport
    breakdown["Base Cost"] = base_cost
    
    return PricingResult(
        total_cost=total_cost,
        breakdown=breakdown,
        margin=margin_amount,
        final_price=final_price
    )
