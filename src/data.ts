import { User, Post, Comment, NeighborhoodEvent, LostFoundItem, HelpRequest, MarketplaceListing, SafetyAlert, Report, Notification, AuditLog } from './types';

export const SAMPLE_NEIGHBORHOODS = [
  "Maple Heights",
  "Oakridge Common",
  "Greenwood Valley",
  "Riverview Point",
  "Beacon Hill Local"
];

export const CURRENT_USER_PROFILES: { [key: string]: User } = {
  guest: {
    id: "user_guest",
    name: "Guest Resident",
    email: "guest@neighborhub.local",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    area: "Visitor / Unverified",
    bio: "Just looking around to see what's happening in Maple Heights.",
    skills: [],
    joinDate: "June 2026",
    trustScore: 0,
    badges: [],
    isVerified: false,
    postsCount: 0,
    filesCount: 0,
    role: "guest"
  },
  resident: {
    id: "user_resident",
    name: "Sarah Jenkins",
    email: "sarah.j@gmail.local",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    area: "Maple Heights (West Side)",
    bio: "Mom of two, dog lover, and amateur baker. Happy to help with tutoring or plant watering!",
    skills: ["Tutor", "Gardener", "Baking"],
    joinDate: "March 2024",
    trustScore: 85,
    badges: ["Friendly Neighbor", "Plant Sitter"],
    isVerified: true,
    postsCount: 14,
    filesCount: 3,
    role: "resident"
  },
  moderator: {
    id: "user_mod",
    name: "Marcus Vance",
    email: "marcus.v@neighborhub.local",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    area: "Maple Heights (North Block)",
    bio: "Community volunteer and HOA committee member. Keeping our neighborhood clean and safe.",
    skills: ["Electrician", "First Aid", "Organizer"],
    joinDate: "January 2023",
    trustScore: 98,
    badges: ["Mod Team", "Founding Neighbor", "Safety First"],
    isVerified: true,
    postsCount: 42,
    filesCount: 12,
    role: "moderator"
  },
  admin: {
    id: "user_admin",
    name: "Elena Rostova",
    email: "elena.admin@neighborhub.org",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    area: "Maple Heights (Central)",
    bio: "NeighborHub Lead Organizer. For official inquiries, HOA guidelines, or directory requests, please reach out.",
    skills: ["Law", "Planning", "Designer"],
    joinDate: "November 2022",
    trustScore: 100,
    badges: ["Admin", "Super Connector", "Local Guide"],
    isVerified: true,
    postsCount: 89,
    filesCount: 35,
    role: "admin"
  }
};

