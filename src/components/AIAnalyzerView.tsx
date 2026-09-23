import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Radio,
  History,
  ShieldAlert,
  Compass,
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Video,
  BookOpen,
} from 'lucide-react';
import { ImpactNewsItem, SocialPlatform, Language } from '../types';
import { translations } from '../data/translations';
import { getLocalizedNews, getLocalizedCategory, getLocalizedImpactLevel } from '../utils/localization';
import { LanguageSelector } from './LanguageSelector';

interface AIAnalyzerViewProps {
  language: Language;
  onSelectLanguage?: (lang: Language) => void;
  onAnalyzeCustom: (topic: string, platform?: SocialPlatform) => Promise<ImpactNewsItem | null>;
  onSelectNews: (news: ImpactNewsItem) => void;
  onGenerateScript?: (news: ImpactNewsItem) => void;
}

export const AIAnalyzerView: React.FC<AIAnalyzerViewProps> = ({
  language,
  onSelectLanguage,
  onAnalyzeCustom,
  onSelectNews,
  onGenerateScript,
}) => {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<ImpactNewsItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = translations[language];

  const presetTopics = [
    {
      title: language === 'hi'
        ? 'लाल सागर व बाब-अल-मंदेब भारतीय नौसेना गश्ती'
        : 'Red Sea & Bab-el-Mandeb Indian Navy patrols',
      platform: 'twitter' as SocialPlatform,
    },
    {
      title: language === 'hi'
        ? 'अमेरिका-चीन AI चिप प्रतिबंध और भारत सेमीकंडक्टर मिशन'
        : 'US-China AI chip export curbs & India fab race',
      platform: 'google' as SocialPlatform,
    },
    {
      title: language === 'hi'
        ? 'बांग्लादेश सीमा सुरक्षा समीक्षा एवं अडानी गोड्डा बिजली आपूर्ति'
        : 'Bangladesh border corridor review & Adani Godda power',
      platform: 'youtube' as SocialPlatform,
    },
    {
      title: language === 'hi'
        ? 'यूरोपीय संघ कार्बन बॉर्डर टैक्स (CBAM) इस्पात टैरिफ'
        : 'EU Carbon Border Tax (CBAM) steel tariff penalties',
      platform: 'google' as SocialPlatform,
    },
    {
      title: language === 'hi'
        ? 'भारतीय इंजीनियरों के लिए अमेरिकी H-1B वीजा लॉटरी सुधार'
        : 'USCIS H-1B lottery reform for Indian engineers',
      platform: 'twitter' as SocialPlatform,
    },
  ];

  const handleRunAnalysis = async (searchTopic?: string, platform?: SocialPlatform) => {
    const topicToRun = searchTopic || query;
    if (!topicToRun.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await onAnalyzeCustom(topicToRun, platform || selectedPlatform);
      if (result) {
        setAnalyzedResult(result);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze topic');
    } finally {
      setIsLoading(false);
    }
  };

  const localizedResult = analyzedResult ? getLocalizedNews(analyzedResult, language) : null;
  const localizedResultLevel = analyzedResult ? getLocalizedImpactLevel(analyzedResult.impactLevel, language) : '';

  return (
    <div id="ai-analyzer-container" className="flex-1 flex flex-col overflow-y-auto p-4 space-y-5">
      {/* Header with Language Selector */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            {t.analyzerEngineTitle}
          </div>
          <h2 className="text-lg font-extrabold text-slate-100">
            {t.analyzerHeading}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {t.analyzerSubtitle}
          </p>
        </div>

        {onSelectLanguage && (
          <LanguageSelector language={language} onSelectLanguage={onSelectLanguage} />
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <div>
          <label htmlFor="analyzer-query-input" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            {t.inputLabel}
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              id="analyzer-query-input"
              type="text"
              placeholder={t.inputPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAnalysis()}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            {t.focusPlatform}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: undefined, label: t.allPlatforms },
              { id: 'twitter', label: 'X (Twitter)' },
              { id: 'google', label: 'Google News' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'facebook', label: 'Facebook' },
              { id: 'instagram', label: 'Instagram' },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => setSelectedPlatform(p.id as SocialPlatform)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  selectedPlatform === p.id
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => handleRunAnalysis()}
          disabled={isLoading || !query.trim()}
          id="run-analysis-btn"
          className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Radio className="w-4 h-4 animate-spin text-orange-200" />
              <span>{t.analyzingFeeds}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.runAnalysisBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Topics */}
      <div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {t.trendingInquiries}
        </div>
        <div className="space-y-1.5">
          {presetTopics.map((pt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(pt.title);
                setSelectedPlatform(pt.platform);
                handleRunAnalysis(pt.title, pt.platform);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-orange-500/40 text-xs text-slate-300 hover:text-slate-100 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span>{pt.title}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-orange-400">
                {t.analyzeTopic} &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Live Analyzed Result Card */}
      {analyzedResult && localizedResult && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-orange-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {localizedResultLevel}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {t.impactScore}: {analyzedResult.impactScore}/100
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-medium">
              {t.freshAnalysisBadge}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-100 leading-snug">
            {localizedResult.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {localizedResult.whatHappened}
          </p>

          {/* Past Action Highlight */}
          {analyzedResult.pastActionOrigin?.hasPastAction && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] uppercase tracking-wider mb-1">
                <History className="w-3.5 h-3.5" />
                {t.pastActionHeading}:
              </div>
              <p className="text-[11px] leading-relaxed">
                {localizedResult.pastActionTitle || analyzedResult.pastActionOrigin.actionTitle}: {localizedResult.pastActionDetails || analyzedResult.pastActionOrigin.details}
              </p>
            </div>
          )}

          {/* India Impact Summary */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="text-[11px] uppercase font-bold text-orange-400 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {t.indiaImpactHeading}:
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {localizedResult.strategicSummary}
            </p>
          </div>

          {/* Next Move */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="text-[11px] uppercase font-bold text-sky-400 mb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              {t.nextMoveHeading}:
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {localizedResult.primaryAction}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={() => onSelectNews(analyzedResult)}
              id="open-full-analyzer-modal-btn"
              className="w-full sm:flex-1 py-2.5 rounded-xl bg-orange-600/90 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-orange-500/50 shadow-md"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>{language === 'hi' ? '📖 पूरा ब्लॉग और विस्तृत विश्लेषण पढ़ें' : '📖 Read Full Blog & Detailed Analysis'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {onGenerateScript && (
              <button
                onClick={() => onGenerateScript(analyzedResult)}
                id="analyzer-create-yt-script-btn"
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/60 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>
                  {language === 'hi' ? '🎬 YouTube स्क्रिप्ट बनाएं' : '🎬 YouTube Script AI'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

