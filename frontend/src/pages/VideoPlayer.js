import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Share2, Download, Eye, Clock, User, MessageSquare } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/LikeButton';
import SubscribeButton from '../components/SubscribeButton';
import Comments from '../components/Comments';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);

  const handleShare = async () => {
    const videoUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title || 'Check out this video',
          text: video?.description || 'Watch this amazing video',
          url: videoUrl
        });
        toast.success('Video shared successfully!');
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(videoUrl);
        toast.success('Video link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
        toast.error('Failed to share video');
      }
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/videos/${videoId}`);
      const videoData = response.data.data;
      setVideo(videoData);
      
      // Increment video views
      try {
        await axios.post(`/api/v1/videos/views/${videoId}`);
        console.log('Video views incremented');
      } catch (viewError) {
        console.log('Failed to increment views:', viewError);
        // Don't show error to user, just log it
      }
    } catch (error) {
      console.error('Failed to fetch video:', error);
      toast.error('Failed to load video');
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

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Video not found</h2>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="relative">
              <ReactPlayer
                url={video.videoFile}
                width="100%"
                height="100%"
                controls
                playing={false}
                volume={1}
                muted={false}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                      autoPlay: false,
                      muted: false
                    }
                  }
                }}
                onReady={() => console.log('Video player ready')}
                onError={(error) => console.error('Video player error:', error)}
              />
            </div>
            
            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye size={20} />
                    <span>{formatViews(video.views)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={20} />
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <LikeButton 
                    videoId={videoId}
                    initialLikes={video.likes?.length || 0}
                    initialUserLike={isAuthenticated && video.likes?.find(
                      like => like.toString() === user._id
                    ) ? 'like' : null}
                  />
                  
                  <button 
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-youtube-gray text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 bg-youtube-gray text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <MessageSquare size={20} />
                    <span>Comments</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-youtube-gray rounded-lg p-4">
                <p className="text-white whitespace-pre-wrap">{video.description}</p>
              </div>
            </div>
          </div>
          
          {/* Channel Info and Related Videos */}
          <div>
            {/* Channel Info */}
            <div className="bg-youtube-gray rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={video.owner?.avatar || '/default-avatar.png'}
                  alt={video.owner?.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <Link
                    to={`/channel/${video.owner?.username}`}
                    className="text-white font-medium hover:text-blue-400 transition-colors"
                  >
                    {video.owner?.username}
                  </Link>
                  <p className="text-gray-400 text-sm">{video.owner?.fullName}</p>
                  <SubscribeButton 
                    channelId={video.owner?._id}
                    username={video.owner?.username}
                    videoOwnerUsername={video.owner?.username}
                  />
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            {showComments && <Comments videoId={videoId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
