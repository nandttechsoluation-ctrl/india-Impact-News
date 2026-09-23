import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Square,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  Volume2,
  FileText,
  Youtube,
  ArrowLeft,
  ShieldAlert,
  Clock,
  Layers,
  ExternalLink,
  Info,
  Wand2,
} from 'lucide-react';
import { ImpactNewsItem } from '../types';
import { realisticVoice } from '../utils/realisticVoiceSynthesizer';
import { ALL_CURATED_VISUALS } from '../utils/newsVisualMatcher';

interface CreatorStudioV2Props {
  newsList: ImpactNewsItem[];
  onExitToReader: () => void;
  editionDate?: string;
}

export interface AiReelSceneStory {
  rank: number;
  headlineHindi: string;
  kyaHua: string;
  isseHogaKya: string;
  spokenScript: string;
  visualCategory: string;
  visualConcept: string;
  onScreenOverlay: string;
  imagePrompt: string;
  visualKeywords: string;
  visualImageUrl?: string;
  durationSeconds?: number;
}

export interface AiReelData {
  hook: {
    spokenScript: string;
    visualConcept: string;
    onScreenOverlay: string;
    imagePrompt: string;
    visualKeywords: string;
    visualImageUrl?: string;
  };
  stories: AiReelSceneStory[];
  outro: {
    spokenScript: string;
    visualConcept: string;
    onScreenOverlay: string;
    imagePrompt: string;
    visualKeywords: string;
    visualImageUrl?: string;
  };
  fullVoiceoverScript: string;
  packaging?: {
    viralTitle: string;
    description: string;
    tags: string[];
  };
  wordCount?: number;
  estimatedDurationSeconds?: number;
}

