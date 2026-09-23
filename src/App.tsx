import React, { useState, useEffect } from 'react';
import { Video, RefreshCw, Key, ShieldCheck, Radio, LogIn } from 'lucide-react';
import { TopImpactFeed } from './components/TopImpactFeed';
import { NewsDetailModal } from './components/NewsDetailModal';
import { ShortReelStudioModal } from './components/ShortReelStudioModal';
import { CreatorStudioV2 } from './components/CreatorStudioV2';
import { UserAuthApiModal } from './components/UserAuthApiModal';
import { getInitialNewsItems, getInitialDailyBriefing } from './data/newsData';
import { ImpactNewsItem, DailyBriefing, Language, UserAuthSession } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('hi');
  const [appMode, setAppMode] = useState<'reader' | 'creator'>('reader');
  const [newsList, setNewsList] = useState<ImpactNewsItem[]>(getInitialNewsItems());
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefing>(getInitialDailyBriefing());
  const [currentEditionDate, setCurrentEditionDate] = useState<string>(() => {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  });
  const [editionDateFormatted, setEditionDateFormatted] = useState<string>('');
  const [selectedNews, setSelectedNews] = useState<ImpactNewsItem | null>(null);
  const [isShortReelModalOpen, setIsShortReelModalOpen] = useState<boolean>(false);
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWireSyncing, setIsWireSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date());
  });

  // Check URL parameters for Version 2 / Creator Mode (?mode=creator or ?v=2)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'creator' || params.get('v') === '2' || params.get('studio') === 'true') {
        setAppMode('creator');
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }, []);

  // User session state with auto-provisioned active connection
  const [userSession, setUserSession] = useState<UserAuthSession | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_auth_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      email: 'nandttechsoluation@gmail.com',
      name: 'Primary Intelligence Officer',
      apiKey: 'usr_wire_live_9a87d612e4f0c8',
      connectedAt: new Date().toISOString(),
      tier: 'Automated Direct Wire Enterprise Pass',
      status: 'ACTIVE_CONNECTED',
      rateLimit: 'Unlimited Real-Time Wire & 24H Origin Feeds',
      sourcesConnected: [
        'PIB New Delhi (Govt of India)',
        'MEA Diplomatic Media Center',
        'Reuters Geopolitical Wire Desk',
        'PTI / ANI Primary Wire Consortium',
      ],
    };
  });

  // Fetch initial news from server
  const fetchData = async (targetDate?: string) => {
    setIsLoading(true);
    try {
      const urlNews = targetDate ? `/api/news/top-impact?date=${targetDate}` : '/api/news/top-impact';
      const urlBriefing = targetDate ? `/api/briefing/daily?date=${targetDate}` : '/api/briefing/daily';

      const [newsRes, briefingRes] = await Promise.all([
        fetch(urlNews),
        fetch(urlBriefing),
      ]);

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        if (newsData.items && newsData.items.length > 0) {
          setNewsList(newsData.items);
          if (newsData.editionDate) setCurrentEditionDate(newsData.editionDate);
          if (newsData.editionDateFormatted) setEditionDateFormatted(newsData.editionDateFormatted);
        }
      }

      if (briefingRes.ok) {
        const bData = await briefingRes.json();
        if (bData.briefing) {
          setDailyBriefing(bData.briefing);
        }
      }
    } catch (err) {
      console.warn('Using baseline intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronize live news engine from PIB, MEA, Reuters, PTI/ANI
  const handleSyncWires = async () => {
    setIsWireSyncing(true);
    try {
      const res = await fetch('/api/wire/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setNewsList(data.items);
        }
        if (data.briefing) {
          setDailyBriefing(data.briefing);
        }
        const timeNow = new Intl.DateTimeFormat('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        }).format(new Date());
        setLastSyncTime(timeNow);
      }
    } catch (err) {
      console.warn('Wire sync warning:', err);
    } finally {
      setIsWireSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-sync wires once on startup
    handleSyncWires();

    // Periodic auto-update every 90 seconds to continuously pull fresh wire stories
    const interval = setInterval(() => {
      handleSyncWires();
    }, 90000);

    return () => clearInterval(interval);
  }, []);

  const handleSessionUpdated = (newSession: UserAuthSession | null) => {
    setUserSession(newSession);
    if (typeof window !== 'undefined') {
      if (newSession) {
        localStorage.setItem('user_auth_session', JSON.stringify(newSession));
        // Automatically sync fresh wire news upon login
        handleSyncWires();
      } else {
        localStorage.removeItem('user_auth_session');
      }
    }
  };

  const isHi = language === 'hi';
  const isConnected = Boolean(userSession && userSession.status === 'ACTIVE_CONNECTED');

  // If in Creator Studio V2 mode (personal use), render CreatorStudioV2
  if (appMode === 'creator') {
    return (
      <CreatorStudioV2
        newsList={newsList}
        onExitToReader={() => setAppMode('reader')}
        editionDate={currentEditionDate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Clean Modern Light Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              🇮🇳
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                {isHi ? 'भारत इम्पैक्ट न्यूज़' : 'India Impact News'}
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">
                {isHi ? 'राष्ट्रीय व वैश्विक सामरिक विश्लेषण' : 'Strategic & Geopolitical Intelligence'}
              </p>
            </div>
          </div>

          {/* Language Switcher (Only Hindi / English Option) */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 shadow-xs">
            <button
              onClick={() => setLanguage('hi')}
              id="toggle-lang-hi"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'hi'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('en')}
              id="toggle-lang-en"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* Main App Container - Clean Public News Reading Feed */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        <TopImpactFeed
          newsList={newsList}
          isLoading={isLoading}
          language={language}
          editionDate={currentEditionDate}
          editionDateFormatted={editionDateFormatted}
          userSession={userSession}
          isWireSyncing={isWireSyncing}
          lastSyncTime={lastSyncTime}
          onSelectLanguage={setLanguage}
          onRefresh={() => handleSyncWires()}
          onSelectNews={(news) => setSelectedNews(news)}
          onOpenAuth={() => setIsUserAuthModalOpen(true)}
          onSyncWires={() => handleSyncWires()}
        />
      </main>

      {/* Simplified Footer with Discreet Private Creator Access */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <span>
            {isHi ? '© 2026 भारत इम्पैक्ट इंटेलिजेंस' : '© 2026 India Impact Intelligence'}
          </span>
          <span className="font-medium text-slate-500 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>
              {isHi
                ? 'PIB New Delhi • MEA • Reuters • PTI/ANI वायर से 24H रियल-टाइम सिंक'
                : 'Real-Time 24H Sync via PIB, MEA, Reuters & PTI/ANI Wires'}
            </span>
          </span>

          {/* Discreet Private Creator Mode Button */}
          <button
            onClick={() => setAppMode('creator')}
            className="text-slate-400 hover:text-slate-700 transition-colors font-semibold hover:underline text-[11px] flex items-center gap-1"
            title="निजी क्रिएटर AI स्टूडियो (Version 2)"
          >
            <span>🔒 क्रिएटर AI स्टूडियो (निजी V2)</span>
          </button>
        </div>
      </footer>

      {/* Detailed News Story Modal (Clean Reading Experience for Viewers) */}
      <NewsDetailModal
        news={selectedNews}
        language={language}
        onSelectLanguage={setLanguage}
        onClose={() => setSelectedNews(null)}
      />

      {/* 5-News Viral Reel / YouTube Short Studio (1 Min or 2 Min with Lifelike Voiceover) */}
      <ShortReelStudioModal
        isOpen={isShortReelModalOpen}
        onClose={() => setIsShortReelModalOpen(false)}
        newsList={newsList}
        language={language}
        editionDate={currentEditionDate}
      />

      {/* User Auth & Direct Wire API Connection Modal */}
      <UserAuthApiModal
        isOpen={isUserAuthModalOpen}
        onClose={() => setIsUserAuthModalOpen(false)}
        language={language}
        session={userSession}
        onSessionUpdated={handleSessionUpdated}
        onSyncWires={handleSyncWires}
      />
    </div>
  );
}
