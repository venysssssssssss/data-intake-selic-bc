import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useUi } from '../contexts/UiContext';

export const InvestmentSimulator: React.FC<{ currentRate: number }> = ({ currentRate }) => {
    const { t } = useUi();
    const [amount, setAmount] = useState(1000);
    const [months, setMonths] = useState(12);

    const projectedReturn = (amount * Math.pow(1 + (currentRate / 100), months / 12));
    const profit = projectedReturn - amount;

    return (
        <div className="h-full flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-indigo-500" />
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{t.roiTitle}</h4>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t.initialInvestment}</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t.durationMonths}</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="60" 
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                    />
                    <div className="text-right text-xs text-slate-500 mt-1">{months}</div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-indigo-700 dark:text-indigo-300">{t.totalReturn}</span>
                        <span className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                            {projectedReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-indigo-500 dark:text-indigo-400">{t.profit}</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            +{profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                    {t.roiDisclaimer}
                </p>
            </div>
        </div>
    );
};