import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Volume2,
  Vibrate,
  Clock,
  Trash2,
  Radio,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { AppNotification, ImpactNewsItem, Language } from '../types';
import { translations } from '../data/translations';
import { getLocalizedImpactLevel } from '../utils/localization';
import { LanguageSelector } from './LanguageSelector';

interface NotificationCenterViewProps {
  notifications: AppNotification[];
  language: Language;
  onSelectLanguage?: (lang: Language) => void;
  onTriggerTestPush: (customTitle?: string, customBody?: string) => void;
  onClearNotifications: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  notifications,
  language,
  onSelectLanguage,
  onTriggerTestPush,
  onClearNotifications,
  onSelectNotification,
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [morningBriefingEnabled, setMorningBriefingEnabled] = useState(true);
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const t = translations[language];

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermissionState(res);
        if (res === 'granted') {
          new Notification(language === 'hi' ? 'इंडिया इम्पैक्ट AI: पुश सक्रिय' : 'India Impact AI: Push Enabled', {
            body: language === 'hi'
              ? 'आपको सुबह 08:00 IST पर दैनिक ब्रीफिंग और महत्वपूर्ण अलर्ट प्राप्त होंगे।'
              : 'You will receive daily briefings at 08:00 AM IST & critical geopolitical alerts.',
            icon: '/icon.svg',
          });
        }
      } catch (err) {
        console.error('Permission error:', err);
      }
    }
  };

  return (
    <div id="notification-center-container" className="flex-1 flex flex-col overflow-y-auto p-4 space-y-5">
      {/* Header with Language Selector */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4" />
            {t.notifHubTitle}
          </div>
          <h2 className="text-lg font-extrabold text-slate-100">
            {t.notifHubHeading}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {t.notifHubSubtitle}
          </p>
        </div>

        {onSelectLanguage && (
          <LanguageSelector language={language} onSelectLanguage={onSelectLanguage} />
        )}
      </div>

      {/* Web Push Notification Permission Card */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-slate-200">
              {t.systemNotifStatus}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              permissionState === 'granted'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : permissionState === 'denied'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {permissionState === 'granted' ? t.enabledStatus : permissionState}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {permissionState === 'granted'
            ? t.webPushActive
            : t.allowPushDesc}
        </p>

        {permissionState !== 'granted' && (
          <button
            onClick={requestBrowserPermission}
            id="request-notif-perm-btn"
            className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-950/40 transition-all cursor-pointer"
          >
            <BellRing className="w-4 h-4" />
            <span>{t.enablePushBtn}</span>
          </button>
        )}
      </div>

      {/* Simulator Test Action */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/30 via-slate-900 to-slate-950 border border-orange-500/40 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          {t.testPushDelivery}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.testPushDesc}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() =>
              onTriggerTestPush(
                language === 'hi'
                  ? '🚨 फारस की खाड़ी नौसैनिक अलर्ट'
                  : '🚨 Persian Gulf Naval Flashpoint Alert',
                language === 'hi'
                  ? 'हॉर्मुज जलडमरूमध्य के पास ड्रोन अलर्ट, ब्रेंट क्रूड 4.2% उछला। ऑपरेशन संकल्प के तहत भारतीय नौसेना तैनात।'
                  : 'Drone alerts near Strait of Hormuz send Brent crude up 4.2%. Indian Navy destroyers deployed under Op Sankalp.'
              )
            }
            id="test-critical-push-btn"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-orange-500/30 transition-all cursor-pointer"
          >
            <span>{t.simulateCriticalAlert}</span>
          </button>
          <button
            onClick={() =>
              onTriggerTestPush(
                language === 'hi'
                  ? '🇮🇳 भारत प्रभाव दैनिक ब्रीफिंग (08:00 IST)'
                  : '🇮🇳 India Impact Daily Briefing (08:00 IST)',
                language === 'hi'
                  ? 'सेमीकंडक्टर आपूर्ति श्रृंखला और समुद्री गलियारे पर आज का विश्लेषण। ऑडियो सुनने के लिए टैप करें।'
                  : 'Silicon supply chain pivot & Persian Gulf maritime corridor status for today. Tap to listen to audio briefing.'
              )
            }
            id="test-briefing-push-btn"
            className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-950/40 transition-all cursor-pointer"
          >
            <span>{t.simulateMorningBriefing}</span>
          </button>
        </div>
      </div>

      {/* Android Notification Channel Toggles */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {t.alertChannelsTitle}
        </h3>

        <div className="space-y-3 divide-y divide-slate-800">
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {t.channelMorningBriefing}
              </div>
              <div className="text-[11px] text-slate-400">
                {t.channelMorningBriefingDesc}
              </div>
            </div>
            <input
              type="checkbox"
              checked={morningBriefingEnabled}
              onChange={(e) => setMorningBriefingEnabled(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {t.channelCriticalAlerts}
              </div>
              <div className="text-[11px] text-slate-400">
                {t.channelCriticalAlertsDesc}
              </div>
            </div>
            <input
              type="checkbox"
              checked={criticalAlertsEnabled}
              onChange={(e) => setCriticalAlertsEnabled(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                {t.channelFeedback}
              </div>
              <div className="text-[11px] text-slate-400">
                {t.channelFeedbackDesc}
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.notificationHistory} ({notifications.length})</span>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={onClearNotifications}
              id="clear-notif-history-btn"
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clearHistory}</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            {t.noNotifications}
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const level = getLocalizedImpactLevel(notif.impactLevel, language);
              return (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification(notif)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/40 cursor-pointer flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          notif.impactLevel === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300'
                            : notif.impactLevel === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {level}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                      {notif.body}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 self-center shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
