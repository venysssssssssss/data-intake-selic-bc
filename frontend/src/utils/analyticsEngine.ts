import { SelicDataPoint } from '../types';

export interface AnalyticResult {
    title: string;
    description: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    color: string;
}

export interface DetailedAnalysis {
    volatility: {
        score: number; // 0-100
        classification: 'Stable' | 'Moderate' | 'Volatile';
        stdDev: number;
    };
    cycle: {
        currentPhase: 'Tightening' | 'Easing' | 'Neutral';
        durationMonths: number;
        magnitude: number;
    };
    distribution: {
        percentile: number;
        historicalAverage: number;
        classification: 'Low' | 'Normal' | 'High';
    };
    momentum: {
        shortTermSlope: number; // 3 months
        longTermSlope: number; // 12 months
        signal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'; // Metaphorical for "Rate Hike Probability"
    };
}

export const parseDate = (dateStr: string): Date => {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
};

export const analyzeData = (data: SelicDataPoint[]): DetailedAnalysis => {
    if (data.length < 12) {
        return {
            volatility: { score: 0, classification: 'Stable', stdDev: 0 },
            cycle: { currentPhase: 'Neutral', durationMonths: 0, magnitude: 0 },
            distribution: { percentile: 50, historicalAverage: 0, classification: 'Normal' },
            momentum: { shortTermSlope: 0, longTermSlope: 0, signal: 'Hold' }
        };
    }

    // Sort data
    const sorted = [...data].sort((a, b) => parseDate(a.data).getTime() - parseDate(b.data).getTime());
    const values = sorted.map(d => parseFloat(d.valor));
    const currentVal = values[values.length - 1];

    // 1. Volatility (Standard Deviation of monthly changes over last 12 months)
    const changes = [];
    for (let i = values.length - 12; i < values.length - 1; i++) {
        changes.push(Math.abs(values[i+1] - values[i]));
    }
    const meanChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    const variance = changes.reduce((a, b) => a + Math.pow(b - meanChange, 2), 0) / changes.length;
    const stdDev = Math.sqrt(variance);
    
    let volScore = Math.min(100, (stdDev / 0.5) * 50); // Normalize: 0.5% std dev = 50 score
    let volClass: 'Stable' | 'Moderate' | 'Volatile' = 'Stable';
    if (volScore > 60) volClass = 'Volatile';
    else if (volScore > 30) volClass = 'Moderate';

    // 2. Cycle Detection (Direction of last major move)
    // Simple heuristic: Look at last 6 months net change
    const sixMonthsAgo = values[values.length - 7] || values[0];
    const cycleDiff = currentVal - sixMonthsAgo;
    let currentPhase: 'Tightening' | 'Easing' | 'Neutral' = 'Neutral';
    if (cycleDiff > 0.5) currentPhase = 'Tightening';
    else if (cycleDiff < -0.5) currentPhase = 'Easing';

    // 3. Distribution (Historical Percentile)
    const sortedValues = [...values].sort((a, b) => a - b);
    const rank = sortedValues.findIndex(v => v >= currentVal);
    const percentile = (rank / sortedValues.length) * 100;
    const histAvg = values.reduce((a, b) => a + b, 0) / values.length;
    
    let distClass: 'Low' | 'Normal' | 'High' = 'Normal';
    if (percentile > 75) distClass = 'High';
    else if (percentile < 25) distClass = 'Low';

    // 4. Momentum (Slope)
    const getSlope = (months: number) => {
        const slice = values.slice(-months);
        if (slice.length < 2) return 0;
        const n = slice.length;
        // Simple linear regression slope
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += slice[i];
            sumXY += i * slice[i];
            sumXX += i * i;
        }
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    };

    const shortSlope = getSlope(3);
    const longSlope = getSlope(12);
    
    // Signal
    let signal: any = 'Hold';
    if (shortSlope > 0.1 && longSlope > 0) signal = 'Strong Buy'; // Hiking aggressively
    else if (shortSlope > 0) signal = 'Buy';
    else if (shortSlope < -0.1 && longSlope < 0) signal = 'Strong Sell'; // Cutting aggressively
    else if (shortSlope < 0) signal = 'Sell';

    return {
        volatility: { score: volScore, classification: volClass, stdDev },
        cycle: { currentPhase, durationMonths: 6, magnitude: cycleDiff },
        distribution: { percentile, historicalAverage: histAvg, classification: distClass },
        momentum: { shortTermSlope: shortSlope, longTermSlope: longSlope, signal }
    };
};
