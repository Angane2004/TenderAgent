from fastapi import APIRouter, UploadFile, File, HTTPException
from models import SKU, SKUMatch, RFPFullDetails
from typing import List
import pypdf
import io
from config import config

router = APIRouter()

# Mock Product Database
PRODUCT_DB = [
    SKU(id="SKU-001", name="11kV XLPE Cable 3-Core 300sqmm", description="High voltage cable", specifications={"voltage": "11kV", "cores": 3, "size": "300sqmm"}, price=500.0),
    SKU(id="SKU-002", name="Exterior Emulsion Paint - Premium", description="Weather-proof paint", specifications={"type": "Exterior", "finish": "Matte"}, price=120.0),
    SKU(id="SKU-003", name="LT Cable 4-Core 50sqmm", description="Low tension cable", specifications={"voltage": "1.1kV", "cores": 4, "size": "50sqmm"}, price=150.0),
]

@router.post("/analyze_pdf", response_model=RFPFullDetails)
async def analyze_pdf(file: UploadFile = File(...)):
    """
    Extract text from PDF and return initial analysis.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        # Here we would normally use an LLM to extract structured specs from 'text'
        # For now, we return the text and a dummy title
        
        return RFPFullDetails(
            title=f"Analysis of {file.filename}",
            url="",
            source="Upload",
            description=text[:200] + "...",
            content_text=text,
            status="analyzed",
            specifications={"detected_items": ["cable", "11kV"]} # Mock detection
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.post("/match_skus", response_model=List[SKUMatch])
async def match_skus(rfp_specs: dict):
    """
    Match extracted specs to Product DB (Vector Search mock).
    """
    # Mock logic: if "11kV" in specs, return cable.
    matches = []
    
    # Simple keyword matching for prototype
    spec_str = str(rfp_specs).lower()
    
    if "cable" in spec_str or "11kv" in spec_str:
        matches.append(SKUMatch(
            sku_id="SKU-001",
            match_score=0.95,
            reasoning="Exact voltage and type match detected.",
            sku_details=PRODUCT_DB[0]
        ))
        matches.append(SKUMatch(
            sku_id="SKU-003",
            match_score=0.60,
            reasoning="Partial match: is a cable but different voltage.",
            sku_details=PRODUCT_DB[2]
        ))
        
    if "paint" in spec_str:
        matches.append(SKUMatch(
            sku_id="SKU-002",
            match_score=0.92,
            reasoning="High confidence match for paint requirement.",
            sku_details=PRODUCT_DB[1]
        ))
        
    # Fallback if no specific keywords
    if not matches:
        matches.append(SKUMatch(
            sku_id="SKU-001", 
            match_score=0.1, 
            reasoning="No clear match found, showing default.",
            sku_details=PRODUCT_DB[0]
        ))
        
    return matches
