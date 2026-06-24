import React, { useState } from 'react';
import { Search, Bell, MapPin, ShieldAlert, BadgeCheck, Star, Sparkles, ChevronDown, BellOff, Trash2, CheckCircle2, LogOut } from 'lucide-react';
import { User, Notification, UserRole } from '../types';
import { SAMPLE_NEIGHBORHOODS } from '../data';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  activeNeighborhood: string;
  onNeighborhoodChange: (name: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  globalSearch: string;
  onGlobalSearchChange: (val: string) => void;
  onTriggerCreatePost: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

export default function Navbar({
  currentUser,
  onRoleChange,
  activeNeighborhood,
  onNeighborhoodChange,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  globalSearch,
  onGlobalSearchChange,
  onTriggerCreatePost,
  activeTab,
  onTabChange,
  onLogout,
}: NavbarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNeighbourhoodMenu, setShowNeighbourhoodMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Upper Status Bar & Quick Role Switcher */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sparkles size={14} className="text-amber-400" />
          <span>Hyperlocal community board simulation</span>
          <span className="hidden sm:inline bg-indigo-500/20 text-indigo-300 font-mono text-[10px] px-2 py-0.5 rounded border border-indigo-500/30">
            Local Time: 2026-06-24 10:14
          </span>
        </div>

        {/* Role Toggle Selector */}
        <div className="relative flex items-center gap-2">
          <span className="text-slate-400 font-medium">Switch Test Role:</span>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold px-2.5 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
          >
            <span className="capitalize">{currentUser.role} View</span>
            <ChevronDown size={12} />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-7 mt-1.5 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-2 border-b border-slate-700 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Select User Sandbox Role
              </div>
              {[
                { r: 'guest', desc: 'Read-only limited view' },
                { r: 'resident', desc: 'Create, comment, RSVP' },
                { r: 'moderator', desc: 'Hide posts, flags, logs' },
                { r: 'admin', desc: 'All tools + user management' }
              ].map(({ r, desc }) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r as UserRole);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col transition-colors cursor-pointer ${
                    currentUser.role === r 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-semibold capitalize">{r}</span>
                  <span className={`text-[9px] ${currentUser.role === r ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => onTabChange('home')} 
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-display font-black text-xl shadow-md shadow-indigo-600/10">
            N
          </div>
          <div className="hidden md:block">
            <span className="text-xl font-bold font-display tracking-tight text-slate-800">Neighbor<span className="text-indigo-600">Hub</span></span>
            <span className="block text-[9px] text-slate-400 uppercase tracking-widest -mt-1">Community Platform</span>
          </div>
        </div>

        {/* Neighborhood Picker */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNeighbourhoodMenu(!showNeighbourhoodMenu)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <MapPin size={14} className="text-indigo-500 shrink-0" />
            <span className="max-w-[120px] truncate">{activeNeighborhood}</span>
            <ChevronDown size={12} className="text-slate-400 shrink-0" />
          </button>

          {showNeighbourhoodMenu && (
            <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                Switch Neighborhood
              </div>
              {SAMPLE_NEIGHBORHOODS.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    onNeighborhoodChange(n);
                    setShowNeighbourhoodMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors ${
                    activeNeighborhood === n 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search posts, events, lost pets, files..."
            value={globalSearch}
            onChange={(e) => {
              onGlobalSearchChange(e.target.value);
              if (activeTab !== 'feed' && activeTab !== 'home') {
                onTabChange('feed'); // auto redirect to feed when searching
              }
            }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50"
          />
        </div>

        {/* Right side controls: Notification, User details, Post something */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Create Button */}
          <button
            onClick={onTriggerCreatePost}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>+ Post</span>
            <span className="hidden lg:inline">Something</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
                setShowNeighbourhoodMenu(false);
              }}
              className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors relative cursor-pointer"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Community Alerts & Updates</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={onClearAllNotifications}
                        className="text-[10px] text-indigo-600 hover:underline font-bold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-400 text-xs">
                      <BellOff className="mx-auto text-slate-300 mb-1" size={20} />
                      <p>All caught up!</p>
                      <p className="text-[10px]">No new alerts.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          onMarkNotificationRead(notif.id);
                          setShowNotifMenu(false);
                          if (notif.type === 'alert') {
                            onTabChange('alerts');
                          } else if (notif.type === 'lost') {
                            onTabChange('lost-found');
                          } else if (notif.type === 'event') {
                            onTabChange('events');
                          } else {
                            onTabChange('feed');
                          }
                        }}
                        className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-indigo-50/40' : ''}`}
                      >
                        <p className="text-xs text-slate-700 font-medium">{notif.text}</p>
                        <div className="flex items-center justify-between mt-1.5 text-[9px] text-slate-400">
                          <span>{notif.type.toUpperCase()}</span>
                          <span>Just now</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Overview */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div 
              onClick={() => {
                onTabChange('profile');
              }} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8.5 h-8.5 rounded-full border border-indigo-200 object-cover group-hover:border-indigo-500 transition-colors"
                  referrerPolicy="no-referrer"
                />
                {currentUser.isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 text-white p-0.5 rounded-full border border-white">
                    <BadgeCheck size={8} />
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors leading-none">{currentUser.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded">
                    Trust Score {currentUser.trustScore}%
                  </span>
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Log Out of NeighborHub"
                className="p-1.5 ml-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
