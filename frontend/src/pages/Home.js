import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Play, Eye, Clock, User } from 'lucide-react';
import axios from 'axios';
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
    </div>
  );
};

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      console.log('Fetching videos with params:', params.toString());
      const response = await axios.get(`/api/v1/videos?${params}`);
      console.log('Videos API response:', response.data);
      
      // Handle different response structures (paginated vs direct)
      let videosData = [];
      if (response.data.data) {
        if (response.data.data.docs) {
          // Paginated response
          videosData = response.data.data.docs;
        } else {
          // Direct array response
          videosData = response.data.data;
        }
      }
      
      console.log('Setting videos:', videosData);
      setVideos(Array.isArray(videosData) ? videosData : []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setVideos([]); // Set to empty array on error
    } finally {
      setLoading(false);
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
        {searchQuery && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              Search results for "{searchQuery}"
            </h1>
            <p className="text-gray-400 mt-1">
              {Array.isArray(videos) ? videos.length : 0} {Array.isArray(videos) && videos.length === 1 ? 'video' : 'videos'} found
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(videos) && videos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="group cursor-pointer"
            >
              <VideoPreview video={video} />
              <div className="mt-3 flex space-x-3">
                <img
                  src={video.owner?.avatar || '/default-avatar.png'}
                  alt={video.owner?.username}
                  className="w-9 h-9 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {video.owner?.username}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                    <span>{formatViews(video.views)}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {!loading && (!Array.isArray(videos) || videos.length === 0) && (
          <div className="text-center py-12">
            <Play size={48} className="mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No videos found' : 'No videos available'}
            </h2>
            <p className="text-gray-400">
              {searchQuery 
                ? 'Try searching with different keywords' 
                : 'Be the first to upload a video!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
