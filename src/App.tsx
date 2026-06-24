import React, { useState, useEffect } from 'react';
import { 
  User, UserRole, Post, Comment, NeighborhoodEvent, 
  LostFoundItem, HelpRequest, MarketplaceListing, 
  SafetyAlert, Report, Notification, AuditLog, FileAttachment 
} from './types';
import { 
  CURRENT_USER_PROFILES, INITIAL_POSTS, INITIAL_COMMENTS, 
  INITIAL_EVENTS, INITIAL_LOST_FOUND, INITIAL_HELP_REQUESTS, 
  INITIAL_MARKETPLACE, INITIAL_ALERTS, INITIAL_REPORTS, 
  INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS, SAMPLE_NEIGHBORHOODS 
} from './data';

import Navbar from './components/Navbar';
import CreatePostModal from './components/CreatePostModal';

// Section Views
import HomeSection from './components/HomeSection';
import FeedSection from './components/FeedSection';
import EventSection from './components/EventSection';
import LostFoundSection from './components/LostFoundSection';
import HelpSection from './components/HelpSection';
import MarketplaceSection from './components/MarketplaceSection';
import DirectorySection from './components/DirectorySection';
import AlertsSection from './components/AlertsSection';
import FilesSection from './components/FilesSection';
import AdminSection from './components/AdminSection';
import ProfileSection from './components/ProfileSection';
import LoginPage from './components/LoginPage';

// Nav icons
import { Megaphone, Calendar, SearchCheck, HelpCircle, ShoppingBag, ShieldAlert, FileText, LayoutDashboard, UserCheck, Home } from 'lucide-react';