export const INITIAL_POSTS: Post[] = [
  {
    id: "post_1",
    title: "Official Announcement: Annual Summer Block Party Planning",
    description: "It's that time of the year! We are commencing plans for the Maple Heights Annual Summer Block Party. We need volunteers for food coordination, kids' games, and cleanup. We have attached the budget proposal from last year and the registration form for vendors. Please comment if you can join the first planning meeting this Thursday!",
    category: "announcement",
    authorId: "user_admin",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    authorRole: "admin",
    isAuthorVerified: true,
    timestamp: "2026-06-23T14:30:00-07:00",
    location: "Central Park Clubhouse",
    likes: 24,
    likedBy: ["user_resident", "user_mod"],
    commentsCount: 3,
    shares: 8,
    fileAttachments: [
      {
        id: "file_block_party_doc",
        name: "Summer_Block_Party_2025_Report.pdf",
        size: "1.4 MB",
        type: "document",
        url: "#",
        category: "Forms"
      },
      {
        id: "file_block_party_flyer",
        name: "Block_Party_Flyer_Draft.png",
        size: "2.1 MB",
        type: "image",
        url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
        category: "Event flyers"
      }
    ],
    isPinned: true
  },
  {
    id: "post_2",
    title: "Lost Golden Retriever near Elm Street Park - Please Keep Look Out!",
    description: "Our beloved 3-year-old Golden Retriever, 'Rusty', ran out of our backyard gate this morning around 8:00 AM. He is wearing a red collar with his ID tag and is super friendly but easily startled. If you spot him, please contact us immediately! I've uploaded a high-res photo and a PDF with contact details to print.",
    category: "alert",
    authorId: "user_resident",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    authorRole: "resident",
    isAuthorVerified: true,
    timestamp: "2026-06-24T01:15:00-07:00",
    location: "Elm Street Park & surroundings",
    likes: 45,
    likedBy: ["user_admin", "user_mod"],
    commentsCount: 5,
    shares: 19,
    fileAttachments: [
      {
        id: "file_rusty_pic",
        name: "Rusty_GoldenRetriever.png",
        size: "840 KB",
        type: "image",
        url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
        category: "Lost and found documents"
      },
      {
        id: "file_rusty_poster",
        name: "LOST_DOG_RUSTY_CONTACT_POSTER.pdf",
        size: "1.2 MB",
        type: "document",
        url: "#",
        category: "Lost and found documents"
      }
    ],
    urgency: "high"
  },
  {
    id: "post_3",
    title: "Looking for high school math tutor for my son (Grade 10)",
    description: "Hi neighbors! My son is struggling with 10th-grade geometry and trigonometry. Looking for an experienced local tutor who can meet in-person twice a week. Happy to pay competitive local rates. Please share recommendations! I've attached his current syllabus for reference.",
    category: "question",
    authorId: "user_resident",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    authorRole: "resident",
    isAuthorVerified: true,
    timestamp: "2026-06-23T09:00:00-07:00",
    location: "West Side Maple Heights",
    likes: 6,
    likedBy: ["user_admin"],
    commentsCount: 2,
    shares: 0,
    fileAttachments: [
      {
        id: "file_syllabus",
        name: "Grade_10_Geometry_Syllabus.pdf",
        size: "340 KB",
        type: "document",
        url: "#",
        category: "Guides"
      }
    ],
    urgency: "low"
  },
  {
    id: "post_4",
    title: "Recommended Local Garden Center? Plus free seedlings",
    description: "Hey everyone! Does anyone have recommendations for local nursery or garden centers that carry organic tomato starters? Also, I have over-seeded my heirloom zucchini starters and have about 8 healthy seedlings to give away to anyone interested in expanding their veggie patch. First come first served, pickup from my front porch!",
    category: "recommendation",
    authorId: "user_mod",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    authorRole: "moderator",
    isAuthorVerified: true,
    timestamp: "2026-06-22T16:45:00-07:00",
    location: "North Block (1240 Oak Drive)",
    likes: 12,
    likedBy: ["user_resident"],
    commentsCount: 4,
    shares: 1,
    fileAttachments: [
      {
        id: "file_zucchini",
        name: "zucchini_seedlings.png",
        size: "1.8 MB",
        type: "image",
        url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        category: "Rules"
      }
    ]
  },
  {
    id: "post_5",
    title: "HOA Guidelines Document Updated for 2026",
    description: "The neighborhood association has updated the community guidelines and rules regarding curbside parking, waste bin collection times, and holiday decoration rules. Please download the document below to review. Feel free to start a thread here if you have any questions before our next general meeting.",
    category: "file",
    authorId: "user_admin",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    authorRole: "admin",
    isAuthorVerified: true,
    timestamp: "2026-06-20T10:00:00-07:00",
    location: "Maple Heights HOA",
    likes: 15,
    likedBy: ["user_mod"],
    commentsCount: 8,
    shares: 4,
    fileAttachments: [
      {
        id: "file_hoa_guidelines",
        name: "HOA_Community_Guidelines_2026.pdf",
        size: "2.6 MB",
        type: "document",
        url: "#",
        category: "Rules"
      }
    ]
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comment_1",
    postId: "post_1",
    authorId: "user_resident",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    authorRole: "resident",
    timestamp: "2026-06-23T15:10:00-07:00",
    text: "I would love to help coordinate the kids' games! My kids had so much fun last year. I can bring some giant Jenga and ring toss sets. Put me down!"
  },
  {
    id: "comment_2",
    postId: "post_1",
    authorId: "user_mod",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    authorRole: "moderator",
    timestamp: "2026-06-23T16:00:00-07:00",
    text: "Count me in for setup and tear-down. I can also handle the electricity needs for the live band if we decide to have one this year."
  },
  {
    id: "comment_3",
    postId: "post_1",
    authorId: "user_admin",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    authorRole: "admin",
    timestamp: "2026-06-23T16:30:00-07:00",
    text: "Fantastic, thank you both! Let's review the draft flyer during the meeting this Thursday."
  },
  {
    id: "comment_4",
    postId: "post_2",
    authorId: "user_mod",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    authorRole: "moderator",
    timestamp: "2026-06-24T01:30:00-07:00",
    text: "Oh no! Sarah, I am heading out for my morning jog near the North Blocks. I'll make sure to take a loop around Elm Street Park and keep an eye out for Rusty."
  },
  {
    id: "comment_5",
    postId: "post_2",
    authorId: "user_admin",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    authorRole: "admin",
    timestamp: "2026-06-24T02:00:00-07:00",
    text: "I've pinned this alert to the top of our community feed and broadcasted a notification to verified neighbors. Let's find Rusty quickly!"
  }
];

