import React from 'react';
import { useUi } from '../contexts/UiContext';
import { BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';

export const EducationalSection: React.FC = () => {
  const { t } = useUi();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-6 transition-colors duration-200">
      <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 flex items-center">
        <BookOpen className="w-6 h-6 mr-2" />
        {t.eduTitle}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">{t.whatIsSelicTitle}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t.whatIsSelicText}
            </p>
        </div>

        <div className="bg-orange-50 dark:bg-slate-700 p-4 rounded-lg">
             <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t.impactTitle}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {t.impactText}
            </p>
        </div>

        <div className="bg-purple-50 dark:bg-slate-700 p-4 rounded-lg border-l-4 border-purple-500">
             <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {t.reflectionTitle}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{t.reflectionText}"
            </p>
        </div>
      </div>
    </div>
  );
};
