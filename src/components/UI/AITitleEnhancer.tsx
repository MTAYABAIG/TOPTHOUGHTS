import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Check, X, RefreshCw, Copy, Star, TrendingUp, Target } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import toast from 'react-hot-toast';

interface AITitleEnhancerProps {
  currentTitle: string;
  onTitleSelect: (title: string) => void;
  placeholder?: string;
}

interface TitleSuggestion {
  title: string;
  type: 'engaging' | 'seo' | 'question' | 'emotional' | 'direct';
  score: number;
  reason: string;
}

const AITitleEnhancer: React.FC<AITitleEnhancerProps> = ({
  currentTitle,
  onTitleSelect,
  placeholder = "Enter a title to enhance with AI"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const typeIcons = {
    engaging: Star,
    seo: TrendingUp,
    question: Target,
    emotional: Sparkles,
    direct: Check
  };

  const typeColors = {
    engaging: 'bg-purple-100 text-purple-700 border-purple-200',
    seo: 'bg-green-100 text-green-700 border-green-200',
    question: 'bg-blue-100 text-blue-700 border-blue-200',
    emotional: 'bg-pink-100 text-pink-700 border-pink-200',
    direct: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const generateSuggestions = async () => {
    if (!currentTitle.trim()) {
      toast.error('Please enter a title first');
      return;
    }

    setLoading(true);
    try {
      // Generate multiple title variations with different approaches
      const prompts = [
        {
          prompt: `Create an engaging, curiosity-driven version of this title: "${currentTitle}". Make it compelling and under 60 characters. Focus on intrigue and reader interest.`,
          type: 'engaging' as const
        },
        {
          prompt: `Rewrite this title to be SEO-optimized and search-friendly: "${currentTitle}". Include relevant keywords and make it discoverable. Under 60 characters.`,
          type: 'seo' as const
        },
        {
          prompt: `Turn this title into a compelling question that makes readers curious: "${currentTitle}". Create intrigue and make them want to know the answer.`,
          type: 'question' as const
        },
        {
          prompt: `Make this title more emotional and impactful: "${currentTitle}". Use power words that evoke feelings and drive engagement. Under 60 characters.`,
          type: 'emotional' as const
        },
        {
          prompt: `Create a direct, clear, and professional version of this title: "${currentTitle}". Make it authoritative and informative. Under 60 characters.`,
          type: 'direct' as const
        }
      ];

      const enhancedTitles = await Promise.all(
        prompts.map(async ({ prompt, type }) => {
          try {
            const result = await geminiService.sendMessage(prompt);
            const cleanTitle = result.replace(/"/g, '').trim();
            
            // Calculate a simple score based on length and type
            const score = Math.min(100, Math.max(60, 100 - (cleanTitle.length - 40)));
            
            return {
              title: cleanTitle,
              type,
              score,
              reason: getReasonForType(type)
            };
          } catch (error) {
            return null;
          }
        })
      );

      const validTitles = enhancedTitles
        .filter((title): title is TitleSuggestion => 
          title !== null && 
          title.title.length > 0 && 
          title.title.length <= 80 &&
          title.title.toLowerCase() !== currentTitle.toLowerCase()
        )
        .sort((a, b) => b.score - a.score);

      if (validTitles.length === 0) {
        toast.error('Failed to generate title suggestions');
        return;
      }

      setSuggestions(validTitles);
      setIsOpen(true);
    } catch (error) {
      toast.error('Failed to enhance title with AI');
    } finally {
      setLoading(false);
    }
  };

  const getReasonForType = (type: string): string => {
    switch (type) {
      case 'engaging': return 'Designed to capture attention and spark curiosity';
      case 'seo': return 'Optimized for search engines and discoverability';
      case 'question': return 'Poses a question to engage readers mentally';
      case 'emotional': return 'Uses emotional triggers to drive engagement';
      case 'direct': return 'Clear, professional, and straightforward';
      default: return 'AI-enhanced for better performance';
    }
  };

  const handleSelectTitle = (suggestion: TitleSuggestion) => {
    setSelectedSuggestion(suggestion.title);
    onTitleSelect(suggestion.title);
    setIsOpen(false);
    setSuggestions([]);
    toast.success('Title updated with AI enhancement!');
  };

  const copyToClipboard = (title: string) => {
    navigator.clipboard.writeText(title);
    toast.success('Title copied to clipboard!');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSuggestions([]);
    setSelectedSuggestion(null);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={generateSuggestions}
        disabled={loading || !currentTitle.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span>{loading ? 'Enhancing...' : 'Enhance with AI'}</span>
      </motion.button>

      {/* Suggestions Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-8 max-w-4xl w-full mx-4 z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">AI Title Suggestions</h3>
                    <p className="text-neutral-600">Choose an enhanced version that fits your content best</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-500" />
                </button>
              </div>

              {/* Original Title */}
              <div className="mb-8 p-6 bg-neutral-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-neutral-700">Original Title:</p>
                  <span className="text-xs text-neutral-500">{currentTitle.length} characters</span>
                </div>
                <p className="text-lg text-neutral-900 font-medium">{currentTitle}</p>
              </div>

              {/* Suggestions Grid */}
              <div className="space-y-4 mb-8">
                <p className="text-lg font-semibold text-neutral-900">AI-Enhanced Suggestions:</p>
                {suggestions.map((suggestion, index) => {
                  const IconComponent = typeIcons[suggestion.type];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      <button
                        onClick={() => handleSelectTitle(suggestion)}
                        className="w-full text-left p-6 border-2 border-neutral-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group-hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[suggestion.type]}`}>
                              <div className="flex items-center space-x-1">
                                <IconComponent className="w-3 h-3" />
                                <span className="capitalize">{suggestion.type}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">Score: {suggestion.score}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(suggestion.title);
                              }}
                              className="p-2 hover:bg-white rounded-lg transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4 text-neutral-500" />
                            </button>
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-semibold text-neutral-900 mb-3 leading-relaxed">
                          {suggestion.title}
                        </h4>
                        
                        <p className="text-sm text-neutral-600 mb-4">
                          {suggestion.reason}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>{suggestion.title.length} characters</span>
                          <span className={`px-2 py-1 rounded-full ${
                            suggestion.title.length <= 60 
                              ? 'bg-green-100 text-green-700' 
                              : suggestion.title.length <= 70
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {suggestion.title.length <= 60 ? 'Perfect Length' : 
                             suggestion.title.length <= 70 ? 'Good Length' : 'Too Long'}
                          </span>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
                <button
                  onClick={generateSuggestions}
                  disabled={loading}
                  className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 disabled:text-neutral-400 font-medium"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Generate New Suggestions</span>
                </button>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSelectTitle({ title: currentTitle, type: 'direct', score: 0, reason: 'Original title' })}
                    className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors"
                  >
                    Keep Original
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITitleEnhancer;