# Data Intake Pro (MVP)

A robust data ingestion platform for Brazilian Selic Rate (Series 4390), featuring automated validation, idempotent storage, and a modern observability dashboard.

## Architecture

- **Backend**: Python 3, FastAPI, DuckDB (Embedded OLAP), Pydantic.
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts.

## Prerequisites

- Python 3.8+
- Node.js 18+

## Setup & Running

### 1. Backend (The "Vault")

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment and install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the API server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
Docs: `http://localhost:8000/docs`

### 2. Frontend (The "Window")

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Dashboard will be available at `http://localhost:5173`.

## Features

1.  **Ingestion**:
    - Click **"Trigger BCB Sync"** on the dashboard to fetch real data from the Central Bank.
    - Idempotent: Can be clicked multiple times without duplicating data (updates existing records).
2.  **Observability**:
    - **Health Check**: Real-time status of the API and Database connection.
    - **Quality Alerts**: Detects gaps in the monthly series and highlights invalid values (0.00).
3.  **Visualization**:
    - Interactive trend chart.
    - Tabular view of raw data.

## Project Structure

```
.
├── backend/
│   ├── main.py          # API Entrypoint
│   ├── database.py      # DuckDB persistence layer
│   ├── models.py        # Pydantic schemas
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/  # Chart, Table, StatusCard
    │   ├── App.tsx      # Main Dashboard Logic
    │   └── api.ts       # Axios client
    └── package.json
```

## Deployment

### GitHub Pages (Frontend Only)

The frontend is configured to deploy automatically to GitHub Pages via GitHub Actions.

1.  Push your changes to GitHub.
2.  Go to your repository **Settings** > **Pages**.
3.  Under **Source**, select **Deploy from a branch**.
4.  Verify that the branch is `gh-pages` (this branch is created automatically by the Action after the first successful run).
5.  Visit your deployed site!

**Note:** The deployed frontend will try to connect to the backend. Since the backend runs locally, the deployed site **will not work fully** (API calls will fail) unless you also deploy the backend to a public cloud provider (e.g., Render, Railway, AWS) and update the API URL in the frontend configuration.

# data-intake-selic-bc