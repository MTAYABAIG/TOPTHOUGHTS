import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  loading?: boolean;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  loading = false,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="text-center p-8 rounded-2xl bg-neutral-50 hover:shadow-lg transition-shadow"
    >
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-200 rounded mb-2"></div>
          <div className="h-6 bg-neutral-200 rounded mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
            {value}
          </div>
          <div className="text-neutral-600 text-lg font-medium mb-2">
            {title}
          </div>
          <p className="text-neutral-500 text-sm">
            {description}
          </p>
        </>
      )}
    </motion.div>
  );
};

export default StatsCard;