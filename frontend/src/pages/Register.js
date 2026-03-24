import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (e.target.name === 'avatar') {
        setAvatarPreview(URL.createObjectURL(file));
      } else if (e.target.name === 'coverImage') {
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  const removePreview = (type) => {
    if (type === 'avatar') {
      setAvatarPreview(null);
      document.querySelector('input[name="avatar"]').value = '';
    } else if (type === 'coverImage') {
      setCoverPreview(null);
      document.querySelector('input[name="coverImage"]').value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Check if avatar is uploaded
    const avatarInput = document.querySelector('input[name="avatar"]');
    if (!avatarInput?.files[0]) {
      toast.error('Avatar is required for registration');
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('fullName', formData.fullName);
    submitData.append('password', formData.password);

    if (avatarInput?.files[0]) {
      submitData.append('avatar', avatarInput.files[0]);
    }
    
    const coverInput = document.querySelector('input[name="coverImage"]');
    if (coverInput?.files[0]) {
      submitData.append('coverImage', coverInput.files[0]);
    }

    console.log('Submitting registration data:', submitData);
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value);
    }

    const result = await register(submitData);
    
    if (result.success) {
      toast.success('Registration successful!');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-youtube-red rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-youtube-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-youtube-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-youtube-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-youtube-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-youtube-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-400 mb-2">
                Avatar (Required) *
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="w-20 h-20 bg-youtube-gray border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Upload size={24} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                </label>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => removePreview('avatar')}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="w-20 h-20 bg-youtube-gray border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Upload size={24} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {coverPreview && (
                  <button
                    type="button"
                    onClick={() => removePreview('coverImage')}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-youtube-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
