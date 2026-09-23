import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { Shield, TrendingUp, Globe, Users, Sparkles, Info, Activity } from 'lucide-react';
import { ImpactNewsItem, Language } from '../types';
import { calculateIndiaImpactDimensions, RadarDataPoint } from '../utils/radarImpactCalculator';

interface IndiaImpactRadarChartProps {
  news: ImpactNewsItem;
  language: Language;
  compact?: boolean;
}

export const IndiaImpactRadarChart: React.FC<IndiaImpactRadarChartProps> = ({
  news,
  language,
  compact = false,
}) => {
  const isHi = language === 'hi';
  const { dataPoints, dominantDimension, averageScore } = calculateIndiaImpactDimensions(news);
  const [activeDimension, setActiveDimension] = useState<RadarDataPoint | null>(null);

  // Map icons for each dimension
  const getDimensionIcon = (dimName: string) => {
    switch (dimName) {
      case 'National Security':
        return <Shield className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'Economic Stability':
        return <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'Foreign Policy':
        return <Globe className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'Domestic Sentiment':
      default:
        return <Users className="w-4 h-4 text-purple-400 shrink-0" />;
    }
  };

  const getLevelBadge = (level: RadarDataPoint['level']) => {
    switch (level) {
      case 'CRITICAL':
        return {
          label: isHi ? 'अति-गंभीर' : 'CRITICAL',
          className: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'HIGH':
        return {
          label: isHi ? 'उच्च प्रभाव' : 'HIGH IMPACT',
          className: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        };
      case 'MODERATE':
        return {
          label: isHi ? 'मध्यम' : 'MODERATE',
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'LOW':
      default:
        return {
          label: isHi ? 'सीमित' : 'LOW',
          className: 'bg-slate-700/40 text-slate-300 border-slate-600',
        };
    }
  };

  // Prepare chart dataset
  const chartData = dataPoints.map((dp) => ({
    dimensionKey: dp.dimension,
    label: isHi ? dp.hiDimension : dp.dimension,
    score: dp.score,
    fullMark: 100,
    pointData: dp,
  }));

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      const dp: RadarDataPoint = p.pointData;
      const badge = getLevelBadge(dp.level);

      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md max-w-xs text-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-100">
              {getDimensionIcon(dp.dimension)}
              <span>{isHi ? dp.hiDimension : dp.dimension}</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badge.className}`}>
              {badge.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-orange-400 font-mono">{dp.score}</span>
            <span className="text-slate-400 text-[11px]">/ 100 {isHi ? 'प्रभाव सूचकांक' : 'Impact Index'}</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              style={{ width: `${dp.score}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 leading-snug line-clamp-3 pt-1 border-t border-slate-800">
            {isHi ? dp.hiRationale : dp.rationale}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="india-impact-radar-card"
      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 shadow-xl space-y-4"
    >
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-orange-400" />
            <span>
              {isHi ? '🇮🇳 भारत प्रभाव रडार (4-आयामी विश्लेषण)' : '🇮🇳 India Impact Radar (4-Dimensional Analysis)'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isHi
              ? 'इस घटना का भारत की 4 प्रमुख रणनीतिक धुरियों पर पड़ने वाला संचयी असर:'
              : "Visual footprint of this event across India's 4 core strategic pillars:"}
          </p>
        </div>

        {/* Dominant Vector Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-950/50 border border-orange-600/40 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span className="text-slate-300">{isHi ? 'मुख्य संवाहक:' : 'Dominant Vector:'}</span>
          <span className="font-bold text-orange-300">
            {isHi ? dominantDimension.hiName : dominantDimension.name} ({dominantDimension.score}/100)
          </span>
        </div>
      </div>

      {/* Radar Chart & High-Level Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Radar Graphic */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 18, right: 28, bottom: 18, left: 28 }}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="label"
                  tick={({ payload, x, y, cx, cy, verticalAnchor, orientation, ...rest }: any) => {
                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        className="text-[11px] sm:text-xs font-bold font-sans fill-slate-200"
                        dy={y > cy ? 12 : -4}
                      >
                        {payload?.value}
                      </text>
                    );
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  stroke="#475569"
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickCount={4}
                />
                <Radar
                  name={isHi ? 'भारत प्रभाव' : 'India Impact'}
                  dataKey="score"
                  stroke="#ea580c"
                  fill="#f97316"
                  fillOpacity={0.42}
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#ea580c', stroke: '#ffffff', strokeWidth: 1.8 }}
                  activeDot={{ r: 6.5, fill: '#f97316', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Footprint Metric */}
          <div className="text-center text-[11px] text-slate-400 flex items-center gap-1.5 mt-[-8px]">
            <span>{isHi ? 'समग्र रणनीतिक तीव्रता:' : 'Composite Strategic Intensity:'}</span>
            <span className="font-mono font-bold text-orange-400 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
              {averageScore}/100
            </span>
          </div>
        </div>

        {/* Dimension Breakdown Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {dataPoints.map((dp) => {
            const badge = getLevelBadge(dp.level);
            const isDominant = dp.dimension === dominantDimension.name;
            const isSelected = activeDimension?.dimension === dp.dimension;

            return (
              <div
                key={dp.dimension}
                onClick={() => setActiveDimension(isSelected ? null : dp)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isDominant
                    ? 'bg-slate-900/90 border-orange-500/50 shadow-sm ring-1 ring-orange-500/20'
                    : isSelected
                    ? 'bg-slate-850 border-sky-500/60'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {getDimensionIcon(dp.dimension)}
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {isHi ? dp.hiDimension : dp.dimension}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badge.className}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono font-black text-sm text-slate-100">{dp.score}</span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDominant
                        ? 'bg-orange-500'
                        : dp.dimension === 'National Security'
                        ? 'bg-rose-500'
                        : dp.dimension === 'Economic Stability'
                        ? 'bg-emerald-500'
                        : dp.dimension === 'Foreign Policy'
                        ? 'bg-sky-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${dp.score}%` }}
                  />
                </div>

                {/* Contextual Rationale Snippet */}
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {isHi ? dp.hiRationale : dp.rationale}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Footer / Clarification */}
      <div className="pt-2 border-t border-slate-800/80 flex items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            {isHi
              ? 'आयाम स्कोर सत्यापित आधिकारिक रिपोर्टिंग व सामरिक विश्लेषण पर आधारित हैं।'
              : 'Dimension axes reflect confirmed impact on defense, macro-economy, diplomacy, and societal response.'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 shrink-0">
          Scale: 0–100 Max Risk/Opportunity
        </span>
      </div>
    </div>
  );
};
