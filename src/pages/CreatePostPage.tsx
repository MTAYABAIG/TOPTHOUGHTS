import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { postsAPI, CreatePostData } from '../services/apiService';
import Button from '../components/UI/Button';
import ImageUpload from '../components/UI/ImageUpload';
import RichTextEditor from '../components/UI/RichTextEditor';

interface PostForm {
  title: string;
  content: string;
  imageUrl: string;
  youtubeUrl: string;
}

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PostForm>({
    defaultValues: {
      title: '',
      content: '',
      imageUrl: '',
      youtubeUrl: '',
    }
  });

  const watchedFields = watch();

  const onSubmit = async (data: PostForm) => {
    setLoading(true);
    
    try {
      const postData: CreatePostData = {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
        youtubeUrl: data.youtubeUrl || undefined,
      };
      
      const newPost = await postsAPI.createPost(postData);
      toast.success('Post created successfully!');
      navigate(`/blog/${newPost._id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Extract plain text from HTML content for preview
  const getPlainTextFromHTML = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

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
              to="/admin"
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Create New Post</h1>
              <p className="text-neutral-600">Write and publish a new blog post</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                      Title *
                    </label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="Enter an engaging post title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Content *</h2>
                
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'Content is required' }}
                  render={({ field }) => (
                    <div className="mb-16">
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Start writing your amazing content..."
                        height={500}
                      />
                    </div>
                  )}
                />
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              {/* Media */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Media</h2>
                
                <div className="space-y-6">
                  <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Featured Image"
                        placeholder="Enter image URL or upload file"
                      />
                    )}
                  />

                  <div>
                    <label htmlFor="youtubeUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                      YouTube Video URL
                    </label>
                    <input
                      {...register('youtubeUrl')}
                      type="url"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      Add a YouTube video to make this post appear in the video library
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                icon={Save}
                size="lg"
                className="w-full md:w-auto"
              >
                {loading ? 'Creating...' : 'Create Post'}
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
            <div className="sticky top-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5 text-neutral-600" />
                  <h2 className="text-lg font-semibold text-neutral-900">Preview</h2>
                </div>
                
                <div className="space-y-4">
                  {watchedFields.imageUrl && (
                    <img
                      src={watchedFields.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2">
                      {watchedFields.title || 'Post Title'}
                    </h3>
                    <p className="text-neutral-600 text-sm line-clamp-3">
                      {getPlainTextFromHTML(watchedFields.content)?.substring(0, 150) || 'Post content will appear here...'}
                    </p>
                  </div>
                  
                  {watchedFields.youtubeUrl && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">
                        📹 YouTube video will be embedded
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;