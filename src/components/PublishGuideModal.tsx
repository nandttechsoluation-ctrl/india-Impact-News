import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Globe,
  Search,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Smartphone,
  QrCode,
  FileCode,
} from 'lucide-react';
import { Language } from '../types';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const isHi = language === 'hi';

  const publicUrl =
    typeof window !== 'undefined' && window.location.href.includes('localhost')
      ? 'https://ais-pre-fcq2xa4uspusc26n54dctf-939788333240.asia-southeast1.run.app/'
      : (typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-fcq2xa4uspusc26n54dctf-939788333240.asia-southeast1.run.app/');

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="publish-guide-modal-overlay"
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] text-slate-100 space-y-6 my-auto max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-750"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <span>{isHi ? '🌐 पब्लिक लाइव लिंक और गूगल सर्च रैंकिंग (SEO)' : '🌐 Public Live Link & Google Search Ranking (SEO)'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isHi
                    ? 'अपनी ऐप को पब्लिक डोमेन पर लाइव करने और गूगल सर्च में सबसे ऊपर लाने की संपूर्ण गाइड'
                    : 'Everything to publish your app publicly and rank #1 when people search for news'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-publish-modal-btn"
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Live Public Link Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-orange-500/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-orange-400 uppercase tracking-wider">
              <span>{isHi ? '🚀 आपका सक्रिय पब्लिक वेब ऐप लिंक:' : '🚀 Your Active Public Web App Link:'}</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {isHi ? 'ऑनलाइन लाइव' : 'Live Online'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 select-all focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleCopyLink}
                id="copy-public-link-btn"
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'कॉपी लिंक' : 'Copy')}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isHi
                ? 'इस लिंक को कोई भी अपने मोबाइल या कंप्यूटर ब्राउज़र में खोल सकता है — यह 24x7 क्लाउड पर उपलब्ध है।'
                : 'Anyone can open this link directly on phone or PC browser — hosted 24x7 on Cloud Run.'}
            </p>
          </div>

          {/* 2. Step-by-step to rank #1 on Google Search */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>{isHi ? '🔍 गूगल सर्च में सबसे पहले कैसे आएं (Ranking Blueprint)' : '🔍 How to Rank #1 on Google Search (SEO Blueprint)'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[11px] flex items-center justify-center font-bold">1</span>
                  <span>Google Search Console में सबमिट करें</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHi
                    ? 'Google Search Console (search.google.com) पर जाएं, अपनी साइट जोड़ें और Sitemap में /sitemap.xml सबमिट करें।'
                    : 'Go to Google Search Console (search.google.com), verify your site and submit /sitemap.xml.'}
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-center font-bold">2</span>
                  <span>Google News Publisher Center</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHi
                    ? 'Google News Publisher Center (publishercenter.google.com) पर रजिस्टर करें ताकि ताज़ा खबरें Google News ऐप में टॉप पर दिखें।'
                    : 'Register on Google News Publisher Center to appear directly in Google News and Top Stories carousel.'}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>कस्टम डोमेन (जैसे: indiainewsimpact.in)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHi
                    ? 'AI Studio के Settings मेनू या Cloud Run से आप .in या .com कस्टम डोमेन जोड़ सकते हैं जिससे ब्रांड क्रेडिबिलिटी और SEO 10x बढ़ता है।'
                    : 'Attach a custom domain like indiainewsimpact.in or .com via Cloudflare/Cloud Run for maximum SEO authority.'}
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] flex items-center justify-center font-bold">4</span>
                  <span>Social & WhatsApp वायरल शेयरिंग</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isHi
                    ? 'ऐप में दिए गए "ब्लॉग शेयर करें" और "यूट्यूब वीडियो स्क्रिप्ट" का उपयोग करके डेली ब्रेकिंग एनालिसिस शेयर करें।'
                    : 'Use the built-in 1-click WhatsApp blog share & YouTube script generator to drive initial viral traffic signals.'}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Already Pre-Configured SEO Features */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? '✅ हमने आपकी ऐप में पहले से क्या-क्या सेट कर दिया है:' : '✅ Already Configured in your App:'}</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-100">robots.txt:</strong> गूगल क्रॉलर्स को सभी पेज इंडेक्स करने की अनुमति।</li>
              <li><strong className="text-slate-100">sitemap.xml:</strong> हर घंटे ऑटोमैटिक इंडेक्सिंग का नक्शा।</li>
              <li><strong className="text-slate-100">Schema.org NewsMediaOrganization:</strong> गूगल सर्च में रिच स्निपेट और न्यूज़ बैज के लिए स्ट्रक्चर्ड डेटा।</li>
              <li><strong className="text-slate-100">Open Graph &amp; Twitter Cards:</strong> व्हाट्सएप, फेसबुक व एक्स (ट्विटर) पर शेयर करने पर सुंदर थंबनेल कार्ड।</li>
              <li><strong className="text-slate-100">PWA (Progressive Web App):</strong> मोबाइल पर बिना प्लेस्टोर के भी "Add to Home Screen" से एक क्लिक में ऐप डाउनलोड।</li>
            </ul>
          </div>

          {/* Footer Close */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-500 font-mono">
              India Impact AI • Production Cloud Deployment
            </span>
            <button
              onClick={onClose}
              id="got-it-btn"
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors"
            >
              {isHi ? 'समझ गया (बंद करें)' : 'Got it (Close)'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
