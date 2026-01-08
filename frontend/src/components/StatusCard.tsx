import React from 'react';
import { Activity, Database } from 'lucide-react';
import { HealthCheck } from '../types';
import { useUi } from '../contexts/UiContext';

interface StatusCardProps {
    health: HealthCheck | null;
    loading: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ health, loading }) => {
    const { t } = useUi();

    if (loading || !health) {
        return <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-24 rounded-lg"></div>;
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex items-center justify-between transition-colors duration-200">
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">{t.systemHealth}</h3>
                <div className="flex items-center mt-1">
                    <Activity className={`w-5 h-5 mr-2 ${health.status === 'active' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-lg font-bold text-gray-900 dark:text-white capitalize">{health.status}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{t.lastCheck}: {new Date(health.timestamp).toLocaleTimeString()}</p>
            </div>
             <div className="text-right">
                <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">{t.database}</h3>
                <div className="flex items-center justify-end mt-1">
                     <Database className="w-4 h-4 mr-1 text-blue-500" />
                    <span className="text-md font-semibold text-gray-700 dark:text-slate-200">{health.db_status}</span>
                </div>
            </div>
        </div>
    );
};