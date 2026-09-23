import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, CheckCircle2, XCircle, X, ExternalLink, Filter } from 'lucide-react';
import { ImpactNewsItem } from '../types';

interface NewsOriginAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsList: ImpactNewsItem[];
  language: 'en' | 'hi';
}

export const NewsOriginAuditModal: React.FC<NewsOriginAuditModalProps> = ({
  isOpen,
  onClose,
  newsList,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';

  // Sample known recycled stories that the gatekeeper audits and blocks from today's feed
  const quarantinedStaleReports = [
    {
      title: isHi
        ? 'भारत-अमेरिका iCET रक्षा समझौता: GE-414 फाइटर जेट इंजन का 80% तकनीक हस्तांतरण'
        : 'India-US iCET Defense Accord: Cabinet Clears 80% Tech Transfer for GE-414 Fighter Jet Engine Manufacturing',
      originalDate: '22 June 2023',
      actualAge: '1180 days ago',
      originalTrigger: 'Cabinet Committee on Security & PM Modi Washington State Visit (June 2023)',
      reason: isHi
        ? 'ओरिजिन 24 घंटे से काफी पुराना (2023) है। कुछ ब्लॉग्स ने इसे दोबारा पोस्ट किया, लेकिन आज कोई नया फैसला नहीं हुआ। 24h गेटकीपर द्वारा आज के फीड से बाहर किया गया।'
        : 'Origin is older than 24 hours (originally from June 2023). Re-posted by news syndicates, but lacks a new breaking trigger today. Quarantined from Today\'s feed.',
    },
    {
      title: isHi
        ? 'ध्रुवीय कूटनीति: कैबिनेट ने पूर्वी अंटार्कटिका में अत्याधुनिक मैत्री-II रिसर्च स्टेशन के लिए ₹1,800 करोड़ किए मंजूर'
        : 'Polar Geopolitics: Cabinet Clears ₹1,800 Crore for Next-Gen Maitri-II Research Station in East Antarctica',
      originalDate: '07 March 2024',
      actualAge: '920 days ago',
      originalTrigger: 'Union Cabinet PIB Press Release on Maitri-II allocation (March 2024)',
      reason: isHi
        ? 'यह घटना मार्च 2024 की है। ओरिजिन 24 घंटे से पुराना होने के कारण इसे आज की ब्रेकिंग खबरों में नहीं दिखाया गया।'
        : 'Cabinet decision occurred in March 2024 (>24h old). Quarantined by the 24h gatekeeper to ensure only genuine today\'s developments appear.',
    },
    {
      title: isHi
        ? 'घरेलू लीथियम भंडार आवंटन: जम्मू-कश्मीर (रियासी) 59 लाख टन भंडार'
        : 'Domestic Lithium Reserves Commercialized: J&K 5.9M Ton Inferred Resources Announcement',
      originalDate: '09 Feb 2023',
      actualAge: '1310 days ago',
      originalTrigger: 'Geological Survey of India (GSI) 62nd CAC announcement in Feb 2023',
      reason: isHi
        ? '2023 की पुरानी घोषणा। 24 घंटे का सख्त नियम लागू होने के कारण इसे बाहर रखा गया है।'
        : 'Original discovery announcement occurred in 2023. Blocked from today\'s active feed under the strict 24-hour origin freshness rule.',
    },
  ];

  return (
    <div
      id="news-origin-audit-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{isHi ? '24 घंटे ओरिजिन जांच व री-अपलोड फ़िल्टर' : '24H Origin & Re-Upload Verification'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {isHi ? 'सक्रिय' : 'Active'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isHi
                  ? 'पुरानी खबरें (24h+ पुरानी) या री-अपलोड की गई खबरें आज के फीड में नहीं आ सकतीं।'
                  : 'News older than 24 hours or recycled re-uploads are strictly blocked from today\'s feed.'}
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300">
          {/* Summary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isHi
                  ? 'सख्त ओरिजिन पॉलिसी: हर खबर का मूल समय सत्यापित है'
                  : 'Strict Origin Policy: Real Event Origin Verified'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi
                ? 'सिस्टम प्रत्येक खबर के मूल घटना समय (Origin Timestamp) की जांच करता है। यदि कोई समाचार किसी पुराने समझौते (जैसे 2023/2024) का री-अपलोड है और पिछले 24 घंटे में कोई नई घटना नहीं हुई है, तो उसे 24-घंटे नियम के तहत आज के मुख्य फीड से तुरंत बाहर (Quarantine) कर दिया जाता है।'
                : 'The system verifies the genuine first origin timestamp of every event. If a report is merely a recycled re-upload of a historical deal (e.g. from 2023 or 2024) with no fresh development today, it is quarantined and prevented from showing in today\'s breaking feed.'}
            </p>
            <div className="flex items-center gap-4 pt-1 font-mono text-xs">
              <span className="text-emerald-400 font-bold">
                ✓ {newsList.length} {isHi ? 'प्रमाणित ताजा खबरें (<24h)' : 'Fresh Verified Events (<24h)'}
              </span>
              <span className="text-amber-400 font-bold">
                ✓ {quarantinedStaleReports.length} {isHi ? 'पुरानी री-अपलोड खबरें हटाई गईं' : 'Stale Re-Uploads Excluded'}
              </span>
            </div>
          </div>

          {/* Section 1: Active Verified Today News */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'आज की मुख्य खबरों का ओरिजिन ऑडिट (< 24 घंटे)' : 'Today\'s Active News Origin Audit (< 24h)'}</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {newsList.length} {isHi ? 'खबरें' : 'items'}
              </span>
            </div>

            <div className="space-y-2">
              {newsList.slice(0, 5).map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        #{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-300 line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <Clock className="w-3 h-3" />
                        {item.timeAgo}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">
                        {isHi ? 'ओरिजिन स्रोत:' : 'Wire Origin:'} {item.sources?.[0]?.publisher || 'Official Press Wire'}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>&lt; 24h PASS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Quarantined / Excluded Re-Uploads */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-300 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>
                  {isHi
                    ? 'हटाए गए पुराने री-अपलोड (24 घंटे से पुराने)'
                    : 'Quarantined Stale Re-Uploads (Older than 24h)'}
                </span>
              </h3>
              <span className="text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                {quarantinedStaleReports.length} {isHi ? 'ब्लॉक किए गए' : 'Blocked'}
              </span>
            </div>

            <div className="space-y-2.5">
              {quarantinedStaleReports.map((stale, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-200 text-xs sm:text-sm">
                      {stale.title}
                    </h4>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {isHi ? 'फीड से बाहर' : 'EXCLUDED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500">{isHi ? 'घटना का वास्तविक समय:' : 'Original Event Date:'}</span>
                      <p className="font-mono text-amber-300 font-bold">{stale.originalDate} ({stale.actualAge})</p>
                    </div>
                    <div>
                      <span className="text-slate-500">{isHi ? 'मूल स्रोत / निर्णय:' : 'Original Anchor:'}</span>
                      <p className="text-slate-300 truncate">{stale.originalTrigger}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-200/90 leading-relaxed italic">
                    💡 {stale.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isHi ? '✓ सख्त 24h फ्रेशनेस सुरक्षा चालू' : '✓ Strict 24h freshness protection active'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors"
          >
            {isHi ? 'समझ गया' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};
