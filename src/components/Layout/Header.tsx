import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Brain, LogOut, Settings, Youtube, Upload, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import GeminiChat from '../AI/GeminiChat';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { user: googleUser, isSignedIn: isGoogleSignedIn, signIn: googleSignIn, signOut: googleSignOut } = useGoogleAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' },
    { path: '/videos', label: 'Videos' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">
                  Top Thought
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    location.pathname === item.path
                      ? 'text-black'
                      : 'text-neutral-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* YouTube Channel Link */}
              <a
                href="https://youtube.com/@topthought20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Visit our YouTube Channel"
              >
                <Youtube className="w-6 h-6" />
              </a>

              {/* Google Auth & Features */}
              {isGoogleSignedIn ? (
                <div className="flex items-center space-x-4">
                  {/* AI Chat Button */}
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-all duration-200"
                    title="Chat with AI"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Chat</span>
                  </button>

                  {/* Upload Video Button */}
                  <Link
                    to="/upload-video"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload</span>
                  </Link>

                  {/* User Profile */}
                  <div className="flex items-center space-x-2">
                    <img
                      src={googleUser?.picture}
                      alt={googleUser?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <button
                      onClick={googleSignOut}
                      className="text-sm text-neutral-600 hover:text-red-600 transition-colors"
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
                >
                  Sign in with Google
                </button>
              )}
              
              {/* Admin Auth */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm font-medium text-neutral-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all duration-200"
                >
                  Admin Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-neutral-700 hover:text-black transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t border-neutral-200"
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-black ${
                      location.pathname === item.path
                        ? 'text-black'
                        : 'text-neutral-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* YouTube Channel Link */}
                <a
                  href="https://youtube.com/@topthought"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  <span>YouTube Channel</span>
                </a>

                {/* Google Auth Mobile */}
                {isGoogleSignedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setIsChatOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors text-left"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>AI Chat</span>
                    </button>
                    <Link
                      to="/upload-video"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Video</span>
                    </Link>
                    <div className="flex items-center space-x-2 py-2">
                      <img
                        src={googleUser?.picture}
                        alt={googleUser?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-neutral-700">{googleUser?.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        googleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-sm font-medium text-neutral-700 hover:text-red-600 transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleGoogleSignIn();
                      setIsMenuOpen(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 text-center"
                  >
                    Sign in with Google
                  </button>
                )}
                
                {/* Admin Auth Mobile */}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-1 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-1 text-sm font-medium text-neutral-700 hover:text-red-600 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Admin Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all duration-200 text-center"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Gemini Chat Drawer */}
      <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Header;