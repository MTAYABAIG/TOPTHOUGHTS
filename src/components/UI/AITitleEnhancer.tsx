import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Check, X, RefreshCw } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import toast from 'react-hot-toast';

interface AITitleEnhancerProps {
  currentTitle: string;
  onTitleSelect: (title: string) => void;
  placeholder?: string;
}

const AITitleEnhancer: React.FC<AITitleEnhancerProps> = ({
  currentTitle,
  onTitleSelect,
  placeholder = "Enter a title to enhance with AI"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!currentTitle.trim()) {
      toast.error('Please enter a title first');
      return;
    }

    setLoading(true);
    try {
      // Generate multiple title variations
      const prompts = [
        `Enhance this blog title to be more engaging and SEO-friendly: "${currentTitle}". Make it compelling and under 60 characters.`,
        `Create a more clickable version of this title: "${currentTitle}". Focus on curiosity and value proposition.`,
        `Rewrite this title to be more professional and authoritative: "${currentTitle}". Keep it clear and informative.`,
        `Make this title more emotional and engaging: "${currentTitle}". Add power words that drive engagement.`,
        `Create a question-based version of this title: "${currentTitle}". Make readers curious to learn more.`
      ];

      const enhancedTitles = await Promise.all(
        prompts.map(async (prompt) => {
          try {
            const result = await geminiService.sendMessage(prompt);
            return result.replace(/"/g, '').trim();
          } catch (error) {
            return null;
          }
        })
      );

      const validTitles = enhancedTitles
        .filter((title): title is string => title !== null && title.length > 0 && title.length <= 80)
        .slice(0, 4); // Keep top 4 suggestions

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

  const handleSelectTitle = (title: string) => {
    setSelectedSuggestion(title);
    onTitleSelect(title);
    setIsOpen(false);
    setSuggestions([]);
    toast.success('Title updated with AI enhancement!');
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
        className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <RefreshCw className="w-3 h-3 animate-spin" />
        ) : (
          <Sparkles className="w-3 h-3" />
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
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-neutral-200 p-6 max-w-2xl w-full mx-4 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">AI Title Suggestions</h3>
                    <p className="text-sm text-neutral-600">Choose an enhanced version of your title</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Original Title */}
              <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm font-medium text-neutral-700 mb-1">Original Title:</p>
                <p className="text-neutral-900">{currentTitle}</p>
              </div>

              {/* Suggestions */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-neutral-700">AI-Enhanced Suggestions:</p>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => handleSelectTitle(suggestion)}
                      className="w-full text-left p-4 border border-neutral-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group-hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-neutral-900 pr-4 leading-relaxed">{suggestion}</p>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-neutral-500">
                        <span>{suggestion.length} characters</span>
                        <span className={`px-2 py-1 rounded-full ${
                          suggestion.length <= 60 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {suggestion.length <= 60 ? 'SEO Optimal' : 'Long Title'}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                <button
                  onClick={generateSuggestions}
                  disabled={loading}
                  className="inline-flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 disabled:text-neutral-400"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Generate New Suggestions</span>
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSelectTitle(currentTitle)}
                    className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
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