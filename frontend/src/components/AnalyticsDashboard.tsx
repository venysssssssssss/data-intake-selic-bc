import React, { useMemo } from 'react';
import { SelicDataPoint } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine, AreaChart, Area } from 'recharts';
import { useUi } from '../contexts/UiContext';
import { analyzeData, DetailedAnalysis } from '../utils/analyticsEngine';
import { TrendingUp, TrendingDown, Activity, History, ArrowRight, Anchor, Gauge } from 'lucide-react';

interface Props {
  data: SelicDataPoint[];
}

const InsightCard: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    analysis: string; 
    highlight: string;
    color: string;
    children: React.ReactNode 
}> = ({ title, icon, analysis, highlight, color, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {icon}
                    {title}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {analysis} <span className={`font-bold ${color}`}>{highlight}</span>
                </p>
            </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
            {children}
        </div>
    </div>
);

export const AnalyticsDashboard: React.FC<Props> = ({ data }) => {
  const { t } = useUi();
  
  const analysis = useMemo(() => analyzeData(data), [data]);
  
  // Prep chart data
  const chartData = useMemo(() => {
      return [...data]
        .sort((a, b) => {
             const [d1, m1, y1] = a.data.split('/').map(Number);
             const [d2, m2, y2] = b.data.split('/').map(Number);
             return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
        })
        .map(d => ({
            date: d.data,
            value: parseFloat(d.valor),
            ma12: 0 // Placeholder for moving average if needed
        }));
  }, [data]);

  const distributionData = useMemo(() => {
      const bins = [0, 5, 10, 15, 20, 25];
      const counts = Array(bins.length - 1).fill(0);
      chartData.forEach(d => {
          const val = d.value;
          const idx = bins.findIndex((b, i) => val >= b && val < bins[i+1]);
          if (idx !== -1) counts[idx]++;
      });
      return counts.map((count, i) => ({ range: `${bins[i]}-${bins[i+1]}%`, count }));
  }, [chartData]);

  if (data.length < 12) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Advanced Market Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. Cycle & Trend Analysis */}
          <InsightCard
            title="Monetary Policy Cycle"
            icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
            color="text-blue-600 dark:text-blue-400"
            analysis="The central bank is currently in a "
            highlight={`${analysis.cycle.currentPhase} Phase`}
          >
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.slice(-24)}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="date" hide />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorVal)" 
                        />
                        {/* Trend Line (Simple visualization) */}
                        <ReferenceLine y={analysis.distribution.historicalAverage} stroke="orange" strokeDasharray="3 3" label="Hist. Avg" />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 text-xs text-slate-500 flex justify-between">
                    <span>Momentum Score: {analysis.momentum.shortTermSlope.toFixed(2)}</span>
                    <span>Cycle Magnitude: {analysis.cycle.magnitude > 0 ? '+' : ''}{analysis.cycle.magnitude.toFixed(2)}%</span>
                </div>
             </div>
          </InsightCard>

          {/* 2. Historical Context (Distribution) */}
          <InsightCard
            title="Historical Context"
            icon={<History className="w-5 h-5 text-purple-500" />}
            color="text-purple-600 dark:text-purple-400"
            analysis="Current rates are historically "
            highlight={`${analysis.distribution.classification} (${Math.round(analysis.distribution.percentile)}th Percentile)`}
          >
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="range" tick={{fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-xs text-slate-500 text-center">
                    Frequency distribution of Selic rates (All-time)
                </div>
             </div>
          </InsightCard>

          {/* 3. Volatility Analysis */}
          <InsightCard
            title="Market Stability"
            icon={<Gauge className="w-5 h-5 text-emerald-500" />}
            color="text-emerald-600 dark:text-emerald-400"
            analysis="Market volatility is currently considered "
            highlight={analysis.volatility.classification}
          >
             <div className="flex items-center justify-center h-64 relative">
                {/* Custom Gauge Visualization using SVG */}
                <svg viewBox="0 0 200 100" className="w-full h-full max-w-[300px]">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
                    <path 
                        d="M 20 100 A 80 80 0 0 1 180 100" 
                        fill="none" 
                        stroke={analysis.volatility.classification === 'Volatile' ? '#ef4444' : analysis.volatility.classification === 'Moderate' ? '#f59e0b' : '#10b981'} 
                        strokeWidth="20" 
                        strokeLinecap="round"
                        strokeDasharray={`${(analysis.volatility.score / 100) * 251} 251`} // 251 is approx arc length
                        className="transition-all duration-1000 ease-out"
                    />
                    <text x="100" y="85" textAnchor="middle" className="text-2xl font-bold fill-slate-700 dark:fill-slate-200">
                        {Math.round(analysis.volatility.score)}/100
                    </text>
                    <text x="100" y="40" textAnchor="middle" className="text-xs fill-slate-400">
                        Risk Score
                    </text>
                </svg>
             </div>
          </InsightCard>

          {/* 4. Real Rate Proxy (Nominal vs Inflation Target Proxy) */}
          <InsightCard
            title="Real Rate Proxy"
            icon={<Anchor className="w-5 h-5 text-amber-500" />}
            color="text-amber-600 dark:text-amber-400"
            analysis="Estimated Real Interest Rate (using 3.5% inflation target) is "
            highlight={`~${(chartData[chartData.length-1]?.value - 3.5).toFixed(2)}%`}
          >
              <div className="h-64 flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-4">
                      <div className="w-24 text-right text-sm font-medium text-slate-500">Nominal</div>
                      <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{width: '100%'}}></div>
                      </div>
                      <div className="w-16 text-sm font-bold text-slate-800 dark:text-slate-100">{chartData[chartData.length-1]?.value}%</div>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="w-24 text-right text-sm font-medium text-slate-500">Inflation (T)</div>
                      <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400" style={{width: `${(3.5 / chartData[chartData.length-1]?.value) * 100}%`}}></div>
                      </div>
                      <div className="w-16 text-sm font-bold text-slate-800 dark:text-slate-100">3.5%</div>
                  </div>
                   <div className="flex items-center gap-4">
                      <div className="w-24 text-right text-sm font-medium text-slate-500">Real Rate</div>
                      <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{width: `${((chartData[chartData.length-1]?.value - 3.5) / chartData[chartData.length-1]?.value) * 100}%`}}></div>
                      </div>
                      <div className="w-16 text-sm font-bold text-slate-800 dark:text-slate-100">{(chartData[chartData.length-1]?.value - 3.5).toFixed(2)}%</div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                      *Approximation assuming constant 3.5% inflation target.
                  </p>
              </div>
          </InsightCard>

      </div>
    </div>
  );
};
