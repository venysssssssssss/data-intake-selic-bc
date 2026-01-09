import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error trap for white screen debugging
window.addEventListener('error', (event) => {
    const root = document.getElementById('root');
    if (root && root.innerHTML === '') {
        root.innerHTML = `<div style="color: red; padding: 20px;">
            <h1>Application Failed to Start</h1>
            <p>Error: ${event.message}</p>
            <p>File: ${event.filename}</p>
            <p>Line: ${event.lineno}</p>
        </div>`;
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
