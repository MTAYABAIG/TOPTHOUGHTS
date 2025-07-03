import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Upload, Play, Sparkles, Wand2, Eye, Shield, Clock, Globe, Users, Video as VideoIcon } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/geminiService';
import { uploadVideoToYouTube, getVideoCategories } from '../services/youtubeService';
import Button from '../components/UI/Button';
import TagInput from '../components/UI/TagInput';
import ImageUpload from '../components/UI/ImageUpload';

interface VideoUploadForm {
  title: string;
  description: string;
  tags: string[];
  category: { value: string; label: string } | null;
  privacyStatus: { value: string; label: string };
  thumbnail: string;
  language: { value: string; label: string };
  license: { value: string; label: string };
  videoType: { value: string; label: string };
  publishAt: string;
  targetChannel: { value: string; label: string };
  allowComments: boolean;
  allowRatings: boolean;
  allowEmbedding: boolean;
  notifySubscribers: boolean;
}

const UploadVideoPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<Array<{ value: string, label: string }>>([]);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);
  const navigate = useNavigate();
  const { user, isSignedIn, signIn } = useGoogleAuth();
  const { isAuthenticated } = useAuth();

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
      thumbnail: '',
      language: { value: 'en', label: 'English' },
      license: { value: 'youtube', label: 'Standard YouTube License' },
      videoType: { value: 'video', label: 'Regular Video' },
      publishAt: '',
      targetChannel: { value: 'topthought20', label: 'TopThought20 (Official)' },
      allowComments: true,
      allowRatings: true,
      allowEmbedding: true,
      notifySubscribers: true,
    }
  });

  const watchedFields = watch();

  const privacyOptions = [
    { value: 'private', label: 'Private' },
    { value: 'unlisted', label: 'Unlisted' },
    { value: 'public', label: 'Public' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' },
  ];

  const licenseOptions = [
    { value: 'youtube', label: 'Standard YouTube License' },
    { value: 'creativeCommon', label: 'Creative Commons - Attribution' },
  ];

  const videoTypeOptions = [
    { value: 'video', label: 'Regular Video' },
    { value: 'short', label: 'YouTube Short (Vertical)' },
    { value: 'live', label: 'Live Stream' },
    { value: 'premiere', label: 'Premiere' },
  ];

  const channelOptions = [
    { value: 'topthought20', label: 'TopThought20 (Official)' },
    { value: 'google', label: 'My Google Account Channel' },
  ];

  React.useEffect(() => {
    // Load video categories
    getVideoCategories().then(cats => {
      setCategories(cats.map(cat => ({ value: cat.id, label: cat.title })));
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      toast.success('Successfully signed in with Google!');
      setShowGoogleSignIn(false);
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

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
      
      // Auto-detect video type based on dimensions (would need actual video analysis)
      // For now, we'll check filename for "short" or aspect ratio hints
      const filename = selectedFile.name.toLowerCase();
      if (filename.includes('short') || filename.includes('vertical')) {
        setValue('videoType', { value: 'short', label: 'YouTube Short (Vertical)' });
      }
      
      // Auto-generate title from filename if empty
      if (!watchedFields.title) {
        const cleanTitle = selectedFile.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
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
      setValue('tags', tags.slice(0, 10));

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

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const onSubmit = async (data: VideoUploadForm) => {
    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    // Check authentication based on target channel
    if (data.targetChannel.value === 'google' && !isSignedIn) {
      setShowGoogleSignIn(true);
      return;
    }

    if (data.targetChannel.value === 'topthought20' && !isAuthenticated) {
      toast.error('Admin authentication required for TopThought20 channel');
      navigate('/login');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let videoId: string;

      if (data.targetChannel.value === 'topthought20') {
        // Upload to TopThought20 channel using admin credentials
        videoId = await uploadToTopThoughtChannel(file, data);
      } else {
        // Upload to user's Google account channel
        videoId = await uploadVideoToYouTube(
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
      }

      toast.success(`Video uploaded successfully to ${data.targetChannel.label}!`);
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadToTopThoughtChannel = async (file: File, data: VideoUploadForm): Promise<string> => {
    // Simulate upload to TopThought20 channel
    // In a real implementation, this would use server-side YouTube API with channel credentials
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve('mock-video-id-topthought20');
        }
      }, 500);
    });
  };

  // Show Google sign-in prompt if needed
  if (showGoogleSignIn) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">Google Account Required</h1>
              <p className="text-lg text-neutral-600 mb-8">
                To upload to your personal YouTube channel, please sign in with your Google account
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleGoogleSignIn}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg w-full"
                  size="lg"
                >
                  Sign in with Google
                </Button>

                <Button
                  onClick={() => {
                    setValue('targetChannel', { value: 'topthought20', label: 'TopThought20 (Official)' });
                    setShowGoogleSignIn(false);
                  }}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Upload to TopThought20 Instead
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Channel Options:</strong><br />
                  • <strong>TopThought20:</strong> Official channel (admin access required)<br />
                  • <strong>Google Account:</strong> Your personal YouTube channel
                </p>
              </div>
            </div>
          </motion.div>
        </div>
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
              <h1 className="text-3xl font-bold text-neutral-900">Upload Video</h1>
              <p className="text-neutral-600">Share your content with the world</p>
            </div>
          </div>
          
          {/* Channel Status */}
          <div className="flex items-center space-x-3">
            {watchedFields.targetChannel?.value === 'topthought20' ? (
              <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                <VideoIcon className="w-4 h-4" />
                <span className="text-sm font-medium">TopThought20 Channel</span>
              </div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500">Personal Channel</p>
                </div>
              </div>
            ) : null}
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
              {/* Channel Selection */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Upload Destination</h2>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Target Channel *
                  </label>
                  <Controller
                    name="targetChannel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={channelOptions}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        onChange={(value) => {
                          field.onChange(value);
                          if (value?.value === 'google' && !isSignedIn) {
                            setShowGoogleSignIn(true);
                          }
                        }}
                      />
                    )}
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Choose between the official TopThought20 channel or your personal YouTube channel
                  </p>
                </div>
              </div>

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

                  {/* Thumbnail Upload */}
                  <Controller
                    name="thumbnail"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Custom Thumbnail"
                        placeholder="Upload a custom thumbnail (1280x720 recommended)"
                      />
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Video Type *
                      </label>
                      <Controller
                        name="videoType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={videoTypeOptions}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      />
                    </div>

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

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Language
                      </label>
                      <Controller
                        name="language"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={languageOptions}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        License
                      </label>
                      <Controller
                        name="license"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={licenseOptions}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label htmlFor="publishAt" className="block text-sm font-medium text-neutral-700 mb-2">
                        Schedule Publication
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                          {...register('publishAt')}
                          type="datetime-local"
                          className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Leave empty to publish immediately
                      </p>
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

              {/* Advanced Settings */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Advanced Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        {...register('allowComments')}
                        type="checkbox"
                        id="allowComments"
                        className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="allowComments" className="text-sm font-medium text-neutral-700">
                        Allow comments
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        {...register('allowRatings')}
                        type="checkbox"
                        id="allowRatings"
                        className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="allowRatings" className="text-sm font-medium text-neutral-700">
                        Allow ratings (likes/dislikes)
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        {...register('allowEmbedding')}
                        type="checkbox"
                        id="allowEmbedding"
                        className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="allowEmbedding" className="text-sm font-medium text-neutral-700">
                        Allow embedding on other websites
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        {...register('notifySubscribers')}
                        type="checkbox"
                        id="notifySubscribers"
                        className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="notifySubscribers" className="text-sm font-medium text-neutral-700">
                        Notify subscribers
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-neutral-900">Security Verification</h2>
                </div>
                
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    onChange={onRecaptchaChange}
                    theme="light"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-blue-900 font-medium text-lg">
                      Uploading to {watchedFields.targetChannel?.label}...
                    </span>
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
                disabled={!file || uploading || !recaptchaToken}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
                icon={Upload}
              >
                {uploading ? 'Uploading...' : `Upload to ${watchedFields.targetChannel?.label || 'YouTube'}`}
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
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5 text-neutral-600" />
                  <h3 className="font-semibold text-neutral-900">Preview</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Thumbnail Preview */}
                  <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                    {watchedFields.thumbnail ? (
                      <img
                        src={watchedFields.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-neutral-400" />
                      </div>
                    )}
                    
                    {/* Video Type Badge */}
                    {watchedFields.videoType?.value === 'short' && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                        SHORT
                      </div>
                    )}
                  </div>
                  
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
                  
                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Channel:</span>
                      <span>{watchedFields.targetChannel?.label}</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Privacy:</span>
                      <span>{watchedFields.privacyStatus.label}</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Type:</span>
                      <span>{watchedFields.videoType?.label}</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Language:</span>
                      <span>{watchedFields.language.label}</span>
                    </div>
                    {watchedFields.publishAt && (
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Scheduled:</span>
                        <span>{new Date(watchedFields.publishAt).toLocaleDateString()}</span>
                      </div>
                    )}
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
                  <p>• Custom thumbnails improve click rates</p>
                  <p>• Shorts get better reach with vertical format</p>
                </div>
              </div>

              {/* Channel Info */}
              <div className="bg-neutral-50 p-6 rounded-xl">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="w-5 h-5 text-neutral-600" />
                  <h3 className="font-semibold text-neutral-900">Upload Options</h3>
                </div>
                <div className="space-y-3 text-sm text-neutral-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span><strong>TopThought20:</strong> Official channel (admin required)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Google Account:</strong> Your personal channel</span>
                  </div>
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