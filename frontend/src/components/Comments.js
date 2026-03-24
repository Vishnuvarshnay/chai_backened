import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Comments = ({ videoId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      console.log('Fetching comments for video:', videoId);
      const response = await axios.get(`/api/v1/comments/${videoId}`);
      console.log('Comments response:', response.data);
      
      // Handle different response structures
      const commentsData = response.data.data?.docs || response.data.data || [];
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      console.log('Adding comment to video:', videoId);
      const response = await axios.post(`/api/v1/comments/${videoId}`, {
        content: newComment
      });

      console.log('Comment response:', response.data);
      setComments(prev => [response.data.data, ...prev]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Add comment error:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      await axios.post(`/api/v1/likes/toggle/c/${commentId}`);
      toast.success('Comment liked!');
      // Refresh comments to update like count
      fetchComments();
    } catch (error) {
      toast.error('Failed to like comment');
    }
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
      <div className="bg-youtube-gray rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-600 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-youtube-gray rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex space-x-3">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">
              {isAuthenticated ? 'Be the first to comment!' : 'Login to add comments'}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              <img
                src={comment.owner?.avatar || '/default-avatar.png'}
                alt={comment.owner?.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-white font-medium text-sm">
                    {comment.owner?.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{comment.content}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button 
                    onClick={() => handleLikeComment(comment._id)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs transition-colors"
                  >
                    <ThumbsUp size={16} />
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                  <button className="text-gray-400 hover:text-white text-xs transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
