import axios from 'axios';
import { SelicDataPoint, IngestResponse, HealthCheck, MetaSelicData } from './types';

// In development, Vite proxies /v1 to localhost:8000
const API_BASE = import.meta.env.VITE_API_URL || '';

// DEBUG: Verificar no Console do navegador (F12) se a URL está correta
console.log('Ambiente:', import.meta.env.MODE);
console.log('API Base URL conectada:', API_BASE ? API_BASE : 'Vazio (Usando Proxy Local ou Erro)');
console.log('Status do Deploy: Nova versão limpa carregada com sucesso');

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