import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Image as ImageIcon, Film, Music, Check, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileAttachment, Post, NeighborhoodEvent, LostFoundItem, HelpRequest, MarketplaceListing, SafetyAlert } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string; avatar: string; role: 'guest' | 'resident' | 'moderator' | 'admin' };
  initialCategory?: string;
  onPostCreated: (post: Post) => void;
  onEventCreated: (event: NeighborhoodEvent) => void;
  onLostFoundCreated: (item: LostFoundItem) => void;
  onHelpCreated: (req: HelpRequest) => void;
  onMarketplaceCreated: (listing: MarketplaceListing) => void;
  onAlertCreated: (alert: SafetyAlert) => void;
  onFileAdded: (file: FileAttachment) => void;
}

type TabType = 'post' | 'event' | 'lostfound' | 'help' | 'marketplace' | 'alert' | 'file';

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  initialCategory = 'post',
  onPostCreated,
  onEventCreated,
  onLostFoundCreated,
  onHelpCreated,
  onMarketplaceCreated,
  onAlertCreated,
  onFileAdded,
}: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialCategory as TabType);

  // Common Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('low');

  // Event specific
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventCategory, setEventCategory] = useState<'Meeting' | 'Cleanup' | 'Sports' | 'Festival' | 'Workshop' | 'Safety'>('Meeting');
  const [eventCapacity, setEventCapacity] = useState('30');

  // Lost & Found specific
  const [lfType, setLfType] = useState<'lost' | 'found'>('lost');
  const [lfDate, setLfDate] = useState('');
  const [lfContact, setLfContact] = useState('');

  // Marketplace specific
  const [marketCategory, setMarketCategory] = useState<'furniture' | 'books' | 'electronics' | 'baby' | 'home' | 'tools' | 'free' | 'other'>('furniture');
  const [marketPrice, setMarketPrice] = useState('');
  const [marketCondition, setMarketCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Good');

  // Alert specific
  const [alertSeverity, setAlertSeverity] = useState<'minor' | 'major' | 'critical'>('minor');
  const [alertType, setAlertType] = useState<'road' | 'water' | 'power' | 'weather' | 'pet' | 'emergency'>('road');

  // Document/File Board specific
  const [fileBoardCategory, setFileBoardCategory] = useState('Forms');

  // File uploading states
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Validate and upload files
  const handleFiles = (files: FileList) => {
    setUploadError('');
    if (currentUser.role === 'guest') {
      setUploadError('Guest users do not have permissions to upload files. Please register or switch roles.');
      return;
    }

    if (attachments.length + files.length > 4) {
      setUploadError('Maximum of 4 files allowed per post.');
      return;
    }

    Array.from(files).forEach((file) => {
      // Validate size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError(`File ${file.name} exceeds the 5MB size limit.`);
        return;
      }

      // Validate type
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx', 'mp4', 'mov', 'mp3'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExtensions.includes(ext)) {
        setUploadError(`Unsupported file type: .${ext}. Only images, PDFs, Word docs, MP4s, and MP3s are allowed.`);
        return;
      }

      // Start simulated upload progress
      const tempId = `file_${Math.random().toString(36).substr(2, 9)}`;
      setUploadProgress((prev) => ({ ...prev, [tempId]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[tempId];
          if (current >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [tempId]: current + 20 };
        });
      }, 150);

      // Create attachment entry
      let fileType: 'image' | 'document' | 'video' | 'audio' = 'document';
      let simulatedUrl = '#';

      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        fileType = 'image';
        simulatedUrl = URL.createObjectURL(file); // Create local url for instant client preview
      } else if (['mp4', 'mov'].includes(ext)) {
        fileType = 'video';
        simulatedUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; // sample video
      } else if (['mp3'].includes(ext)) {
        fileType = 'audio';
      }

      const friendlySize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      setTimeout(() => {
        const newAttachment: FileAttachment = {
          id: tempId,
          name: file.name,
          size: friendlySize === '0.0 MB' ? '120 KB' : friendlySize,
          type: fileType,
          url: simulatedUrl,
          category: activeTab === 'file' ? fileBoardCategory : undefined
        };
        setAttachments((prev) => [...prev, newAttachment]);
      }, 900);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
    setUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setUploadError('Please fill in both the title and description.');
      return;
    }

    const baseId = `item_${Date.now()}`;
    const timestampStr = new Date().toISOString();

    // Route creations based on active tab
    if (activeTab === 'post') {
      const newPost: Post = {
        id: baseId,
        title,
        description,
        category: (attachments.some(a => a.type === 'document') ? 'file' : 'discussion'),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: currentUser.role,
        isAuthorVerified: true,
        timestamp: timestampStr,
        location: location || 'Maple Heights General',
        likes: 0,
        likedBy: [],
        commentsCount: 0,
        shares: 0,
        fileAttachments: attachments,
        urgency: urgency,
        isPinned: false
      };
      onPostCreated(newPost);
    } 
    else if (activeTab === 'event') {
      const newEvent: NeighborhoodEvent = {
        id: baseId,
        title,
        description,
        date: eventDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: eventTime || '06:00 PM',
        venue: eventVenue || 'Central Park Clubhouse',
        organizer: `${currentUser.name} (${currentUser.role})`,
        capacity: parseInt(eventCapacity) || 30,
        rsvpCount: 1,
        rsvps: [currentUser.name],
        category: eventCategory,
        attachedFiles: attachments
      };
      onEventCreated(newEvent);
    } 
    else if (activeTab === 'lostfound') {
      const newLf: LostFoundItem = {
        id: baseId,
        type: lfType,
        title,
        description,
        location: location || 'Unknown Neighborhood Corner',
        date: lfDate || new Date().toISOString().split('T')[0],
        contactMethod: lfContact || `Contact ${currentUser.name} via NeighborHub Chat`,
        status: 'Open',
        image: attachments.find(att => att.type === 'image')?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        attachedFiles: attachments
      };
      onLostFoundCreated(newLf);
    } 
    else if (activeTab === 'help') {
      const newHelp: HelpRequest = {
        id: baseId,
        title,
        description,
        urgency: urgency,
        authorId: currentUser.id,
        authorName: currentUser.name,
        status: 'Open',
        volunteersCount: 0,
        volunteers: [],
        attachedFiles: attachments
      };
      onHelpCreated(newHelp);
    } 
    else if (activeTab === 'marketplace') {
      const newListing: MarketplaceListing = {
        id: baseId,
        title,
        description,
        category: marketCategory,
        price: marketCategory === 'free' ? 'Free' : (parseFloat(marketPrice) || 'Free'),
        condition: marketCondition,
        image: attachments.find(att => att.type === 'image')?.url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        contact: lfContact || `Message ${currentUser.name}`,
        authorName: currentUser.name,
        authorId: currentUser.id,
        attachedFiles: attachments
      };
      onMarketplaceCreated(newListing);
    } 
    else if (activeTab === 'alert') {
      const newAlert: SafetyAlert = {
        id: baseId,
        title,
        description,
        severity: alertSeverity,
        type: alertType,
        timestamp: timestampStr,
        isPinned: alertSeverity === 'critical',
        authorName: currentUser.name
      };
      onAlertCreated(newAlert);
    } 
    else if (activeTab === 'file') {
      // Also register file directly to file board
      if (attachments.length === 0) {
        setUploadError('Please attach at least one file to upload to the Document Board.');
        return;
      }
      attachments.forEach((att) => {
        onFileAdded({
          ...att,
          category: fileBoardCategory
        });
      });
      
      // Also post a notification or a regular post to feed notifying about the file
      const filePost: Post = {
        id: baseId,
        title: `Shared File: ${title}`,
        description: `Uploaded file '${attachments[0].name}' under the category '${fileBoardCategory}'. Description: ${description}`,
        category: 'file',
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: currentUser.role,
        isAuthorVerified: true,
        timestamp: timestampStr,
        location: 'Document Library',
        likes: 0,
        likedBy: [],
        commentsCount: 0,
        shares: 0,
        fileAttachments: attachments,
        isPinned: false
      };
      onPostCreated(filePost);
    }

    // Reset Form & Close
    setTitle('');
    setDescription('');
    setLocation('');
    setUrgency('low');
    setAttachments([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-800">Create Neighborhood Post</h2>
            <p className="text-xs text-slate-500 mt-0.5">Posting as <span className="font-medium text-indigo-600">{currentUser.name}</span> ({currentUser.role})</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 py-2 border-b border-gray-100 bg-white flex flex-wrap gap-1.5">
          {[
            { id: 'post', label: 'Feed Post' },
            { id: 'event', label: 'Organize Event' },
            { id: 'lostfound', label: 'Lost & Found' },
            { id: 'help', label: 'Help Request' },
            { id: 'marketplace', label: 'Marketplace' },
            { id: 'alert', label: 'Safety Alert' },
            { id: 'file', label: 'Upload File' }
          ].map((tab) => {
            // Restrictions
            if (tab.id === 'alert' && !['moderator', 'admin'].includes(currentUser.role)) return null;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setUploadError('');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Guest Warning */}
          {currentUser.role === 'guest' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Guest View Only</p>
                <p className="text-xs">You can compile posts as a demo, but guests are normally restricted from posting in verified neighborhoods. Switch roles in the top-right to test resident, mod, or admin permissions!</p>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Core Title and Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Title *</label>
            <input
              type="text"
              required
              placeholder={
                activeTab === 'post' ? "What's on your mind?" :
                activeTab === 'event' ? "e.g., Annual Block BBQ Picnic" :
                activeTab === 'lostfound' ? "e.g., Found Set of Keys with Green Strap" :
                activeTab === 'help' ? "e.g., Need help moving couch on Saturday" :
                activeTab === 'marketplace' ? "e.g., Clean Baby Stroller in Greenwood" :
                activeTab === 'alert' ? "e.g., Gas leak smell detected near Maple Park" :
                "Document Title (e.g., Community Guidelines Booklet)"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Description / Details *</label>
            <textarea
              required
              rows={4}
              placeholder="Provide all relevant details for your neighbors. Be polite, clear, and descriptive!"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
            />
          </div>

          {/* Conditional Forms Based on activeTab */}

          {/* EVENT FORM */}
          {activeTab === 'event' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Cleanup">Cleanup</option>
                  <option value="Sports">Sports</option>
                  <option value="Festival">Festival</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Capacity (People)</label>
                <input
                  type="number"
                  min="1"
                  value={eventCapacity}
                  onChange={(e) => setEventCapacity(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Time *</label>
                <input
                  type="text"
                  placeholder="e.g., 6:30 PM"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Venue *</label>
                <input
                  type="text"
                  placeholder="e.g., Central Park Clubhouse"
                  required
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* LOST & FOUND FORM */}
          {activeTab === 'lostfound' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1 col-span-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      checked={lfType === 'lost'}
                      onChange={() => setLfType('lost')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    I Lost Something
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      checked={lfType === 'found'}
                      onChange={() => setLfType('found')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    I Found Something
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date Last Seen *</label>
                <input
                  type="date"
                  required
                  value={lfDate}
                  onChange={(e) => setLfDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location Tag *</label>
                <input
                  type="text"
                  placeholder="e.g., Elm Street picnic tables"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Method / Instructions *</label>
                <input
                  type="text"
                  placeholder="e.g., Call Sarah at 555-0199 or reply to this post"
                  required
                  value={lfContact}
                  onChange={(e) => setLfContact(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* HELP REQUEST FORM */}
          {activeTab === 'help' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Urgency Level</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        urgency === level 
                          ? level === 'high' 
                            ? 'bg-red-500 border-red-600 text-white shadow-sm'
                            : level === 'medium'
                              ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                              : 'bg-green-500 border-green-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Location Tag</label>
                <input
                  type="text"
                  placeholder="e.g., West Side, 150m from Park"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* MARKETPLACE FORM */}
          {activeTab === 'marketplace' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={marketCategory}
                  onChange={(e) => setMarketCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="furniture">Furniture</option>
                  <option value="books">Books & Media</option>
                  <option value="electronics">Electronics</option>
                  <option value="baby">Baby & Kids</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="tools">Tools & DIY</option>
                  <option value="free">Free Items</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {marketCategory !== 'free' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Price ($) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g., 45"
                    required
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Condition</label>
                <select
                  value={marketCondition}
                  onChange={(e) => setMarketCondition(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Method *</label>
                <input
                  type="text"
                  placeholder="e.g., Call/text Marcus at 555-0100"
                  required
                  value={lfContact}
                  onChange={(e) => setLfContact(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* SAFETY ALERT FORM */}
          {activeTab === 'alert' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50/50 rounded-xl border border-red-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-red-800">Alert Type</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-red-900"
                >
                  <option value="road">Road / Traffic Closure</option>
                  <option value="water">Water Disruption</option>
                  <option value="power">Power Outage</option>
                  <option value="weather">Severe Weather</option>
                  <option value="pet">Missing Pet / Animal Warning</option>
                  <option value="emergency">General Safety Emergency</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-red-800">Severity Level</label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-red-900 font-semibold"
                >
                  <option value="minor">Minor Warning</option>
                  <option value="major">Major Disruption</option>
                  <option value="critical">Critical / Life Threatening</option>
                </select>
              </div>
            </div>
          )}

          {/* DOCUMENT FILE BOARD FORM */}
          {activeTab === 'file' && (
            <div className="grid grid-cols-1 gap-4 p-4 bg-indigo-50/30 rounded-xl border border-indigo-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-indigo-900">Document Classification Category *</label>
                <select
                  value={fileBoardCategory}
                  onChange={(e) => setFileBoardCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs text-indigo-900"
                >
                  <option value="Forms">Forms (e.g. Vendor applications, HOA parking)</option>
                  <option value="Notices">Notices (e.g. AGM announcements, roadworks schedules)</option>
                  <option value="Guides">Guides (e.g. Recyclable waste instructions)</option>
                  <option value="Rules">Rules (e.g. HOA Handbook, pet policies)</option>
                  <option value="Event flyers">Event Flyers (e.g. Block party, sports BBQ)</option>
                  <option value="Safety documents">Safety Flyers (e.g. Heatwave, wildfire guides)</option>
                </select>
              </div>
            </div>
          )}

          {/* Standard Fields: Feed post & others */}
          {activeTab === 'post' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Oakridge Common East"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-1.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Urgency Label</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-4 py-1.5 border border-slate-200 rounded-xl text-xs bg-white"
                >
                  <option value="low">Standard / Discussion</option>
                  <option value="medium">Mild Attention Needed</option>
                  <option value="high">Urgent Alert</option>
                </select>
              </div>
            </div>
          )}

          {/* FILE UPLOAD DRAG-AND-DROP CANVAS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Attach Supporting Files {activeTab === 'file' ? '*' : '(Optional)'}
              </label>
              <span className="text-[10px] text-slate-400">
                Max 4 files, up to 5MB each. Supporting PNG, JPG, PDF, DOCX, MP4, MP3
              </span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging 
                  ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]' 
                  : 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-slate-50/80'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                }}
                className="hidden"
                multiple
              />
              <UploadCloud className="text-slate-400 mb-2" size={32} />
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop your files here, or <span className="text-indigo-600">browse folders</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Images, PDFs, documents, audio or video clips
              </p>
            </div>

            {/* Uploaded Attachments Previews & Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="space-y-1.5 mt-3">
                {attachments.map((att) => (
                  <div key={att.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 bg-white border border-slate-100 rounded-lg text-indigo-600 shrink-0">
                        {att.type === 'image' ? <ImageIcon size={16} /> :
                         att.type === 'video' ? <Film size={16} /> :
                         att.type === 'audio' ? <Music size={16} /> :
                         <FileText size={16} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{att.name}</p>
                        <p className="text-[10px] text-slate-400">{att.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Check size={10} /> Ready
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {Object.entries(uploadProgress)
                  .filter(([id]) => !attachments.some((a) => a.id === id))
                  .map(([id, progress]) => (
                    <div key={id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium truncate">Simulating encryption & upload security check...</span>
                        <span className="text-slate-700 font-semibold">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-1.5"
            >
              Post to Neighborhood
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
