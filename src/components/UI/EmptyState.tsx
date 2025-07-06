import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  illustration?: 'posts' | 'search' | 'videos' | 'admin';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  illustration = 'posts'
}) => {
  const getIllustration = () => {
    switch (illustration) {
      case 'posts':
        return (
          <div className="relative w-64 h-48 mx-auto mb-8">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-60" />
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-4 w-12 h-12 bg-blue-200 rounded-lg opacity-40"
            />
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-8 right-6 w-8 h-8 bg-purple-200 rounded-full opacity-50"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-6 left-8 w-6 h-6 bg-green-200 rounded-md opacity-45"
            />
            
            {/* Main illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Icon className="w-16 h-16 text-neutral-400" />
              </div>
            </div>
          </div>
        );
      
      case 'search':
        return (
          <div className="relative w-64 h-48 mx-auto mb-8">
            {/* Search illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 border-4 border-neutral-300 rounded-full"
                />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-2 -right-2 w-8 h-1 bg-neutral-400 rounded-full origin-left"
                  style={{ transformOrigin: '0 50%' }}
                />
              </div>
            </div>
            
            {/* Floating question marks */}
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-8 text-2xl text-neutral-300"
            >
              ?
            </motion.div>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-8 right-4 text-lg text-neutral-300"
            >
              ?
            </motion.div>
          </div>
        );
      
      case 'videos':
        return (
          <div className="relative w-64 h-48 mx-auto mb-8">
            {/* Video player illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                </motion.div>
              </div>
            </div>
            
            {/* Floating video icons */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2 left-4 w-8 h-6 bg-red-200 rounded opacity-60"
            />
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-4 right-2 w-6 h-4 bg-red-300 rounded opacity-50"
            />
          </div>
        );
      
      case 'admin':
        return (
          <div className="relative w-64 h-48 mx-auto mb-8">
            {/* Dashboard illustration */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl" />
            
            {/* Dashboard elements */}
            <div className="absolute inset-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded animate-pulse" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-neutral-300 rounded animate-pulse" />
                <div className="h-12 bg-neutral-300 rounded animate-pulse" />
                <div className="h-12 bg-neutral-300 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-neutral-200 rounded animate-pulse" />
                <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-neutral-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
            
            {/* Central icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Icon className="w-8 h-8 text-neutral-400" />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      {getIllustration()}
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-neutral-900 mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;