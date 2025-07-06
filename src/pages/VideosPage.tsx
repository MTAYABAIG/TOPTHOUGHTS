import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Play, Calendar, User, Eye, Video as VideoIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { usePosts } from '../hooks/usePosts';
import { useYouTubeStats } from '../hooks/useYouTubeStats';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import Button from '../components/UI/Button';

const VideosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 9;
  const youtubeStats = useYouTubeStats();
  const { isAuthenticated } = useAuth();

  const { posts, loading, totalPages } = usePosts({
    page: currentPage,
    limit: videosPerPage,
    search: searchTerm,
  });

  // Filter posts that have YouTube videos
  const videoPosts = posts.filter(post => post.youtubeUrl);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading && videoPosts.length === 0) {
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
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-serif text-neutral-900 mb-4">
            Video Library
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore our collection of educational videos, tutorials, and in-depth discussions on topics that matter.
          </p>
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
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>
          </form>
        </motion.div>

        {/* Real YouTube Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              {youtubeStats.loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-neutral-900 mb-1">
                    {youtubeStats.videos}
                  </div>
                  <div className="text-neutral-600">Total Videos</div>
                </>
              )}
            </div>
            <div>
              {youtubeStats.loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-neutral-900 mb-1">
                    {youtubeStats.views}
                  </div>
                  <div className="text-neutral-600">Total Views</div>
                </>
              )}
            </div>
            <div>
              {youtubeStats.loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-neutral-900 mb-1">
                    {youtubeStats.subscribers}
                  </div>
                  <div className="text-neutral-600">Subscribers</div>
                </>
              )}
            </div>
          </div>
          
          {youtubeStats.error && (
            <div className="mt-4 text-center">
              <p className="text-red-600 text-sm">{youtubeStats.error}</p>
            </div>
          )}
        </motion.div>

        {/* Videos Grid */}
        {videoPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {videoPosts.map((video, index) => (
              <motion.article
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getYouTubeThumbnail(video.youtubeUrl!) || video.imageUrl || 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Play Button Overlay */}
                  <Link
                    to={`/video/${video._id}`}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-lg">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </Link>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                    12:34
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(video.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>1.2K views</span>
                    </div>
                  </div>

                  <Link to={`/video/${video._id}`}>
                    <h3 className="font-bold text-lg text-neutral-900 mb-3 group-hover:text-black transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                  </Link>

                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {video.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-neutral-600" />
                      </div>
                      <span className="text-sm text-neutral-600">{video.author || 'Top Thought'}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/video/${video._id}`}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Watch
                      </Link>
                      <Link
                        to={`/blog/${video._id}`}
                        className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
                      >
                        Article
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : !loading && (
          <EmptyState
            icon={searchTerm ? Search : VideoIcon}
            title={searchTerm ? "No Videos Found" : "No Videos Yet"}
            description={
              searchTerm 
                ? `We couldn't find any videos matching "${searchTerm}". Try different keywords or browse all content.`
                : "Your video library is waiting to be filled with amazing content. Create posts with YouTube videos to build your video collection."
            }
            illustration={searchTerm ? 'search' : 'videos'}
            action={
              !searchTerm && isAuthenticated ? (
                <Link to="/admin/create">
                  <Button icon={Plus} size="lg">
                    Create Video Post
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
        {loading && videoPosts.length > 0 && (
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
                      ? 'bg-black text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* YouTube Channel CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-red-600 rounded-2xl p-8 lg:p-12 text-white text-center mt-16"
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our YouTube Channel</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Get notified when we publish new videos and join our growing community of learners and thinkers.
          </p>
          <a
            href="https://youtube.com/@topthought20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-colors text-lg"
          >
            <Play className="w-5 h-5" />
            <span>Subscribe Now</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default VideosPage;