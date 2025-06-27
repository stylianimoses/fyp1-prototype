import React, { useState } from 'react';
import { Users, FileText, Flag, Settings, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'users' | 'reports'>('posts');
  const { posts, updatePost, addNotification } = useApp();

  // Mock data for admin features
  const pendingPosts = posts.filter(post => post.status === 'active');
  const reportedPosts = posts.filter(post => post.reports > 0);
  const mockUsers = [
    { id: '1', username: 'johndoe', email: 'john@example.com', status: 'active', joinDate: new Date(Date.now() - 2592000000) },
    { id: '2', username: 'janedoe', email: 'jane@example.com', status: 'active', joinDate: new Date(Date.now() - 1296000000) },
    { id: '3', username: 'bobsmith', email: 'bob@example.com', status: 'suspended', joinDate: new Date(Date.now() - 864000000) }
  ];

  const handleApprovePost = (postId: string) => {
    // In a real app, this would mark the post as approved
    addNotification({
      userId: posts.find(p => p.id === postId)?.authorId || '1',
      type: 'status_update',
      title: 'Post Approved',
      message: 'Your post has been reviewed and approved by our team.',
      isRead: false,
      relatedId: postId
    });
  };

  const handleRejectPost = (postId: string) => {
    updatePost(postId, { status: 'archived' });
    addNotification({
      userId: posts.find(p => p.id === postId)?.authorId || '1',
      type: 'status_update',
      title: 'Post Rejected',
      message: 'Your post has been reviewed and requires modifications.',
      isRead: false,
      relatedId: postId
    });
  };

  const tabs = [
    { id: 'posts', label: 'Post Reviews', icon: FileText, count: pendingPosts.length },
    { id: 'users', label: 'User Management', icon: Users, count: mockUsers.length },
    { id: 'reports', label: 'Reports', icon: Flag, count: reportedPosts.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage content and users across the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsers.filter(u => u.status === 'active').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPosts.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reportedPosts.length}</p>
              </div>
              <Flag className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Post Reviews Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {pendingPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Posts</h3>
                    <p className="text-gray-600">All posts have been reviewed</p>
                  </div>
                ) : (
                  pendingPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {post.type === 'lost' ? 'Lost' : 'Found'}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                              {post.category}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Author</p>
                              <p className="font-medium">{post.authorName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Posted</p>
                              <p className="font-medium">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-medium">{post.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Engagement</p>
                              <p className="font-medium">❤️ {post.likes} | 🚩 {post.reports}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Public Description</p>
                            <p className="text-gray-700">{post.description}</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Private Details (Admin Only)</p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-gray-700">{post.privateDetails}</p>
                            </div>
                          </div>
                        </div>

                        {post.photos[0] && (
                          <img
                            src={post.photos[0]}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleRejectPost(post.id)}
                            className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleApprovePost(post.id)}
                            className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          Joined {formatDistanceToNow(user.joinDate, { addSuffix: true })}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                          View Profile
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {reportedPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports</h3>
                    <p className="text-gray-600">No posts have been reported</p>
                  </div>
                ) : (
                  reportedPosts.map((post) => (
                    <div key={post.id} className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                          <p className="text-gray-600 mb-2">By {post.authorName}</p>
                          <p className="text-sm text-red-600">🚩 {post.reports} reports</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                            Review
                          </button>
                          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;