import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Camera, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';

interface CreatePostForm {
  title: string;
  type: 'lost' | 'found';
  category: string;
  description: string;
  privateDetails: string;
  location: string;
}

const CreatePostPage: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPost, addNotification } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<CreatePostForm>();

  const categories = ['Electronics', 'Keys', 'Jewelry', 'Clothing', 'Documents', 'Other'];

  // Mock photo URLs for demo
  const mockPhotos = [
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg',
    'https://images.pexels.com/photos/1927673/pexels-photo-1927673.jpeg',
    'https://images.pexels.com/photos/1666069/pexels-photo-1666069.jpeg',
    'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg'
  ];

  const handlePhotoUpload = () => {
    if (photos.length < 3) {
      const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
      setPhotos([...photos, randomPhoto]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreatePostForm) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    addPost({
      ...data,
      photos,
      authorId: user!.id,
      authorName: user!.username,
      status: 'active',
      likes: 0,
      reports: 0
    });

    addNotification({
      userId: user!.id,
      type: 'status_update',
      title: 'Post Created',
      message: `Your ${data.type} item post "${data.title}" has been created successfully.`,
      isRead: false
    });

    setIsSubmitting(false);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Help others find their lost items or report found items</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Item Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Item Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    {...register('type', { required: 'Please select item type' })}
                    type="radio"
                    value="lost"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Lost Item</p>
                    <p className="text-sm text-gray-600">I lost something</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    {...register('type', { required: 'Please select item type' })}
                    type="radio"
                    value="found"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Found Item</p>
                    <p className="text-sm text-gray-600">I found something</p>
                  </div>
                </label>
              </div>
              {errors.type && (
                <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Title and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  placeholder="e.g., iPhone 14 Pro, Blue Wallet"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('location', { required: 'Location is required' })}
                  type="text"
                  placeholder="Where was the item lost/found?"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Photos (Up to 3)
              </label>
              <div className="space-y-4">
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {photos.length < 3 && (
                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    className="w-full flex items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">
                        Click to add a photo ({photos.length}/3)
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Public Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                placeholder="Describe the item's appearance, brand, color, and any distinctive features..."
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Private Details */}
            <div>
              <label htmlFor="privateDetails" className="block text-sm font-medium text-gray-700 mb-2">
                Private Verification Details *
              </label>
              <textarea
                {...register('privateDetails', { required: 'Private details are required' })}
                rows={3}
                placeholder="Add details only the true owner would know (serial numbers, contents, personal engravings, etc.)"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                These details will only be visible to administrators for verification purposes
              </p>
              {errors.privateDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.privateDetails.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? 'Creating Post...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;