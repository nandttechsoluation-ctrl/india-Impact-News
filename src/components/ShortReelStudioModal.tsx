import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  Clock,
  Mic,
  Flame,
  CheckCircle2,
  ChevronRight,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { ImpactNewsItem, Language, ShortReelData, ShortReelScene } from '../types';
import { generate5NewsShortReel } from '../utils/shortReelService';
import { realisticVoice, VoicePersona } from '../utils/realisticVoiceSynthesizer';

interface ShortReelStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsList: ImpactNewsItem[];
  language?: Language;
  editionDate?: string;
}

export const ShortReelStudioModal: React.FC<ShortReelStudioModalProps> = ({
  isOpen,
  onClose,
  newsList,
  language = 'hi',
  editionDate,
}) => {
  const [durationMode, setDurationMode] = useState<'1min' | '2min'>('1min');
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('confident_anchor');
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPausedAudio, setIsPausedAudio] = useState<boolean>(false);
  const [studioTab, setStudioTab] = useState<'player' | 'script' | 'packaging'>('player');

  // Copied states
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedYtDesc, setCopiedYtDesc] = useState<boolean>(false);
  const [copiedInstaDesc, setCopiedInstaDesc] = useState<boolean>(false);
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);

  // Generate the 5-news short reel data
  const [reelData, setReelData] = useState<ShortReelData>(() =>
    generate5NewsShortReel(newsList, undefined, editionDate, durationMode)
  );

  // Re-generate reel data when newsList or durationMode changes
  useEffect(() => {
    if (newsList && newsList.length > 0) {
      setReelData(generate5NewsShortReel(newsList, undefined, editionDate, durationMode));
      setCurrentSceneIndex(0);
      stopAudio();
    }
  }, [newsList, editionDate, durationMode]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    realisticVoice.stop();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };

  if (!isOpen) return null;

  const currentScene: ShortReelScene = reelData.scenes[currentSceneIndex] || reelData.scenes[0];

  // Play a specific scene or chain through all scenes using realisticVoice
  const playSceneAudio = (sceneIdx: number, autoAdvance: boolean = true) => {
    stopAudio();
    const scene = reelData.scenes[sceneIdx];
    if (!scene) return;

    setCurrentSceneIndex(sceneIdx);
    setIsPlayingAudio(true);
    setIsPausedAudio(false);

    realisticVoice.speak(scene.spokenHindiScript, {
      lang: 'hi',
      persona: voicePersona,
      enableStudioBed: true,
      onEnd: () => {
        if (autoAdvance && sceneIdx < reelData.scenes.length - 1) {
          // Seamless continuous transition without artificial delay
          playSceneAudio(sceneIdx + 1, true);
        } else {
          setIsPlayingAudio(false);
          setIsPausedAudio(false);
        }
      },
      onError: () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      },
    });
  };

  const playFullScriptNonStop = () => {
    stopAudio();
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
    realisticVoice.speak(reelData.fullSpokenTextHindi, {
      lang: 'hi',
      persona: voicePersona,
      enableStudioBed: true,
      onEnd: () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      },
      onError: () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      },
    });
  };

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      if (isPausedAudio) {
        realisticVoice.resume();
        setIsPausedAudio(false);
      } else {
        realisticVoice.pause();
        setIsPausedAudio(true);
      }
    } else {
      playSceneAudio(currentSceneIndex, true);
    }
  };

  const handleNextScene = () => {
    const next = Math.min(reelData.scenes.length - 1, currentSceneIndex + 1);
    setCurrentSceneIndex(next);
    if (isPlayingAudio) {
      playSceneAudio(next, true);
    }
  };

  const handlePrevScene = () => {
    const prev = Math.max(0, currentSceneIndex - 1);
    setCurrentSceneIndex(prev);
    if (isPlayingAudio) {
      playSceneAudio(prev, true);
    }
  };

  const handleCopy = (text: string, type: 'script' | 'yt' | 'insta') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'script') {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      } else if (type === 'yt') {
        setCopiedYtDesc(true);
        setTimeout(() => setCopiedYtDesc(false), 2000);
      } else if (type === 'insta') {
        setCopiedInstaDesc(true);
        setTimeout(() => setCopiedInstaDesc(false), 2000);
      }
    }
  };

  return (
    <AnimatePresence>
      <div
        id="short-reel-studio-modal-overlay"
        className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl bg-white rounded-2xl h-[94vh] max-h-[880px] flex flex-col shadow-2xl overflow-hidden border border-slate-200 text-slate-900"
        >
          {/* Header Bar */}
          <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50 shrink-0 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-sm">
                <Video className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                  <span>5 बड़ी खबरें: YouTube Shorts & Reel Studio</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                    AI Voiceover
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  प्रामाणिक न्यूज़ एंकर आवाज़ में 1 या 2 मिनट का वीडियो तैयार करें
                </p>
              </div>
            </div>

            {/* Right Controls: Duration Toggle & Close */}
            <div className="flex items-center gap-2">
              {/* 1 Min vs 2 Min Toggle */}
              <div className="flex items-center bg-slate-200/90 rounded-xl p-1 border border-slate-300">
                <button
                  onClick={() => setDurationMode('1min')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    durationMode === '1min'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="1 Minute Fast Viral Shorts / Reel"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>1 मिनट (60s)</span>
                </button>
                <button
                  onClick={() => setDurationMode('2min')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    durationMode === '2min'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="2 Minutes In-Depth Briefing (What, Why, Impact)"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>2 मिनट (120s)</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Sub Navigation Bar: Studio Tabs & Voiceover Persona */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-slate-100/70 border-b border-slate-200 gap-3 text-xs flex-wrap">
            {/* Studio Mode Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setStudioTab('player')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  studioTab === 'player'
                    ? 'bg-white text-red-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎬 9:16 प्लेयर प्रिव्यू
              </button>
              <button
                onClick={() => setStudioTab('script')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  studioTab === 'script'
                    ? 'bg-white text-red-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📝 पूरा वॉइसओवर स्क्रिप्ट
              </button>
              <button
                onClick={() => setStudioTab('packaging')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  studioTab === 'packaging'
                    ? 'bg-white text-red-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚀 YouTube / Insta पैकेज
              </button>
            </div>

            {/* Realistic Voice Persona Selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-red-500" />
                <span>आवाज़ टोन:</span>
              </span>
              <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-300">
                <button
                  onClick={() => setVoicePersona('confident_anchor')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    voicePersona === 'confident_anchor'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="बिल्कुल स्पष्ट, आत्मविश्वास से भरपूर व डॉक्यूमेंट्री टोन (जैसा आपके वीडियो में है)"
                >
                  🎙️ कॉन्फिडेंट एंकर (स्पष्ट व दमदार)
                </button>
                <button
                  onClick={() => setVoicePersona('reel_creator')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    voicePersona === 'reel_creator'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="तेज़ व जोशीली यूट्यूबर आवाज़"
                >
                  ⚡ वायरल रील्स
                </button>
                <button
                  onClick={() => setVoicePersona('anchor')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    voicePersona === 'anchor'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="गंभीर व शांत न्यूज़ डेस्क आवाज़"
                >
                  📡 न्यूज़ डेस्क
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            {/* TAB 1: 9:16 VERTICAL PLAYER PREVIEW */}
            {studioTab === 'player' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-4xl mx-auto">
                {/* 9:16 Mobile Phone Frame Simulation */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="relative w-[300px] h-[533px] sm:w-[320px] sm:h-[568px] rounded-[36px] bg-black overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col justify-between text-white">
                    {/* Background Visual */}
                    <img
                      src={currentScene.visualImageUrl}
                      alt={currentScene.headlineHindi}
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 pointer-events-none" />

                    {/* Top Status & Search Header in Reel */}
                    <div className="relative z-10 p-4 space-y-2">
                      {/* Scene Progress Bars */}
                      <div className="flex items-center gap-1">
                        {reelData.scenes.map((s, idx) => (
                          <div
                            key={s.id}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              idx === currentSceneIndex
                                ? 'bg-red-500'
                                : idx < currentSceneIndex
                                ? 'bg-white/80'
                                : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Header Badge */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] tracking-wider uppercase flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>{currentScene.type === 'hook' ? 'HOOK' : currentScene.type === 'outro' ? 'OUTRO' : `#${currentScene.rankNumber} ${currentScene.category}`}</span>
                        </span>
                        <span className="font-mono text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded-md">
                          Scene {currentSceneIndex + 1}/{reelData.scenes.length} (~{currentScene.durationSeconds}s)
                        </span>
                      </div>
                    </div>

                    {/* Middle Scene Title Overlay */}
                    <div className="relative z-10 px-4 text-center space-y-2">
                      <div className="inline-block bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                        <p className="text-sm sm:text-base font-black text-amber-300 leading-snug drop-shadow-md">
                          {currentScene.headlineHindi}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Dynamic Subtitles & Audio Visualizer */}
                    <div className="relative z-10 p-4 space-y-3">
                      {/* Kinetic Subtitles Box */}
                      <div className="p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-center space-y-1">
                        <div className="text-xs font-extrabold text-white leading-relaxed">
                          {currentScene.kineticCaptions.map((cap, cIdx) => (
                            <div key={cIdx} className={cIdx === 1 ? 'text-amber-400 font-black text-sm' : ''}>
                              {cap}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Speaking indicator */}
                      {isPlayingAudio && (
                        <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-bold bg-black/70 py-1 rounded-lg">
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          <span>असली न्यूज़ एंकर आवाज़ चल रही है...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={handlePrevScene}
                      disabled={currentSceneIndex === 0}
                      className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                      title="पिछला सीन"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      onClick={togglePlayAudio}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                    >
                      {isPlayingAudio && !isPausedAudio ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>रुकें</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isPausedAudio ? 'जारी रखें' : 'सुनें (Play All)'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleNextScene}
                      disabled={currentSceneIndex === reelData.scenes.length - 1}
                      className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                      title="अगला सीन"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        stopAudio();
                        setCurrentSceneIndex(0);
                        playSceneAudio(0, true);
                      }}
                      className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-100"
                      title="शुरू से चलाएं"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Scene Breakdown & Script Inspector */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-900">
                        वर्तमान सीन {currentSceneIndex + 1}: {currentScene.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-slate-500 font-semibold">
                        ⏱️ ~{currentScene.durationSeconds} सेकंड
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        📢 एंकर वॉइसओवर (बोली जाने वाली हिंदी):
                      </label>
                      <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {currentScene.spokenHindiScript}
                      </p>
                    </div>

                    {currentScene.indiaImpactPoint && (
                      <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-900 space-y-1">
                        <span className="font-bold flex items-center gap-1">
                          <span>🇮🇳 भारत पर असर:</span>
                        </span>
                        <p>{currentScene.indiaImpactPoint}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => playSceneAudio(currentSceneIndex, false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-red-600" />
                        <span>केवल यह सीन सुनें</span>
                      </button>

                      <button
                        onClick={() => handleCopy(currentScene.spokenHindiScript, 'script')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>कॉपी करें</span>
                      </button>
                    </div>
                  </div>

                  {/* Scene Selector Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600">सभी सीन चुनें:</span>
                    <div className="grid grid-cols-7 gap-1.5">
                      {reelData.scenes.map((s, sIdx) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setCurrentSceneIndex(sIdx);
                            if (isPlayingAudio) playSceneAudio(sIdx, true);
                          }}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            sIdx === currentSceneIndex
                              ? 'bg-red-600 text-white border-red-700 shadow-sm font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 text-xs'
                          }`}
                        >
                          <div className="text-[10px] font-bold">
                            {sIdx === 0 ? 'Hook' : sIdx === 6 ? 'Outro' : `#${sIdx}`}
                          </div>
                          <div className="text-[9px] opacity-80">{s.durationSeconds}s</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COMPLETE SCRIPT */}
            {studioTab === 'script' && (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        अंतिम वॉइसओवर स्क्रिप्ट (Final Voiceover Script)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {reelData.fullSpokenTextHindi.split(/\s+/).filter(Boolean).length} शब्द • ~50-55s
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      3-4s ओपनिंग + 5 बड़ी खबरें (8-10s) + 3-4s एंडिंग • 100% तथ्य आधारित, शून्य रुकावट
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={playFullScriptNonStop}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      title="पूरा वॉइसओवर बिना किसी पॉज़ के लगातार सुनें"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>लगातार सुनें</span>
                    </button>

                    <button
                      onClick={() => handleCopy(reelData.fullSpokenTextHindi, 'script')}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'कॉपी हो गया!' : 'स्क्रिप्ट कॉपी करें'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-base leading-relaxed text-slate-900 font-sans">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
                    💡 <strong>रिकॉर्डिंग टिप:</strong> यह स्क्रिप्ट सीधे पढ़ने व वॉइसओवर के लिए तैयार की गई है। इसमें कोई हेडिंग या बुलेट पॉइंट नहीं है ताकि आप इसे 50-60 सेकंड में सीधे रिकॉर्ड कर सकें।
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm sm:text-base font-medium leading-loose whitespace-pre-line text-slate-800 selection:bg-red-100">
                    {reelData.fullSpokenTextHindi}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PACKAGING & SEO */}
            {studioTab === 'packaging' && (
              <div className="max-w-3xl mx-auto space-y-5">
                {/* Viral Titles */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>हाई-सीटीआर वायरल टाइटल्स (High CTR Titles):</span>
                  </h3>
                  <div className="space-y-2">
                    {reelData.viralTitles.map((title, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800"
                      >
                        <span>{title}</span>
                        <button
                          onClick={() => {
                            if (typeof navigator !== 'undefined') {
                              navigator.clipboard.writeText(title);
                              setCopiedTitleIndex(tIdx);
                              setTimeout(() => setCopiedTitleIndex(null), 2000);
                            }
                          }}
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shrink-0"
                        >
                          {copiedTitleIndex === tIdx ? 'कॉपी हो गया' : 'कॉपी'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* YouTube Shorts Description */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      YouTube Shorts विवरण (Description With Timestamps):
                    </h3>
                    <button
                      onClick={() => handleCopy(reelData.youtubeShortsDescription, 'yt')}
                      className="px-3 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold"
                    >
                      {copiedYtDesc ? 'कॉपी हो गया' : 'कॉपी करें'}
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-line">
                    {reelData.youtubeShortsDescription}
                  </pre>
                </div>

                {/* Instagram Caption */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Instagram Reel कैप्शन (Caption):
                    </h3>
                    <button
                      onClick={() => handleCopy(reelData.instagramCaption, 'insta')}
                      className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold"
                    >
                      {copiedInstaDesc ? 'कॉपी हो गया' : 'कॉपी करें'}
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-line">
                    {reelData.instagramCaption}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
