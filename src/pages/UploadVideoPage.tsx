import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Upload, Play, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { geminiService } from '../services/geminiService';
import { uploadVideoToYouTube, getVideoCategories } from '../services/youtubeService';
import Button from '../components/UI/Button';
import TagInput from '../components/UI/TagInput';

interface VideoUploadForm {
  title: string;
  description: string;
  tags: string[];
  category: { value: string; label: string } | null;
  privacyStatus: { value: string; label: string };
}

const UploadVideoPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<Array<{ value: string, label: string }>>([]);
  const [generatingContent, setGeneratingContent] = useState(false);
  const navigate = useNavigate();
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
    if (!isSignedIn) {
      navigate('/');
      return;
    }

    // Load video categories
    getVideoCategories().then(cats => {
      setCategories(cats.map(cat => ({ value: cat.id, label: cat.title })));
    });
  }, [isSignedIn, navigate]);

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
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-4">Please sign in with Google to upload videos.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Upload to YouTube</h1>
              <p className="text-neutral-600">Share your video with the world</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
              <p className="text-xs text-neutral-500">Signed in with Google</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* File Upload */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Video File</h2>
                
                <div className="space-y-4">
                  <div
                    onClick={() => document.getElementById('video-file')?.click()}
                    className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-neutral-400 transition-colors"
                  >
                    <input
                      id="video-file"
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {file ? (
                      <div className="flex items-center justify-center space-x-3">
                        <Play className="w-8 h-8 text-green-600" />
                        <div className="text-left">
                          <p className="text-neutral-900 font-medium">{file.name}</p>
                          <p className="text-neutral-500 text-sm">
                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                        <p className="text-neutral-600 text-lg mb-2">Click to select a video file</p>
                        <p className="text-neutral-500 text-sm">
                          MP4, MOV, AVI, WMV (Max 2GB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">Video Details</h2>
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
                
                <div className="space-y-6">
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
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter an engaging video title"
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
                      rows={6}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Describe your video..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="Add tags to help people find your video"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-blue-900 font-medium text-lg">Uploading video...</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-blue-700 text-sm">{uploadProgress}% complete</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                loading={uploading}
                disabled={!file || uploading}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
                icon={Upload}
              >
                {uploading ? 'Uploading...' : 'Upload to YouTube'}
              </Button>
            </form>
          </motion.div>

          {/* Preview Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-6">
              {/* Preview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-4">Preview</h3>
                
                <div className="space-y-4">
                  {file && (
                    <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-neutral-400" />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2 line-clamp-2">
                      {watchedFields.title || 'Video Title'}
                    </h4>
                    <p className="text-neutral-600 text-sm line-clamp-3">
                      {watchedFields.description || 'Video description will appear here...'}
                    </p>
                  </div>
                  
                  {watchedFields.category && (
                    <div className="inline-block bg-neutral-100 text-neutral-700 px-2 py-1 rounded-md text-xs font-medium">
                      {watchedFields.category.label}
                    </div>
                  )}
                  
                  {watchedFields.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {watchedFields.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
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
                  
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500">
                      Privacy: {watchedFields.privacyStatus.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Tips */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <p className="text-white/90 text-sm mb-4">
                  Use our AI to generate compelling titles, descriptions, and tags that will help your video reach more viewers.
                </p>
                <div className="space-y-2 text-xs text-white/80">
                  <p>• AI-generated content is SEO optimized</p>
                  <p>• Titles are under 60 characters</p>
                  <p>• Descriptions include relevant hashtags</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoPage;