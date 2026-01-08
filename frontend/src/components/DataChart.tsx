import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SelicDataPoint } from '../types';
import { useUi } from '../contexts/UiContext';

interface DataChartProps {
  data: SelicDataPoint[];
}

export const DataChart: React.FC<DataChartProps> = ({ data }) => {
  const { t, theme } = useUi();
  
  // Sort data by date ascending for the chart
  const sortedData = [...data].sort((a, b) => {
      const [d1, m1, y1] = a.data.split('/').map(Number);
      const [d2, m2, y2] = b.data.split('/').map(Number);
      return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
  });

  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md h-96 transition-colors duration-200">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">{t.trendTitle}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
          <XAxis dataKey="data" stroke={isDark ? "#94a3b8" : "#666"} />
          <YAxis stroke={isDark ? "#94a3b8" : "#666"} />
          <Tooltip 
             contentStyle={{ 
                 backgroundColor: isDark ? '#1e293b' : '#fff',
                 borderColor: isDark ? '#334155' : '#ccc',
                 color: isDark ? '#f8fafc' : '#000'
             }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Selic %" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};