export default function App() {
  // Active state routing
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>(SAMPLE_NEIGHBORHOODS[0]);
  const [globalSearch, setGlobalSearch] = useState('');

  // Active Sandbox test user profile and Authentication
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('nh_isLoggedIn') === 'true';
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('nh_currentRole') as UserRole) || 'resident';
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('nh_currentUser');
    if (savedUser) return JSON.parse(savedUser);
    return CURRENT_USER_PROFILES.resident;
  });

  // Core Data States (Initialized from localStorage if present, else default)
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [events, setEvents] = useState<NeighborhoodEvent[]>([]);
  const [lostFound, setLostFound] = useState<LostFoundItem[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceListing[]>([]);
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [sharedFiles, setSharedFiles] = useState<FileAttachment[]>([]);

  // Modals controller
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load state from local storage or defaults on mount
  useEffect(() => {
    const lPosts = localStorage.getItem('nh_posts');
    const lComments = localStorage.getItem('nh_comments');
    const lEvents = localStorage.getItem('nh_events');
    const lLostFound = localStorage.getItem('nh_lostfound');
    const lHelp = localStorage.getItem('nh_help');
    const lMarket = localStorage.getItem('nh_market');
    const lAlerts = localStorage.getItem('nh_alerts');
    const lReports = localStorage.getItem('nh_reports');
    const lNotifs = localStorage.getItem('nh_notifs');
    const lAudit = localStorage.getItem('nh_audit');
    const lFiles = localStorage.getItem('nh_files');

    if (lPosts) setPosts(JSON.parse(lPosts)); else setPosts(INITIAL_POSTS);
    if (lComments) setComments(JSON.parse(lComments)); else setComments(INITIAL_COMMENTS);
    if (lEvents) setEvents(JSON.parse(lEvents)); else setEvents(INITIAL_EVENTS);
    if (lLostFound) setLostFound(JSON.parse(lLostFound)); else setLostFound(INITIAL_LOST_FOUND);
    if (lHelp) setHelpRequests(JSON.parse(lHelp)); else setHelpRequests(INITIAL_HELP_REQUESTS);
    if (lMarket) setMarketplace(JSON.parse(lMarket)); else setMarketplace(INITIAL_MARKETPLACE);
    if (lAlerts) setAlerts(JSON.parse(lAlerts)); else setAlerts(INITIAL_ALERTS);
    if (lReports) setReports(JSON.parse(lReports)); else setReports(INITIAL_REPORTS);
    if (lNotifs) setNotifications(JSON.parse(lNotifs)); else setNotifications(INITIAL_NOTIFICATIONS);
    if (lAudit) setAuditLogs(JSON.parse(lAudit)); else setAuditLogs(INITIAL_AUDIT_LOGS);

    // Grab file attachments from initial posts and events to pre-fill Shared File board
    if (lFiles) {
      setSharedFiles(JSON.parse(lFiles));
    } else {
      const initialAttachments: FileAttachment[] = [];
      INITIAL_POSTS.forEach(p => p.fileAttachments.forEach(att => initialAttachments.push(att)));
      INITIAL_EVENTS.forEach(e => e.attachedFiles.forEach(att => initialAttachments.push(att)));
      setSharedFiles(initialAttachments);
    }
  }, []);

  // Save states to local storage on update
  useEffect(() => {
    if (posts.length > 0) localStorage.setItem('nh_posts', JSON.stringify(posts));
  }, [posts]);
  useEffect(() => {
    if (comments.length > 0) localStorage.setItem('nh_comments', JSON.stringify(comments));
  }, [comments]);
  useEffect(() => {
    if (events.length > 0) localStorage.setItem('nh_events', JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    if (lostFound.length > 0) localStorage.setItem('nh_lostfound', JSON.stringify(lostFound));
  }, [lostFound]);
  useEffect(() => {
    if (helpRequests.length > 0) localStorage.setItem('nh_help', JSON.stringify(helpRequests));
  }, [helpRequests]);
  useEffect(() => {
    if (marketplace.length > 0) localStorage.setItem('nh_market', JSON.stringify(marketplace));
  }, [marketplace]);
  useEffect(() => {
    if (alerts.length > 0) localStorage.setItem('nh_alerts', JSON.stringify(alerts));
  }, [alerts]);
  useEffect(() => {
    if (reports.length > 0) localStorage.setItem('nh_reports', JSON.stringify(reports));
  }, [reports]);
  useEffect(() => {
    if (notifications.length > 0) localStorage.setItem('nh_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    if (auditLogs.length > 0) localStorage.setItem('nh_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    if (sharedFiles.length > 0) localStorage.setItem('nh_files', JSON.stringify(sharedFiles));
  }, [sharedFiles]);

  // Handle Role Shift
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const selectedProfile = CURRENT_USER_PROFILES[role];
    setCurrentUser(selectedProfile);
    localStorage.setItem('nh_currentRole', role);
    localStorage.setItem('nh_currentUser', JSON.stringify(selectedProfile));
  };

  // Handle Authentication
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsLoggedIn(true);
    localStorage.setItem('nh_isLoggedIn', 'true');
    localStorage.setItem('nh_currentRole', user.role);
    localStorage.setItem('nh_currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('nh_isLoggedIn');
    localStorage.removeItem('nh_currentRole');
    localStorage.removeItem('nh_currentUser');
    setActiveTab('home');
  };

  // State Mutators / Action Handlers

  // 1. Post Created
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);

    // Automatically index attached files to shared document board
    if (newPost.fileAttachments.length > 0) {
      newPost.fileAttachments.forEach((att) => {
        handleFileAdded({
          ...att,
          category: att.category || 'Forms'
        });
      });
    }

    // Add Audit Log
    addAuditLog(`Created new feed post`, newPost.title);
    // Broadcast notification
    addNotification(`New post shared: ${newPost.title}`, 'reply');
  };

  // 2. Event Created
  const handleEventCreated = (newEvent: NeighborhoodEvent) => {
    setEvents((prev) => [newEvent, ...prev]);

    if (newEvent.attachedFiles.length > 0) {
      newEvent.attachedFiles.forEach((att) => {
        handleFileAdded({
          ...att,
          category: att.category || 'Event flyers'
        });
      });
    }

    addAuditLog(`Organized community event`, newEvent.title);
    addNotification(`New neighborhood event scheduled: ${newEvent.title}`, 'event');
  };

  // 3. Lost & Found Item Created
  const handleLostFoundCreated = (newItem: LostFoundItem) => {
    setLostFound((prev) => [newItem, ...prev]);
    addAuditLog(`Filed missing property report`, newItem.title);
    addNotification(`Alert: ${newItem.type.toUpperCase()} item reported: ${newItem.title}`, 'lost');
  };

  // 4. Help Request Created
  const handleHelpCreated = (newHelp: HelpRequest) => {
    setHelpRequests((prev) => [newHelp, ...prev]);
    addAuditLog(`Filed assistance request`, newHelp.title);
    addNotification(`Urgent: Neighborhood support request: ${newHelp.title}`, 'help');
  };

  // 5. Marketplace Listing Created
  const handleMarketplaceCreated = (newListing: MarketplaceListing) => {
    setMarketplace((prev) => [newListing, ...prev]);
    addAuditLog(`Listed items on swap board`, newListing.title);
  };

  // 6. Safety Alert Created
  const handleAlertCreated = (newAlert: SafetyAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    addAuditLog(`Broadcasted critical warning`, newAlert.title);
    addNotification(`EMERGENCY: ${newAlert.title}`, 'alert');
  };

  // 7. Directly adding file to Shared Document Board
  const handleFileAdded = (newFile: FileAttachment) => {
    setSharedFiles((prev) => {
      if (prev.some((f) => f.id === newFile.id)) return prev;
      return [newFile, ...prev];
    });
    addNotification(`New document uploaded to library: ${newFile.name}`, 'upload');
  };

  // Like a post
  const handleLikePost = (postId: string) => {
    setPosts((prev) => 
      prev.map((post) => {
        if (post.id !== postId) return post;
        const alreadyLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked 
            ? post.likedBy.filter(id => id !== currentUser.id) 
            : [...post.likedBy, currentUser.id]
        };
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      text
    };

    setComments((prev) => [...prev, newComment]);
    setPosts((prev) => 
      prev.map((p) => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)
    );
  };

  // Delete Post
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter(p => p.id !== postId));
    addAuditLog(`Removed post from server`, postId);
  };

  // File Claim/Report Inappropriate content
  const handleReportItem = (itemId: string, itemType: 'post' | 'comment', title: string, reason: string) => {
    const newReport: Report = {
      id: `rep_${Date.now()}`,
      itemId,
      itemType,
      itemTitle: title,
      reportedBy: currentUser.name,
      reason,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setReports((prev) => [newReport, ...prev]);
  };

  // RSVP Event
  const handleRsvpEvent = (eventId: string) => {
    setEvents((prev) => 
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const isGoing = ev.rsvps.includes(currentUser.name);
        return {
          ...ev,
          rsvps: isGoing 
            ? ev.rsvps.filter(n => n !== currentUser.name) 
            : [...ev.rsvps, currentUser.name],
          rsvpCount: isGoing ? ev.rsvpCount - 1 : ev.rsvpCount + 1
        };
      })
    );
  };

  // Volunteer Pledging
  const handleVolunteer = (helpId: string, volunteerName: string) => {
    setHelpRequests((prev) => 
      prev.map((help) => {
        if (help.id !== helpId) return help;
        const hasVolunteered = help.volunteers.includes(volunteerName);
        return {
          ...help,
          volunteers: hasVolunteered 
            ? help.volunteers.filter(v => v !== volunteerName) 
            : [...help.volunteers, volunteerName],
          volunteersCount: hasVolunteered ? help.volunteersCount - 1 : help.volunteersCount + 1
        };
      })
    );
  };

  // Resolve Help request
  const handleResolveHelp = (helpId: string) => {
    setHelpRequests((prev) => 
      prev.map((h) => h.id === helpId ? { ...h, status: 'Resolved' } : h)
    );
    addAuditLog(`Marked assistance request resolved`, helpId);
  };

  // Update Lost & Found status
  const handleUpdateLfStatus = (itemId: string, newStatus: 'Open' | 'Recovered' | 'Claimed') => {
    setLostFound((prev) => 
      prev.map((item) => item.id === itemId ? { ...item, status: newStatus } : item)
    );
    addAuditLog(`Updated missing report status to ${newStatus}`, itemId);
  };

  // Resolve moderation reports
  const handleResolveReport = (reportId: string, actionType: 'dismiss' | 'remove_item' | 'ban_user') => {
    setReports((prev) => 
      prev.map((rep) => rep.id === reportId ? { ...rep, status: actionType === 'dismiss' ? 'dismissed' : 'resolved' } : rep)
    );

    const reportObj = reports.find(r => r.id === reportId);
    if (!reportObj) return;

    if (actionType === 'remove_item') {
      if (reportObj.itemType === 'post') {
        setPosts((prev) => prev.filter(p => p.id !== reportObj.itemId));
      } else if (reportObj.itemType === 'comment') {
        setComments((prev) => prev.filter(c => c.id !== reportObj.itemId));
      }
      addAuditLog(`Moderator action: Content Removed`, reportObj.itemTitle);
    } else if (actionType === 'ban_user') {
      addAuditLog(`Moderator action: Account Suspended`, `User associated with item: ${reportObj.itemTitle}`);
    } else if (actionType === 'dismiss') {
      addAuditLog(`Moderator action: Complaint Dismissed`, reportObj.itemTitle);
    }
  };

  // Delete file from library
  const handleRemoveFile = (fileId: string) => {
    setSharedFiles((prev) => prev.filter((f) => f.id !== fileId));
    addAuditLog(`Removed shared file from storage`, fileId);
  };

  // Update profile bio
  const handleUpdateBio = (newBio: string) => {
    setCurrentUser((prev) => ({ ...prev, bio: newBio }));
  };

  // Notifications clearance
  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  // Helper function to append to audit log list
  const addAuditLog = (action: string, targetItem: string) => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      moderatorName: currentUser.name,
      action,
      targetItem,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Helper function to insert notification
  const addNotification = (text: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      text,
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Left Sidebar Rails Nav Links
  const navLinks = [
    { id: 'home', label: 'Explore Hub', icon: Home },
    { id: 'feed', label: 'Community Feed', icon: Megaphone },
    { id: 'events', label: 'Calendar Events', icon: Calendar },
    { id: 'lost-found', label: 'Lost & Found', icon: SearchCheck },
    { id: 'help', label: 'Help Board', icon: HelpCircle },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'directory', label: 'Neighbor Directory', icon: UserCheck },
    { id: 'alerts', label: 'Safety Warnings', icon: ShieldAlert },
    { id: 'files', label: 'Document Vault', icon: FileText },
  ];

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-x-hidden antialiased">
      {/* Sticky Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        activeNeighborhood={activeNeighborhood}
        onNeighborhoodChange={setActiveNeighborhood}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
        onTriggerCreatePost={() => setIsCreateModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Fullscreen Dashboard Layout Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar sticky desktop navigation rail */}
        <aside className="lg:w-64 shrink-0 space-y-4 text-left hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3 px-1">Navigation Board</h3>
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id);
                        setGlobalSearch(''); // reset search on tab navigate
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === link.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </button>
                  );
                })}

                {/* Moderator Exclusive Sidebar section */}
                {['moderator', 'admin'].includes(currentUser.role) && (
                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">Management Keys</p>
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'admin'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50/50'
                      }`}
                    >
                      <LayoutDashboard size={16} />
                      Moderation Dashboard
                    </button>
                  </div>
                )}
              </nav>
            </div>

            {/* Quick Helper Widget */}
            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-4 rounded-2xl border border-indigo-500/15 text-xs shadow-md shadow-indigo-900/10 space-y-2">
              <p className="font-bold text-amber-300 flex items-center gap-1">💡 Pro Tips</p>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                To explore all platform perspectives, change the <span className="text-amber-400 font-bold">Switch Test Role</span> dropdown at the very top. Banning a user or removing complaints registers in the Moderator Log in real-time.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile quick navigations bar (placed at bottom or top of mobile, here we place category pills for clean scroll) */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 border-b border-slate-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setGlobalSearch('');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === link.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {link.label}
            </button>
          ))}
          {['moderator', 'admin'].includes(currentUser.role) && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              Moderation
            </button>
          )}
        </div>

        {/* Core Screen Active Panel Container */}
        <main className="flex-1 min-w-0">
          {activeTab === 'home' && (
            <HomeSection
              neighborhoodName={activeNeighborhood}
              onTabChange={setActiveTab}
              posts={posts}
              events={events}
              alerts={alerts}
              currentUser={currentUser}
              onTriggerCreatePost={() => setIsCreateModalOpen(true)}
              onLikePost={handleLikePost}
              onRsvpEvent={handleRsvpEvent}
            />
          )}

          {activeTab === 'feed' && (
            <FeedSection
              posts={posts}
              comments={comments}
              currentUser={currentUser}
              globalSearch={globalSearch}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onDeletePost={handleDeletePost}
              onReportItem={handleReportItem}
            />
          )}

          {activeTab === 'events' && (
            <EventSection
              events={events}
              currentUser={currentUser}
              onRsvpEvent={handleRsvpEvent}
              onTriggerCreatePost={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'lost-found' && (
            <LostFoundSection
              items={lostFound}
              currentUser={currentUser}
              onUpdateStatus={handleUpdateLfStatus}
              onTriggerCreatePost={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'help' && (
            <HelpSection
              helpRequests={helpRequests}
              currentUser={currentUser}
              onVolunteer={handleVolunteer}
              onResolveHelp={handleResolveHelp}
              onTriggerCreatePost={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceSection
              listings={marketplace}
              currentUser={currentUser}
              onTriggerCreatePost={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'directory' && (
            <DirectorySection
              currentUser={currentUser}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsSection
              alerts={alerts}
              currentUser={currentUser}
              onTriggerCreatePost={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'files' && (
            <FilesSection
              files={sharedFiles}
              currentUser={currentUser}
              onRemoveFile={handleRemoveFile}
              onTriggerCreatePost={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminSection
              reports={reports}
              auditLogs={auditLogs}
              currentUser={currentUser}
              posts={posts}
              onResolveReport={handleResolveReport}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileSection
              currentUser={currentUser}
              onUpdateBio={handleUpdateBio}
              posts={posts}
              files={sharedFiles}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* CENTRAL POSTING HUB DIALOG MODAL */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        initialCategory={
          activeTab === 'feed' ? 'post' :
          activeTab === 'events' ? 'event' :
          activeTab === 'lost-found' ? 'lostfound' :
          activeTab === 'help' ? 'help' :
          activeTab === 'marketplace' ? 'marketplace' :
          activeTab === 'alerts' ? 'alert' :
          activeTab === 'files' ? 'file' : 'post'
        }
        onPostCreated={handlePostCreated}
        onEventCreated={handleEventCreated}
        onLostFoundCreated={handleLostFoundCreated}
        onHelpCreated={handleHelpCreated}
        onMarketplaceCreated={handleMarketplaceCreated}
        onAlertCreated={handleAlertCreated}
        onFileAdded={handleFileAdded}
      />
    </div>
  );
}
