import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Upload, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-youtube-dark border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-youtube-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-semibold text-xl">ChaiTube</span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="flex-1 bg-youtube-gray border border-gray-600 rounded-l-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-youtube-gray border border-l-0 border-gray-600 rounded-r-full px-6 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  className="flex items-center space-x-2 bg-youtube-red hover:bg-red-600 px-4 py-2 rounded-full transition-colors"
                >
                  <Upload size={20} />
                  <span>Upload</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-full transition-colors">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                    <span className="text-white">{user?.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-youtube-gray rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to={`/channel/${user?.username}`}
                      className="block px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg"
                    >
                      Your Channel
                    </Link>
                    <Link
                      to="/my-videos"
                      className="block px-4 py-2 text-white hover:bg-gray-700"
                    >
                      My Videos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-b-lg flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