export const INITIAL_EVENTS: NeighborhoodEvent[] = [
  {
    id: "event_1",
    title: "Summer Block Party General Planning Meeting",
    description: "Join us in the Central Park Clubhouse to draft the schedule, divide volunteer roles, and finalize vendor applications. Everyone is welcome to pitch in. We'll have pizza and drinks for attendees!",
    date: "2026-06-25",
    time: "06:30 PM",
    venue: "Central Park Clubhouse, Maple Heights",
    organizer: "Elena Rostova (Admin)",
    capacity: 35,
    rsvpCount: 14,
    rsvps: ["Sarah Jenkins", "Marcus Vance", "David Chen", "Emily Rose", "Thomas Miller"],
    category: "Meeting",
    attachedFiles: [
      {
        id: "file_ev_meeting_agenda",
        name: "Planning_Meeting_Agenda_June25.pdf",
        size: "240 KB",
        type: "document",
        url: "#",
        category: "Event flyers"
      }
    ]
  },
  {
    id: "event_2",
    title: "Neighborhood Park Cleanup & Gardening Drive",
    description: "Let's spruce up Greenwood Park! We'll be planting native wildflower seeds, repainting the benches, and cleaning up trash. Please bring gardening gloves and trash grabbers if you have them. Water and snacks provided by local store 'Green Harvest'.",
    date: "2026-06-27",
    time: "09:00 AM",
    venue: "Greenwood Park Picnic Area",
    organizer: "Marcus Vance (Moderator)",
    capacity: 50,
    rsvpCount: 28,
    rsvps: ["Sarah Jenkins", "Elena Rostova", "John Doe", "Jane Smith"],
    category: "Cleanup",
    attachedFiles: [
      {
        id: "file_ev_cleanup_poster",
        name: "Cleanup_Flyer_Greenwood_Park.png",
        size: "1.5 MB",
        type: "image",
        url: "https://images.unsplash.com/photo-1532413992378-f169ac26ffd0?auto=format&fit=crop&w=600&q=80",
        category: "Event flyers"
      }
    ]
  },
  {
    id: "event_3",
    title: "Youth Soccer Friendlies & BBQ",
    description: "A fun sporting afternoon for neighborhood kids aged 8-14. We'll organize friendly match-ups and fire up the grill afterwards. All residents are invited to cheer! Parents are requested to stay to watch.",
    date: "2026-07-04",
    time: "02:00 PM",
    venue: "Maple Heights Sports Fields",
    organizer: "Sarah Jenkins",
    capacity: 40,
    rsvpCount: 18,
    rsvps: ["Marcus Vance", "Billy Jenkins", "Lily Jenkins"],
    category: "Sports",
    attachedFiles: []
  },
  {
    id: "event_4",
    title: "Neighborhood Watch & Fire Safety Seminar",
    description: "A crucial session led by our local fire captain on home safety preparations for the summer heatwave, and a status update from the Neighborhood Watch committee regarding nighttime block safety.",
    date: "2026-07-10",
    time: "07:00 PM",
    venue: "Maple Heights Fire Hall Community Room",
    organizer: "Community Safety Group",
    capacity: 60,
    rsvpCount: 32,
    rsvps: ["Elena Rostova", "Marcus Vance"],
    category: "Safety",
    attachedFiles: [
      {
        id: "file_safety_brochure",
        name: "Wildfire_Home_Preparedness.pdf",
        size: "3.2 MB",
        type: "document",
        url: "#",
        category: "Safety documents"
      }
    ]
  }
];

