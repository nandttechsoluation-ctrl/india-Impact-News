import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ChevronRight, X, AlertTriangle, Radio } from 'lucide-react';
import { AppNotification } from '../types';

interface AndroidNotificationBannerProps {
  notification: AppNotification | null;
  onDismiss: () => void;
  onSelect: (notification: AppNotification) => void;
}

export const AndroidNotificationBanner: React.FC<AndroidNotificationBannerProps> = ({
  notification,
  onDismiss,
  onSelect,
}) => {
  useEffect(() => {
    if (notification) {
      // Auto-dismiss after 7 seconds if not interacted
      const timer = setTimeout(() => {
        onDismiss();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          id={`android-notification-popup-${notification.id}`}
          initial={{ y: -100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="absolute top-10 left-3 right-3 z-50 pointer-events-auto"
        >
          <div className="bg-slate-900/95 border border-orange-500/40 shadow-2xl shadow-orange-950/40 rounded-2xl p-3.5 backdrop-blur-xl text-slate-100 flex flex-col gap-2">
            {/* Header: App identity & Time */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm">
                  <Radio className="w-3 h-3" />
                </div>
                <span className="font-semibold text-slate-200">India Impact AI</span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-orange-400 font-medium">{notification.timestamp}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                id="dismiss-notif-btn"
                className="text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Content */}
            <div
              onClick={() => onSelect(notification)}
              className="cursor-pointer group flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded tracking-wider ${
                      notification.impactLevel === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : notification.impactLevel === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {notification.impactLevel} IMPACT
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium truncate">
                    {notification.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-1">
                  {notification.title}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                  {notification.body}
                </p>
              </div>
              <div className="self-center p-1.5 rounded-full bg-slate-800/80 group-hover:bg-orange-500 group-hover:text-white text-slate-400 transition-colors shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
              <button
                onClick={() => onSelect(notification)}
                id="view-notif-action-btn"
                className="px-2.5 py-1 rounded-lg bg-orange-600/30 hover:bg-orange-600 text-orange-200 hover:text-white font-medium transition-all"
              >
                View Full Analysis
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
