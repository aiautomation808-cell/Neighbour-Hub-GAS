import React, { useState } from 'react';
import { User as UserIcon, BadgeCheck, Star, Calendar, FileText, Settings, Shield, MapPin, CheckCircle, Save, Edit2 } from 'lucide-react';
import { User, Post, FileAttachment } from '../types';

interface ProfileSectionProps {
  currentUser: User;
  onUpdateBio: (newBio: string) => void;
  posts: Post[];
  files: FileAttachment[];
}

export default function ProfileSection({
  currentUser,
  onUpdateBio,
  posts,
  files,
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(currentUser.bio);

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBio(editedBio);
    setIsEditing(false);
  };

  const userPosts = posts.filter(p => p.authorId === currentUser.id);
  const userFiles = files.filter(f => userPosts.some(p => p.fileAttachments.some(att => att.id === f.id)));

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Upper Cover Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-800 text-white overflow-hidden p-6 sm:p-8 shadow-md">
        <div className="absolute inset-0 bg-grid-white/5 opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar and verification */}
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full border-4 border-white/95 shadow-xl object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            {currentUser.isVerified && (
              <span className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1 rounded-full border-2 border-white shadow-md" title="Verified Resident">
                <BadgeCheck size={16} />
              </span>
            )}
          </div>

          {/* Identity Info */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-xl font-bold font-display text-white">{currentUser.name}</h2>
              <span className="text-[10px] bg-white/20 border border-white/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-indigo-100">
                {currentUser.role} Account
              </span>
            </div>

            <p className="text-xs text-indigo-100/90 flex items-center justify-center sm:justify-start gap-1">
              <MapPin size={12} className="text-indigo-300" />
              {currentUser.area}
            </p>

            <p className="text-[10px] text-indigo-200/80 flex items-center justify-center sm:justify-start gap-1">
              <Calendar size={11} />
              Registered Neighbor Since {currentUser.joinDate}
            </p>
          </div>

          {/* Trust Score circular card */}
          <div className="bg-slate-900/40 border border-white/10 p-4 rounded-2xl shrink-0 text-center space-y-1 w-36">
            <p className="text-[10px] font-black tracking-widest text-indigo-200 uppercase">Trust score</p>
            <p className="text-2xl font-black text-amber-400">{currentUser.trustScore}%</p>
            <p className="text-[9px] text-slate-300 font-semibold">Verified Resident</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Bio & Badges) */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Biography</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={12} /> Edit Bio
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveBio} className="space-y-3">
                <textarea
                  rows={4}
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-700"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Save size={12} /> Save Updates
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {currentUser.bio || "No biography provided yet. Add an elegant description to build trust!"}
              </p>
            )}
          </div>

          {/* Badges Checklist */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Earned Badges</h3>
            {currentUser.badges.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No helpful badges earned yet. Start helping neighbors by answering requests or organizing cleanups!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentUser.badges.map((badge) => (
                  <div key={badge} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 border border-amber-200">
                      <Star size={14} className="fill-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{badge}</p>
                      <p className="text-[10px] text-slate-400">Awarded for community actions</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Stats checklist & Activity items) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Sandbox Stats</h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold">Posts Contributed</span>
                <span className="font-bold text-slate-800">{userPosts.length} posts</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold">Verification Status</span>
                <span className="font-bold text-green-600">Verified ✓</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Current Platform Role</span>
                <span className="font-bold text-indigo-600 uppercase">{currentUser.role}</span>
              </div>
            </div>
          </div>

          {/* Guidelines info card */}
          <div className="p-5 bg-indigo-50/50 border border-indigo-150 rounded-2xl text-left space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
              <Shield size={14} />
              <span>Trust Verified</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your trust score increments as you gain positive reactions on posts, RSVP to block events, and help other residents resolved mutual-aid requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
