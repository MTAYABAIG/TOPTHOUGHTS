import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import TagInput from '../UI/TagInput';
import { signInToYouTube, uploadVideoToYouTube, getVideoCategories } from '../../services/youtubeService';

interface VideoUploadForm {
  title: string;
  description: string;
  tags: string[];
  category: { value: string; label: string } | null;
  privacyStatus: { value: string; label: string };
}

interface VideoUploaderProps {
  onUploadComplete?: (videoId: string) => void;
  onClose?: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadComplete, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [categories, setCategories] = useState<Array<{value: string, label: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<VideoUploadForm>({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      category: null,
      privacyStatus: { value: 'private', label: 'Private' },
    }
  });

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

  const handleSignIn = async () => {
    try {
      await signInToYouTube();
      setIsSignedIn(true);
      toast.success('Successfully signed in to YouTube!');
    } catch (error) {
      toast.error('Failed to sign in to YouTube');
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
      
      // Check file size (max 128GB for YouTube, but we'll set a reasonable limit)
      const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
      if (selectedFile.size > maxSize) {
        toast.error('File size too large. Maximum 2GB allowed.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const onSubmit = async (data: VideoUploadForm) => {
    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    if (!isSignedIn) {
      toast.error('Please sign in to YouTube first');
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
      onUploadComplete?.(videoId);
      reset();
      setFile(null);
      onClose?.();
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Upload to YouTube</h2>
            <p className="text-neutral-600">Share your video with the world</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!isSignedIn ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Sign in to YouTube
          </h3>
          <p className="text-neutral-600 mb-6">
            You need to sign in to your YouTube account to upload videos.
          </p>
          <Button onClick={handleSignIn} className="bg-red-600 hover:bg-red-700">
            Sign in with Google
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Video File *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center cursor-pointer hover:border-neutral-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-neutral-900 font-medium">{file.name}</span>
                  <span className="text-neutral-500">
                    ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-neutral-600">Click to select a video file</p>
                  <p className="text-neutral-500 text-sm mt-1">
                    MP4, MOV, AVI, WMV (Max 2GB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Video Details */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
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
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
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

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"></div>
                <span className="text-neutral-900 font-medium">Uploading video...</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-neutral-600 text-sm mt-1">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              loading={uploading}
              disabled={!file || uploading}
              className="flex-1 bg-red-600 hover:bg-red-700"
              icon={Upload}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={uploading}
              >
                Cancel
              </Button>
            )}
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-medium">Important Notes</h4>
                <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                  <li>• Make sure you have the rights to upload this content</li>
                  <li>• Videos are uploaded to your connected YouTube account</li>
                  <li>• Processing may take additional time after upload</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default VideoUploader;