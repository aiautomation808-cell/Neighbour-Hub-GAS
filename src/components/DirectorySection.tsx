import React, { useState } from 'react';
import { Search, MapPin, BadgeCheck, Phone, ShieldCheck, Mail, MessageSquare, Info, Star } from 'lucide-react';
import { User } from '../types';
import { CURRENT_USER_PROFILES } from '../data';

interface DirectorySectionProps {
  currentUser: User;
}

export default function DirectorySection({ currentUser }: DirectorySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'volunteer' | 'business'>('all');

  // Convert CURRENT_USER_PROFILES object to array, and add additional mock neighbors
  const mockMembers: User[] = [
    CURRENT_USER_PROFILES.admin,
    CURRENT_USER_PROFILES.moderator,
    CURRENT_USER_PROFILES.resident,
    {
      id: "dir_1",
      name: "David Chen",
      email: "david.chen@gmail.local",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      area: "Maple Heights (South Side)",
      bio: "Master Electrician with 12+ years of residential experience. Happy to advise neighbors on electrical safety or do minor wiring fixes on weekends.",
      skills: ["Electrician", "First Aid", "Tools"],
      joinDate: "October 2023",
      trustScore: 92,
      badges: ["Official Electrician", "Safety Leader"],
      isVerified: true,
      postsCount: 12,
      filesCount: 1,
      role: "resident"
    },
    {
      id: "dir_2",
      name: "Emily Rose",
      email: "emily.rose@gmail.local",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      area: "Maple Heights (East Block)",
      bio: "Professional landscape designer and organic gardener. Love helping neighbors design drought-tolerant native wildflower garden patches.",
      skills: ["Gardener", "Baking", "Designer"],
      joinDate: "May 2024",
      trustScore: 88,
      badges: ["Green Thumb", "Beautifier"],
      isVerified: true,
      postsCount: 9,
      filesCount: 4,
      role: "resident"
    },
    {
      id: "dir_3",
      name: "Green Harvest Store",
      email: "orders@greenharvest.local",
      avatar: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80",
      area: "Main Street, Maple Heights",
      bio: "Local organic grocery store and gardening supply hub. Proud sponsor of neighborhood cleanup drives. Mention NeighborHub for 10% off seeds!",
      skills: ["Gardener", "Baking", "Tools"],
      joinDate: "August 2022",
      trustScore: 95,
      badges: ["Business Sponsor", "Sustainer"],
      isVerified: true,
      postsCount: 22,
      filesCount: 8,
      role: "resident"
    }
  ];

  const filteredMembers = mockMembers.filter((m) => {
    // Role filter
    if (activeFilter === 'volunteer' && m.skills.length === 0) return false;
    if (activeFilter === 'business' && m.name.includes('Store')) return false; // simulated business logic
    if (activeFilter === 'business' && !m.name.includes('Store') && m.id !== 'dir_3') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.area.toLowerCase().includes(q) ||
        m.skills.some(sk => sk.toLowerCase().includes(q)) ||
        m.bio.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleContactMember = (name: string) => {
    alert(`Simulating secure peer-to-peer message: Chat thread opened with ${name}! Check your messages tab.`);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Banner Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">Verified Neighborhood Directory</h2>
          <p className="text-xs text-slate-500">Discover local contractors, organic gardens, volunteers, or contact HOA committee leads.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border shrink-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${activeFilter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All Neighbors
          </button>
          <button
            onClick={() => setActiveFilter('volunteer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${activeFilter === 'volunteer' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Volunteers / Skills
          </button>
          <button
            onClick={() => setActiveFilter('business')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${activeFilter === 'business' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Local Businesses
          </button>
        </div>
      </div>

      {/* Local Directory Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by name, neighborhood street, or service skill tags (e.g., Electrician, Gardener)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-white"
        />
      </div>

      {/* Members Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border rounded-2xl p-12 text-center text-slate-400">
            <MapPin className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="font-bold text-sm text-slate-700">No matching neighbors found</p>
            <p className="text-xs">Adjust your search terms or view the full list.</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div 
              key={member.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Member Identity Block */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-full object-cover border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    {member.isVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 text-white p-0.5 rounded-full border border-white" title="Verified Resident">
                        <BadgeCheck size={10} />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
                      {member.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <MapPin size={9} />
                      {member.area}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{member.bio}</p>

                {/* Skills/Services offered */}
                {member.skills.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-indigo-800 uppercase tracking-wide">Skills & mutual-aid services</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <span key={skill} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Badges and reputation metrics */}
                {member.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.badges.map((badge) => (
                      <span key={badge} className="bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Star size={8} className="fill-amber-500" />
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button Panel */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Trust reputation: <span className="text-slate-800 font-bold">{member.trustScore}%</span></span>

                {currentUser.role === 'guest' ? (
                  <span className="italic text-slate-400">🔒 Guest</span>
                ) : (
                  <button
                    onClick={() => handleContactMember(member.name)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
