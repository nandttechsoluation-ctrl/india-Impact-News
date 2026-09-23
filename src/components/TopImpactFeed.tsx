import React, { useState } from 'react';
import {
  Flame,
  Radio,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldCheck,
  Video,
  BookOpen,
  Volume2,
  Play,
  Pause,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ImpactNewsItem, Language, UserAuthSession } from '../types';
import { resolveStructuredNewsDetails } from '../utils/newsContentResolver';
import { realisticVoice } from '../utils/realisticVoiceSynthesizer';
import { WIRE_SOURCE_NAMES_HI } from '../utils/wireHeadlineTranslator';

interface TopImpactFeedProps {
  newsList: ImpactNewsItem[];
  isLoading: boolean;
  language: Language;
  editionDate?: string;
  editionDateFormatted?: string;
  userSession?: UserAuthSession | null;
  isWireSyncing?: boolean;
  lastSyncTime?: string;
  onSelectLanguage: (lang: Language) => void;
  onRefresh: () => void;
  onSelectNews: (news: ImpactNewsItem) => void;
  onOpenShortReel?: () => void;
  onOpenAuth?: () => void;
  onSyncWires?: () => void;
}

export const TopImpactFeed: React.FC<TopImpactFeedProps> = ({
  newsList,
  isLoading,
  language,
  editionDate,
  editionDateFormatted,
  userSession,
  isWireSyncing = false,
  lastSyncTime,
  onSelectLanguage,
  onRefresh,
  onSelectNews,
  onOpenShortReel,
  onOpenAuth,
  onSyncWires,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingNewsId, setPlayingNewsId] = useState<string | null>(null);

  const isHi = language === 'hi';

  const categories = [
    { id: 'all', label: isHi ? 'सभी खबरें' : 'All Stories' },
    { id: 'geopolitics', label: isHi ? 'भू-राजनीति व रक्षा' : 'Geopolitics & Defense' },
    { id: 'trade', label: isHi ? 'व्यापार व अर्थव्यवस्था' : 'Trade & Economy' },
    { id: 'tech', label: isHi ? 'तकनीक व सेमीकंडक्टर' : 'Tech & AI' },
    { id: 'energy', label: isHi ? 'ऊर्जा व कच्चा तेल' : 'Energy & Oil' },
  ];

  const filteredNews = newsList.filter((item) => {
    const details = resolveStructuredNewsDetails(item, language);
    const matchesSearch =
      !searchQuery ||
      details.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.whatHappened.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    const cat = item.category.toLowerCase();
    if (activeCategory === 'geopolitics') return cat.includes('geo') || cat.includes('defense') || cat.includes('military');
    if (activeCategory === 'trade') return cat.includes('trade') || cat.includes('economy') || cat.includes('tariff');
    if (activeCategory === 'tech') return cat.includes('tech') || cat.includes('semiconductor') || cat.includes('chip');
    if (activeCategory === 'energy') return cat.includes('energy') || cat.includes('oil') || cat.includes('crude');

    return true;
  });

  const handlePlayVoice = (e: React.MouseEvent, news: ImpactNewsItem) => {
    e.stopPropagation();
    if (playingNewsId === news.id) {
      realisticVoice.stop();
      setPlayingNewsId(null);
    } else {
      const details = resolveStructuredNewsDetails(news, language);
      setPlayingNewsId(news.id);
      realisticVoice.speak(details.audioNarrationText, {
        lang: language,
        persona: 'anchor',
        enableStudioBed: true,
        onEnd: () => setPlayingNewsId(null),
        onError: () => setPlayingNewsId(null),
      });
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 pb-16">
      {/* Clean News Feed Content */}
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'खबरें खोजें (जैसे: Apple Pay, टैरिफ, ब्रिक्स, तेल...)' : 'Search stories (e.g. Apple Pay, Tariffs, BRICS, Oil...)'}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-[11px] text-slate-500 font-medium ml-auto hidden sm:inline whitespace-nowrap">
            {filteredNews.length} {isHi ? 'सत्यापित खबरें' : 'verified stories'}
          </span>
        </div>
      </div>

      {/* News Cards Feed */}
      <div className="max-w-3xl mx-auto px-4 pt-3 space-y-3.5">
        {isLoading && newsList.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
            <RefreshCw className="w-8 h-8 mx-auto text-orange-600 animate-spin" />
            <p className="text-xs text-slate-500">
              {isHi ? 'ताज़ा 24 घंटे की खबरें लोड हो रही हैं...' : 'Loading verified 24h stories...'}
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-800">
              {isHi ? 'कोई खबर नहीं मिली' : 'No matching stories found'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHi ? 'कृपया अन्य कीवर्ड खोजें' : 'Please try a different search keyword'}
            </p>
          </div>
        ) : (
          filteredNews.map((news) => {
            const isCritical = news.impactLevel === 'CRITICAL';
            const isHigh = news.impactLevel === 'HIGH';
            const details = resolveStructuredNewsDetails(news, language);
            const isPlayingThis = playingNewsId === news.id;

            return (
              <article
                key={news.id}
                onClick={() => onSelectNews(news)}
                id={`news-card-${news.id}`}
                className="cursor-pointer group bg-white hover:bg-orange-50/20 border border-slate-200 hover:border-orange-400 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col gap-3"
              >
                {/* Top Meta: Rank, Category, Wire Source & Time */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isCritical && <Flame className="w-3 h-3 text-rose-600" />}
                      #{news.impactRank} {news.impactLevel}
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      {news.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {/* Source Agency Badge */}
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {isHi && news.wireOrigin?.sourceName
                        ? (WIRE_SOURCE_NAMES_HI[news.wireOrigin.sourceName] || news.wireOrigin.sourceName)
                        : (news.wireOrigin?.sourceName || news.sources?.[0]?.publisher || 'Wire')}
                    </span>

                    {/* Freshness Tag */}
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{news.timeAgo}</span>
                    </span>
                  </div>
                </div>

                {/* Headline & Image */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {details.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {details.summary}
                    </p>
                  </div>

                  {details.imageUrl && (
                    <div className="shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={details.imageUrl}
                        alt={details.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                {/* Impact on India Highlight Box */}
                <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 flex items-start gap-2 text-xs">
                  <span className="text-base shrink-0">🇮🇳</span>
                  <div className="flex-1">
                    <span className="font-bold text-orange-950 uppercase tracking-wider block text-[10px]">
                      {isHi ? 'भारत पर सीधा असर:' : 'Direct Impact on India:'}
                    </span>
                    <p className="text-slate-800 line-clamp-2 mt-0.5 font-medium leading-relaxed">
                      {details.impactOnIndia}
                    </p>
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Read Full Story Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNews(news);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isHi ? 'पूरा पढ़ें (5 बिंदु)' : 'Read Full Story'}</span>
                    </button>

                    {/* Realistic Voiceover Audio Button */}
                    <button
                      onClick={(e) => handlePlayVoice(e, news)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all border ${
                        isPlayingThis
                          ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                      title={isHi ? 'असली आवाज़ में सुनें' : 'Listen in natural voice'}
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>{isHi ? 'रुकें' : 'Pause'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                          <span>{isHi ? 'सुनो खबर' : 'Listen'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 font-semibold text-xs group-hover:text-orange-600">
                    <span className="hidden xs:inline">{isHi ? 'विस्तार से' : 'Details'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
