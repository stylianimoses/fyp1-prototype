import React, { useState } from 'react';
import { Search, Edit, Archive, Eye, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { formatDistanceToNow } from 'date-fns';

const MyPostsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');
  const { posts, updatePost } = useApp();
  const { user } = useAuth();

  const myPosts = posts.filter(post => post.authorId === user!.id);
  const filteredPosts = myPosts.filter(post => {
    if (filter === 'active') return post.status !== 'archived' && post.status !== 'returned';
    if (filter === 'archived') return post.status === 'archived' || post.status === 'returned';
    return true;
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    claimed: 'bg-yellow-100 text-yellow-800',
    returning: 'bg-blue-100 text-blue-800',
    returned: 'bg-gray-100 text-gray-800',
    archived: 'bg-gray-100 text-gray-600'
  };

  const handleArchive = (postId: string) => {
    updatePost(postId, { status: 'archived' });
  };

  const handleMarkReturned = (postId: string) => {
    updatePost(postId, { status: 'returned' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
          <p className="text-gray-600">Manage all your lost and found posts</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex space-x-4">
            {['all', 'active', 'archived'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                <span className="ml-2 text-xs">
                  ({filterOption === 'all' ? myPosts.length : 
                    filterOption === 'active' ? myPosts.filter(p => p.status !== 'archived' && p.status !== 'returned').length :
                    myPosts.filter(p => p.status === 'archived' || p.status === 'returned').length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Found</h3>
            <p className="text-gray-600">
              {filter === 'active' 
                ? "You don't have any active posts" 
                : filter === 'archived'
                ? "You don't have any archived posts"
                : "You haven't created any posts yet"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {post.type === 'lost' ? 'Lost' : 'Found'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Category</p>
                          <p className="font-medium">{post.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Location</p>
                          <p className="font-medium">{post.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Posted</p>
                          <p className="font-medium">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{post.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>❤️ {post.likes} likes</span>
                        <span>🚩 {post.reports} reports</span>
                      </div>
                    </div>

                    {post.photos[0] && (
                      <img
                        src={post.photos[0]}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {post.status === 'returning' && (
                        <button
                          onClick={() => handleMarkReturned(post.id)}
                          className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
                        >
                          <span>Mark as Returned</span>
                        </button>
                      )}
                      
                      {(post.status === 'active' || post.status === 'claimed') && (
                        <button
                          onClick={() => handleArchive(post.id)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-orange-600 transition-colors text-sm"
                        >
                          <Archive className="h-4 w-4" />
                          <span>Archive</span>
                        </button>
                      )}
                      
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors text-sm">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;