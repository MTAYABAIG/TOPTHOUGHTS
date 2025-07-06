import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { postsAPI, UpdatePostData } from '../services/apiService';
import { usePost } from '../hooks/usePosts';
import Button from '../components/UI/Button';
import ImageUpload from '../components/UI/ImageUpload';
import RichTextEditor from '../components/UI/RichTextEditor';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import AITitleEnhancer from '../components/UI/AITitleEnhancer';

interface PostForm {
  title: string;
  content: string;
  imageUrl: string;
  youtubeUrl: string;
}

export default function EditPostPage() {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { post, loading: postLoading, error } = usePost({ id: id! });
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PostForm>();

  const watchedFields = watch();

  useEffect(() => {
    if (post) {
      setValue('title', post.title);
      setValue('content', post.content);
      setValue('imageUrl', post.imageUrl || '');
      setValue('youtubeUrl', post.youtubeUrl || '');
    }
  }, [post, setValue]);

  const onSubmit = async (data: PostForm) => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      const updateData: UpdatePostData = {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
        youtubeUrl: data.youtubeUrl || undefined,
      };
      
      await postsAPI.updatePost(id, updateData);
      toast.success('Post updated successfully!');
      navigate(`/blog/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update post';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeleteLoading(true);
    
    try {
      await postsAPI.deletePost(id);
      toast.success('Post deleted successfully!');
      navigate('/admin');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete post';
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Extract plain text from HTML content for preview
  const getPlainTextFromHTML = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  if (postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            {error || 'Post Not Found'}
          </h1>
          <Link
            to="/admin"
            className="text-black hover:text-neutral-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
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
              to="/admin"
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Edit Post</h1>
              <p className="text-neutral-600">Update your blog post</p>
            </div>
          </div>
          <Button
            onClick={handleDelete}
            variant="danger"
            icon={Trash2}
            loading={deleteLoading}
            disabled={loading}
          >
            Delete Post
          </Button>
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
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
                        Title *
                      </label>
                      <AITitleEnhancer
                        currentTitle={watchedFields.title}
                        onTitleSelect={(title) => setValue('title', title)}
                      />
                    </div>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="Enter an engaging post title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      {watchedFields.title?.length || 0}/60 characters {(watchedFields.title?.length || 0) > 60 && '(too long for SEO)'}
                    </p>
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
                disabled={deleteLoading}
              >
                {loading ? 'Updating...' : 'Update Post'}
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
                  
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500">
                      Post ID: {post._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}