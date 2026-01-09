import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { SelicDataPoint } from '../types';
import { calculateProjection, parseDate } from '../utils/analyticsEngine';

export const RateProjection: React.FC<{ data: SelicDataPoint[] }> = ({ data }) => {
    const chartData = useMemo(() => {
        const sorted = [...data].sort((a, b) => parseDate(a.data).getTime() - parseDate(b.data).getTime());
        const historical = sorted.slice(-12).map(d => ({
            date: d.data,
            value: parseFloat(d.valor as any),
            type: 'historical'
        }));
        
        const projection = calculateProjection(data);
        return [...historical, ...projection];
    }, [data]);

    return (
        <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} interval={2} />
                    <YAxis domain={['auto', 'auto']} width={40} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fill="url(#colorHist)" 
                        strokeWidth={2}
                    />
                     {/* Overlay for projection segment logic would be complex in single Area, 
                         so we trust the visual continuity or use ReferenceLine to mark start of projection */}
                    <ReferenceLine x={chartData[chartData.length - 7]?.date} stroke="green" strokeDasharray="3 3" label="Forecast Start" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};