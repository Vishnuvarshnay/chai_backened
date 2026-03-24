import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Users, Video, Calendar, Check } from 'lucide-react';
import axios from 'axios';

const Channel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    fetchChannelData();
  }, [username]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      
      // Fetch channel profile
      const channelResponse = await axios.get(`/api/v1/users/c/${username}`);
      setChannel(channelResponse.data.data);
      
      // Fetch channel videos
      const videosResponse = await axios.get(`/api/v1/videos?username=${username}`);
      setVideos(videosResponse.data.data || []);
    } catch (error) {
      console.error('Failed to fetch channel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatSubscribers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M subscribers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K subscribers`;
    }
    return `${count} subscribers`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `Joined ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Channel not found</h2>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Channel Header */}
      <div className="bg-gradient-to-b from-youtube-gray to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={channel.avatar || '/default-avatar.png'}
              alt={channel.username}
              className="w-32 h-32 rounded-full"
            />
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-2">{channel.username}</h1>
              <p className="text-gray-400 mb-2">{channel.fullName}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-gray-400 text-sm">
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{formatSubscribers(channel.subscribersCount || 0)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Video size={16} />
                  <span>{videos.length} videos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{formatDate(channel.createdAt)}</span>
                </div>
              </div>
              
              {channel.isSubscribed && (
                <div className="flex items-center space-x-1 mt-2 text-gray-400 text-sm">
                  <Check size={16} className="text-blue-400" />
                  <span>Subscribed</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'videos'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'about'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <Link
                    key={video._id}
                    to={`/watch/${video._id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full aspect-video object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                        <span>{formatViews(video.views)} views</span>
                        <span>•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video size={48} className="mx-auto text-gray-600 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No videos yet</h2>
                <p className="text-gray-400">This channel hasn't uploaded any videos</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-youtube-gray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">About {channel.username}</h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-white font-medium mb-2">Description</h3>
                <p className="text-gray-400">
                  {channel.description || 'No description available.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-black rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Users size={20} className="text-blue-400" />
                      <span className="text-white font-medium">
                        {formatSubscribers(channel.subscribersCount || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Video size={20} className="text-green-400" />
                      <span className="text-white font-medium">{videos.length} videos</span>
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={20} className="text-yellow-400" />
                      <span className="text-white font-medium">
                        {formatDate(channel.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">Links</h3>
                <div className="space-y-2">
                  <a
                    href={`mailto:${channel.email}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {channel.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
