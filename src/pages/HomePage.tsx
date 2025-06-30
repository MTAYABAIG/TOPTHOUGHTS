import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Bell, Mail, TrendingUp, Users, Video } from 'lucide-react';
import Button from '../components/UI/Button';
import BlogCard from '../components/Blog/BlogCard';
import { mockPosts } from '../data/mockData';

const HomePage = () => {
  const featuredPosts = mockPosts.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-50" />
        <div className="absolute top-10 left-10 w-20 h-20 bg-neutral-200 rounded-full opacity-20 animate-float" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-neutral-300 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl font-bold font-serif text-neutral-900 mb-6"
            >
              Welcome to{' '}
              <span className="text-black">
                Top Thought
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl lg:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto"
            >
              Elevating minds through thoughtful content. Discover inspiring insights, deep analysis, and transformative ideas that shape our world.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" icon={BookOpen}>
                <Link to="/blog">
                  Explore Articles
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Join thousands of readers who trust Top Thought for quality content and meaningful discussions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-8 rounded-2xl bg-neutral-50 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">100+</div>
              <div className="text-neutral-600 text-lg font-medium">Inspiring Articles</div>
              <p className="text-neutral-500 text-sm mt-2">
                Carefully crafted content that sparks meaningful conversations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-8 rounded-2xl bg-neutral-50 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">50+</div>
              <div className="text-neutral-600 text-lg font-medium">Video Discussions</div>
              <p className="text-neutral-500 text-sm mt-2">
                In-depth video content exploring complex topics and ideas
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-8 rounded-2xl bg-neutral-50 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">10K+</div>
              <div className="text-neutral-600 text-lg font-medium">Engaged Readers</div>
              <p className="text-neutral-500 text-sm mt-2">
                A growing community of thoughtful individuals worldwide
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stay Updated Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Get the latest insights and articles delivered straight to your inbox. Join our community of thoughtful readers and never miss a post.
            </p>
            
            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-lg mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-white focus:outline-none text-lg"
                  />
                </div>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-black hover:bg-neutral-100 px-8 py-4 text-lg font-semibold"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-white/70 text-sm mt-4">
                📧 Weekly newsletter • 🚫 No spam • ✅ Unsubscribe anytime
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                Latest Thoughts
              </h2>
              <p className="text-lg text-neutral-600">
                Discover our most recent articles and insights.
              </p>
            </div>
            <Link
              to="/blog"
              className="flex items-center space-x-1 text-black hover:text-neutral-700 font-medium transition-colors group mt-6 md:mt-0"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;