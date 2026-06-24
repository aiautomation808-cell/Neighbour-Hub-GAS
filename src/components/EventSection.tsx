import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, MapPin, User, BadgeAlert, FileText, BadgeCheck, CheckCircle2, Users, ArrowRight, X } from 'lucide-react';
import { NeighborhoodEvent, User } from '../types';

interface EventSectionProps {
  events: NeighborhoodEvent[];
  currentUser: User;
  onRsvpEvent: (id: string) => void;
  onTriggerCreatePost: () => void;
}

export default function EventSection({
  events,
  currentUser,
  onRsvpEvent,
  onTriggerCreatePost,
}: EventSectionProps) {
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<NeighborhoodEvent | null>(null);

  // June 2026 Calendar Grid Info
  // June 1st 2026 is a Monday. June has 30 days.
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const leadingDays = 1; // Mon is 1st, so offset is 0 if we start Mon, but 1 day if Sunday is start of week grid.
  const emptyCells = Array.from({ length: 1 }, (_, i) => i); // 1 empty cell to offset Monday start on a Sunday-first grid.

  const getEventsForDay = (day: number) => {
    const formattedDayStr = `2026-06-${day.toString().padStart(2, '0')}`;
    return events.filter(e => e.date === formattedDayStr);
  };

  const categoriesList = [
    { name: 'Meeting', bg: 'bg-blue-50 border-blue-200 text-blue-700' },
    { name: 'Cleanup', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { name: 'Sports', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
    { name: 'Festival', bg: 'bg-rose-50 border-rose-200 text-rose-700' },
    { name: 'Workshop', bg: 'bg-purple-50 border-purple-200 text-purple-700' },
    { name: 'Safety', bg: 'bg-red-50 border-red-200 text-red-700' },
  ];

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Top Controls Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">Neighborhood Calendar & Meetings</h2>
          <p className="text-xs text-slate-500">Discover or host assemblies, park cleanups, games, or watch meetings.</p>
        </div>

        {/* List / Calendar view toggles */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewType === 'list' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List size={14} />
              List
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewType === 'calendar' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarIcon size={14} />
              Calendar
            </button>
          </div>

          <button
            onClick={onTriggerCreatePost}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            + Create Event
          </button>
        </div>
      </div>

      {/* Category Legends */}
      <div className="flex flex-wrap gap-2">
        {categoriesList.map(cat => (
          <span key={cat.name} className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${cat.bg}`}>
            {cat.name}
          </span>
        ))}
      </div>

      {/* LIST VIEW */}
      {viewType === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-12 text-center border text-slate-400">
              <CalendarIcon className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="font-bold text-sm text-slate-700">No events scheduled</p>
              <p className="text-xs">Schedule the very first block activity now!</p>
            </div>
          ) : (
            events.map((ev) => {
              const isGoing = ev.rsvps.includes(currentUser.name);
              const badgeStyle = categoriesList.find(c => c.name === ev.category)?.bg || 'bg-slate-100 border-slate-200 text-slate-700';

              return (
                <div 
                  key={ev.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Event Header Card */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="bg-indigo-50 border border-indigo-150 text-indigo-700 font-display p-2.5 rounded-xl shrink-0 text-center w-12">
                        <span className="block text-[10px] font-black uppercase tracking-wider">
                          {new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="block text-base font-black mt-0.5">
                          {new Date(ev.date).getDate()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider inline-block ${badgeStyle}`}>
                          {ev.category}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{ev.time}</p>
                      </div>
                    </div>

                    {/* Main Event Body */}
                    <div className="space-y-1">
                      <h3 
                        onClick={() => setSelectedEvent(ev)}
                        className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {ev.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{ev.description}</p>
                    </div>

                    {/* Venue / Location info */}
                    <p className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                      <MapPin size={11} className="text-slate-400" />
                      {ev.venue}
                    </p>

                    {/* Files Attachment block if any */}
                    {ev.attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {ev.attachedFiles.map((f) => (
                          <span key={f.id} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-500">
                            <FileText size={10} className="text-indigo-500" />
                            <span className="max-w-[100px] truncate">{f.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Section */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      👥 Capacity: <span className="font-semibold text-slate-700">{ev.rsvpCount}</span> / <span className="text-slate-400">{ev.capacity}</span> Going
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      {currentUser.role === 'guest' ? (
                        <span className="text-[10px] text-slate-400 italic">🔒 Guest read-only</span>
                      ) : (
                        <button
                          onClick={() => onRsvpEvent(ev.id)}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                            isGoing 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                          }`}
                        >
                          {isGoing ? 'Going ✓' : 'RSVP'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewType === 'calendar' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">June 2026</h3>
            <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">All times listed in local timezone</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {/* Week Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 py-1">{d}</span>
            ))}

            {/* Empty Offset cells */}
            {emptyCells.map((val) => (
              <div key={`empty-${val}`} className="min-h-[85px] bg-slate-50/50 rounded-lg" />
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === 24; // June 24th is mock "today"

              return (
                <div 
                  key={day} 
                  className={`min-h-[85px] border p-1 rounded-lg flex flex-col justify-between text-left transition-colors relative ${
                    isToday 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/15 bg-indigo-50/10' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ${
                    isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}>
                    {day}
                  </span>

                  {/* Day Events Indicator list */}
                  <div className="mt-1 flex-1 space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const color = categoriesList.find(c => c.name === ev.category)?.bg || 'bg-slate-100';
                      return (
                        <div 
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`text-[9px] font-bold px-1 py-0.5 rounded truncate cursor-pointer ${color}`}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <p className="text-[8px] font-bold text-slate-400">+{dayEvents.length - 2} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT DETAILED POPUP MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-left">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Neighborhood event briefing</span>
              <button onClick={() => setSelectedEvent(null)} className="p-1 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider border border-indigo-200">
                  {selectedEvent.category}
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-2 font-display">{selectedEvent.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Organized by <span className="font-semibold text-slate-700">{selectedEvent.organizer}</span></p>
              </div>

              {/* Event Schedule specifications */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">DATE</p>
                  <p className="font-bold text-slate-800">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">SCHEDULED TIME</p>
                  <p className="font-bold text-slate-800">{selectedEvent.time}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/50">
                  <p className="text-[10px] font-semibold text-slate-400">VENUE / PLACE</p>
                  <p className="font-bold text-indigo-600 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} />
                    {selectedEvent.venue}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700">About the Assembly</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
              </div>

              {/* Attendees List */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  👥 RSVPed Neighbors ({selectedEvent.rsvpCount} / {selectedEvent.capacity})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.rsvps.map((name) => (
                    <span key={name} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Document files if any */}
              {selectedEvent.attachedFiles.length > 0 && (
                <div className="space-y-1.5 p-3.5 bg-indigo-50/30 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-950">Event Flyers & Reference Material</h4>
                  <div className="space-y-1.5">
                    {selectedEvent.attachedFiles.map((file) => (
                      <div key={file.id} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-indigo-100">
                        <span className="font-semibold text-slate-700 truncate">{file.name}</span>
                        <a 
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert(`Simulated file downloads: ${file.name}`); }}
                          className="text-indigo-600 font-bold hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Event Footer Actions */}
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-100"
              >
                Close
              </button>

              {currentUser.role === 'guest' ? (
                <span className="text-xs text-slate-400 italic flex items-center">🔒 Guest View</span>
              ) : (
                <button
                  onClick={() => {
                    onRsvpEvent(selectedEvent.id);
                    // update active state in view
                    setSelectedEvent(prev => prev ? {
                      ...prev,
                      rsvps: prev.rsvps.includes(currentUser.name) 
                        ? prev.rsvps.filter(n => n !== currentUser.name)
                        : [...prev.rsvps, currentUser.name],
                      rsvpCount: prev.rsvps.includes(currentUser.name) 
                        ? prev.rsvpCount - 1 
                        : prev.rsvpCount + 1
                    } : null);
                  }}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                    selectedEvent.rsvps.includes(currentUser.name)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {selectedEvent.rsvps.includes(currentUser.name) ? 'Going ✓ (Click to Cancel)' : 'RSVP to Event'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
