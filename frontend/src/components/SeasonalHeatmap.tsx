import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SelicDataPoint } from '../types';
import { calculateSeasonality } from '../utils/analyticsEngine';

export const SeasonalHeatmap: React.FC<{ data: SelicDataPoint[] }> = ({ data }) => {
    const seasonality = useMemo(() => calculateSeasonality(data), [data]);

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonality}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                    <YAxis domain={['auto', 'auto']} width={40} tick={{fontSize: 12}} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="avg" fill="#8884d8" radius={[4, 4, 0, 0]}>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};