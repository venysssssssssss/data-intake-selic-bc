import { useEffect, useState } from 'react';
import { api } from './api';
import { HealthCheck, SelicDataPoint, MetaSelicData } from './types';
import { DataChart } from './components/DataChart';
import { DataTable } from './components/DataTable';
import { StatusCard } from './components/StatusCard';
import { SchemaViewer } from './components/SchemaViewer';
import { EducationalSection } from './components/EducationalSection';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { KeyIndicators } from './components/KeyIndicators';
import { RefreshCw, DownloadCloud, AlertOctagon, Moon, Sun, Globe, Zap, ZapOff } from 'lucide-react';
import { UiProvider, useUi } from './contexts/UiContext';

function Dashboard() {
  const { t, theme, toggleTheme, language, setLanguage } = useUi();
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [data, setData] = useState<SelicDataPoint[]>([]);
  const [metaSelic, setMetaSelic] = useState<MetaSelicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [qualityIssues, setQualityIssues] = useState<string[]>([]);
  
  // Use ref for autoSync interval to avoid stale closures if not using dependency correctly, 
  // but here we will just clear/set interval on state change.

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthData, rawData, metaData] = await Promise.all([
        api.getHealth(),
        api.getRawData(),
        api.getMetaSelic()
      ]);
      setHealth(healthData);
      setData(rawData);
      setMetaSelic(metaData);
      checkQuality(rawData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async () => {
    setIngesting(true);
    try {
      await api.fetchFromBCB();
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Failed to ingest data from BCB", error);
      alert("Failed to ingest data from BCB");
    } finally {
      setIngesting(false);
    }
  };

  const checkQuality = (dataPoints: SelicDataPoint[]) => {
    const issues: string[] = [];
    if (dataPoints.length < 2) return;

    const sorted = [...dataPoints].sort((a, b) => {
        const [d1, m1, y1] = a.data.split('/').map(Number);
        const [d2, m2, y2] = b.data.split('/').map(Number);
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    });

    for (let i = 0; i < sorted.length - 1; i++) {
        const [d1, m1, y1] = sorted[i].data.split('/').map(Number);
        const [d2, m2, y2] = sorted[i+1].data.split('/').map(Number);
        
        const date1 = new Date(y1, m1 - 1, d1);
        const date2 = new Date(y2, m2 - 1, d2);

        const monthDiff = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());

        if (monthDiff > 1) {
            issues.push(`${t.gapDetected} ${sorted[i].data} - ${sorted[i+1].data}`);
        }
    }
    setQualityIssues(issues);
  };

  useEffect(() => {
    fetchData();
  }, [language]); 

  // Auto-Sync Logic (Real-time Simulation)
  useEffect(() => {
      let intervalId: NodeJS.Timeout;
      if (autoSync) {
          // Poll BCB endpoint via backend every 10 seconds if enabled
          intervalId = setInterval(() => {
              handleIngest(); 
          }, 10000);
      }
      return () => {
          if (intervalId) clearInterval(intervalId);
      }
  }, [autoSync]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">{t.appTitle}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
            {/* Language Toggle */}
            <button
                onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow hover:bg-slate-50 dark:hover:bg-slate-700"
                title="Switch Language"
            >
                <div className="flex items-center gap-1 font-bold text-xs">
                    <Globe className="w-4 h-4" />
                    {language.toUpperCase()}
                </div>
            </button>

            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow hover:bg-slate-50 dark:hover:bg-slate-700"
                title="Toggle Theme"
            >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

            {/* Auto-Sync Toggle */}
            <button
                onClick={() => setAutoSync(!autoSync)}
                className={`flex items-center px-3 py-2 rounded-lg shadow transition ${
                    autoSync 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
            >
                {autoSync ? <Zap className="w-4 h-4 mr-2 animate-pulse" /> : <ZapOff className="w-4 h-4 mr-2" />}
                <span className="text-sm font-medium">{t.autoSync}</span>
            </button>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t.refresh}
          </button>
          <button 
            onClick={handleIngest} 
            disabled={ingesting}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <DownloadCloud className={`w-4 h-4 mr-2 ${ingesting ? 'animate-pulse' : ''}`} />
            {ingesting ? t.ingesting : t.ingest}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* Key Indicators Section (New) */}
        <KeyIndicators 
            metaSelic={metaSelic} 
            lastMonthly={data.length > 0 ? data[0] : null} // Assuming data is sorted DESC from backend
            loading={loading}
        />

        {/* Top Section: Health, Schema, Quality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
                <StatusCard health={health} loading={loading} />
                <SchemaViewer />
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md transition-colors duration-200">
                    <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                        <AlertOctagon className="w-5 h-5 mr-2 text-orange-500" />
                        {t.qualityAlerts}
                    </h3>
                    {qualityIssues.length === 0 && data.length > 0 ? (
                        <p className="text-green-600 dark:text-green-400 text-sm">{t.noGaps}</p>
                    ) : (
                        <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                            {qualityIssues.map((issue, idx) => (
                                <li key={idx} className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/30">
                                    {issue}
                                </li>
                            ))}
                            {data.length === 0 && !loading && <li className="text-sm text-gray-500 dark:text-gray-400">{t.noData}</li>}
                        </ul>
                    )}
                </div>
            </div>

            <div className="md:col-span-2">
                <DataChart data={data} />
            </div>
        </div>

        {/* Middle Section: Educational Content */}
        <EducationalSection />

        {/* Bottom Section: Analytics & Raw Data */}
        <div className="space-y-8">
            <AnalyticsDashboard data={data} />
            <DataTable data={data} />
        </div>

      </main>
    </div>
  )
}

function App() {
    return (
        <UiProvider>
            <Dashboard />
        </UiProvider>
    );
}

export default App
