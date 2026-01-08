import axios from 'axios';
import { SelicDataPoint, IngestResponse, HealthCheck, MetaSelicData } from './types';

// In development, Vite proxies /v1 to localhost:8000
const API_BASE = ''; 

export const api = {
    getHealth: async (): Promise<HealthCheck> => {
        const response = await axios.get<HealthCheck>(`${API_BASE}/v1/health`);
        return response.data;
    },
    
    getRawData: async (): Promise<SelicDataPoint[]> => {
        const response = await axios.get<SelicDataPoint[]>(`${API_BASE}/v1/raw-data`);
        return response.data;
    },
    
    fetchFromBCB: async (): Promise<IngestResponse> => {
        const response = await axios.post<IngestResponse>(`${API_BASE}/v1/fetch-bcb`);
        return response.data;
    },

    getMetaSelic: async (): Promise<MetaSelicData> => {
        const response = await axios.get<MetaSelicData>(`${API_BASE}/v1/meta-selic`);
        return response.data;
    }
};