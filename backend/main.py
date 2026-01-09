from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import requests
import logging
from typing import List
from datetime import datetime

from models import SelicDataPoint, IngestResponse, HealthCheck, MetaSelicData
import database

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Data Intake Pro API", description="API for ingesting and monitoring Selic data", version="1.0.0")

# CORS setup for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Data Intake Pro Backend is running. Access endpoints at /v1/..."}

@app.on_event("startup")
def startup_event():
    database.init_db()
    logger.info("Database initialized.")

@app.get("/v1/health", response_model=HealthCheck)
def health_check():
    try:
        database.get_db_connection().execute("SELECT 1").fetchone()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
        
    return HealthCheck(
        status="active",
        timestamp=datetime.now(),
        db_status=db_status
    )

@app.post("/v1/ingest", response_model=IngestResponse)
def ingest_manual(data: List[SelicDataPoint]):
    logger.info(f"Received manual ingestion request for {len(data)} items.")
    try:
        count = database.upsert_data([d.dict() for d in data])
        return IngestResponse(status="success", message="Data ingested successfully", rows_processed=count)
    except Exception as e:
        logger.error(f"Ingestion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/fetch-bcb", response_model=IngestResponse)
def fetch_from_bcb():
    """
    Triggers a fetch from the BCB API (Series 4390) and ingests the data.
    This is the 'Real-time' sync endpoint.
    """
    BCB_API_URL = "http://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados?formato=json"
    logger.info(f"Fetching data from BCB: {BCB_API_URL}")
    
    try:
        response = requests.get(BCB_API_URL)
        response.raise_for_status()
        data = response.json()
        
        validated_data = [SelicDataPoint(**item) for item in data]
        
        count = database.upsert_data([d.dict() for d in validated_data])
        
        logger.info(f"Successfully fetched and ingested {count} records from BCB.")
        return IngestResponse(status="success", message="BCB Data fetched and ingested", rows_processed=count)
        
    except requests.RequestException as e:
        logger.error(f"Error fetching from BCB: {e}")
        raise HTTPException(status_code=502, detail="Failed to fetch data from BCB")
    except Exception as e:
        logger.error(f"Error processing BCB data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/raw-data", response_model=List[dict])
def get_raw_data():
    return database.get_all_data()

@app.get("/v1/meta-selic", response_model=MetaSelicData)
def get_meta_selic():
    """
    Fetches the latest Annual Target Selic (Series 432).
    """
    # Series 432: Meta Selic definida pelo Copom % a.a.
    # We fetch the last 1 record to get the current target.
    BCB_META_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"
    
    try:
        response = requests.get(BCB_META_URL)
        response.raise_for_status()
        data = response.json() # Returns a list with one item
        
        if not data:
            raise HTTPException(status_code=404, detail="Meta Selic data not found")
            
        return MetaSelicData(**data[0])
    except Exception as e:
        logger.error(f"Error fetching Meta Selic: {e}")
        raise HTTPException(status_code=502, detail="Failed to fetch Meta Selic")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)