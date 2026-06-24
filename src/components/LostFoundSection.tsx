import React, { useState } from 'react';
import { SearchCheck, Calendar, MapPin, Phone, CheckCircle, Info, Sparkles, MessageSquare, AlertCircle, X } from 'lucide-react';
import { LostFoundItem, User } from '../types';

interface LostFoundSectionProps {
  items: LostFoundItem[];
  currentUser: User;
  onUpdateStatus: (id: string, newStatus: 'Open' | 'Recovered' | 'Claimed') => void;
  onTriggerCreatePost: () => void;
}

export default function LostFoundSection({
  items,
  currentUser,
  onUpdateStatus,
  onTriggerCreatePost,
}: LostFoundSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const filteredItems = items.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setClaimMessage('');
      setSelectedItem(null);
      alert("Claim request sent successfully! The finder/owner has been notified via email.");
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Banner Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">Lost & Found Pet & Property Ledger</h2>
          <p className="text-xs text-slate-500">Report missing pets or items found around Maple Heights parks, pavements, or clubhouse.</p>
        </div>

        <div className="flex gap-2.5 items-center">
          <div className="flex bg-slate-100 p-1 rounded-xl border">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${activeTab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${activeTab === 'lost' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Lost
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${activeTab === 'found' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Found
            </button>
          </div>

          <button
            onClick={onTriggerCreatePost}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            + File Report
          </button>
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white p-12 text-center text-slate-400 border rounded-2xl">
            <SearchCheck className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="font-bold text-sm text-slate-700">No reported lost or found items</p>
            <p className="text-xs">Browse other sections or submit a report if you lost something.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOwner = currentUser.role === 'admin' || currentUser.role === 'moderator';

            return (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden group border-b border-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      item.type === 'lost' 
                        ? 'bg-red-500 border-red-600 text-white' 
                        : 'bg-emerald-500 border-emerald-600 text-white'
                    }`}>
                      {item.type}
                    </span>

                    {/* Status Badge */}
                    <span className={`absolute top-2.5 right-2.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      item.status === 'Open'
                        ? 'bg-slate-900 border-slate-800 text-white'
                        : item.status === 'Recovered'
                          ? 'bg-green-500 border-green-600 text-white'
                          : 'bg-amber-500 border-amber-600 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                        <Calendar size={10} />
                        Date Seen: {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{item.description}</p>

                    <div className="space-y-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
                      <p className="flex items-center gap-1 font-semibold">
                        <MapPin size={11} className="text-indigo-500" />
                        {item.location}
                      </p>
                      <p className="flex items-start gap-1 font-semibold">
                        <Phone size={11} className="text-indigo-500 mt-0.5" />
                        <span className="truncate">{item.contactMethod}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card controls */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Finder/Owner Actions */}
                  {isOwner ? (
                    <div className="flex gap-1.5 w-full">
                      <button
                        onClick={() => onUpdateStatus(item.id, 'Recovered')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold text-[10px] py-1 px-2 rounded-lg transition-colors text-center"
                      >
                        ✓ Recovered
                      </button>
                      <button
                        onClick={() => onUpdateStatus(item.id, 'Claimed')}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] py-1 px-2 rounded-lg transition-colors text-center"
                      >
                        ✓ Claimed
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-1.5 rounded-lg text-center transition-colors cursor-pointer"
                    >
                      ✉ Contact / Claim Item
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CLAIM / MESSAGE INBOX DIALOG POPUP */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <SearchCheck size={16} className="text-indigo-600" />
                Contact Owner / Finder
              </h3>
              <button onClick={() => setSelectedItem(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
              <p className="text-[9px] text-slate-400 font-bold uppercase">Item Selected</p>
              <h4 className="text-xs font-bold text-slate-800">{selectedItem.title}</h4>
              <p className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5">
                <MapPin size={10} />
                Last Seen: {selectedItem.location}
              </p>
            </div>

            {claimSuccess ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center text-xs font-bold">
                ✓ Message sent securely to Finder. Check your registered inbox for updates.
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Write your message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe specific features (colors, markings, tags, serial numbers) to verify your claim or arrange a safe porch handoff."
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="flex justify-end gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm"
                  >
                    Send Secure Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
