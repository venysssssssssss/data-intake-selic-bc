import React from 'react';
import { useUi } from '../contexts/UiContext';
import { MetaSelicData, SelicDataPoint } from '../types';
import { Target, TrendingUp, Calendar } from 'lucide-react';

interface KeyIndicatorsProps {
    metaSelic: MetaSelicData | null;
    lastMonthly: SelicDataPoint | null;
    loading: boolean;
}

export const KeyIndicators: React.FC<KeyIndicatorsProps> = ({ metaSelic, lastMonthly, loading }) => {
    const { t } = useUi();

    if (loading && !metaSelic) {
        return <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-32 rounded-lg col-span-1 md:col-span-3"></div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Meta Selic Card */}
            <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center mb-2 opacity-90">
                        <Target className="w-5 h-5 mr-2" />
                        <h3 className="text-sm font-semibold uppercase tracking-wider">{t.metaSelicTitle}</h3>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-4xl font-bold">{metaSelic ? `${metaSelic.valor.toFixed(2)}%` : '--'}</span>
                        <span className="ml-2 text-sm opacity-75">a.a.</span>
                    </div>
                    <p className="mt-2 text-xs opacity-75 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {metaSelic ? metaSelic.data : '--'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-indigo-500/30 text-xs text-indigo-100">
                        {t.metaSelicDesc}
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Target className="w-40 h-40" />
                </div>
            </div>

            {/* Last Monthly Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 border-emerald-500 transition-colors duration-200">
                <div className="flex items-center mb-2 text-slate-500 dark:text-slate-400">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider">{t.lastMonthlyTitle}</h3>
                </div>
                 <div className="flex items-baseline text-slate-900 dark:text-white">
                    <span className="text-4xl font-bold">{lastMonthly ? `${lastMonthly.valor}%` : '--'}</span>
                    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">a.m.</span>
                </div>
                 <p className="mt-2 text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {lastMonthly ? lastMonthly.data : '--'}
                </p>
            </div>
        </div>
    );
};
