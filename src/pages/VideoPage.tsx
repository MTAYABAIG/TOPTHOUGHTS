import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { format } from 'date-fns';
import ReactPlayer from 'react-player/youtube';
import { mockPosts } from '../data/mockData';

const VideoPage = () => {
  const { id } = useParams();
  const post = mockPosts.find(p => p._id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Video Not Found</h1>
          <Link
            to="/blog"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post.youtubeUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">No Video Available</h1>
          <p className="text-neutral-600 mb-4">This post doesn't have an associated video.</p>
          <Link
            to={`/blog/${post._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Read the Article Instead →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to={`/blog/${post._id}`}
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Article</span>
          </Link>
        </motion.div>

        {/* Video Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <Play className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Video Content</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold font-serif text-neutral-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-6">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            </div>
            {post.author && (
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        </motion.header>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12"
        >
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <ReactPlayer
              url={post.youtubeUrl}
              width="100%"
              height="100%"
              controls
              playing={false}
              config={{
                youtube: {
                  playerVars: {
                    showinfo: 1,
                    rel: 0,
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Video Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">About This Video</h2>
              
              <div className="prose prose-lg max-w-none text-neutral-700 space-y-6">
                {post.content.split('\n\n').slice(0, 3).map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200">
                <Link
                  to={`/blog/${post._id}`}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 group"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Video Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Video Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Published</span>
                    <span className="font-medium">{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Author</span>
                    <span className="font-medium">{post.author || 'Top Thought'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Category</span>
                    <span className="font-medium">Educational</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Share This Video</h3>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 bg-blue-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors">
                    LinkedIn
                  </button>
                </div>
              </div>

              {/* YouTube Channel */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2">Subscribe to Our Channel</h3>
                <p className="text-red-100 text-sm mb-4">
                  Get notified when we publish new videos and content.
                </p>
                <a
                  href="https://youtube.com/@topthought"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Subscribe</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoPage;