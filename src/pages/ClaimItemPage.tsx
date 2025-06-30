import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Camera, X, CheckCircle, AlertTriangle, MapPin, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { formatDistanceToNow } from 'date-fns';

interface ClaimForm {
  claimDetails: string;
}

const ClaimItemPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [supportingImages, setSupportingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { posts, addClaim, addNotification } = useApp();
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ClaimForm>();

  // Find the post being claimed
  const post = posts.find(p => p.id === postId);

  // Mock supporting images for demo
  const mockSupportingImages = [
    'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg',
    'https://images.pexels.com/photos/1666069/pexels-photo-1666069.jpeg',
    'https://images.pexels.com/photos/1927673/pexels-photo-1927673.jpeg',
    'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg',
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
  ];

  // Redirect if post not found
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Item Not Found</h3>
            <p className="text-gray-600 mb-6">The item you're trying to claim could not be found.</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prevent claiming own items
  if (post.authorId === user?.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cannot Claim Own Item</h3>
            <p className="text-gray-600 mb-6">You cannot submit a claim for your own posted item.</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddSupportingImage = () => {
    if (supportingImages.length < 5) {
      const randomImage = mockSupportingImages[Math.floor(Math.random() * mockSupportingImages.length)];
      setSupportingImages([...supportingImages, randomImage]);
    }
  };

  const removeSupportingImage = (index: number) => {
    setSupportingImages(supportingImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ClaimForm) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create the claim with all required fields
      const newClaim = {
        postId: post.id,
        claimantId: user!.id,
        claimantName: user!.username,
        status: 'pending' as const,
        message: data.claimDetails,
        proofImages: supportingImages,
        // Hidden fields as specified
        createdAt: new Date(),
        adminReviewed: false
      };

      addClaim(newClaim);

      // Notify the post author
      addNotification({
        userId: post.authorId,
        type: 'claim',
        title: 'New Claim Received',
        message: `${user!.username} has submitted a claim for your ${post.type} item "${post.title}".`,
        isRead: false,
        relatedId: post.id
      });

      // Notify the claimant
      addNotification({
        userId: user!.id,
        type: 'claim',
        title: 'Claim Submitted Successfully',
        message: `Your claim for "${post.title}" has been submitted and is pending review.`,
        isRead: false,
        relatedId: post.id
      });

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Claim Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
              Your claim for "<strong>{post.title}</strong>" has been submitted and is now pending review. 
              The item owner will be notified and will review your claim details.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>What happens next?</strong><br />
                You'll receive a notification once the item owner reviews your claim. 
                If approved, you'll be able to coordinate the return through our messaging system.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/claims')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View My Claims
              </button>
              <button
                onClick={() => navigate('/home')}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Item</h1>
            <p className="text-gray-600">Submit a formal claim for this item by providing proof of ownership</p>
          </div>

          {/* Item Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
              <p className="text-sm text-gray-600 mt-1">Please confirm this is the item you want to claim</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Item Images */}
                <div>
                  {post.photos.length > 0 ? (
                    <div className="space-y-4">
                      <img
                        src={post.photos[0]}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                      {post.photos.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {post.photos.slice(1, 4).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`${post.title} ${index + 2}`}
                              className="w-full h-20 object-cover rounded-md border border-gray-200"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Item Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {post.type === 'lost' ? 'Lost Item' : 'Found Item'}
                      </span>
                      <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{post.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Posted by</p>
                        <p className="text-sm text-gray-600">{post.authorName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Posted</p>
                        <p className="text-sm text-gray-600">
                          {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{post.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Submission Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900">Provide Your Proof of Ownership</h2>
              <p className="text-sm text-blue-800 mt-1">
                Help us verify that this item belongs to you by providing specific details only the owner would know
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Claim Details - Main Required Field */}
              <div>
                <label htmlFor="claimDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Unique Features or Proof of Ownership *
                </label>
                <textarea
                  {...register('claimDetails', { 
                    required: 'Please provide details about why this item belongs to you',
                    minLength: { 
                      value: 50, 
                      message: 'Please provide more detailed information (at least 50 characters)' 
                    }
                  })}
                  rows={6}
                  placeholder="Provide specific details that only the true owner would know, such as:
• Unique marks, scratches, or wear patterns
• Contents of bags, wallets, or containers
• Serial numbers or model details
• Personal engravings or customizations
• Where and when you lost/found the item
• Any other identifying features not visible in photos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
                {errors.claimDetails && (
                  <p className="mt-2 text-sm text-red-600">{errors.claimDetails.message}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Be as specific as possible. This information will be used to verify your ownership claim.
                </p>
              </div>

              {/* Supporting Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Upload Supporting Images (Optional)
                </label>
                <div className="space-y-4">
                  {supportingImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {supportingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Supporting evidence ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeSupportingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {supportingImages.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddSupportingImage}
                      className="w-full flex items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                          Upload Supporting Images
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Add photos that help prove ownership ({supportingImages.length}/5)
                        </p>
                      </div>
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Upload photos such as receipts, original packaging, photos of you with the item, or other evidence of ownership.
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 mb-1">Important Notice</p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Please provide accurate and truthful information. False claims may result in account suspension. 
                      Your claim will be reviewed by the item owner and may require additional verification before approval.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
    </div>
  );
};

export default ClaimItemPage;