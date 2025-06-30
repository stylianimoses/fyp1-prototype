import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Camera, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';

interface ClaimModalProps {
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
}

interface ClaimForm {
  message: string;
  contactMethod: 'email' | 'phone' | 'both';
  proofDescription: string;
  additionalInfo: string;
}

const ClaimModal: React.FC<ClaimModalProps> = ({ post, onClose, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addClaim, addNotification, addChatMessage } = useApp();
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ClaimForm>();

  // Mock proof images for demo
  const mockProofImages = [
    'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg',
    'https://images.pexels.com/photos/1666069/pexels-photo-1666069.jpeg',
    'https://images.pexels.com/photos/1927673/pexels-photo-1927673.jpeg'
  ];

  const handleAddProofImage = () => {
    if (proofImages.length < 3) {
      const randomImage = mockProofImages[Math.floor(Math.random() * mockProofImages.length)];
      setProofImages([...proofImages, randomImage]);
    }
  };

  const removeProofImage = (index: number) => {
    setProofImages(proofImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ClaimForm) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const chatId = `claim-${post.id}-${user!.id}-${Date.now()}`;
    
    // Create the claim
    addClaim({
      postId: post.id,
      claimantId: user!.id,
      claimantName: user!.username,
      status: 'pending',
      message: data.message,
      proofImages,
      proofDescription: data.proofDescription,
      contactMethod: data.contactMethod,
      additionalInfo: data.additionalInfo,
      chatId
    });

    // Send initial chat message
    addChatMessage({
      chatId,
      senderId: user!.id,
      senderName: user!.username,
      message: `Hi! I believe this ${post.type === 'lost' ? 'lost' : 'found'} item belongs to me. ${data.message}`,
      isPreset: false
    });

    // Notify the post author
    addNotification({
      userId: post.authorId,
      type: 'claim',
      title: 'New Claim Received',
      message: `${user!.username} has claimed your ${post.type} item "${post.title}".`,
      isRead: false,
      relatedId: post.id
    });

    // Notify the claimant
    addNotification({
      userId: user!.id,
      type: 'claim',
      title: 'Claim Submitted',
      message: `Your claim for "${post.title}" has been submitted and is being reviewed.`,
      isRead: false,
      relatedId: post.id
    });

    setIsSubmitting(false);
    setStep('confirmation');
  };

  const handleClose = () => {
    if (step === 'confirmation') {
      onSuccess();
    }
    onClose();
  };

  if (step === 'confirmation') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Claim Submitted!</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your claim has been submitted successfully. The item owner will be notified and can review your claim details.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900 mb-1">Chat Available</p>
                  <p className="text-sm text-blue-700">
                    A chat has been created between you and the item owner. You'll be notified when they respond.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all transform hover:scale-[1.02]"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Claim This Item</h3>
            <p className="text-sm text-gray-600 mt-1">"{post.title}"</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Item Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                {post.photos[0] && (
                  <img
                    src={post.photos[0]}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{post.title}</h4>
                  <p className="text-sm text-gray-600">{post.category} • {post.location}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    post.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {post.type === 'lost' ? 'Lost Item' : 'Found Item'}
                  </span>
                </div>
              </div>
            </div>

            {/* Claim Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Why do you believe this item belongs to you? *
              </label>
              <textarea
                {...register('message', { 
                  required: 'Please explain why this item belongs to you',
                  minLength: { value: 20, message: 'Please provide more details (at least 20 characters)' }
                })}
                rows={4}
                placeholder="Describe specific details about the item that only the owner would know..."
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {/* Proof Description */}
            <div>
              <label htmlFor="proofDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Proof Details
              </label>
              <textarea
                {...register('proofDescription')}
                rows={3}
                placeholder="Describe any additional proof you have (receipts, serial numbers, unique markings, etc.)"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Proof Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Upload Proof Images (Optional)
              </label>
              <div className="space-y-4">
                {proofImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {proofImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeProofImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {proofImages.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddProofImage}
                    className="w-full flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-center">
                      <Camera className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">
                        Add proof image ({proofImages.length}/3)
                      </p>
                    </div>
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Upload images that prove ownership (receipts, photos with the item, etc.)
              </p>
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Contact Method *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    {...register('contactMethod', { required: 'Please select a contact method' })}
                    type="radio"
                    value="email"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email only</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('contactMethod', { required: 'Please select a contact method' })}
                    type="radio"
                    value="phone"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Phone only</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('contactMethod', { required: 'Please select a contact method' })}
                    type="radio"
                    value="both"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Both email and phone</span>
                </label>
              </div>
              {errors.contactMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.contactMethod.message}</p>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                {...register('additionalInfo')}
                rows={2}
                placeholder="Any other information that might help verify your claim..."
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">Important Notice</p>
                  <p className="text-sm text-amber-800">
                    Please provide accurate information. False claims may result in account suspension. 
                    The item owner will review your claim and may request additional verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting Claim...</span>
                  </div>
                ) : (
                  'Submit Claim'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;