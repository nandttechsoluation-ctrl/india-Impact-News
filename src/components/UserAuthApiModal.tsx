import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Key,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  X,
  Sparkles,
  Zap,
  Radio,
  LogOut,
  RefreshCw,
  Lock,
  User,
  ArrowRight,
} from 'lucide-react';
import { UserAuthSession } from '../types';

interface UserAuthApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  session: UserAuthSession | null;
  onSessionUpdated: (newSession: UserAuthSession | null) => void;
  onSyncWires?: () => Promise<void> | void;
}

export const UserAuthApiModal: React.FC<UserAuthApiModalProps> = ({
  isOpen,
  onClose,
  language,
  session,
  onSessionUpdated,
  onSyncWires,
}) => {
  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const isHi = language === 'hi';

  if (!isOpen) return null;

  const handleCopyKey = () => {
    if (!session?.apiKey) return;
    navigator.clipboard.writeText(session.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleLoginAndProvision = async (emailToUse?: string) => {
    const targetEmail = (emailToUse || inputEmail).trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMsg(isHi ? 'कृपया एक मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login-provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: inputName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.session) {
        onSessionUpdated(data.session);
        setInputEmail('');
        setInputName('');
        // Automatically sync fresh wire news
        if (onSyncWires) {
          onSyncWires();
        }
      } else {
        setErrorMsg(data.error || (isHi ? 'लॉगिन में समस्या आई।' : 'Failed to connect.'));
      }
    } catch (err: any) {
      setErrorMsg(isHi ? 'नेटवर्क त्रुटि। पुनः प्रयास करें।' : 'Network error. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (session?.email) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.email }),
        });
      }
      onSessionUpdated(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_auth_session');
      }
    } catch (err) {
      console.warn('Logout error:', err);
      onSessionUpdated(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerManualSync = async () => {
    if (!onSyncWires) return;
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    try {
      await onSyncWires();
      setSyncSuccessMsg(
        isHi
          ? 'पीआईबी, विदेश मंत्रालय, रॉयटर्स और पीटीआई/एएनआई से ताज़ा खबरें सिंक हो गईं!'
          : 'Latest dispatches synchronized from PIB, MEA, Reuters, and PTI/ANI!'
      );
      setTimeout(() => setSyncSuccessMsg(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const isConnected = Boolean(session && session.status === 'ACTIVE_CONNECTED');

  return (
    <AnimatePresence>
      <div
        id="user-auth-api-modal-overlay"
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200 text-slate-900 max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <span>{isHi ? 'न्यूज़ इंजन व यूजर अकाउंट' : 'News Engine & User Account'}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isConnected
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isConnected ? (isHi ? '🟢 कनेक्टेड' : '🟢 LIVE CONNECTED') : (isHi ? 'लॉगिन करें' : 'LOGIN NEEDED')}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  {isHi
                    ? 'PIB, MEA, Reuters व PTI/ANI वायर नेटवर्क से ऑटोमैटिक कनेक्शन'
                    : 'Auto-connection to PIB, MEA, Reuters & PTI/ANI Wire Network'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Auto-Connect Explain Banner */}
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-2.5 text-xs text-slate-700">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-orange-950 block">
                  {isHi ? '⚡ ऑटोमैटिक वायर पाइपलाइन एक्टिवेशन' : '⚡ Automatic Wire Pipeline Activation'}
                </span>
                <p className="leading-relaxed">
                  {isHi
                    ? 'लॉगिन करते ही आपका पर्सनल API टोकन अपने आप मेन वायर नेटवर्क से जुड़ जाता है, जिससे ऐप में नई खबरें निरंतर अपडेट होती रहती हैं।'
                    : 'Logging in automatically connects your API token to the central wire pipeline, keeping your news stream constantly fresh.'}
                </p>
              </div>
            </div>

            {/* IF USER IS LOGGED IN */}
            {isConnected && session ? (
              <div className="space-y-4">
                {/* User Info Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase">
                        {session.email.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">
                          {session.name || session.email.split('@')[0]}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1 font-mono">
                          <Mail className="w-3 h-3" />
                          {session.email}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isHi ? 'सक्रिय' : 'ACTIVE'}</span>
                    </span>
                  </div>

                  {/* API Token Box */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-orange-600" />
                        <span>{isHi ? 'सक्रिय पर्सनल API टोकन:' : 'Active API Token:'}</span>
                      </span>
                      <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {isHi ? 'मुख्य वायर से जुड़ा' : 'Connected to Wire'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <code className="font-mono text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 truncate flex-1 select-all">
                        {session.apiKey}
                      </code>
                      <button
                        onClick={handleCopyKey}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                      >
                        {copiedKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">{isHi ? 'कॉपी हो गया' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isHi ? 'कॉपी' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Connected Wire Sources */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      {isHi ? 'कनेक्टेड प्राइमरी वायर सोर्सेज (4/4):' : 'Connected Primary Wires (4/4):'}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-ping" />
                      <span>{isHi ? 'लाइव सिंक चालू' : 'Live Syncing'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">PIB New Delhi</span>
                        <span className="text-[10px] text-slate-500">Government of India Press Desk</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">MEA Media Center</span>
                        <span className="text-[10px] text-slate-500">Ministry of External Affairs</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">Reuters Geopolitics</span>
                        <span className="text-[10px] text-slate-500">Global Primary Wire Desk</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">PTI / ANI Consortium</span>
                        <span className="text-[10px] text-slate-500">National News Agency Wires</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sync Success Message */}
                {syncSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{syncSuccessMsg}</span>
                  </div>
                )}

                {/* Actions: Sync News Now + Logout */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={handleTriggerManualSync}
                    disabled={isSyncing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>
                      {isSyncing
                        ? (isHi ? 'वायर सिंक हो रही है...' : 'Syncing Wires...')
                        : (isHi ? 'ताज़ा खबरें सिंक करें' : 'Sync Wires Now')}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    title={isHi ? 'लॉगआउट करें' : 'Logout'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isHi ? 'लॉगआउट' : 'Logout'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* IF USER IS LOGGED OUT -> LOGIN FORM */
              <div className="space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLoginAndProvision();
                  }}
                  className="space-y-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {isHi ? 'लॉगिन करें (News Engine Login)' : 'Login to News Engine'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isHi
                        ? 'अपना ईमेल दर्ज करें। लॉगिन करते ही आपका API टोकन सीधे PIB, MEA, Reuters व PTI/ANI से जुड़ जाएगा।'
                        : 'Enter your email. Login will instantly bind your API token to the primary wire networks.'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {isHi ? 'ईमेल पता' : 'Email Address'} *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          value={inputEmail}
                          onChange={(e) => setInputEmail(e.target.value)}
                          placeholder="user@example.com"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {isHi ? 'नाम (वैकल्पिक)' : 'Name (Optional)'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={inputName}
                          onChange={(e) => setInputName(e.target.value)}
                          placeholder={isHi ? 'आपका नाम' : 'Your name'}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Quick Login Preset */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 block mb-1">
                      {isHi ? 'त्वरित 1-क्लिक टेस्ट लॉगिन:' : '1-Click Quick Login:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLoginAndProvision('nandttechsoluation@gmail.com')}
                      className="text-xs text-orange-700 bg-orange-100/70 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-lg font-mono font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>nandttechsoluation@gmail.com</span>
                      <ArrowRight className="w-3 h-3 text-orange-600" />
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {isLoading
                        ? (isHi ? 'कनेक्ट हो रहा है...' : 'Connecting to Wires...')
                        : (isHi ? 'लॉगिन करें और लाइव वायर से जुड़ें' : 'Login & Connect to Live Wires')}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>{isHi ? 'सत्यापित सुरक्षित एंडपॉइंट' : 'Verified Secure Wire Endpoint'}</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
