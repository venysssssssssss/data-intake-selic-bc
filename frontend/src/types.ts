export interface SelicDataPoint {
    data: string;
    valor: number;
    ingested_at?: string;
}

export interface IngestResponse {
    status: string;
    message: string;
    rows_processed: number;
}

export interface HealthCheck {
    status: string;
    timestamp: string;
    db_status: string;
}

export interface MetaSelicData {
    data: string;
    valor: number;
}