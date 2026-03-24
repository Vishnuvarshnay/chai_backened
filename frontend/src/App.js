import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPlayer from './pages/VideoPlayer';
import UploadVideo from './pages/UploadVideo';
import Channel from './pages/Channel';
import MyVideos from './pages/MyVideos';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/watch/:videoId" element={<VideoPlayer />} />
            <Route path="/channel/:username" element={<Channel />} />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <UploadVideo />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-videos" 
              element={
                <ProtectedRoute>
                  <MyVideos />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
