import React from 'react';
import { Database, FileJson, CheckCircle2 } from 'lucide-react';
import { useUi } from '../contexts/UiContext';

export const SchemaViewer: React.FC = () => {
    const { t } = useUi();
  const schema = {
    "model": "SelicDataPoint",
    "fields": [
      { "name": "data", "type": "string", "format": "DD/MM/YYYY", "required": true },
      { "name": "valor", "type": "float", "description": "Annualized Rate %", "required": true },
      { "name": "ingested_at", "type": "datetime", "default": "now()", "required": false }
    ]
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md transition-colors duration-200">
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
            <Database className="w-5 h-5 mr-2 text-indigo-500" />
            {t.schemaTitle}
        </h3>
        <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 border border-slate-200 dark:border-slate-700 font-mono text-xs">
            <div className="flex items-center justify-between mb-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">{t.schemaDesc}</span>
                <FileJson className="w-4 h-4 text-slate-400" />
            </div>
            <pre className="text-slate-600 dark:text-slate-300 overflow-x-auto">
                {JSON.stringify(schema, null, 2)}
            </pre>
            <div className="mt-2 flex items-center text-green-600 dark:text-green-500 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t.schemaFooter}</span>
            </div>
        </div>
    </div>
  );
};