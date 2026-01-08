import duckdb
import os
import logging

DB_PATH = "selic_data.duckdb"

def get_db_connection():
    conn = duckdb.connect(DB_PATH)
    return conn

def init_db():
    conn = get_db_connection()
    # Create sequence if not exists (optional, but good for ID)
    # Create table with composite primary key or unique constraint logic via upsert
    conn.execute("""
        CREATE TABLE IF NOT EXISTS selic_series (
            date DATE PRIMARY KEY,
            value DOUBLE,
            ingested_at TIMESTAMP
        )
    """)
    conn.close()

def upsert_data(data_list):
    """
    Inserts data idempotently. Updates value if date exists.
    data_list: List of dicts {'data': 'DD/MM/YYYY', 'valor': float}
    """
    conn = get_db_connection()
    try:
        # Prepare data for insertion
        # We process manually to ensure date parsing fits DuckDB's DATE type (YYYY-MM-DD usually preferred in DB)
        processed_data = []
        for item in data_list:
            # Convert DD/MM/YYYY to YYYY-MM-DD
            dt_parts = item['data'].split('/')
            iso_date = f"{dt_parts[2]}-{dt_parts[1]}-{dt_parts[0]}"
            processed_data.append((iso_date, item['valor']))
        
        # Using DuckDB's upsert capability
        # INSERT OR REPLACE INTO is supported
        for date, value in processed_data:
            conn.execute(f"""
                INSERT OR REPLACE INTO selic_series (date, value, ingested_at)
                VALUES ('{date}', {value}, current_timestamp)
            """)
        
        return len(processed_data)
    except Exception as e:
        logging.error(f"Error inserting data: {e}")
        raise e
    finally:
        conn.close()

def get_all_data():
    conn = get_db_connection()
    try:
        # Order by date descending
        result = conn.execute("SELECT strftime(date, '%d/%m/%Y') as data, value as valor, ingested_at FROM selic_series ORDER BY date DESC").fetchdf()
        return result.to_dict(orient='records')
    finally:
        conn.close()
