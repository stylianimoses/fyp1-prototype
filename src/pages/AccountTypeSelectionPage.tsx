import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Search, ArrowRight } from 'lucide-react';

const AccountTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAccountTypeSelection = (type: 'user' | 'admin') => {
    // Store the selected account type in localStorage for use in signup
    localStorage.setItem('selectedAccountType', type);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-3xl mb-6 shadow-lg">
            <Search className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LostFound</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Help reunite lost items with their owners. Choose your account type to get started.
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Account */}
          <div 
            onClick={() => handleAccountTypeSelection('user')}
            className="group bg-white rounded-2xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-blue-200"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">User Account</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Perfect for individuals who want to report lost items or help return found items to their owners.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Post lost and found items</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Chat with other users</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Manage your claims</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Schedule meetups</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                <span>Choose User Account</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Admin Account */}
          <div 
            onClick={() => handleAccountTypeSelection('admin')}
            className="group bg-white rounded-2xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-purple-200"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrator Account</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                For moderators and administrators who manage content, verify claims, and oversee platform operations.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span>Review and approve posts</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span>Manage user accounts</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span>Handle reports and disputes</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span>Access analytics dashboard</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                <span>Choose Admin Account</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            You can always change your account type later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelectionPage;