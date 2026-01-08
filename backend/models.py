from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional

class SelicDataPoint(BaseModel):
    data: str = Field(..., description="Date in DD/MM/YYYY format")
    valor: float = Field(..., description="Selic rate value")

    @field_validator('data')
    def validate_date_format(cls, v):
        try:
            datetime.strptime(v, '%d/%m/%Y')
        except ValueError:
            raise ValueError('Incorrect data format, should be DD/MM/YYYY')
        return v

class IngestResponse(BaseModel):
    status: str
    message: str
    rows_processed: int
    
class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    db_status: str

class MetaSelicData(BaseModel):
    data: str
    valor: float