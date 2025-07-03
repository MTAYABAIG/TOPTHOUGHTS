import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { Upload, Play, Sparkles, Wand2, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import { geminiService } from '../../services/geminiService';
import { uploadVideoToYouTube, getVideoCategories } from '../../services/youtubeService';
import Button from '../UI/Button';
import TagInput from '../UI/TagInput';

interface VideoUploadForm {
  title: string;
  description: string;
  tags: string[];
  category: { value: string; label: string } | null;
  privacyStatus: { value: string; label: string };
}

interface VideoUploaderProps {
  onUploadComplete: (videoId: string) => void;
  onClose: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadComplete, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<Array<{ value: string, label: string }>>([]);
  const [generatingContent, setGeneratingContent] = useState(false);
  const { user, isSignedIn } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoUploadForm>({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      category: null,
      privacyStatus: { value: 'private', label: 'Private' },
    }
  });

  const watchedFields = watch();

  const privacyOptions = [
    { value: 'private', label: 'Private' },
    { value: 'unlisted', label: 'Unlisted' },
    { value: 'public', label: 'Public' },
  ];

  React.useEffect(() => {
    // Load video categories
    getVideoCategories().then(cats => {
      setCategories(cats.map(cat => ({ value: cat.id, label: cat.title })));
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (!selectedFile.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }

      // Check file size (max 2GB)
      const maxSize = 2 * 1024 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error('File size too large. Maximum 2GB allowed.');
        return;
      }

      setFile(selectedFile);
      
      // Auto-generate title from filename if empty
      if (!watchedFields.title) {
        const filename = selectedFile.name.replace(/\.[^/.]+$/, "");
        const cleanTitle = filename.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setValue('title', cleanTitle);
      }
    }
  };

  const generateAIContent = async () => {
    if (!watchedFields.title) {
      toast.error('Please enter a title first');
      return;
    }

    setGeneratingContent(true);
    try {
      // Generate description
      const description = await geminiService.generateVideoDescription(
        watchedFields.title,
        watchedFields.description || 'Educational video content'
      );
      setValue('description', description);

      // Generate tags
      const tags = await geminiService.generateVideoTags(watchedFields.title, description);
      setValue('tags', tags.slice(0, 10)); // YouTube allows max 500 characters for tags

      toast.success('AI content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI content');
    } finally {
      setGeneratingContent(false);
    }
  };

  const enhanceTitle = async () => {
    if (!watchedFields.title) {
      toast.error('Please enter a title first');
      return;
    }

    setGeneratingContent(true);
    try {
      const enhancedTitle = await geminiService.generateVideoTitle(watchedFields.title);
      setValue('title', enhancedTitle);
      toast.success('Title enhanced with AI!');
    } catch (error) {
      toast.error('Failed to enhance title');
    } finally {
      setGeneratingContent(false);
    }
  };

  const onSubmit = async (data: VideoUploadForm) => {
    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    if (!user?.accessToken) {
      toast.error('Please sign in with Google first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const videoId = await uploadVideoToYouTube(
        file,
        {
          title: data.title,
          description: data.description,
          tags: data.tags,
          categoryId: data.category?.value || '22',
          privacyStatus: data.privacyStatus.value as 'private' | 'public' | 'unlisted',
        },
        (progress) => setUploadProgress(progress)
      );

      toast.success('Video uploaded successfully!');
      onUploadComplete(videoId);
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Access Denied</h2>
          <p className="text-neutral-600 mb-4">Please sign in with Google to upload videos.</p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Upload to YouTube</h2>
          <p className="text-neutral-600">Share your video with the world</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
              <p className="text-xs text-neutral-500">Signed in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Video File</h3>
            <div
              onClick={() => document.getElementById('video-file-modal')?.click()}
              className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center cursor-pointer hover:border-neutral-400 transition-colors"
            >
              <input
                id="video-file-modal"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <Play className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <p className="text-neutral-900 font-medium">{file.name}</p>
                    <p className="text-neutral-500 text-sm">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-1">Click to select a video file</p>
                  <p className="text-neutral-500 text-sm">
                    MP4, MOV, AVI, WMV (Max 2GB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Video Details */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Video Details</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAIContent}
                loading={generatingContent}
                icon={Sparkles}
              >
                Generate with AI
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
                      Title *
                    </label>
                    <button
                      type="button"
                      onClick={enhanceTitle}
                      disabled={generatingContent || !watchedFields.title}
                      className="text-xs text-purple-600 hover:text-purple-700 disabled:text-neutral-400 flex items-center space-x-1"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Enhance</span>
                    </button>
                  </div>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter video title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe your video..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Category
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={categories}
                          placeholder="Select category"
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Privacy *
                    </label>
                    <Controller
                      name="privacyStatus"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={privacyOptions}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                  </div>
                </div>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      label="Tags"
                      placeholder="Add tags..."
                    />
                  )}
                />
              </div>

              {/* Preview */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-4 h-4 text-neutral-600" />
                  <h4 className="font-medium text-neutral-900">Preview</h4>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                  {file && (
                    <div className="aspect-video bg-neutral-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                  
                  <div>
                    <h5 className="font-medium text-neutral-900 mb-1 line-clamp-2">
                      {watchedFields.title || 'Video Title'}
                    </h5>
                    <p className="text-neutral-600 text-sm line-clamp-2">
                      {watchedFields.description || 'Video description...'}
                    </p>
                  </div>
                  
                  {watchedFields.category && (
                    <div className="inline-block bg-neutral-200 text-neutral-700 px-2 py-1 rounded text-xs">
                      {watchedFields.category.label}
                    </div>
                  )}
                  
                  {watchedFields.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {watchedFields.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {watchedFields.tags.length > 3 && (
                        <span className="text-xs text-neutral-500">
                          +{watchedFields.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-blue-900 font-medium">Uploading video...</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-blue-700 text-sm">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={uploading}
              disabled={!file || uploading}
              className="bg-red-600 hover:bg-red-700"
              icon={Upload}
            >
              {uploading ? 'Uploading...' : 'Upload to YouTube'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default VideoUploader;