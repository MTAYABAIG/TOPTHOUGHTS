import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Play } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  youtubeUrl?: string;
  createdAt: string;
  author?: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const excerpt = post.content.substring(0, 150) + '...';
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      <Link to={`/blog/${post._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={post.imageUrl || 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          {post.youtubeUrl && (
            <div className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full">
              <Play className="w-4 h-4" />
            </div>
          )}
        </div>
      </Link>

      <div className={`p-6 ${featured ? 'lg:p-8' : ''}`}>
        <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
          {post.author && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          )}
        </div>

        <Link to={`/blog/${post._id}`}>
          <h2 className={`font-bold text-neutral-900 mb-3 group-hover:text-black transition-colors ${
            featured ? 'text-2xl lg:text-3xl' : 'text-xl'
          }`}>
            {post.title}
          </h2>
        </Link>

        <p className={`text-neutral-600 mb-4 ${featured ? 'text-lg' : ''}`}>
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={`/blog/${post._id}`}
            className="inline-flex items-center space-x-1 text-black hover:text-neutral-700 font-medium transition-colors group/link"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
          
          {post.youtubeUrl && (
            <Link
              to={`/video/${post._id}`}
              className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors group/video"
            >
              <Play className="w-4 h-4" />
              <span>Watch Video</span>
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;