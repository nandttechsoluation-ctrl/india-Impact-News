import React, { useState, useEffect } from 'react';
import {
  Radio,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Zap,
  Clock,
  Layers,
  Globe,
  Building2,
  FileText,
} from 'lucide-react';
import { DirectWireSource, RawWireDispatch, ImpactNewsItem } from '../types';
import { translateWireHeadline, translateWireSnippet, WIRE_SOURCE_NAMES_HI, stripWireSourcePrefix } from '../utils/wireHeadlineTranslator';

interface DirectWireModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  onWireSynced?: (newItems: ImpactNewsItem[]) => void;
}

export const DirectWireModal: React.FC<DirectWireModalProps> = ({
  isOpen,
  onClose,
  language,
  onWireSynced,
}) => {
  const [sources, setSources] = useState<DirectWireSource[]>([]);
  const [dispatches, setDispatches] = useState<RawWireDispatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const isHi = language === 'hi';

  const fetchWireData = async () => {
    setIsLoading(true);
    try {
      const [resStatus, resDispatches] = await Promise.all([
        fetch('/api/wire/status'),
        fetch('/api/wire/dispatches'),
      ]);

      if (resStatus.ok) {
        const dataStatus = await resStatus.json();
        setSources(dataStatus.sources || []);
      }

      if (resDispatches.ok) {
        const dataDispatches = await resDispatches.json();
        setDispatches(dataDispatches.dispatches || []);
      }
    } catch (e) {
      console.warn('Error fetching wire status:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWireData();
    }
  }, [isOpen]);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/wire/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSyncFeedback(
          isHi
            ? `✓ ${data.wireCount || 5} ताज़ा वायर खबरें प्राप्त हुईं। री-अपलोड वाली पुरानी खबरें बाहर की गईं।`
            : `✓ Synchronized ${data.wireCount || 5} direct wire dispatches. Stale re-uploads quarantined.`
        );
        if (data.sources) setSources(data.sources);
        if (data.items && onWireSynced) {
          onWireSynced(data.items);
        }
        // Refresh dispatches list
        const resDispatches = await fetch('/api/wire/dispatches');
        if (resDispatches.ok) {
          const d = await resDispatches.json();
          setDispatches(d.dispatches || []);
        }
      } else {
        setSyncFeedback(isHi ? 'वायर सिंक करने में त्रुटि।' : 'Failed to sync wire feeds.');
      }
    } catch (err: any) {
      setSyncFeedback(isHi ? 'कनेक्शन त्रुटि।' : 'Connection error.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="direct-wire-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-950/60 border border-orange-500/30 text-orange-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{isHi ? 'डायरेक्ट प्राइमरी वायर फ़ीड' : 'Direct Primary Wire Feeds'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {isHi ? 'लाइव' : 'Live Feeds'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isHi
                  ? 'सोशल मीडिया से पहले सीधे सरकारी व अंतरराष्ट्रीय प्रेस वायर से सटीक समय पर खबरें प्राप्त करें।'
                  : 'Direct, zero-lag feeds from official government & international wires. Bypasses social media re-upload delays.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300">
          {/* Action Callout Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                <Zap className="w-4 h-4 text-orange-400" />
                <span>
                  {isHi ? 'सीधा वायर कनेक्शन सक्रिय' : 'Direct Wire Pipeline Connected'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isHi
                  ? 'यह सिस्टम PIB, विदेश मंत्रालय और रॉयटर्स के ओरिजिनल प्रकाशन समय को सीधे पढ़ता है, जिससे सोशल मीडिया पर 4 दिन बाद री-पोस्ट हुई खबरें आज की खबर नहीं बन पातीं।'
                  : 'System directly pulls true publication timestamps from PIB, MEA, and Reuters wires. Historical stories re-posted days later on social media are quarantined.'}
              </p>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              id="btn-sync-wires-now"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (isHi ? 'सिंक हो रहा है...' : 'Syncing Wires...') : (isHi ? 'तत्काल वायर सिंक करें' : 'Sync Wires Now')}</span>
            </button>
          </div>

          {syncFeedback && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-medium text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Wire Sources Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-orange-400" />
                <span>{isHi ? 'संबद्ध प्राइमरी वायर स्रोत' : 'Integrated Primary Wire Sources'}</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {sources.filter((s) => s.status === 'ONLINE').length} / {sources.length || 4} {isHi ? 'ऑनलाइन' : 'Online'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between gap-2 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-100 text-xs truncate">
                        {isHi ? (WIRE_SOURCE_NAMES_HI[src.name] || src.name) : src.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          src.status === 'ONLINE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {src.status === 'ONLINE' ? (isHi ? 'सक्रिय' : 'ONLINE') : src.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {isHi ? translateWireSnippet(src.description) : src.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                    <span className="capitalize">{src.category.toLowerCase().replace('_', ' ')}</span>
                    <span className="text-emerald-400 font-mono">Zero Social Lag</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Wire Dispatches Stream */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'ताजा वायर डिस्पैच (सत्यापित प्रकाशन समय)' : 'Latest Wire Dispatches (Verified PubDate)'}</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {dispatches.length} {isHi ? 'डिस्पैच' : 'dispatches'}
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {dispatches.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/40 text-center text-slate-400 text-xs">
                  {isLoading
                    ? (isHi ? 'वायर फ़ीड लोड हो रहा है...' : 'Loading wire feeds...')
                    : (isHi ? 'कोई वायर डिस्पैच उपलब्ध नहीं है।' : 'No wire dispatches available.')}
                </div>
              ) : (
                dispatches.map((disp, idx) => (
                  <div
                    key={disp.id || idx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950/60 text-orange-300 border border-orange-700/40">
                          {isHi ? (WIRE_SOURCE_NAMES_HI[disp.wireSource] || disp.wireSource) : disp.wireSource}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                          <Clock className="w-3 h-3" />
                          {disp.hoursAgo < 1
                            ? (isHi ? `${Math.round(disp.hoursAgo * 60)} मिनट पहले` : `${Math.round(disp.hoursAgo * 60)}m ago`)
                            : (isHi ? `${disp.hoursAgo} घंटे पहले` : `${disp.hoursAgo}h ago`)}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-100 text-xs sm:text-sm leading-snug">
                        {isHi ? translateWireHeadline(disp.title) : stripWireSourcePrefix(disp.title)}
                      </h4>

                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {isHi ? translateWireSnippet(disp.contentSnippet) : disp.contentSnippet}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>WIRE VERIFIED</span>
                      </span>

                      {disp.sourceUrl && (
                        <a
                          href={disp.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-orange-400 p-1"
                          title="View Wire Release"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isHi ? '✓ सीधे वायर टाइमस्टैम्प से संचालित' : '✓ Powered by direct wire timestamps'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
