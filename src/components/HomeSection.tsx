import React from 'react';
import { Megaphone, Calendar, HelpCircle, MapPin, SearchCheck, ShoppingBag, ShieldAlert, FileText, ArrowRight, Star, Award, Sparkles, BadgeCheck, FlameKindling, Info } from 'lucide-react';
import { Post, NeighborhoodEvent, SafetyAlert, User } from '../types';

interface HomeSectionProps {
  neighborhoodName: string;
  onTabChange: (tab: string) => void;
  posts: Post[];
  events: NeighborhoodEvent[];
  alerts: SafetyAlert[];
  currentUser: User;
  onTriggerCreatePost: () => void;
  onLikePost: (id: string) => void;
  onRsvpEvent: (id: string) => void;
}

export default function HomeSection({
  neighborhoodName,
  onTabChange,
  posts,
  events,
  alerts,
  currentUser,
  onTriggerCreatePost,
  onLikePost,
  onRsvpEvent
}: HomeSectionProps) {
  // Filter for alerts
  const criticalAlert = alerts.find(a => a.severity === 'critical');
  const trendingPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  const categories = [
    { id: 'feed', label: 'Feed & Discussions', count: posts.length, icon: Megaphone, color: 'bg-blue-50 text-blue-600 hover:border-blue-300' },
    { id: 'events', label: 'Events & Meetings', count: events.length, icon: Calendar, color: 'bg-emerald-50 text-emerald-600 hover:border-emerald-300' },
    { id: 'lost-found', label: 'Lost & Found Board', count: 2, icon: SearchCheck, color: 'bg-amber-50 text-amber-600 hover:border-amber-300' },
    { id: 'help', label: 'Help Requests', count: 2, icon: HelpCircle, color: 'bg-purple-50 text-purple-600 hover:border-purple-300' },
    { id: 'marketplace', label: 'Marketplace Deals', count: 3, icon: ShoppingBag, color: 'bg-rose-50 text-rose-600 hover:border-rose-300' },
    { id: 'alerts', label: 'Safety & Alerts', count: alerts.length, icon: ShieldAlert, color: 'bg-red-50 text-red-600 hover:border-red-300' },
    { id: 'files', label: 'Shared Documents', count: 5, icon: FileText, color: 'bg-indigo-50 text-indigo-600 hover:border-indigo-300' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Critical Alert Warning Bar */}
      {criticalAlert && (
        <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl shrink-0 animate-pulse">
              <ShieldAlert size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-red-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Critical Warning
                </span>
                <span className="text-xs text-red-100 font-mono">By {criticalAlert.authorName}</span>
              </div>
              <h3 className="text-sm font-bold mt-1">{criticalAlert.title}</h3>
              <p className="text-xs text-red-100 mt-0.5 line-clamp-1">{criticalAlert.description}</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange('alerts')}
            className="text-xs font-bold bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-all self-stretch md:self-auto text-center shrink-0"
          >
            Read Cooling Info
          </button>
        </div>
      )}

      {/* Hero Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-800 text-white overflow-hidden p-6 sm:p-10 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200">
            <FlameKindling size={12} className="text-amber-400" />
            <span>Welcome Neighbor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-tight">
            Your neighborhood is online at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">{neighborhoodName}</span>
          </h1>
          <p className="text-sm text-indigo-100/90 leading-relaxed max-w-lg">
            Stay updated with safety alerts, discover local events, borrow tools, support local businesses, download HOA rules, and support elderly neighbors with medicine runs.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onTriggerCreatePost}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Post Something
            </button>
            <button
              onClick={() => onTabChange('files')}
              className="bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-500/30 font-semibold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Upload Document
            </button>
          </div>
        </div>

        {/* Floating Accent badges */}
        <div className="absolute right-8 bottom-8 hidden lg:flex flex-col gap-3 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs w-64 text-left">
          <p className="font-bold text-slate-200">Your Neighborhood Stats</p>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex justify-between"><span>Active Residents</span> <span className="font-semibold text-white">412</span></div>
            <div className="flex justify-between"><span>Volunteer Helpers</span> <span className="font-semibold text-green-400">45 Active</span></div>
            <div className="flex justify-between"><span>HOA Guidelines</span> <span className="font-semibold text-indigo-400">Verified</span></div>
          </div>
        </div>
      </div>

      {/* Quick Category Chips Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold font-display text-slate-800 text-left">Quick Navigation Board</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onTabChange(cat.id)}
                className={`p-4 rounded-2xl border border-slate-100 flex flex-col items-start text-left bg-white transition-all hover:shadow-md cursor-pointer ${cat.color}`}
              >
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100/50">
                  <IconComponent size={20} />
                </div>
                <h3 className="font-bold text-xs mt-3 text-slate-800">{cat.label}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{cat.count} listings / posts</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout for Feed and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trending Feed Posts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
              <Star size={18} className="text-amber-500 fill-amber-500" />
              Trending Conversations
            </h2>
            <button 
              onClick={() => onTabChange('feed')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              See community feed <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {trendingPosts.map((post) => (
              <div 
                key={post.id} 
                className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left space-y-3.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-8 h-8 rounded-full border border-slate-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-800">{post.authorName}</span>
                        {post.isAuthorVerified && (
                          <BadgeCheck size={12} className="text-indigo-600 shrink-0" />
                        )}
                        <span className="text-[9px] capitalize px-1 bg-slate-100 text-slate-500 rounded font-medium">
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{post.location} • 1 day ago</p>
                    </div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{post.description}</p>
                </div>

                {/* File Attachment Pill */}
                {post.fileAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.fileAttachments.map((att) => (
                      <span key={att.id} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-150 text-slate-600 text-[9px] px-2 py-1 rounded-lg">
                        <FileText size={10} className="text-indigo-500" />
                        <span className="max-w-[120px] truncate">{att.name}</span>
                        <span className="text-slate-400">({att.size})</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <span>👍</span>
                      <span className="font-semibold text-slate-700">{post.likes} Likes</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <span>💬</span>
                      <span className="font-semibold text-slate-700">{post.commentsCount} Comments</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onTabChange('feed')}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Join conversation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Upcoming Events & Highlighted helper */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
              <Calendar size={18} className="text-emerald-600" />
              Community Calendar
            </h2>
            <button 
              onClick={() => onTabChange('events')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Calendar view
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <div 
                key={ev.id} 
                className="p-4 bg-white border border-slate-150 rounded-2xl shadow-sm text-left flex gap-3 items-start"
              >
                {/* Date Accent block */}
                <div className="bg-indigo-50 text-indigo-700 w-11 shrink-0 p-2 rounded-xl flex flex-col items-center justify-center border border-indigo-100">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider">
                    {new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-sm font-black mt-0.5">
                    {new Date(ev.date).getDate()}
                  </span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{ev.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{ev.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <MapPin size={10} className="shrink-0 text-slate-400" />
                    {ev.venue}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] font-semibold text-slate-400">
                      👥 {ev.rsvpCount} RSVPed
                    </span>
                    <button
                      onClick={() => onRsvpEvent(ev.id)}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded transition-colors ${
                        ev.rsvps.includes(currentUser.name)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {ev.rsvps.includes(currentUser.name) ? 'Going ✓' : 'RSVP'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Helper Spotlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 text-left space-y-3">
            <div className="flex items-center gap-2">
              <Award className="text-amber-600 shrink-0" size={18} />
              <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">Featured Helper</h3>
            </div>
            
            <div className="flex items-center gap-2.5">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
                alt="Sarah" 
                className="w-10 h-10 rounded-full border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800">Sarah Jenkins</span>
                  <BadgeCheck size={12} className="text-indigo-600" />
                </div>
                <span className="text-[9px] text-slate-500 font-semibold">Tutor • Gardener • Baker</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed italic">
              "Helped coordinate 3 volunteer food pick-ups for seniors, and donated 8 zucchini starters to neighbors last week!"
            </p>

            <div className="flex justify-between items-center bg-white/70 border border-amber-200 p-2 rounded-xl text-[10px]">
              <span className="text-amber-800 font-bold">⭐ Resident Trust Score: 85%</span>
              <button 
                onClick={() => onTabChange('directory')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Browse neighbors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