export const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: "lf_1",
    type: "lost",
    title: "Lost Cat: White & Ginger tabby named 'Luna'",
    description: "Luna didn't come home for dinner last night. She is a small 2-year-old female tabby, very shy, microchipped. She has a faint white star patch on her chest. Might be hiding under porches or decks. Please let me know if you see her!",
    location: "Corner of Pine Ave & 4th Street",
    date: "2026-06-22",
    contactMethod: "Call Sarah Jenkins at 555-0199 or message via app",
    status: "Open",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    attachedFiles: []
  },
  {
    id: "lf_2",
    type: "found",
    title: "Found House Keys with leather strap",
    description: "Found a bunch of keys lying on the concrete pathway near the children's sandbox in Central Park. It has about 4 keys and a distinct tan leather strap embossed with a small tree emblem. Claim by identifying the brand or keys!",
    location: "Central Park Kids Sandbox",
    date: "2026-06-23",
    contactMethod: "Reply here or meet at 1240 Oak Drive",
    status: "Open",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80",
    attachedFiles: []
  }
];

export const INITIAL_HELP_REQUESTS: HelpRequest[] = [
  {
    id: "help_1",
    title: "Medicine pickup from local pharmacy for elderly neighbor",
    description: "I am currently at work and won't be back until late tonight. Our elderly neighbor, Mr. Henderson, needs his prescription refilled and picked up from Maple Pharmacy before it closes at 6:00 PM. I can reimburse anyone who helps immediately! Already paid over the phone.",
    urgency: "high",
    authorId: "user_resident",
    authorName: "Sarah Jenkins",
    status: "Open",
    volunteersCount: 0,
    volunteers: [],
    attachedFiles: []
  },
  {
    id: "help_2",
    title: "Need to borrow a heavy-duty power washer",
    description: "Hi folks! Looking to wash my driveway and deck this weekend. Instead of renting, does any neighbor have a heavy-duty power washer I could borrow for 1 day? Happy to return it fully fueled and cleaned, plus offer some home-baked cinnamon rolls as a thank you!",
    urgency: "low",
    authorId: "user_mod",
    authorName: "Marcus Vance",
    status: "Open",
    volunteersCount: 1,
    volunteers: ["Sarah Jenkins"],
    attachedFiles: []
  }
];

export const INITIAL_MARKETPLACE: MarketplaceListing[] = [
  {
    id: "market_1",
    title: "Solid Pine Wooden Dining Table & 4 Chairs",
    description: "Moving sale! We are downsizing and need to sell this sturdy, rustic pine dining table. It has minor surface scratches but is in beautiful structural condition. Comes with 4 matching solid wood chairs. Pickup only, must be gone by Sunday.",
    category: "furniture",
    price: 150,
    condition: "Good",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80",
    contact: "Message Sarah Jenkins or text 555-0199",
    authorName: "Sarah Jenkins",
    authorId: "user_resident",
    attachedFiles: []
  },
  {
    id: "market_2",
    title: "Box of Children's Picture Books (Free!)",
    description: "Clearing out my kids' bookshelf. Approx 20 books suitable for ages 3-7. Includes classics and some puzzle books. Excellent condition. Just want them to go to a family who will read them! Leaving on the porch under cover.",
    category: "free",
    price: "Free",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    contact: "Leave a comment here to reserve, pickup from North Block",
    authorName: "Marcus Vance",
    authorId: "user_mod",
    attachedFiles: []
  },
  {
    id: "market_3",
    title: "Dewalt Corded Jigsaw - barely used",
    description: "Great corded jigsaw, purchased for a single DIY cabinet project last year and has been sitting in the box since. Works perfectly, includes wood cutting blades. Let's find it a good home.",
    category: "tools",
    price: 45,
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    contact: "Contact Marcus Vance",
    authorName: "Marcus Vance",
    authorId: "user_mod",
    attachedFiles: []
  }
];

