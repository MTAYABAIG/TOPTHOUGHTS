import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
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

interface FeaturedPostProps {
  post: BlogPost;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {
  const excerpt = post.content.substring(0, 200) + '...';

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl mb-16"
    >
      <div className="absolute inset-0">
        <img
          src={post.imageUrl || 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>

      <div className="relative z-10 p-8 lg:p-16 text-white">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-4 text-sm text-white/80 mb-4">
            <span className="bg-primary-500 px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
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
            <h1 className="text-3xl lg:text-5xl font-bold font-serif mb-6 hover:text-primary-200 transition-colors">
              {post.title}
            </h1>
          </Link>

          <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
            {excerpt}
          </p>

          <Link
            to={`/blog/${post._id}`}
            className="inline-flex items-center space-x-2 bg-white text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors group"
          >
            <span>Read Full Article</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </motion.section>
  );
};

export default FeaturedPost;