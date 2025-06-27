export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  accountType: 'user' | 'admin';
  isVerified: boolean;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  type: 'lost' | 'found';
  description: string;
  privateDetails: string;
  location: string;
  photos: string[];
  authorId: string;
  authorName: string;
  status: 'active' | 'claimed' | 'returning' | 'returned' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  reports: number;
  claimId?: string;
}

export interface Claim {
  id: string;
  postId: string;
  claimantId: string;
  claimantName: string;
  status: 'pending' | 'approved' | 'returning' | 'completed' | 'rejected';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isPreset?: boolean;
}

export interface Meeting {
  id: string;
  chatId: string;
  scheduledBy: string;
  date: Date;
  location: string;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'claim' | 'message' | 'meeting' | 'status_update';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string;
}