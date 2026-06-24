import React from 'react';
import { ShieldAlert, AlertTriangle, CloudRain, Flame, CheckCircle, Info, Pin, Calendar, MapPin } from 'lucide-react';
import { SafetyAlert, User } from '../types';

interface AlertsSectionProps {
  alerts: SafetyAlert[];
  currentUser: User;
  onTriggerCreatePost: () => void;
}

export default function AlertsSection({
  alerts,
  currentUser,
  onTriggerCreatePost,
}: AlertsSectionProps) {
  // Pin important alerts at the top
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const getAlertIcon = (type: SafetyAlert['type']) => {
    switch (type) {
      case 'road': return '🚧';
      case 'water': return '💧';
      case 'power': return '⚡';
      case 'weather': return '🌡️';
      case 'pet': return '🐕';
      case 'emergency': return '🚨';
      default: return '⚠️';
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Banner controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">Community Safety & Utilities Board</h2>
          <p className="text-xs text-slate-500">Live utility notices, water repairs, local weather safety advisories, and emergency announcements.</p>
        </div>

        {['moderator', 'admin'].includes(currentUser.role) && (
          <button
            onClick={onTriggerCreatePost}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer shrink-0"
          >
            🚨 Broadcast Alert
          </button>
        )}
      </div>

      {/* Grid of Alerts */}
      <div className="space-y-4">
        {sortedAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isMajor = alert.severity === 'major';

          return (
            <div 
              key={alert.id}
              className={`p-5 rounded-2xl border shadow-sm transition-all text-left relative flex gap-4 items-start ${
                isCritical 
                  ? 'bg-red-50/50 border-red-200 ring-2 ring-red-500/5' 
                  : isMajor
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-slate-200'
              }`}
            >
              {/* Pinned Marker */}
              {alert.isPinned && (
                <span className="absolute top-3.5 right-4 flex items-center gap-1 text-[10px] font-bold text-indigo-600 font-display bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-150">
                  <Pin size={10} className="fill-indigo-600" />
                  Pinned Bulletin
                </span>
              )}

              {/* Alert Icon Block */}
              <div className={`p-3.5 rounded-2xl shrink-0 text-xl shadow-sm ${
                isCritical 
                  ? 'bg-red-100 border border-red-200 text-red-600' 
                  : isMajor
                    ? 'bg-amber-100 border border-amber-200 text-amber-600'
                    : 'bg-slate-100 border border-slate-200 text-slate-600'
              }`}>
                {getAlertIcon(alert.type)}
              </div>

              {/* Body Details */}
              <div className="space-y-2 flex-1 min-w-0 pr-20">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-red-600 border-red-700 text-white'
                        : isMajor
                          ? 'bg-amber-500 border-amber-600 text-white'
                          : 'bg-slate-800 border-slate-900 text-white'
                    }`}>
                      {alert.severity} Alert
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">By {alert.authorName}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{alert.title}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{alert.description}</p>
                
                <p className="text-[9px] text-slate-400 font-mono">
                  Reported: {new Date(alert.timestamp).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
