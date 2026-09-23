import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Share2,
  Video,
} from 'lucide-react';
import { DailyBriefing, ImpactNewsItem, Language } from '../types';
import { translations } from '../data/translations';
import { getLocalizedBriefing, getLocalizedNews, getLocalizedCategory } from '../utils/localization';
import { LanguageSelector } from './LanguageSelector';

interface DailyBriefingViewProps {
  briefing: DailyBriefing;
  topNews: ImpactNewsItem[];
  language: Language;
  onSelectLanguage?: (lang: Language) => void;
  onTriggerDailyPush: (briefing: DailyBriefing) => void;
  onSelectNews: (news: ImpactNewsItem) => void;
  onGenerateScript?: (news: ImpactNewsItem) => void;
}

export const DailyBriefingView: React.FC<DailyBriefingViewProps> = ({
  briefing,
  topNews,
  language,
  onSelectLanguage,
  onTriggerDailyPush,
  onSelectNews,
  onGenerateScript,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [speechSupported, setSpeechSupported] = useState(true);

  const t = translations[language];
  const localized = getLocalizedBriefing(briefing, language);

  // Web Speech API integration
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel audio if language changes while playing
  useEffect(() => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [language]);

  const speakCurrentScript = (rate: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const script = localized.audioScript;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find(
        (v) =>
          v.lang === 'hi-IN' ||
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi')
      );
      if (hiVoice) {
        utterance.voice = hiVoice;
      }
    } else {
      utterance.lang = 'en-IN';
      const inVoice = voices.find(
        (v) => v.lang === 'en-IN' || v.name.includes('India') || v.name.includes('Natural')
      );
      if (inVoice) {
        utterance.voice = inVoice;
      }
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakCurrentScript(playbackRate);
      }
    }
  };

  const handleResetAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying && 'speechSynthesis' in window) {
      speakCurrentScript(rate);
    }
  };

  return (
    <div id="daily-briefing-container" className="flex-1 flex flex-col overflow-y-auto p-4 space-y-5">
      {/* Date and Briefing Tag */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
              {t.executiveBriefingTitle}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {briefing.date} • {t.last24Hours}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSelectLanguage && (
            <LanguageSelector language={language} onSelectLanguage={onSelectLanguage} />
          )}
          <button
            onClick={() => onTriggerDailyPush(briefing)}
            id="trigger-briefing-push-btn"
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-950/40 transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{t.sendDailyPush}</span>
          </button>
        </div>
      </div>

      {/* Main Headline Card with Indian Tricolor Accent */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-slate-200 to-emerald-600 opacity-90" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          {t.intelligencePillar}
        </span>
        <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-2 leading-snug">
          {localized.headline}
        </h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          {localized.executiveSummary}
        </p>
      </div>

      {/* Audio Briefing Player */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-orange-500/30 shadow-md">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-slate-200">
              {t.listenBriefing} ({language === 'hi' ? 'हिंदी ऑडियो' : 'English Audio'})
            </span>
          </div>
          {/* Playback speed selector */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px]">
            {[1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded font-mono font-semibold transition-colors ${
                  playbackRate === speed
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex items-center justify-center gap-1 h-8 my-2 px-2 bg-slate-950/60 rounded-xl border border-slate-800/70">
          {Array.from({ length: 28 }).map((_, i) => {
            const heights = [20, 45, 80, 60, 30, 90, 70, 50, 85, 40, 65, 30, 95, 55];
            const h = heights[i % heights.length];
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-orange-500 animate-pulse'
                    : 'bg-slate-700'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * ((i % 3) + 1)) / 3)}%` : '20%',
                  animationDelay: `${i * 45}ms`,
                }}
              />
            );
          })}
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleResetAudio}
            id="reset-audio-btn"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Rewind"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            id="play-pause-audio-btn"
            className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-950/40 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{t.pauseAudio}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{t.playAudio}</span>
              </>
            )}
          </button>

          <div className="w-8" />
        </div>
      </div>

      {/* Strategic Threat vs Opportunity Barometer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          {t.geopoliticalBarometer}
        </h3>
        <div className="space-y-3">
          {/* Opportunity */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {t.opportunityIndex}
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {briefing.opportunityIndex}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-600 to-teal-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${briefing.opportunityIndex}%` }}
              />
            </div>
          </div>

          {/* Threat / Vulnerability */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t.threatIndex}
              </span>
              <span className="font-mono font-bold text-rose-400">
                {briefing.strategicThreatIndex}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${briefing.strategicThreatIndex}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Strategic Takeaways */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-400" />
          {t.keyTakeawaysTitle}
        </h3>
        <ul className="space-y-2.5">
          {localized.keyTakeaways.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
              <div className="w-5 h-5 rounded-full bg-orange-950/60 border border-orange-500/40 text-orange-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p>{point}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Ranked Impact Flash Cards for Quick Navigation */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t.itemsCoveredTitle}
        </div>
        {topNews.slice(0, 3).map((item) => {
          const locItem = getLocalizedNews(item, language);
          const cat = getLocalizedCategory(item.category, language);
          return (
            <div
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/40 cursor-pointer flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase text-orange-400 bg-orange-950/40 px-1.5 py-0.5 rounded border border-orange-800/40">
                    {t.rank} #{item.impactRank}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {cat}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                  {locItem.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onGenerateScript && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateScript(item);
                    }}
                    className="px-2 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-red-200 text-[10px] font-bold flex items-center gap-1 transition-all"
                    title="Generate YouTube Script"
                  >
                    <Video className="w-3 h-3 text-red-400" />
                    <span>YT Script</span>
                  </button>
                )}
                <span className="text-xs text-orange-400 font-semibold whitespace-nowrap">
                  {t.deepDive} &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

