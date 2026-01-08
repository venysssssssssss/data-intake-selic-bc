import React from 'react';
import { FileJson } from 'lucide-react';

export const SchemaViewer: React.FC = () => {
  const schema = {
    name: "SelicDataPoint",
    description: "Contract for Series 4390",
    fields: [
      { name: "data", type: "string", format: "DD/MM/YYYY", required: true },
      { name: "valor", type: "float", description: "Percentage value", required: true }
    ]
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md transition-colors duration-200">
      <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
        <FileJson className="w-5 h-5 mr-2 text-indigo-500" />
        Data Contract (Schema)
      </h3>
      <div className="bg-slate-900 text-slate-50 p-3 rounded text-xs font-mono overflow-auto border border-slate-700">
        <pre>{JSON.stringify(schema, null, 2)}</pre>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Strict validation enforced by Pydantic on Ingest.
      </p>
    </div>
  );
};