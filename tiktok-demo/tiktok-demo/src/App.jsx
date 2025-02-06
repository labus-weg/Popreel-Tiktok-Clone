import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Music2, User, Home, Search, PlusCircle, MessageSquare } from 'lucide-react';
import axios from 'axios';

// VideoPlayer Component
const VideoPlayer = ({ video, isVisible }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isVisible]);

  return (
    <div className="relative h-screen w-full bg-black">
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={() => {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }}
      />
      
      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src={video.userAvatar || '/api/placeholder/40/40'} 
            className="w-10 h-10 rounded-full border-2 border-white"
            alt="user avatar"
          />
          <span className="text-white font-semibold">@{video.username}</span>
          <button className="bg-primary px-4 py-1 rounded-full text-sm font-semibold">
            Follow
          </button>
        </div>
        <p className="text-white mb-2">{video.caption}</p>
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4 text-white" />
          <span className="text-white text-sm">
            {video.songName || 'Original Sound'}
          </span>
        </div>
      </div>

      {/* Interaction Sidebar */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1">
          <button className="bg-transparent p-2 rounded-full hover:bg-white/10 transition-colors">
            <Heart className="w-8 h-8 text-white" />
          </button>
          <span className="text-white text-xs">{video.likes || 0}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="bg-transparent p-2 rounded-full hover:bg-white/10 transition-colors">
            <MessageCircle className="w-8 h-8 text-white" />
          </button>
          <span className="text-white text-xs">{video.comments?.length || 0}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="bg-transparent p-2 rounded-full hover:bg-white/10 transition-colors">
            <Share2 className="w-8 h-8 text-white" />
          </button>
          <span className="text-white text-xs">Share</span>
        </div>
      </div>
    </div>
  );
};

// VideoFeed Component
const VideoFeed = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) < 50) return;

    if (diff > 0 && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    } else if (diff < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex((prev) => prev - 1);
    }

    setTouchStart(null);
  };

  return (
    <div 
      className="h-screen w-full overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <VideoPlayer 
        video={videos[currentVideoIndex]} 
        isVisible={true}
      />
    </div>
  );
};

// UploadVideo Component
const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('caption', caption);
    
    try {
      await axios.post('/api/videos', formData);
      setUploading(false);
      alert('Upload successful');
    } catch (error) {
      setUploading(false);
      alert('Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {preview ? (
              <video 
                src={preview} 
                className="w-full rounded" 
                controls
              />
            ) : (
              <div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFile(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
                <label 
                  htmlFor="video-upload"
                  className="cursor-pointer text-gray-500"
                >
                  Click to upload or drag and drop
                </label>
              </div>
            )}
          </div>

          <textarea
            placeholder="Write a caption..."
            className="w-full p-3 border rounded-lg resize-none"
            rows="3"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`w-full py-3 rounded-lg font-semibold ${
              uploading || !file 
                ? 'bg-gray-300 text-gray-500'
                : 'bg-primary text-white'
            }`}
          >
            {uploading ? 'Uploading...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

// NavigationBar Component
const NavigationBar = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
    <button className="flex flex-col items-center gap-1">
      <Home className="w-6 h-6" />
      <span className="text-xs">Home</span>
    </button>
    <button className="flex flex-col items-center gap-1">
      <Search className="w-6 h-6" />
      <span className="text-xs">Discover</span>
    </button>
    <button className="flex flex-col items-center gap-1">
      <PlusCircle className="w-6 h-6" />
      <span className="text-xs">Upload</span>
    </button>
    <button className="flex flex-col items-center gap-1">
      <MessageSquare className="w-6 h-6" />
      <span className="text-xs">Inbox</span>
    </button>
    <button className="flex flex-col items-center gap-1">
      <User className="w-6 h-6" />
      <span className="text-xs">Profile</span>
    </button>
  </nav>
);

// App Component
const App = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    };
    fetchVideos();
  }, []);

  return (
    <Router>
      <div className="h-screen bg-black">
        <Routes>
          <Route path="/" element={<VideoFeed videos={videos} />} />
          <Route path="/upload" element={<UploadVideo />} />
        </Routes>
        <NavigationBar />
      </div>
    </Router>
  );
};

export default App;