export const INITIAL_ALERTS: SafetyAlert[] = [
  {
    id: "alert_1",
    title: "Road Closure: Elm Street Intersection Construction",
    description: "Starting Monday, June 29, the city water department will be repairing mains under the Elm Street and Pine Ave intersection. Expect single-lane traffic and delays between 9:00 AM and 4:00 PM all week.",
    severity: "minor",
    type: "road",
    timestamp: "2026-06-23T11:00:00-07:00",
    isPinned: true,
    authorName: "City Transit Liaison"
  },
  {
    id: "alert_2",
    title: "Water Service Disruption - Scheduled Maintenance",
    description: "Attention North Block residents: water service will be temporarily shut off on Thursday, June 25 from 1:00 PM to 4:00 PM for fire hydrant pressure testing and pipe upgrades. Please store water in advance.",
    severity: "major",
    type: "water",
    timestamp: "2026-06-24T08:00:00-07:00",
    isPinned: false,
    authorName: "Elena Rostova (Admin)"
  },
  {
    id: "alert_3",
    title: "CRITICAL: Severe Heatwave Warning & Cooling Center Location",
    description: "A National Weather Service Heat Advisory is active starting tomorrow. Temperatures are projected to reach 104°F. A community cooling center will be operational at the Central Park Clubhouse from 10:00 AM to 8:00 PM daily. Air conditioning, ice water, and charging stations will be free.",
    severity: "critical",
    type: "weather",
    timestamp: "2026-06-24T09:15:00-07:00",
    isPinned: true,
    authorName: "Maple Heights Safety Committee"
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: "rep_1",
    itemId: "post_3",
    itemType: "post",
    itemTitle: "Looking for high school math tutor for my son (Grade 10)",
    reportedBy: "Anon Resident",
    reason: "Contains personal phone number on public board (accidental, user meant to put it in contact reply only)",
    timestamp: "2026-06-24T02:10:00-07:00",
    status: "pending"
  },
  {
    id: "rep_2",
    itemId: "comment_2",
    itemType: "comment",
    itemTitle: "Marcus Vance comment on Summer Block Party",
    reportedBy: "Skeptical Neighbour",
    reason: "Suspicious link (Resolved, link was just a Google Sheets budget draft, dismissed)",
    timestamp: "2026-06-23T18:00:00-07:00",
    status: "dismissed"
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    userId: "user_resident",
    text: "Marcus Vance replied to your alert 'Lost Golden Retriever near Elm Street Park'",
    type: "reply",
    timestamp: "2026-06-24T01:31:00-07:00",
    isRead: false
  },
  {
    id: "notif_2",
    userId: "user_resident",
    text: "URGENT: Severe Heatwave Warning - Cooling center active tomorrow",
    type: "alert",
    timestamp: "2026-06-24T09:16:00-07:00",
    isRead: false
  },
  {
    id: "notif_3",
    userId: "user_mod",
    text: "New content flag reported for Post: 'Looking for high school math tutor'",
    type: "admin",
    timestamp: "2026-06-24T02:11:00-07:00",
    isRead: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud_1",
    moderatorName: "Marcus Vance",
    action: "Approved post attachment verification",
    targetItem: "Summer_Block_Party_2025_Report.pdf",
    timestamp: "2026-06-23T15:00:00-07:00"
  },
  {
    id: "aud_2",
    moderatorName: "Elena Rostova",
    action: "Pinned critical safety alert",
    targetItem: "CRITICAL: Severe Heatwave Warning",
    timestamp: "2026-06-24T09:16:00-07:00"
  }
];
