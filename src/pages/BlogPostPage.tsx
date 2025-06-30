import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import ReactPlayer from 'react-player/youtube';
import { mockPosts } from '../data/mockData';

const BlogPostPage = () => {
  const { id } = useParams();
  const post = mockPosts.find(p => p._id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Post Not Found</h1>
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

  return (
    <article className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-4">
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

          <h1 className="text-3xl lg:text-5xl font-bold font-serif text-neutral-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        {post.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
            />
          </motion.div>
        )}

        {/* YouTube Video */}
        {post.youtubeUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-8"
          >
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <ReactPlayer
                url={post.youtubeUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
              />
            </div>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <div className="text-neutral-700 leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="border-t border-neutral-200 pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <p className="text-neutral-600">
                Published on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </p>
              {post.author && (
                <p className="text-neutral-600">
                  By {post.author}
                </p>
              )}
            </div>
            
            <Link
              to="/blog"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              More Articles
            </Link>
          </div>
        </motion.footer>
      </div>
    </article>
  );
};

export default BlogPostPage;