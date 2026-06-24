import React from 'react';
import { HelpCircle, HandHelping, CheckCircle2, Clock, MapPin, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { HelpRequest, User } from '../types';

interface HelpSectionProps {
  helpRequests: HelpRequest[];
  currentUser: User;
  onVolunteer: (id: string, volunteerName: string) => void;
  onResolveHelp: (id: string) => void;
  onTriggerCreatePost: () => void;
}

export default function HelpSection({
  helpRequests,
  currentUser,
  onVolunteer,
  onResolveHelp,
  onTriggerCreatePost,
}: HelpSectionProps) {
  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Banner Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">Community Mutual Aid & Support</h2>
          <p className="text-xs text-slate-500">Ask for a hand or offer your skills for elderly checks, grocery pickups, or borrowing ladders.</p>
        </div>

        <button
          onClick={onTriggerCreatePost}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer shrink-0"
        >
          + Request Assistance
        </button>
      </div>

      {/* Grid of help items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {helpRequests.length === 0 ? (
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border p-12 text-center text-slate-400">
            <HelpCircle className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="font-bold text-sm text-slate-700">No active help requests</p>
            <p className="text-xs">Submit a request if you need support or tools.</p>
          </div>
        ) : (
          helpRequests.map((req) => {
            const hasVolunteered = req.volunteers.includes(currentUser.name);
            const isAuthor = req.authorId === currentUser.id || currentUser.role === 'admin';

            return (
              <div 
                key={req.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between ${
                  req.status === 'Resolved' 
                    ? 'border-slate-200 bg-slate-50/50 opacity-80' 
                    : req.urgency === 'high'
                      ? 'border-red-200 ring-1 ring-red-500/5'
                      : 'border-slate-200'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                      req.urgency === 'high'
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : req.urgency === 'medium'
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'bg-green-50 border-green-200 text-green-600'
                    }`}>
                      {req.urgency} Urgency
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                      req.status === 'Resolved'
                        ? 'bg-slate-200 border-slate-300 text-slate-600'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{req.title}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Submitted by {req.authorName}</p>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{req.description}</p>
                  </div>

                  {/* Volunteers List info */}
                  {req.status === 'Open' && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-[10px] text-slate-500">
                      <p className="font-bold text-slate-700 uppercase tracking-wide text-[9px]">Active Volunteers ({req.volunteersCount})</p>
                      {req.volunteers.length === 0 ? (
                        <p className="italic text-slate-400">No volunteers yet. Be the first to help!</p>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {req.volunteers.map((vol) => (
                            <span key={vol} className="bg-white border px-2 py-0.5 rounded text-slate-600 font-medium">
                              🙋 {vol}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Files or attachment inside request */}
                  {req.attachedFiles && req.attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {req.attachedFiles.map((file) => (
                        <span key={file.id} className="inline-flex items-center gap-1 bg-slate-100 border text-slate-600 text-[9px] px-2 py-0.5 rounded-lg">
                          <FileText size={10} className="text-indigo-500" />
                          <span className="max-w-[120px] truncate">{file.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-between items-center text-xs">
                  {req.status === 'Resolved' ? (
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Helpful act completed!
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <HandHelping size={13} className="text-indigo-500 shrink-0" />
                      {req.volunteersCount} neighbors pledged
                    </span>
                  )}

                  <div className="flex gap-2">
                    {/* Resolve action for creator */}
                    {isAuthor && req.status === 'Open' && (
                      <button
                        onClick={() => onResolveHelp(req.id)}
                        className="px-3 py-1.5 border border-green-200 hover:border-green-300 text-green-700 bg-green-50/50 hover:bg-green-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        ✓ Mark Handled
                      </button>
                    )}

                    {/* Volunteer pledging button */}
                    {req.status === 'Open' && (
                      currentUser.role === 'guest' ? (
                        <span className="text-[10px] text-slate-400 italic">🔒 Guest Read Only</span>
                      ) : (
                        <button
                          onClick={() => onVolunteer(req.id, currentUser.name)}
                          className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer ${
                            hasVolunteered
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {hasVolunteered ? 'Pledged ✓' : 'Volunteer Now'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
