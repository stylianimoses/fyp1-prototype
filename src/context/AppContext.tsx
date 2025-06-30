import React, { createContext, useContext, useState } from 'react';
import { Post, Claim, Notification, ChatMessage, Meeting } from '../types';

interface AppContextType {
  posts: Post[];
  claims: Claim[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  meetings: Meeting[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  addClaim: (claim: Omit<Claim, 'id' | 'updatedAt'>) => void;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  scheduleMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Lost iPhone 14 Pro',
      category: 'Electronics',
      type: 'lost',
      description: 'Black iPhone 14 Pro with blue case. Lost near Central Park entrance.',
      privateDetails: 'Has a small scratch on the back, serial number starts with F2L...',
      location: 'Central Park, New York',
      photos: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'],
      authorId: '1',
      authorName: 'John Doe',
      status: 'active',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      likes: 12,
      reports: 0
    },
    {
      id: '2',
      title: 'Found Car Keys',
      category: 'Keys',
      type: 'found',
      description: 'Found Honda car keys with blue keychain near downtown coffee shop.',
      privateDetails: 'Keys have a Honda logo and two additional keys, keychain says "Best Dad"',
      location: 'Downtown Coffee Shop, Main Street',
      photos: ['https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg'],
      authorId: '2',
      authorName: 'Jane Smith',
      status: 'active',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
      likes: 8,
      reports: 0
    }
  ]);

  const [claims, setClaims] = useState<Claim[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates, updatedAt: new Date() } : post
    ));
  };

  const addClaim = (claim: Omit<Claim, 'id' | 'updatedAt'>) => {
    const newClaim: Claim = {
      ...claim,
      id: Date.now().toString(),
      updatedAt: new Date()
    };
    setClaims(prev => [newClaim, ...prev]);
  };

  const updateClaim = (id: string, updates: Partial<Claim>) => {
    setClaims(prev => prev.map(claim => 
      claim.id === id ? { ...claim, ...updates, updatedAt: new Date() } : claim
    ));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const scheduleMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: Date.now().toString()
    };
    setMeetings(prev => [...prev, newMeeting]);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === id ? { ...meeting, ...updates } : meeting
    ));
  };

  return (
    <AppContext.Provider value={{
      posts,
      claims,
      notifications,
      chatMessages,
      meetings,
      addPost,
      updatePost,
      addClaim,
      updateClaim,
      addNotification,
      markNotificationRead,
      addChatMessage,
      scheduleMeeting,
      updateMeeting
    }}>
      {children}
    </AppContext.Provider>
  );
};