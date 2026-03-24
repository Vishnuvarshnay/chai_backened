import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Film, Image } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadVideo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video file must be less than 100MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    document.querySelector('input[type="file"][accept*="video"]').value = '';
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    document.querySelector('input[type="file"][accept*="image"]').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile || !thumbnailFile) {
      toast.error('Please upload both video and thumbnail');
      return;
    }
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('videoFile', videoFile);
    submitFormData.append('thumbnail', thumbnailFile);

    try {
      const response = await axios.post('/api/v1/videos', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      toast.success('Video uploaded successfully!');
      navigate(`/watch/${response.data.data._id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Upload Video</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Upload */}
          <div className="bg-youtube-gray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Film className="mr-2" /> Video File
            </h2>
            
            {!videoPreview ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop your video here</p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <label className="cursor-pointer">
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block transition-colors">
                    Select Video
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 text-sm mt-4">
                  MP4, WebM, OGG (Max. 100MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={videoPreview}
                  className="w-full rounded-lg"
                  controls
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div className="bg-youtube-gray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Image className="mr-2" /> Thumbnail
            </h2>
            
            {!thumbnailPreview ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <Image size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop your thumbnail here</p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <label className="cursor-pointer">
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block transition-colors">
                    Select Thumbnail
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 text-sm mt-4">
                  JPG, PNG, GIF (Max. 5MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="bg-youtube-gray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Video Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter video title"
                />
                <p className="text-gray-500 text-sm mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={5000}
                  className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Tell viewers about your video"
                />
                <p className="text-gray-500 text-sm mt-1">
                  {formData.description.length}/5000 characters
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-youtube-gray rounded-lg p-6">
              <h3 className="text-white font-medium mb-2">Uploading video...</h3>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !videoFile || !thumbnailFile}
              className="px-6 py-3 bg-youtube-red hover:bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Upload Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
