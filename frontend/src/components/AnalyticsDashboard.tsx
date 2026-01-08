import React, { useMemo } from 'react';
import { useUi } from '../contexts/UiContext';
import { SelicDataPoint } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface AnalyticsProps {
  data: SelicDataPoint[];
}

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ data }) => {
  const { t } = useUi();

  // 1. Yearly Average Calculation
  const yearlyData = useMemo(() => {
    const grouped: Record<string, number[]> = {};
    data.forEach(d => {
        const year = d.data.split('/')[2];
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(d.valor);
    });

    return Object.keys(grouped).sort().map(year => {
        const values = grouped[year];
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return { year, avg: parseFloat(avg.toFixed(2)) };
    });
  }, [data]);

  // 2. Distribution (Low, Medium, High)
  const distributionData = useMemo(() => {
    let low = 0;   // < 5
    let med = 0;   // 5 - 10
    let high = 0;  // > 10

    data.forEach(d => {
        if (d.valor < 5) low++;
        else if (d.valor <= 10) med++;
        else high++;
    });

    return [
        { name: t.rangeLow, value: low, color: '#10b981' }, // Green
        { name: t.rangeMed, value: med, color: '#f59e0b' }, // Amber
        { name: t.rangeHigh, value: high, color: '#ef4444' } // Red
    ];
  }, [data, t]);

  if (data.length === 0) return null;

  return (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 flex items-center">
            <PieChartIcon className="w-6 h-6 mr-2" />
            {t.analyticsTitle}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Yearly Average Bar Chart */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md transition-colors duration-200">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        {t.yearlyAvgTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.yearlyAvgDesc}</p>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={yearlyData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#f8fafc' }}
                            />
                            <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} name="Avg Selic %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution Pie Chart */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md transition-colors duration-200">
                 <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center">
                        <PieChartIcon className="w-5 h-5 mr-2" />
                        {t.distributionTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.distributionDesc}</p>
                </div>
                <div className="h-64 flex justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    </div>
  );
};
