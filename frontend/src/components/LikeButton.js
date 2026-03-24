import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LikeButton = ({ videoId, initialLikes = 0, initialUserLike = null }) => {
  const { isAuthenticated, user } = useAuth();
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [userLike, setUserLike] = useState(initialUserLike);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if current user liked this video
    if (isAuthenticated && videoId) {
      checkUserLikeStatus();
    }
  }, [videoId, isAuthenticated]);

  const checkUserLikeStatus = async () => {
    try {
      // This would need an endpoint to check like status, for now use initial prop
      setUserLike(initialUserLike);
    } catch (error) {
      console.error('Failed to check like status:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos');
      return;
    }

    setLoading(true);
    try {
      console.log('Toggling like for video:', videoId);
      await axios.post(`/api/v1/likes/toggle/v/${videoId}`);
      
      if (userLike === 'like') {
        setLikeCount(prev => Math.max(0, prev - 1));
        setUserLike(null);
        toast.success('Like removed');
      } else {
        setLikeCount(prev => prev + 1);
        setUserLike('like');
        toast.success('Video liked!');
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error(error.response?.data?.message || 'Failed to update like status');
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike videos');
      return;
    }

    // For now, just remove the like if it exists
    if (userLike === 'like') {
      handleLike();
    }
  };

  const formatLikes = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          loading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : userLike === 'like'
            ? 'bg-blue-600 text-white'
            : 'bg-youtube-gray text-gray-300 hover:bg-gray-700'
        }`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <ThumbsUp size={20} />
        )}
        <span>{formatLikes(likeCount)}</span>
      </button>
      
      <button
        onClick={handleDislike}
        disabled={loading}
        className={`p-2 rounded-lg transition-colors ${
          loading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-youtube-gray text-gray-300 hover:bg-gray-700'
        }`}
      >
        <ThumbsDown size={20} />
      </button>
    </div>
  );
};

export default LikeButton;
