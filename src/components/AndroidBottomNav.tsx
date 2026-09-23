import React from 'react';
import { Newspaper, Sparkles, Radio, Bell } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

export type NavTab = 'feed' | 'briefing' | 'analyzer' | 'alerts';

interface AndroidBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  notificationCount?: number;
  language?: Language;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onSelectTab,
  notificationCount = 0,
  language = 'en',
}) => {
  const t = translations[language];

  const tabs = [
    {
      id: 'feed' as NavTab,
      label: t.tabFeed,
      icon: Newspaper,
    },
    {
      id: 'briefing' as NavTab,
      label: t.tabDailyBriefing,
      icon: Radio,
    },
    {
      id: 'analyzer' as NavTab,
      label: t.tabAIAnalyzer,
      icon: Sparkles,
    },
    {
      id: 'alerts' as NavTab,
      label: t.tabPushAlerts,
      icon: Bell,
      badge: notificationCount > 0 ? notificationCount : undefined,
    },
  ];

  return (
    <nav
      id="android-bottom-navigation"
      aria-label="Bottom Navigation"
      className="w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 pt-2 pb-5 z-40 select-none"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative group`}
            >
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-[10px] font-bold text-white flex items-center justify-center shadow">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium tracking-tight transition-colors ${
                  isActive ? 'text-orange-400 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android Gesture Bar Line */}
      <div className="w-32 h-1 bg-slate-700/80 rounded-full mx-auto mt-2 opacity-70" />
    </nav>
  );
};

