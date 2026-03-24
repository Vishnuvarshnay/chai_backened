import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SubscribeButton = ({ channelId, username, videoOwnerUsername, initialSubscribed = false, initialCount = 0 }) => {
  const { isAuthenticated, user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [subscriberCount, setSubscriberCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch channel info to get current subscription status
    if (channelId && username) {
      fetchChannelInfo();
    }
  }, [channelId, username]);

  const fetchChannelInfo = async () => {
    try {
      const response = await axios.get(`/api/v1/users/c/${username}`);
      const channelData = response.data.data;
      setIsSubscribed(channelData.isSubscribed || false);
      setSubscriberCount(channelData.subscribersCount || 0);
    } catch (error) {
      console.error('Failed to fetch channel info:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      return;
    }

    if (!channelId) {
      toast.error('Invalid channel');
      return;
    }

    setLoading(true);
    try {
      console.log('Toggling subscription for channel:', channelId);
      const response = await axios.post(`/api/v1/subscriptions/c/${channelId}`);
      
      if (isSubscribed) {
        setIsSubscribed(false);
        setSubscriberCount(prev => Math.max(0, prev - 1));
        toast.success('Unsubscribed');
      } else {
        setIsSubscribed(true);
        setSubscriberCount(prev => prev + 1);
        toast.success('Subscribed!');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const formatSubscribers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Don't show subscribe button for user's own channel
  const isOwnChannel = user?._id === channelId || user?.username === username || user?.username === videoOwnerUsername;
  
  if (isOwnChannel) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-gray-500 text-sm">
          {formatSubscribers(subscriberCount)} subscribers
        </span>
        <div className="bg-gray-700 text-gray-400 px-4 py-2 rounded-full text-sm">
          Your Channel
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-gray-500 text-sm">
        {formatSubscribers(subscriberCount)} subscribers
      </span>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`px-4 py-2 rounded-full transition-colors ${
          loading
            ? 'bg-gray-600 text-white cursor-not-allowed'
            : isSubscribed
            ? 'bg-gray-600 hover:bg-gray-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          isSubscribed ? 'Subscribed' : 'Subscribe'
        )}
      </button>
    </div>
  );
};

export default SubscribeButton;
