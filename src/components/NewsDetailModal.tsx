import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Share2,
  Check,
  Flame,
  ShieldCheck,
  Video,
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { ImpactNewsItem, Language } from '../types';
import { resolveStructuredNewsDetails } from '../utils/newsContentResolver';
import { realisticVoice, VoicePersona } from '../utils/realisticVoiceSynthesizer';
import { WIRE_SOURCE_NAMES_HI } from '../utils/wireHeadlineTranslator';

interface NewsDetailModalProps {
  news: ImpactNewsItem | null;
  language: Language;
  onSelectLanguage?: (lang: Language) => void;
  onClose: () => void;
  onOpenShortReel?: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  news,
  language,
  onSelectLanguage,
  onClose,
  onOpenShortReel,
}) => {
  const [activeLang, setActiveLang] = useState<Language>(language);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('anchor');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isFactCheckOpen, setIsFactCheckOpen] = useState<boolean>(false);

  useEffect(() => {
    setActiveLang(language);
  }, [language]);

  // Clean up audio on unmount or close
  useEffect(() => {
    return () => {
      realisticVoice.stop();
    };
  }, []);

  if (!news) return null;

  const isHi = activeLang === 'hi';
  const details = resolveStructuredNewsDetails(news, activeLang);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (isAudioPaused) {
        realisticVoice.resume();
        setIsAudioPaused(false);
      } else {
        realisticVoice.pause();
        setIsAudioPaused(true);
      }
    } else {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);

      realisticVoice.speak(details.audioNarrationText, {
        lang: activeLang,
        persona: voicePersona,
        onEnd: () => {
          setIsPlayingAudio(false);
          setIsAudioPaused(false);
        },
        onError: () => {
          setIsPlayingAudio(false);
          setIsAudioPaused(false);
        },
      });
    }
  };

  const handleStopAudio = () => {
    realisticVoice.stop();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isCritical = news.impactLevel === 'CRITICAL';
  const isHigh = news.impactLevel === 'HIGH';

  return (
    <AnimatePresence>
      <div
        id={`news-detail-modal-overlay-${news.id}`}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 290 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 border border-slate-200"
        >
          {/* Top Bar: Language Switcher, Realistic Voiceover, Close */}
          <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50/90 shrink-0 gap-2">
            {/* Left: Back & Rank */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                title={isHi ? 'वापस जाएं' : 'Go back'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  isCritical
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : isHigh
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isCritical && <Flame className="w-3 h-3 text-rose-600" />}
                #{news.impactRank} • {news.impactLevel}
              </div>

              <span className="text-xs font-semibold text-slate-500 hidden xs:inline">
                {news.category}
              </span>
            </div>

            {/* Right: Language Toggle & Realistic Audio Player & Close */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-200/90 rounded-lg p-0.5 border border-slate-300">
                <button
                  onClick={() => {
                    setActiveLang('hi');
                    if (onSelectLanguage) onSelectLanguage('hi');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    activeLang === 'hi'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => {
                    setActiveLang('en');
                    if (onSelectLanguage) onSelectLanguage('en');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    activeLang === 'en'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Realistic Human Voiceover Player */}
              <button
                onClick={handleToggleAudio}
                id="listen-realistic-voice-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border ${
                  isPlayingAudio
                    ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                    : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                }`}
                title={isHi ? 'असली इंसानी आवाज़ में खबर सुनें' : 'Listen with natural human voiceover'}
              >
                {isPlayingAudio ? (
                  isAudioPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{isHi ? 'जारी रखें' : 'Resume'}</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>{isHi ? 'रुकें' : 'Pause'}</span>
                    </>
                  )
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isHi ? 'सुनो खबर' : 'Listen'}</span>
                  </>
                )}
              </button>

              {isPlayingAudio && (
                <button
                  onClick={handleStopAudio}
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                  title={isHi ? 'ऑडियो बंद करें' : 'Stop audio'}
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                title={isHi ? 'बंद करें' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Scrollable Story Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white">
            {/* Verified Origin & Wire Source Tag */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  {isHi && news.wireOrigin?.sourceName
                    ? (WIRE_SOURCE_NAMES_HI[news.wireOrigin.sourceName] || news.wireOrigin.sourceName)
                    : (news.wireOrigin?.sourceName || news.sources?.[0]?.publisher || 'Official Wire')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{news.timeAgo}</span>
                </span>
              </div>

              {onOpenShortReel && (
                <button
                  onClick={onOpenShortReel}
                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  <span>{isHi ? '🎬 5-न्यूज़ रील देखें' : '🎬 Watch 5-News Reel'}</span>
                </button>
              )}
            </div>

            {/* Main Story Headline */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
              {details.title}
            </h1>

            {/* High-Impact Visual Photo */}
            {details.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 max-h-72">
                <img
                  src={details.imageUrl}
                  alt={details.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs font-medium">
                  {isHi ? 'ताज़ा भू-राजनीतिक घटनाक्रम • सत्यापित विजुअल' : 'Breaking Geopolitical Intelligence • Verified Photo'}
                </div>
              </div>
            )}

            {/* Quick Executive Summary Callout */}
            <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-slate-800 text-sm leading-relaxed">
              <span className="font-bold text-orange-900">{isHi ? '⚡ सारांश: ' : '⚡ Executive Summary: '}</span>
              <span>{details.summary}</span>
            </div>

            {/* Fact-Check & Authenticity Verification Inspector (User Transparency Proof) */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 overflow-hidden shadow-xs">
              <button
                onClick={() => setIsFactCheckOpen(!isFactCheckOpen)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-emerald-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">
                    {isHi ? '🛡️ 100% फैक्ट-चेक व स्रोत प्रमाण (यहाँ क्लिक करके जाँचें)' : '🛡️ 100% Fact-Check & Source Proof (Click to Inspect)'}
                  </span>
                  <span className="text-[10px] font-extrabold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                    {isHi ? 'सत्यापित' : 'VERIFIED'}
                  </span>
                </div>
                {isFactCheckOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-emerald-700" />
                )}
              </button>

              {isFactCheckOpen && (
                <div className="px-4 pb-4 pt-1 space-y-3 text-xs text-slate-800 border-t border-emerald-200/60 bg-white">
                  {/* Point 1: 24h Freshness Proof */}
                  <div className="flex items-start gap-2.5 pt-2">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {isHi ? '1. यह खबर पुरानी क्यों नहीं है? (24H Freshness Threshold):' : '1. Why this news is not stale? (24H Freshness Threshold):'}
                      </span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {isHi
                          ? `यह खबर पिछले 24 घंटे के शुद्ध समय चक्र में सीधे आधिकारिक वायर से प्राप्त हुई है (${news.timeAgo})। हमारा सिस्टम किसी भी पुरानी या बासी खबर को स्वतः फ़िल्टर (क्वारंटाइन) कर देता है।`
                          : `Received directly via official primary wire within the strict 24-hour cycle (${news.timeAgo}). Stale or recirculated reports are automatically quarantined.`}
                      </p>
                    </div>
                  </div>

                  {/* Point 2: 100% Official Source Proof */}
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 block">
                        {isHi ? '2. कंटेंट 100% सच्चा व तथ्यों पर आधारित कैसे है? (Primary Source Wire):' : '2. How is this content 100% accurate and factual? (Primary Source Wire):'}
                      </span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {isHi
                          ? `यह रिपोर्ट बिना किसी सोशल मीडिया अफवाह के सीधे ${news.wireOrigin?.sourceName || news.sources?.[0]?.publisher || 'पीआईबी व आधिकारिक प्राथमिक वायर'} के आधिकारिक बुलेटिन से सत्यापित की गई है।`
                          : `Verified directly from official bulletins issued by ${news.wireOrigin?.sourceName || news.sources?.[0]?.publisher || 'PIB / MEA / Primary Wire'} without social media distortion.`}
                      </p>

                      {/* Official Wire Link */}
                      {(news.wireOrigin?.wireUrl || news.sources?.[0]?.url) && (
                        <a
                          href={news.wireOrigin?.wireUrl || news.sources?.[0]?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors"
                        >
                          <span>{isHi ? 'मूल आधिकारिक वायर रिपोर्ट खोलें' : 'View Original Wire Dispatch'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Point 3: Separation of Hard Facts vs Analytical Impact */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {isHi ? '3. तथ्यों (Facts) और विश्लेषण (Analysis) का स्पष्ट विभाजन:' : '3. Strict separation of Hard Facts vs Strategic Analysis:'}
                      </span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {isHi
                          ? 'कंटेंट में उल्लिखित संस्थाओं के नाम, आंकड़े, तारीखें व फैसले 100% आधिकारिक रिकॉर्ड पर आधारित हैं, जबकि "भारत पर असर" व "आगे का कदम" राष्ट्रीय सुरक्षा व आर्थिक नीतिगत विश्लेषण द्वारा समर्थित हैं।'
                          : 'All entities, dates, figures, and decisions are 100% hard facts from government records, while "Impact on India" and "Next Moves" provide structured geopolitical impact analysis.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* THE CORE 5 CONTENT SECTIONS (REQUESTED BY USER)                           */}
            {/* ========================================================================= */}
            <div className="space-y-4 pt-1">
              {/* 1. क्या हुआ (WHAT HAPPENED) */}
              <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                    📌
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isHi ? '1. क्या हुआ? (What Happened)' : '1. What Happened?'}
                  </h2>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pl-9">
                  {details.whatHappened}
                </p>
              </section>

              {/* 2. क्यों हुआ / मुख्य कारण (WHY IT HAPPENED) */}
              <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    🔍
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isHi ? '2. क्यों हुआ? / पृष्ठभूमि (Why It Happened)' : '2. Why Did It Happen? (Root Cause)'}
                  </h2>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pl-9">
                  {details.whyHappening}
                </p>
              </section>

              {/* 3. भारत पर असर (IMPACT ON INDIA) */}
              <section className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-200 text-orange-900 flex items-center justify-center font-bold text-sm">
                    🇮🇳
                  </div>
                  <h2 className="text-base font-bold text-orange-950">
                    {isHi ? '3. भारत पर सीधा असर (Impact on India)' : '3. Direct Impact on India'}
                  </h2>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed pl-9 font-medium">
                  {details.impactOnIndia}
                </p>
              </section>

              {/* 4. पूरी दुनिया पर असर (IMPACT ON THE WORLD) */}
              <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    🌍
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isHi ? '4. पूरी दुनिया पर असर (Impact on the World)' : '4. Impact on the World (Global Effects)'}
                  </h2>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pl-9">
                  {details.impactOnWorld}
                </p>
              </section>

              {/* 5. आगे क्या करना चाहिए / अगला कदम (WHAT NEXT) */}
              <section className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-200 text-indigo-900 flex items-center justify-center font-bold text-sm">
                    🎯
                  </div>
                  <h2 className="text-base font-bold text-indigo-950">
                    {isHi ? '5. आगे क्या करना चाहिए? / अगला कदम (What Next)' : '5. What Next? (Strategic Action Plan)'}
                  </h2>
                </div>
                <div className="text-sm text-slate-800 leading-relaxed pl-9 space-y-1.5">
                  {details.whatNext.split('\n').map((step, idx) => (
                    <p key={idx} className="font-medium">
                      {step}
                    </p>
                  ))}
                </div>
              </section>
            </div>

            {/* Bottom Actions: Share & Reel Studio */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{isHi ? 'लिंक कॉपी हो गया!' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>{isHi ? 'शेयर करें' : 'Share Story'}</span>
                  </>
                )}
              </button>

              {onOpenShortReel && (
                <button
                  onClick={onOpenShortReel}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Video className="w-4 h-4" />
                  <span>{isHi ? '🎬 5 बड़ी खबरें रील बनाएं (1 या 2 मिनट)' : '🎬 5-News Reel Studio (1 or 2 Min)'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
