import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeaturedPost from '../components/Blog/FeaturedPost';
import BlogCard from '../components/Blog/BlogCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import Button from '../components/UI/Button';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../contexts/AuthContext';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const { isAuthenticated } = useAuth();

  const { posts, loading, error, totalPages, total } = usePosts({
    page: currentPage,
    limit: postsPerPage,
    search: searchTerm,
  });

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold font-serif text-neutral-900 mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore our collection of articles, tutorials, and insights.
          </p>
          {total > 0 && (
            <p className="text-sm text-neutral-500 mt-2">
              {total} article{total !== 1 ? 's' : ''} available
            </p>
          )}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto mb-12"
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </form>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Featured Post */}
        {featuredPost && !searchTerm && (
          <FeaturedPost post={featuredPost} />
        )}

        {/* Posts Grid */}
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : !loading && posts.length === 0 && (
          <EmptyState
            icon={searchTerm ? Search : PenTool}
            title={searchTerm ? "No Articles Found" : "No Articles Yet"}
            description={
              searchTerm 
                ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms or browse all articles.`
                : "This is where amazing content will live. Start by creating your first blog post and share your thoughts with the world."
            }
            illustration={searchTerm ? 'search' : 'posts'}
            action={
              !searchTerm && isAuthenticated ? (
                <Link to="/admin/create">
                  <Button icon={Plus} size="lg">
                    Create Your First Post
                  </Button>
                </Link>
              ) : searchTerm ? (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              ) : null
            }
          />
        )}

        {/* Loading State */}
        {loading && posts.length > 0 && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;