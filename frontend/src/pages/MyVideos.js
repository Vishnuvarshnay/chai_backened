import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, Clock, Edit, Trash2, Video } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VideoPreview = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <div 
      className="relative aspect-video bg-black rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && video.videoFile && !videoError ? (
        <video
          src={video.videoFile}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        />
      ) : (
        <img
          src={video.thumbnail || '/placeholder-thumbnail.svg'}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-thumbnail.svg';
          }}
        />
      )}
      
      {/* Always show the play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-50 rounded-full p-3">
          <Play size={24} className="text-white" />
        </div>
      </div>
      
      {/* Duration badge */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
        {video.duration ? 
          `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 
          '0:00'
        }
      </div>
      
      {/* Video file indicator */}
      {video.videoFile ? (
        <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <Video size={12} />
          <span>Video</span>
        </div>
      ) : (
        <div className="absolute top-2 left-2 bg-red-900 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          No Video File
        </div>
      )}
    </div>
  );
};

const MyVideos = () => {
  const { user, isAuthenticated } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyVideos();
    }
  }, [isAuthenticated, user]);

  const fetchMyVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/videos?userId=${user._id}`);
      console.log('My videos response:', response.data);
      
      let videosData = [];
      if (response.data.data) {
        if (response.data.data.docs) {
          videosData = response.data.data.docs;
        } else {
          videosData = response.data.data;
        }
      }
      
      // Log video details for debugging
      console.log(`Found ${videosData.length} videos for user ${user.username}`);
      videosData.forEach((video, index) => {
        console.log(`Video ${index + 1}: "${video.title}" - Video File: ${video.videoFile ? '✅' : '❌'}`);
      });
      
      setVideos(Array.isArray(videosData) ? videosData : []);
    } catch (error) {
      console.error('Failed to fetch my videos:', error);
      toast.error('Failed to load your videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/videos/${videoId}`);
      setVideos(videos.filter(video => video._id !== videoId));
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Failed to delete video:', error);
      toast.error('Failed to delete video');
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
          <p className="text-gray-400 mb-4">You need to be logged in to view your videos</p>
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Videos</h1>
          <Link
            to="/upload"
            className="bg-youtube-red hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Upload New Video
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <Play size={48} className="mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No videos uploaded yet</h2>
            <p className="text-gray-400 mb-6">Start by uploading your first video</p>
            <Link
              to="/upload"
              className="bg-youtube-red hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
            >
              Upload Video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="group cursor-pointer">
                <Link to={`/watch/${video._id}`}>
                  <VideoPreview video={video} />
                </Link>
                <div className="mt-3">
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                    <Link to={`/watch/${video._id}`}>
                      {video.title}
                    </Link>
                  </h3>
                  
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{formatViews(video.views)}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(video.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/edit-video/${video._id}`}
                        className="text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 size={16} />
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

export default MyVideos;
