import React from 'react';
import { Heart, Flag, HandHeart, MapPin, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onClaim?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onReport, onClaim }) => {
  const navigate = useNavigate();
  
  const handleLike = () => onLike?.(post.id);
  const handleReport = () => onReport?.(post.id);
  const handleClaim = () => {
    // Navigate to dedicated claim page instead of using modal
    navigate(`/claim/${post.id}`);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    claimed: 'bg-yellow-100 text-yellow-800',
    returning: 'bg-blue-100 text-blue-800',
    returned: 'bg-gray-100 text-gray-800',
    archived: 'bg-gray-100 text-gray-600'
  };

  const typeColors = {
    lost: 'bg-red-100 text-red-800',
    found: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image */}
      {post.photos.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.photos[0]}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[post.type]}`}>
              {post.type === 'lost' ? 'Lost' : 'Found'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
            {post.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">{post.description}</p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{post.location}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button
              onClick={handleReport}
              className="flex items-center space-x-1 text-gray-600 hover:text-yellow-500 transition-colors"
            >
              <Flag className="h-4 w-4" />
              <span className="text-sm">Report</span>
            </button>
          </div>
          
          {post.status === 'active' && (
            <button
              onClick={handleClaim}
              className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <HandHeart className="h-4 w-4" />
              <span>Claim</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;