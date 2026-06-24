import React, { useState } from 'react';
import { Search, Flame, Clock, Navigation, MapPin, BadgeCheck, FileText, Download, Share2, ThumbsUp, MessageSquare, AlertTriangle, Bookmark, Trash2, Shield, X, Send } from 'lucide-react';
import { Post, Comment, User, FileAttachment } from '../types';

interface FeedSectionProps {
  posts: Post[];
  comments: Comment[];
  currentUser: User;
  globalSearch: string;
  onLikePost: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onDeletePost: (id: string) => void;
  onReportItem: (itemId: string, itemType: 'post' | 'comment', title: string, reason: string) => void;
}

export default function FeedSection({
  posts,
  comments,
  currentUser,
  globalSearch,
  onLikePost,
  onAddComment,
  onDeletePost,
  onReportItem,
}: FeedSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'popular'>('newest');
  const [feedSearch, setFeedSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Bookmarks state (local to session)
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Report modal states
  const [reportingPost, setReportingPost] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost || !reportReason.trim()) return;

    onReportItem(
      reportingPost.id,
      'post',
      reportingPost.title,
      reportReason
    );

    setReportSuccess(true);
    setReportReason('');
    setTimeout(() => {
      setReportSuccess(false);
      setReportingPost(null);
    }, 1500);
  };

  // Filter and search logic
  const activeSearch = feedSearch || globalSearch;
  const filteredPosts = posts
    .filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (activeSearch.trim()) {
        const query = activeSearch.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.authorName.toLowerCase().includes(query) ||
          post.location.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const categoriesList = [
    { id: 'all', label: 'All Updates' },
    { id: 'announcement', label: '📢 Announcements' },
    { id: 'discussion', label: '💬 Discussions' },
    { id: 'question', label: '❓ Questions' },
    { id: 'alert', label: '⚠️ Alerts' },
    { id: 'recommendation', label: '⭐ Recommendations' },
    { id: 'file', label: '📁 Shared Files' }
  ];

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Search and Sort controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Local Feed Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Filter current feed by keywords..."
            value={feedSearch}
            onChange={(e) => setFeedSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50"
          />
          {activeSearch && (
            <button 
              onClick={() => { setFeedSearch(''); }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-indigo-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort triggers */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              sortOrder === 'newest' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock size={13} />
            Newest First
          </button>
          <button
            onClick={() => setSortOrder('popular')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              sortOrder === 'popular' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame size={13} />
            Trending
          </button>
        </div>
      </div>

      {/* Categories chips selection */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.8 text-xs font-bold rounded-full border whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Feed Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <MessageSquare className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="font-bold text-sm text-slate-700">No postings found</p>
            <p className="text-xs">Try clearing some filter criteria, or write the very first post of this category!</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const hasDocument = post.fileAttachments.some(a => a.type === 'document');
            const hasImage = post.fileAttachments.some(a => a.type === 'image');
            const bookmarked = bookmarks.includes(post.id);

            return (
              <div 
                key={post.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md relative ${
                  post.isPinned ? 'border-amber-300 ring-2 ring-amber-500/5 bg-amber-50/10' : 'border-slate-200'
                }`}
              >
                {/* Pinned label */}
                {post.isPinned && (
                  <div className="absolute top-0 right-12 -translate-y-1/2 bg-amber-500 text-slate-900 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300 shadow">
                    📌 Pinned Official
                  </div>
                )}

                {/* Post Author Block */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 hover:underline cursor-pointer">{post.authorName}</span>
                        {post.isAuthorVerified && (
                          <BadgeCheck size={13} className="text-indigo-600 shrink-0" />
                        )}
                        <span className="text-[9px] font-bold capitalize px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded border border-slate-200">
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin size={10} />
                        {post.location} • {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Urgency tag */}
                    {post.urgency && post.urgency !== 'low' && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        post.urgency === 'high' 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'bg-amber-50 border-amber-200 text-amber-600'
                      }`}>
                        {post.urgency} Action
                      </span>
                    )}

                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-lg capitalize">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="mt-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => setSelectedPost(post)}>
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {post.description}
                  </p>
                </div>

                {/* Previews gallery */}
                {post.fileAttachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {/* Image thumbnail preview if available */}
                    {post.fileAttachments.some(a => a.type === 'image') && (
                      <div className="grid grid-cols-2 gap-2 max-w-md">
                        {post.fileAttachments.filter(a => a.type === 'image').map((att) => (
                          <div key={att.id} className="relative aspect-video rounded-xl overflow-hidden border border-slate-150 bg-slate-50 group">
                            <img
                              src={att.url}
                              alt={att.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded-full">View Attachment</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Document attachments block */}
                    <div className="space-y-1.5">
                      {post.fileAttachments.map((att) => (
                        <div key={att.id} className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs max-w-xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={15} className="text-indigo-600 shrink-0" />
                            <span className="font-semibold text-slate-700 truncate">{att.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                          </div>
                          <a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); alert(`Downloading simulated file: ${att.name}`); }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 shrink-0 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg"
                          >
                            <Download size={10} /> Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action panel */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                        post.likedBy.includes(currentUser.id) ? 'text-indigo-600' : 'hover:text-slate-800'
                      }`}
                    >
                      <span>👍</span>
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-1.5 font-bold hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      <span>{comments.filter(c => c.postId === post.id).length} Comments</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer ${
                        bookmarked ? 'text-indigo-600' : ''
                      }`}
                    >
                      <Bookmark size={14} className={bookmarked ? 'fill-indigo-600' : ''} />
                      <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Simulation */}
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText?.(window.location.href);
                        alert("Simulated share: Link copied to clipboard!");
                      }}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Share link"
                    >
                      <Share2 size={14} />
                    </button>

                    {/* Report action */}
                    <button
                      onClick={() => setReportingPost(post)}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded transition-colors"
                      title="Report to Moderator"
                    >
                      <AlertTriangle size={14} />
                    </button>

                    {/* Delete action (only own posts, or admin/mod) */}
                    {(post.authorId === currentUser.id || ['moderator', 'admin'].includes(currentUser.role)) && (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete your post?")) {
                            onDeletePost(post.id);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* POST EXPANSION OVERLAY MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Neighborhood discussion thread</span>
              <button onClick={() => setSelectedPost(null)} className="p-1 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
              {/* Opener Post Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={selectedPost.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{selectedPost.authorName}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded">{selectedPost.authorRole}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{selectedPost.location} • {new Date(selectedPost.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800">{selectedPost.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedPost.description}</p>

                {/* Attached Files List */}
                {selectedPost.fileAttachments.length > 0 && (
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attached File Attachments ({selectedPost.fileAttachments.length})</p>
                    {selectedPost.fileAttachments.map((att) => (
                      <div key={att.id} className="flex items-center justify-between gap-3 text-xs bg-white p-2 rounded-lg border border-slate-150">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={14} className="text-indigo-600" />
                          <span className="font-semibold text-slate-700 truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400">({att.size})</span>
                        </div>
                        <a 
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert("Simulating attachment file downloading!"); }}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Stream */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Responses ({comments.filter(c => c.postId === selectedPost.id).length})</h4>
                
                <div className="space-y-3.5">
                  {comments.filter(c => c.postId === selectedPost.id).length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">No comments yet. Write the first response below!</p>
                  ) : (
                    comments
                      .filter(c => c.postId === selectedPost.id)
                      .map((comment) => (
                        <div key={comment.id} className="flex gap-2.5 items-start p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-left">
                          <img src={comment.authorAvatar} alt="" className="w-7.5 h-7.5 rounded-full object-cover shrink-0" />
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 justify-between">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-slate-800">{comment.authorName}</span>
                                <span className="text-[8px] font-semibold text-slate-400 capitalize bg-slate-100 px-1 py-0.2 rounded border">
                                  {comment.authorRole}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400">Just now</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{comment.text}</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Post Comment Input Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              {currentUser.role === 'guest' ? (
                <div className="text-center text-xs text-slate-400 p-2">
                  🔒 You are browsing as a guest. Please <span className="font-bold text-indigo-600">switch roles</span> in the top status bar to comment or interact!
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <input
                    type="text"
                    placeholder="Write a constructive response as a verified neighbor..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCommentText.trim()) {
                        onAddComment(selectedPost.id, newCommentText);
                        setNewCommentText('');
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    onClick={() => {
                      if (newCommentText.trim()) {
                        onAddComment(selectedPost.id, newCommentText);
                        setNewCommentText('');
                      }
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shrink-0 transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT FORM MODAL */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="text-red-500" size={16} />
                Flag Content for Moderation
              </h3>
              <button onClick={() => setReportingPost(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                <X size={16} />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center text-xs font-semibold">
                ✓ Report submitted to NeighborHub Moderators queue successfully.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Item to flag</p>
                  <p className="text-xs text-slate-800 font-semibold truncate bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{reportingPost.title}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Reason for flagging *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide details of why this violates community guidelines (e.g., spam, harassment, exposed telephone number, fake profile)..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500"
                  />
                </div>

                <div className="flex justify-end gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setReportingPost(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-sm"
                  >
                    Submit Report
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
