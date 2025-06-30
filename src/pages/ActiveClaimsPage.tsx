import React, { useState } from 'react';
import { MessageCircle, Calendar, MapPin, CheckCircle, Clock, Eye, User, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import ChatWindow from '../components/ChatWindow';
import { format } from 'date-fns';

const ActiveClaimsPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const { posts, claims, meetings } = useApp();
  const { user } = useAuth();

  // Get user's claims (both as claimant and as post owner)
  const userClaims = claims.filter(claim => 
    claim.claimantId === user!.id || 
    posts.find(p => p.id === claim.postId)?.authorId === user!.id
  );

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

  const getClaimDetails = (claim: any) => {
    const post = posts.find(p => p.id === claim.postId);
    const isOwner = post?.authorId === user!.id;
    return { post, isOwner };
  };

  const ClaimDetailsModal = ({ claim, onClose }: { claim: any; onClose: () => void }) => {
    const { post } = getClaimDetails(claim);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Claim Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
            {/* Item Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                {post?.photos[0] && (
                  <img
                    src={post.photos[0]}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{post?.title}</h4>
                  <p className="text-sm text-gray-600">{post?.category} • {post?.location}</p>
                </div>
              </div>
            </div>

            {/* Claimant Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Claimant Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{claim.claimantName}</p>
                <p className="text-sm text-gray-600">
                  Preferred contact: {claim.contactMethod || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Claim Message */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Claim Explanation</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{claim.message}</p>
              </div>
            </div>

            {/* Proof Description */}
            {claim.proofDescription && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Additional Proof Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{claim.proofDescription}</p>
                </div>
              </div>
            )}

            {/* Proof Images */}
            {claim.proofImages && claim.proofImages.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Proof Images
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {claim.proofImages.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Proof ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-300"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {claim.additionalInfo && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Additional Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{claim.additionalInfo}</p>
                </div>
              </div>
            )}

            {/* Claim Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Status</h4>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[claim.status]}`}>
                  {React.createElement(statusIcons[claim.status], { className: "h-4 w-4 mr-1" })}
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  Submitted {format(claim.createdAt, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Claims</h1>
          <p className="text-gray-600">Track your active claims and communications</p>
        </div>

        {userClaims.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Claims</h3>
            <p className="text-gray-600">You don't have any active claims at the moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userClaims.map((claim) => {
              const { post, isOwner } = getClaimDetails(claim);
              const StatusIcon = statusIcons[claim.status];
              const scheduledMeeting = claim.chatId ? getScheduledMeeting(claim.chatId) : null;
              
              return (
                <div key={claim.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {post?.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[claim.status]}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                          {isOwner && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                              Your Item
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {isOwner ? `Claimed by: ${claim.claimantName}` : `Your claim for this item`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(claim.createdAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                      
                      {post?.photos[0] && (
                        <img
                          src={post.photos[0]}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Claim Message Preview */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 line-clamp-2">"{claim.message}"</p>
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
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setSelectedClaim(claim.id)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                        <div className="text-sm text-gray-600">
                          Status: <span className="font-medium">{claim.status}</span>
                        </div>
                      </div>
                      
                      {(claim.status === 'approved' || claim.status === 'returning') && claim.chatId && (
                        <button
                          onClick={() => setActiveChat(claim.chatId!)}
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

      {/* Claim Details Modal */}
      {selectedClaim && (
        <ClaimDetailsModal
          claim={userClaims.find(c => c.id === selectedClaim)}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </div>
  );
};

export default ActiveClaimsPage;