export const CreatorStudioV2: React.FC<CreatorStudioV2Props> = ({
  newsList,
  onExitToReader,
  editionDate,
}) => {
  const [reelData, setReelData] = useState<AiReelData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [customFocus, setCustomFocus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'director' | 'script' | 'packaging'>('director');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0); // 0 = hook, 1..5 = stories, 6 = outro
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingFull, setIsPlayingFull] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.12);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showVisualPicker, setShowVisualPicker] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-generate on first open if not generated yet
  useEffect(() => {
    generateReelWithAi();
    return () => {
      realisticVoice.stop();
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateReelWithAi = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep('1/4: लाइव फीड से खेल, सोशल ट्वीट्स व टूटी खबरों को फ़िल्टर किया जा रहा है...');

    try {
      setTimeout(() => {
        setGenerationStep('2/4: टॉप 5 भू-राजनीतिक व आर्थिक घटनाओं का चयन...');
      }, 1200);

      setTimeout(() => {
        setGenerationStep('3/4: 50s वॉइसओवर स्क्रिप्ट और क्या हुआ + इससे होगा क्या लिखा जा रहा है...');
      }, 2500);

      setTimeout(() => {
        setGenerationStep('4/4: Gemini AI 9:16 सिनेमाई विजुअल कांसेप्ट तय कर रहा है...');
      }, 3800);

      // Send a clean, lean payload to avoid excessive network overhead
      const sanitizedItems = newsList.slice(0, 15).map((n) => ({
        id: n.id,
        title: n.title,
        summary: n.summary,
        category: n.category,
        hi: {
          title: n.hi?.title,
          summary: n.hi?.summary,
          whatHappened: n.hi?.whatHappened,
          whyHappening: n.hi?.whyHappening,
          strategicSummary: n.hi?.strategicSummary,
        },
      }));

      const res = await fetch('/api/ai/generate-v2-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customFocus: customFocus.trim() || undefined,
          items: sanitizedItems,
        }),
      });

      const resText = await res.text();
      let json: any;
      try {
        json = JSON.parse(resText);
      } catch {
        if (res.status === 413) {
          throw new Error('अनुरोध आकार बहुत बड़ा था। कृपया कस्टम फोकस को छोटा रखें।');
        }
        throw new Error(`सर्वर से अप्रत्याशित उत्तर प्राप्त हुआ (${res.status})। कृपया पुनः प्रयास करें।`);
      }

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Failed to generate AI reel');
      }

      setReelData(json.data);
      setSelectedSceneIndex(0);
    } catch (err: any) {
      console.error('Failed to generate with AI:', err);
      setErrorMsg(err.message || 'AI जनरेशन में समस्या आई। पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Build unified scenes array: [Hook, Story 1, Story 2, Story 3, Story 4, Story 5, Outro]
  const allScenes = reelData
    ? [
        {
          type: 'hook',
          title: 'हुक (ओपनिंग 3-4s)',
          rank: 0,
          spokenScript: reelData.hook.spokenScript,
          visualConcept: reelData.hook.visualConcept,
          onScreenOverlay: reelData.hook.onScreenOverlay,
          imagePrompt: reelData.hook.imagePrompt,
          visualKeywords: reelData.hook.visualKeywords,
          visualImageUrl: reelData.hook.visualImageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1080&auto=format&fit=crop',
          duration: 4,
        },
        ...reelData.stories.map((st, i) => ({
          type: 'story',
          title: `खबर #${st.rank}: ${st.headlineHindi || 'टॉप न्यूज़'}`,
          rank: st.rank,
          spokenScript: st.spokenScript,
          kyaHua: st.kyaHua,
          isseHogaKya: st.isseHogaKya,
          visualConcept: st.visualConcept,
          onScreenOverlay: st.onScreenOverlay,
          imagePrompt: st.imagePrompt,
          visualKeywords: st.visualKeywords,
          visualImageUrl: st.visualImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1080&auto=format&fit=crop',
          duration: st.durationSeconds || 10,
        })),
        {
          type: 'outro',
          title: 'एंडिंग (कॉल टू एक्शन 3-4s)',
          rank: 6,
          spokenScript: reelData.outro.spokenScript,
          visualConcept: reelData.outro.visualConcept,
          onScreenOverlay: reelData.outro.onScreenOverlay,
          imagePrompt: reelData.outro.imagePrompt,
          visualKeywords: reelData.outro.visualKeywords,
          visualImageUrl: reelData.outro.visualImageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1080&auto=format&fit=crop',
          duration: 4,
        },
      ]
    : [];

  const currentScene = allScenes[selectedSceneIndex] || allScenes[0];

  // Voice playback for single scene
  const playCurrentScene = () => {
    if (!currentScene) return;
    if (isPlaying) {
      realisticVoice.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    realisticVoice.speak(currentScene.spokenScript, {
      lang: 'hi',
      rate: speechRate,
      persona: 'confident_anchor',
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  // Voice playback for entire reel continuously
  const playFullReel = () => {
    if (!reelData) return;
    if (isPlayingFull) {
      realisticVoice.stop();
      setIsPlayingFull(false);
      return;
    }

    setIsPlayingFull(true);
    realisticVoice.speak(reelData.fullVoiceoverScript, {
      lang: 'hi',
      rate: speechRate,
      persona: 'confident_anchor',
      onEnd: () => setIsPlayingFull(false),
      onError: () => setIsPlayingFull(false),
    });
  };

  // Change visual for current scene
  const handleSelectVisual = (url: string) => {
    if (!reelData) return;
    if (selectedSceneIndex === 0) {
      setReelData({
        ...reelData,
        hook: { ...reelData.hook, visualImageUrl: url },
      });
    } else if (selectedSceneIndex === 6) {
      setReelData({
        ...reelData,
        outro: { ...reelData.outro, visualImageUrl: url },
      });
    } else {
      const storyIdx = selectedSceneIndex - 1;
      const updated = [...reelData.stories];
      if (updated[storyIdx]) {
        updated[storyIdx] = { ...updated[storyIdx], visualImageUrl: url };
        setReelData({ ...reelData, stories: updated });
      }
    }
    setShowVisualPicker(false);
  };

  // Update script text directly if creator modifies it
  const handleScriptChange = (newText: string) => {
    if (!reelData) return;
    if (selectedSceneIndex === 0) {
      setReelData({
        ...reelData,
        hook: { ...reelData.hook, spokenScript: newText },
      });
    } else if (selectedSceneIndex === 6) {
      setReelData({
        ...reelData,
        outro: { ...reelData.outro, spokenScript: newText },
      });
    } else {
      const storyIdx = selectedSceneIndex - 1;
      const updated = [...reelData.stories];
      if (updated[storyIdx]) {
        updated[storyIdx] = { ...updated[storyIdx], spokenScript: newText };
        setReelData({ ...reelData, stories: updated });
      }
    }
  };

  const allCuratedVisuals = ALL_CURATED_VISUALS;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitToReader}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
            title="पब्लिक न्यूज़ पोर्टल पर वापस जाएं"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>पब्लिक रीडर मोड</span>
          </button>

          <div className="h-4 w-px bg-slate-700" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                क्रिएटर AI स्टूडियो V2
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                निजी उपयोग (Private)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              संचालित: Google Gemini AI • ऑटो-फ़िल्टर (खेल व फालतू खबरें ब्लॉक)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateReelWithAi}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'AI तैयार कर रहा है...' : '✨ नई AI रील जनरेट करें'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 9:16 Interactive Mobile Canvas (4 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] flex flex-col items-center">
            {/* Phone Bezel */}
            <div className="w-full aspect-[9/16] bg-black rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between">
              {/* Screen Content */}
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-slate-900 flex flex-col justify-between">
                {/* Background Image / Visual */}
                {currentScene?.visualImageUrl ? (
                  <img
                    src={currentScene.visualImageUrl}
                    alt={currentScene.title}
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.78] transition-transform duration-700 ease-out hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-700" />
                  </div>
                )}

                {/* Subtle cinematic gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />

                {/* Top Overlay Badge */}
                <div className="relative z-10 p-4 pt-5 flex items-start justify-between">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-black tracking-wide shadow-lg">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{currentScene?.onScreenOverlay || 'भारत प्रभाव • 5 बड़ी खबरें'}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
                    {selectedSceneIndex === 0
                      ? 'हुक'
                      : selectedSceneIndex === 6
                      ? 'एंडिंग'
                      : `#${selectedSceneIndex} / 5`}
                  </span>
                </div>

                {/* Bottom Kinetic Captions Overlay */}
                <div className="relative z-10 p-4 pb-6 space-y-2.5">
                  {currentScene?.type === 'story' && (
                    <div className="space-y-1.5">
                      <div className="bg-black/75 backdrop-blur-md p-2 rounded-xl border border-white/10 text-xs font-semibold text-white leading-snug">
                        <span className="text-amber-400 font-bold mr-1">📌 क्या हुआ:</span>
                        {currentScene.kyaHua || currentScene.spokenScript}
                      </div>
                      <div className="bg-red-950/80 backdrop-blur-md p-2 rounded-xl border border-red-500/30 text-xs font-bold text-red-200 leading-snug">
                        <span className="text-red-400 font-bold mr-1">⚡ इससे होगा क्या?</span>
                        {currentScene.isseHogaKya || 'भारतीय बाजारों पर सीधा असर पड़ेगा।'}
                      </div>
                    </div>
                  )}

                  {currentScene?.type !== 'story' && (
                    <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs font-bold text-white leading-relaxed text-center">
                      {currentScene?.spokenScript}
                    </div>
                  )}

                  {/* Progress Indicator Dots */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {allScenes.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSceneIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === selectedSceneIndex
                            ? 'w-6 bg-red-500'
                            : 'w-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                        title={`Scene ${idx}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Controls Under Phone */}
            <div className="w-full mt-4 flex items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setSelectedSceneIndex((prev) => Math.max(0, prev - 1))}
                disabled={selectedSceneIndex === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                title="पिछला सीन"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={playCurrentScene}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>रोकें</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>सीन सुनें</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedSceneIndex((prev) => Math.min(allScenes.length - 1, prev + 1))}
                disabled={selectedSceneIndex === allScenes.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                title="अगला सीन"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Visual Director & Script Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Top Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('director')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                  activeTab === 'director'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>🎬 AI विजुअल व स्क्रिप्ट डायरेक्टर</span>
              </button>

              <button
                onClick={() => setActiveTab('script')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                  activeTab === 'script'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>🎙️ पूरी वॉइसओवर स्क्रिप्ट</span>
              </button>

              <button
                onClick={() => setActiveTab('packaging')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                  activeTab === 'packaging'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>📦 शॉर्ट्स पैकेजिंग</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">आवाज़ स्पीड:</span>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1 text-xs"
              >
                <option value="1.0">1.0x (सामान्य)</option>
                <option value="1.12">1.12x (तेज)</option>
                <option value="1.25">1.25x (सुपर फास्ट)</option>
              </select>
            </div>
          </div>

          {/* Loading Banner */}
          {isGenerating && (
            <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-amber-200 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              <div>
                <p className="font-bold">Gemini AI रील व विजुअल डायरेक्शन प्रोसेस कर रहा है...</p>
                <p className="text-amber-300/80 text-[11px] mt-0.5">{generationStep}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center justify-between text-red-200 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={generateReelWithAi}
                className="px-2 py-1 rounded bg-red-800 hover:bg-red-700 text-white text-[11px]"
              >
                दोबारा कोशिश करें
              </button>
            </div>
          )}

          {/* TAB 1: AI Visual & Scene Director */}
          {activeTab === 'director' && currentScene && (
            <div className="space-y-4">
              {/* Scene Selector Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {allScenes.map((sc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSceneIndex(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      idx === selectedSceneIndex
                        ? 'bg-slate-800 text-white border border-red-500/50 shadow-md'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
                    }`}
                  >
                    <span>
                      {idx === 0 ? '🌍 हुक' : idx === 6 ? '🏁 एंडिंग' : `#${sc.rank}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Scene Header */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                    {currentScene.type === 'hook'
                      ? 'प्रारंभिक हुक (0:00 - 0:04)'
                      : currentScene.type === 'outro'
                      ? 'अंतिम संदेश (0:50 - 0:54)'
                      : `सीन #${currentScene.rank} (अवधि: ~${currentScene.duration}s)`}
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">{currentScene.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowVisualPicker(!showVisualPicker)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>🎨 विजुअल बदलें</span>
                  </button>
                </div>
              </div>

              {/* Visual Picker Dropdown / Drawer */}
              {showVisualPicker && (
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      इस सीन के लिए सत्यापित हाई-डेफिनिशन विजुअल चुनें:
                    </span>
                    <button
                      onClick={() => setShowVisualPicker(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      बंद करें ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {allCuratedVisuals.slice(0, 12).map((vis) => (
                      <button
                        key={vis.id}
                        onClick={() => handleSelectVisual(vis.url)}
                        className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-red-500 text-left transition-all"
                      >
                        <img
                          src={vis.url}
                          alt={vis.label}
                          className="w-full h-20 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[10px] font-bold text-white line-clamp-1">
                            {vis.labelHi || vis.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spoken Voiceover Script for this Scene */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-red-400" />
                    <span>एंकर वॉइसओवर स्क्रिप्ट (सीधे बोली जाने वाली हिंदी):</span>
                  </label>
                  <button
                    onClick={() => handleCopy(currentScene.spokenScript, 'scene-script')}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'scene-script' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'scene-script' ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                  </button>
                </div>

                <textarea
                  value={currentScene.spokenScript}
                  onChange={(e) => handleScriptChange(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm font-medium text-slate-100 leading-relaxed focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* AI Visual Director Card */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI विजुअल डायरेक्शन (Visual Director Concept)</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                    <strong className="text-white block mb-0.5">🎬 AI विजुअल कांसेप्ट:</strong>
                    {currentScene.visualConcept || 'High-impact cinematic footage depicting the news development.'}
                  </div>

                  {currentScene.imagePrompt && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-white block text-[11px]">
                          🎨 AI इमेज जनरेशन प्रॉम्प्ट (Midjourney / Imagen / DALL-E के लिए):
                        </strong>
                        <button
                          onClick={() => handleCopy(currentScene.imagePrompt, 'image-prompt')}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 font-bold flex items-center gap-1"
                        >
                          {copiedKey === 'image-prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'image-prompt' ? 'कॉपी हुआ' : 'प्रॉम्प्ट कॉपी'}</span>
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-slate-400 leading-relaxed break-words">
                        {currentScene.imagePrompt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Full Spoken Voiceover Script */}
          {activeTab === 'script' && reelData && (
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">अंतिम वॉइसओवर स्क्रिप्ट (Full Spoken Script)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {reelData.wordCount || 180} शब्द • ~{reelData.estimatedDurationSeconds || 52} सेकंड • 100% धाराप्रवाह, शून्य रुकावट
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={playFullReel}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    {isPlayingFull ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingFull ? 'रोकें' : 'लगातार सुनें'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(reelData.fullVoiceoverScript, 'full-script')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                  >
                    {copiedKey === 'full-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'full-script' ? 'कॉपी हो गई' : 'पूरी स्क्रिप्ट कॉपी करें'}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 text-sm leading-loose whitespace-pre-line text-slate-200 font-medium">
                {reelData.fullVoiceoverScript}
              </div>
            </div>
          )}

          {/* TAB 3: YouTube Shorts Packaging */}
          {activeTab === 'packaging' && reelData?.packaging && (
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">वायरल यूट्यूब शॉर्ट्स टाइटल (Viral Title):</label>
                  <button
                    onClick={() => handleCopy(reelData.packaging!.viralTitle, 'yt-title')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedKey === 'yt-title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>कॉपी</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={reelData.packaging.viralTitle}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-sm font-bold text-white"
                />
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">डिस्क्रिप्शन व टाइमस्टैम्प्स (Description & Timestamps):</label>
                  <button
                    onClick={() => handleCopy(reelData.packaging!.description, 'yt-desc')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedKey === 'yt-desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>कॉपी</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={reelData.packaging.description}
                  className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed"
                />
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300">हैशटैग्स (Hashtags & Tags):</label>
                <div className="flex flex-wrap gap-2">
                  {reelData.packaging.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
