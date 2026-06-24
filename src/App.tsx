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
import { 
  seedDatabase, 
  subscribeToCollection, 
  addFirestoreDoc, 
  updateFirestoreDoc, 
  deleteFirestoreDoc 
} from './lib/firebase';

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

  // Core Data States (Synchronized with Firestore in real-time)
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

  // DB initialization status
  const [isInitializing, setIsInitializing] = useState(true);

  // Modals controller
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initialize and seed DB once on mount
  useEffect(() => {
    const initDb = async () => {
      try {
        await seedDatabase();
      } catch (err) {
        console.error("Failed to seed database:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initDb();
  }, []);

  // Set up Firebase Real-Time Subscriptions
  useEffect(() => {
    if (isInitializing) return;

    const unsubPosts = subscribeToCollection<Post>('posts', setPosts, 'timestamp', 'desc');
    const unsubComments = subscribeToCollection<Comment>('comments', setComments, 'timestamp', 'asc');
    const unsubEvents = subscribeToCollection<NeighborhoodEvent>('events', setEvents, 'date', 'asc');
    const unsubLostFound = subscribeToCollection<LostFoundItem>('lost_found', setLostFound, 'date', 'desc');
    const unsubHelp = subscribeToCollection<HelpRequest>('help_requests', setHelpRequests, 'urgency', 'desc');
    const unsubMarketplace = subscribeToCollection<MarketplaceListing>('marketplace', setMarketplace, 'id', 'desc');
    const unsubAlerts = subscribeToCollection<SafetyAlert>('alerts', setAlerts, 'timestamp', 'desc');
    const unsubReports = subscribeToCollection<Report>('reports', setReports, 'timestamp', 'desc');
    const unsubNotifications = subscribeToCollection<Notification>('notifications', setNotifications, 'timestamp', 'desc');
    const unsubAuditLogs = subscribeToCollection<AuditLog>('audit_logs', setAuditLogs, 'timestamp', 'desc');
    const unsubFiles = subscribeToCollection<FileAttachment>('shared_files', setSharedFiles, 'name', 'asc');

    return () => {
      unsubPosts();
      unsubComments();
      unsubEvents();
      unsubLostFound();
      unsubHelp();
      unsubMarketplace();
      unsubAlerts();
      unsubReports();
      unsubNotifications();
      unsubAuditLogs();
      unsubFiles();
    };
  }, [isInitializing]);

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

  // State Mutators / Action Handlers via Firestore

  // 1. Post Created
  const handlePostCreated = async (newPost: Post) => {
    await addFirestoreDoc('posts', newPost.id, newPost);

    // Automatically index attached files to shared document board
    if (newPost.fileAttachments.length > 0) {
      for (const att of newPost.fileAttachments) {
        await handleFileAdded({
          ...att,
          category: att.category || 'Forms'
        });
      }
    }

    // Add Audit Log
    addAuditLog(`Created new feed post`, newPost.title);
    // Broadcast notification
    addNotification(`New post shared: ${newPost.title}`, 'reply');
  };

  // 2. Event Created
  const handleEventCreated = async (newEvent: NeighborhoodEvent) => {
    await addFirestoreDoc('events', newEvent.id, newEvent);

    if (newEvent.attachedFiles.length > 0) {
      for (const att of newEvent.attachedFiles) {
        await handleFileAdded({
          ...att,
          category: att.category || 'Event flyers'
        });
      }
    }

    addAuditLog(`Organized community event`, newEvent.title);
    addNotification(`New neighborhood event scheduled: ${newEvent.title}`, 'event');
  };

  // 3. Lost & Found Item Created
  const handleLostFoundCreated = async (newItem: LostFoundItem) => {
    await addFirestoreDoc('lost_found', newItem.id, newItem);
    addAuditLog(`Filed missing property report`, newItem.title);
    addNotification(`Alert: ${newItem.type.toUpperCase()} item reported: ${newItem.title}`, 'lost');
  };

  // 4. Help Request Created
  const handleHelpCreated = async (newHelp: HelpRequest) => {
    await addFirestoreDoc('help_requests', newHelp.id, newHelp);
    addAuditLog(`Filed assistance request`, newHelp.title);
    addNotification(`Urgent: Neighborhood support request: ${newHelp.title}`, 'help');
  };

  // 5. Marketplace Listing Created
  const handleMarketplaceCreated = async (newListing: MarketplaceListing) => {
    await addFirestoreDoc('marketplace', newListing.id, newListing);
    addAuditLog(`Listed items on swap board`, newListing.title);
  };

  // 6. Safety Alert Created
  const handleAlertCreated = async (newAlert: SafetyAlert) => {
    await addFirestoreDoc('alerts', newAlert.id, newAlert);
    addAuditLog(`Broadcasted critical warning`, newAlert.title);
    addNotification(`EMERGENCY: ${newAlert.title}`, 'alert');
  };

  // 7. Directly adding file to Shared Document Board
  const handleFileAdded = async (newFile: FileAttachment) => {
    await addFirestoreDoc('shared_files', newFile.id, newFile);
    addNotification(`New document uploaded to library: ${newFile.name}`, 'upload');
  };

  // Like a post
  const handleLikePost = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const alreadyLiked = post.likedBy.includes(currentUser.id);
      const updatedLikes = alreadyLiked ? post.likes - 1 : post.likes + 1;
      const updatedLikedBy = alreadyLiked 
        ? post.likedBy.filter(id => id !== currentUser.id) 
        : [...post.likedBy, currentUser.id];
      
      await updateFirestoreDoc('posts', postId, {
        likes: updatedLikes,
        likedBy: updatedLikedBy
      });
    }
  };

  // Add Comment
  const handleAddComment = async (postId: string, text: string) => {
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

    await addFirestoreDoc('comments', newComment.id, newComment);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      await updateFirestoreDoc('posts', postId, {
        commentsCount: post.commentsCount + 1
      });
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    await deleteFirestoreDoc('posts', postId);
    const relatedComments = comments.filter((c) => c.postId === postId);
    for (const c of relatedComments) {
      await deleteFirestoreDoc('comments', c.id);
    }
    addAuditLog(`Removed post from server`, postId);
  };

  // File Claim/Report Inappropriate content
  const handleReportItem = async (itemId: string, itemType: 'post' | 'comment', title: string, reason: string) => {
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
    await addFirestoreDoc('reports', newReport.id, newReport);
  };

  // RSVP Event
  const handleRsvpEvent = async (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      const isGoing = ev.rsvps.includes(currentUser.name);
      const updatedRsvps = isGoing 
        ? ev.rsvps.filter(n => n !== currentUser.name) 
        : [...ev.rsvps, currentUser.name];
      const updatedRsvpCount = isGoing ? ev.rsvpCount - 1 : ev.rsvpCount + 1;

      await updateFirestoreDoc('events', eventId, {
        rsvps: updatedRsvps,
        rsvpCount: updatedRsvpCount
      });
    }
  };

  // Volunteer Pledging
  const handleVolunteer = async (helpId: string, volunteerName: string) => {
    const help = helpRequests.find((h) => h.id === helpId);
    if (help) {
      const hasVolunteered = help.volunteers.includes(volunteerName);
      const updatedVolunteers = hasVolunteered 
        ? help.volunteers.filter(v => v !== volunteerName) 
        : [...help.volunteers, volunteerName];
      const updatedVolunteersCount = hasVolunteered ? help.volunteersCount - 1 : help.volunteersCount + 1;

      await updateFirestoreDoc('help_requests', helpId, {
        volunteers: updatedVolunteers,
        volunteersCount: updatedVolunteersCount
      });
    }
  };

  // Resolve Help request
  const handleResolveHelp = async (helpId: string) => {
    await updateFirestoreDoc('help_requests', helpId, { status: 'Resolved' });
    addAuditLog(`Marked assistance request resolved`, helpId);
  };

  // Update Lost & Found status
  const handleUpdateLfStatus = async (itemId: string, newStatus: 'Open' | 'Recovered' | 'Claimed') => {
    await updateFirestoreDoc('lost_found', itemId, { status: newStatus });
    addAuditLog(`Updated missing report status to ${newStatus}`, itemId);
  };

  // Resolve moderation reports
  const handleResolveReport = async (reportId: string, actionType: 'dismiss' | 'remove_item' | 'ban_user') => {
    const reportObj = reports.find(r => r.id === reportId);
    if (!reportObj) return;

    const updatedStatus = actionType === 'dismiss' ? 'dismissed' : 'resolved';
    await updateFirestoreDoc('reports', reportId, { status: updatedStatus });

    if (actionType === 'remove_item') {
      if (reportObj.itemType === 'post') {
        await deleteFirestoreDoc('posts', reportObj.itemId);
      } else if (reportObj.itemType === 'comment') {
        await deleteFirestoreDoc('comments', reportObj.itemId);
      }
      addAuditLog(`Moderator action: Content Removed`, reportObj.itemTitle);
    } else if (actionType === 'ban_user') {
      addAuditLog(`Moderator action: Account Suspended`, `User associated with item: ${reportObj.itemTitle}`);
    } else if (actionType === 'dismiss') {
      addAuditLog(`Moderator action: Complaint Dismissed`, reportObj.itemTitle);
    }
  };

  // Delete file from library
  const handleRemoveFile = async (fileId: string) => {
    await deleteFirestoreDoc('shared_files', fileId);
    addAuditLog(`Removed shared file from storage`, fileId);
  };

  // Update profile bio
  const handleUpdateBio = async (newBio: string) => {
    setCurrentUser((prev) => ({ ...prev, bio: newBio }));
    if (currentUser.id.startsWith('custom_user_')) {
      await updateFirestoreDoc('custom_users', currentUser.id, { bio: newBio });
    }
  };

  // Notifications clearance
  const handleClearAllNotifications = async () => {
    for (const n of notifications) {
      if (!n.isRead) {
        await updateFirestoreDoc('notifications', n.id, { isRead: true });
      }
    }
  };

  const handleMarkNotificationRead = async (notifId: string) => {
    await updateFirestoreDoc('notifications', notifId, { isRead: true });
  };

  // Helper function to append to audit log list
  const addAuditLog = async (action: string, targetItem: string) => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      moderatorName: currentUser.name,
      action,
      targetItem,
      timestamp: new Date().toISOString()
    };
    await addFirestoreDoc('audit_logs', newLog.id, newLog);
  };

  // Helper function to insert notification
  const addNotification = async (text: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      text,
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    await addFirestoreDoc('notifications', newNotif.id, newNotif);
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

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-800">Connecting to NeighborHub Cloud</h3>
            <p className="text-xs text-slate-500">Synchronizing community boards in real-time...</p>
          </div>
        </div>
      </div>
    );
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
