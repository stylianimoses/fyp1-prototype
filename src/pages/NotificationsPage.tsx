import React from 'react';
import { Bell, Check, MessageCircle, HandHeart, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead } = useApp();
  const { user } = useAuth();

  const userNotifications = notifications.filter(n => n.userId === user!.id);

  const typeIcons = {
    claim: HandHeart,
    message: MessageCircle,
    meeting: Calendar,
    status_update: AlertCircle
  };

  const typeColors = {
    claim: 'text-green-600 bg-green-100',
    message: 'text-blue-600 bg-blue-100',
    meeting: 'text-purple-600 bg-purple-100',
    status_update: 'text-orange-600 bg-orange-100'
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllAsRead = () => {
    userNotifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationRead(notification.id);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your lost and found activities</p>
          </div>
          
          {userNotifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Check className="h-4 w-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        {userNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up! No new notifications to show.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {userNotifications.map((notification) => {
              const TypeIcon = typeIcons[notification.type];
              const typeColorClass = typeColors[notification.type];
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${typeColorClass}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;