export type UserRole = 'guest' | 'resident' | 'moderator' | 'admin';

export interface FileAttachment {
  id: string;
  name: string;
  size: string; // e.g., '1.2 MB'
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  area: string;
  bio: string;
  skills: string[];
  joinDate: string;
  trustScore: number; // 0 to 100
  badges: string[];
  isVerified: boolean;
  postsCount: number;
  filesCount: number;
  role: UserRole;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  category: 'announcement' | 'discussion' | 'question' | 'alert' | 'recommendation' | 'offer' | 'request' | 'file';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  isAuthorVerified: boolean;
  timestamp: string;
  location: string;
  likes: number;
  likedBy: string[]; // userIds
  commentsCount: number;
  shares: number;
  fileAttachments: FileAttachment[];
  urgency?: 'low' | 'medium' | 'high';
  isPinned?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  timestamp: string;
  text: string;
  attachment?: FileAttachment;
}

export interface NeighborhoodEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  capacity: number;
  rsvpCount: number;
  rsvps: string[]; // user names or user IDs
  category: 'Meeting' | 'Cleanup' | 'Sports' | 'Festival' | 'Workshop' | 'Safety';
  attachedFiles: FileAttachment[];
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  contactMethod: string;
  status: 'Open' | 'Recovered' | 'Claimed';
  image?: string;
  attachedFiles: FileAttachment[];
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  authorId: string;
  authorName: string;
  status: 'Open' | 'Resolved';
  volunteersCount: number;
  volunteers: string[]; // volunteer names
  attachedFiles: FileAttachment[];
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: 'furniture' | 'books' | 'electronics' | 'baby' | 'home' | 'tools' | 'free' | 'other';
  price: number | 'Free';
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  image?: string;
  contact: string;
  authorName: string;
  authorId: string;
  attachedFiles: FileAttachment[];
}

export interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  type: 'road' | 'water' | 'power' | 'weather' | 'pet' | 'emergency';
  timestamp: string;
  isPinned: boolean;
  authorName: string;
}

export interface Report {
  id: string;
  itemId: string; // post ID or comment ID
  itemType: 'post' | 'comment' | 'lostfound' | 'help' | 'listing';
  itemTitle: string;
  reportedBy: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  type: 'reply' | 'alert' | 'event' | 'help' | 'lost' | 'admin' | 'upload';
  timestamp: string;
  isRead: boolean;
}

export interface AuditLog {
  id: string;
  moderatorName: string;
  action: string;
  targetItem: string;
  timestamp: string;
}
