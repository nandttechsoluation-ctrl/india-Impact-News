import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Bell } from 'lucide-react';

interface AndroidStatusBarProps {
  notificationCount?: number;
  onOpenNotifications?: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  notificationCount = 0,
  onOpenNotifications,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full px-5 py-2 flex items-center justify-between text-xs font-semibold text-slate-300 select-none bg-slate-950/80 backdrop-blur-md border-b border-slate-800/40 z-30"
    >
      {/* Left: Time & Notification icons */}
      <div className="flex items-center space-x-2">
        <span className="tracking-tight text-slate-200 font-medium">{currentTime || '09:41'}</span>
        {notificationCount > 0 && (
          <button
            onClick={onOpenNotifications}
            id="status-bar-notif-btn"
            className="flex items-center text-orange-400 hover:text-orange-300 transition-colors ml-1"
            title={`${notificationCount} new intelligence alerts`}
          >
            <Bell className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px] ml-0.5 font-bold">1</span>
          </button>
        )}
      </div>

      {/* Center: Punch Hole Camera Simulator */}
      <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
      </div>

      {/* Right: Connectivity & Battery */}
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-bold text-sky-400">5G</span>
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-slate-400">96%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
