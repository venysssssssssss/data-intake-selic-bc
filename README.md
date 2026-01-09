# Data Intake Pro (Selic Series 4390)

**Data Intake Pro** is a high-performance observability and analytics platform designed to ingest, monitor, and visualize the Brazilian Selic Rate (Series 4390) in real-time. It combines a robust Python backend with a modern, responsive React frontend to deliver actionable financial insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production-green.svg)

---

## 🚀 Features

### Core Functionality
- **Real-time Ingestion:** Synchronizes data directly from the Central Bank of Brazil (BCB) API (Series 4390).
- **Data Observability:** Automatically detects data gaps, sequence breaks, and quality issues.
- **Resilient Backend:** Powered by **FastAPI** and **DuckDB** for high-speed, serverless-friendly data processing.

### Advanced Analytics (Frontend)
- **Interactive Dashboards:**
  - **Monetary Policy Cycle:** Visualizes tightening vs. easing cycles.
  - **Market Stability:** Gauges volatility using standard deviation analysis.
  - **Historical Context:** Places current rates in historical percentiles (Low/Med/High).
  - **Real Rate Proxy:** Estimates real interest rates vs. inflation targets.
- **Predictive Models:**
  - **6-Month Forecast:** Linear regression projections based on recent trends.
  - **Seasonality Heatmap:** Analyzes monthly rate averages to detect seasonal patterns.
- **ROI Simulator:** Interactive calculator for estimating investment returns based on current rates.

### UX & Engineering
- **Fully Responsive:** Optimized for Mobile, Tablet, and Desktop.
- **Internationalization (i18n):** Native support for **English** and **Portuguese (PT-BR)**.
- **Dark Mode:** System-aware theme switching.
- **Strict Typing:** Full TypeScript integration sharing types between API and UI.

---

## 🏗 Architecture

The application follows a **Decoupled Architecture** to ensure scalability and independent deployment cycles.

```mermaid
graph TD
    User[User / Browser] -->|HTTPS| GH[GitHub Pages (Frontend)]
    GH -->|API Calls (Axios)| Render[Render (Backend API)]
    Render -->|SQL| DuckDB[(DuckDB Database)]
    Render -->|HTTP| BCB[Central Bank of Brazil API]
    
    subgraph Frontend [React + Vite]
        UI[UI Components]
        Analytics[Analytics Engine]
        I18n[Translation Layer]
    end
    
    subgraph Backend [FastAPI + Python]
        Ingest[Ingestion Service]
        Quality[Quality Check Service]
    end
```

### Deployment Strategy

1.  **Frontend (GitHub Pages):**
    *   **Source:** `frontend/` directory.
    *   **Build:** GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the Vite project.
    *   **Artifact:** The `dist/` folder is uploaded to GitHub Pages.
    *   **Config:** Uses `base: './'` to support flexible hosting paths.

2.  **Backend (Render):**
    *   **Source:** `backend/` directory.
    *   **Runtime:** Python 3.11+.
    *   **Database:** DuckDB (Embedded OLAP database).
    *   **Security:** CORS configured to allow requests from the frontend origin.

---

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 | Component-based UI library. |
| | TypeScript | Type safety and developer experience. |
| | Tailwind CSS | Utility-first styling for responsive design. |
| | Recharts | Composable charting library. |
| | Vite | Next-generation frontend tooling. |
| **Backend** | Python 3.11 | Core logic and data processing. |
| | FastAPI | Modern, fast web framework for APIs. |
| | DuckDB | In-process SQL OLAP database. |
| | Pydantic | Data validation and settings management. |

---

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Server running at http://localhost:8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### 3. Environment Configuration
Create a `.env` file in `frontend/` if needed, but for local dev, Vite proxies `/v1` requests to `http://localhost:8000` automatically via `vite.config.ts`.

---

## 🚀 Deployment Guide

### Frontend (GitHub Actions)
The repository includes a configured workflow: `.github/workflows/deploy.yml`.
1.  Go to **Settings > Secrets and variables > Actions**.
2.  Add a secret named `VITE_API_URL`.
3.  Value: `https://<your-render-app-name>.onrender.com` (No trailing slash).
4.  Push to `main` to trigger the deploy.

### Backend (Render/Railway)
1.  Connect your repository.
2.  Root Directory: `backend`.
3.  Build Command: `pip install -r requirements.txt`.
4.  Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

---

## 🔒 Security & Privacy
- **No Secrets in Code:** All sensitive URLs and keys are managed via Environment Variables.
- **CORS Policy:** Backend restricts access patterns to legitimate clients.
- **Data Privacy:** Uses public data (Series 4390); no PII is collected.

---

## 📄 License
This project is licensed under the MIT License.
