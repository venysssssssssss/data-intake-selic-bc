import React from 'react';
import { SelicDataPoint } from '../types';
import { AlertTriangle } from 'lucide-react';
import { useUi } from '../contexts/UiContext';

interface DataTableProps {
  data: SelicDataPoint[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const { t } = useUi();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t.rawData}</h3>
      </div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t.date}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t.value} (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t.status}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {data.map((row, idx) => {
                const isError = row.valor === 0;
                return (
                  <tr key={idx} className={isError ? "bg-red-50 dark:bg-red-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-700"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{row.data}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isError ? "text-red-600 font-bold" : "text-gray-900 dark:text-slate-300"}`}>
                        {row.valor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                        {isError ? (
                            <span className="flex items-center text-red-500">
                                <AlertTriangle className="w-4 h-4 mr-1" /> {t.invalid}
                            </span>
                        ) : (
                            <span className="text-green-600 dark:text-green-400">{t.valid}</span>
                        )}
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};