from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import config

# Import agents (will be created next)
from agents.sales_agent import router as sales_router
from agents.technical_agent import router as technical_router
from agents.pricing_agent import router as pricing_router
from agents.master_agent import router as master_router

app = FastAPI(title="TenderAgent AI Backend", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    config.validate()
    print("Backend started. AI Provider:", config.AI_PROVIDER)

@app.get("/")
async def root():
    return {"message": "TenderAgent AI Backend is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers (commented out until files exist)
app.include_router(sales_router, prefix="/api/sales", tags=["Sales Agent"])
app.include_router(technical_router, prefix="/api/technical", tags=["Technical Agent"])
app.include_router(pricing_router, prefix="/api/pricing", tags=["Pricing Agent"])
app.include_router(master_router, prefix="/api/master", tags=["Master Agent"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
