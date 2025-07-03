import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import VideoUploader from '../components/YouTube/VideoUploader';

const UploadVideoPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useGoogleAuth();

  React.useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
      return;
    }
  }, [isSignedIn, navigate]);

  const handleUploadComplete = (videoId: string) => {
    console.log('Video uploaded with ID:', videoId);
    navigate('/admin');
  };

  const handleClose = () => {
    navigate('/');
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in with Google to upload videos.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center mb-8"
        >
          <Link
            to="/"
            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Upload Video</h1>
            <p className="text-neutral-600">Share your content with the world</p>
          </div>
        </motion.div>

        {/* Video Uploader Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <VideoUploader
            onUploadComplete={handleUploadComplete}
            onClose={handleClose}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default UploadVideoPage;