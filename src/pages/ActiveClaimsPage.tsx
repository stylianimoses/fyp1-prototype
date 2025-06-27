import React, { useState } from 'react';
import { MessageCircle, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import ChatWindow from '../components/ChatWindow';
import { format } from 'date-fns';

const ActiveClaimsPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { posts, claims, meetings } = useApp();
  const { user } = useAuth();

  // Mock active claims for demo
  const activeClaims = [
    {
      id: '1',
      postId: '1',
      post: posts.find(p => p.id === '1'),
      status: 'returning' as const,
      claimantName: 'Alice Johnson',
      message: 'I believe this is my iPhone. It has a scratch on the back corner.',
      createdAt: new Date(Date.now() - 86400000),
      chatId: 'chat-1'
    },
    {
      id: '2',
      postId: '2',
      post: posts.find(p => p.id === '2'),
      status: 'approved' as const,
      claimantName: 'Bob Smith',
      message: 'These are definitely my car keys. The keychain says "Best Dad".',
      createdAt: new Date(Date.now() - 172800000),
      chatId: 'chat-2'
    }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    returning: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    returning: MessageCircle,
    completed: CheckCircle,
    rejected: Clock
  };

  const getScheduledMeeting = (chatId: string) => {
    return meetings.find(m => m.chatId === chatId && m.status === 'scheduled');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Claims</h1>
          <p className="text-gray-600">Track your active claims and communications</p>
        </div>

        {activeClaims.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Claims</h3>
            <p className="text-gray-600">You don't have any active claims at the moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeClaims.map((claim) => {
              const StatusIcon = statusIcons[claim.status];
              const scheduledMeeting = getScheduledMeeting(claim.chatId);
              
              return (
                <div key={claim.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {claim.post?.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[claim.status]}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Claimed by: <span className="font-medium">{claim.claimantName}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(claim.createdAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                      
                      {claim.post?.photos[0] && (
                        <img
                          src={claim.post.photos[0]}
                          alt={claim.post.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Claim Message */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700">"{claim.message}"</p>
                    </div>

                    {/* Scheduled Meeting */}
                    {scheduledMeeting && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-medium text-blue-900">Scheduled Meeting</p>
                        </div>
                        <div className="text-sm text-blue-800 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>{format(scheduledMeeting.date, 'PPP p')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span>{scheduledMeeting.location}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        Status: <span className="font-medium">{claim.status}</span>
                      </div>
                      
                      {(claim.status === 'approved' || claim.status === 'returning') && (
                        <button
                          onClick={() => setActiveChat(claim.chatId)}
                          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Open Chat</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {activeChat && (
        <ChatWindow
          chatId={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default ActiveClaimsPage;