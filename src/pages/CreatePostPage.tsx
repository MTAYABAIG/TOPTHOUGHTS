import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Save, Eye, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import Button from '../components/UI/Button';
import ImageUpload from '../components/UI/ImageUpload';
import TagInput from '../components/UI/TagInput';
import RichTextEditor from '../components/UI/RichTextEditor';

interface PostForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  category: { value: string; label: string } | null;
  videoUrl: string;
  isPublished: boolean;
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
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      tags: [],
      category: null,
      videoUrl: '',
      isPublished: false,
    }
  });

  const watchedFields = watch();

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    if (!watchedFields.slug || watchedFields.slug === generateSlug(watchedFields.title)) {
      setValue('slug', generateSlug(title));
    }
  };

  const categoryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' },
    { value: 'development', label: 'Development' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'education', label: 'Education' },
    { value: 'science', label: 'Science' },
  ];

  const onSubmit = async (data: PostForm) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this data to your backend
      console.log('Creating post:', {
        ...data,
        category: data.category?.value,
        author: 'Admin', // This would come from auth context
        createdAt: new Date().toISOString(),
      });
      
      toast.success(`Post ${data.isPublished ? 'published' : 'saved as draft'} successfully!`);
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    setValue('isPublished', false);
    handleSubmit(onSubmit)();
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
                      onChange={handleTitleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="Enter an engaging post title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-neutral-700 mb-2">
                      Slug
                    </label>
                    <input
                      {...register('slug')}
                      type="text"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="url-friendly-slug"
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      Auto-generated from title. Edit if needed.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-neutral-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      {...register('excerpt')}
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Brief description for previews and SEO"
                    />
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
                    name="featuredImage"
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
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                      YouTube Video URL
                    </label>
                    <input
                      {...register('videoUrl')}
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

              {/* Categories and Tags */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Organization</h2>
                
                <div className="space-y-6">
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
                          options={categoryOptions}
                          placeholder="Select a category"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                        />
                      )}
                    />
                  </div>

                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        label="Tags"
                        placeholder="Type and press Enter to add tags"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Publishing Options */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-6">Publishing</h2>
                
                <div className="flex items-center space-x-3">
                  <input
                    {...register('isPublished')}
                    type="checkbox"
                    id="isPublished"
                    className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-neutral-700">
                    Publish immediately
                  </label>
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Uncheck to save as draft
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  loading={loading}
                  icon={Save}
                  size="lg"
                  onClick={() => setValue('isPublished', true)}
                >
                  {loading ? 'Publishing...' : 'Publish Post'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={saveDraft}
                  disabled={loading}
                >
                  Save Draft
                </Button>
              </div>
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
                  {watchedFields.featuredImage && (
                    <img
                      src={watchedFields.featuredImage}
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
                      {watchedFields.excerpt || getPlainTextFromHTML(watchedFields.content)?.substring(0, 150) || 'Post content will appear here...'}
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
                          className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {watchedFields.tags.length > 3 && (
                        <span className="text-xs text-neutral-500">
                          +{watchedFields.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {watchedFields.videoUrl && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">
                        📹 YouTube video will be embedded
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500">
                      Status: {watchedFields.isPublished ? 'Published' : 'Draft'}
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
};

export default CreatePostPage;