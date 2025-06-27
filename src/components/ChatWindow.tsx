import React, { useState } from 'react';
import { Send, Plus, Calendar, MapPin, Clock, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface ChatWindowProps {
  chatId: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, onClose }) => {
  const [message, setMessage] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  
  const { chatMessages, addChatMessage, scheduleMeeting } = useApp();
  const { user } = useAuth();

  const presetMessages = [
    "I'm available to meet today",
    "Can you confirm the item details?",
    "Let's meet at a public place",
    "I can meet at 2 PM",
    "Is this still available?",
    "Thank you for finding my item!",
    "Can you provide more details?",
    "I'll be there in 10 minutes"
  ];

  const messages = chatMessages.filter(msg => msg.chatId === chatId);

  const sendMessage = (text: string, isPreset = false) => {
    if (!text.trim()) return;

    addChatMessage({
      chatId,
      senderId: user!.id,
      senderName: user!.username,
      message: text,
      isPreset
    });

    setMessage('');
  };

  const scheduleMeetingHandler = () => {
    if (!meetingDate || !meetingTime || !meetingLocation) return;

    const meetingDateTime = new Date(`${meetingDate}T${meetingTime}`);
    
    scheduleMeeting({
      chatId,
      scheduledBy: user!.id,
      date: meetingDateTime,
      location: meetingLocation,
      status: 'scheduled'
    });

    // Send a message about the meeting
    sendMessage(
      `📅 Meeting scheduled for ${format(meetingDateTime, 'PPP')} at ${format(meetingDateTime, 'p')} at ${meetingLocation}`,
      true
    );

    setShowMeetingModal(false);
    setMeetingDate('');
    setMeetingTime('');
    setMeetingLocation('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === user!.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === user!.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } ${msg.isPreset ? 'border-l-4 border-blue-300' : ''}`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {format(msg.timestamp, 'HH:mm')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preset Messages */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-1 mb-2">
            {presetMessages.slice(0, 4).map((preset, index) => (
              <button
                key={index}
                onClick={() => sendMessage(preset, true)}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMeetingModal(true)}
              className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(message)}
            />
            <button
              onClick={() => sendMessage(message)}
              className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Schedule Meeting</h4>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  placeholder="Meeting location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={scheduleMeetingHandler}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;