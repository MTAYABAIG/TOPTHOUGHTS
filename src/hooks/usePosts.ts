import { useState, useEffect } from 'react';
import { postsAPI, BlogPost, PostsResponse } from '../services/apiService';
import toast from 'react-hot-toast';

interface UsePostsOptions {
  page?: number;
  limit?: number;
  search?: string;
  autoFetch?: boolean;
}

interface UsePostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  refetch: () => Promise<void>;
}

export const usePosts = (options: UsePostsOptions = {}): UsePostsReturn => {
  const { page = 1, limit = 10, search = '', autoFetch = true } = options;
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getPosts({
        page,
        limit,
        search: search || undefined,
      });
      
      setPosts(response.posts);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setTotal(response.total);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchPosts();
    }
  }, [page, limit, search, autoFetch]);

  return {
    posts,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refetch: fetchPosts,
  };
};

// Hook for single post
interface UsePostOptions {
  id: string;
  autoFetch?: boolean;
}

interface UsePostReturn {
  post: BlogPost | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePost = (options: UsePostOptions): UsePostReturn => {
  const { id, autoFetch = true } = options;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getPost(id);
      setPost(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && id) {
      fetchPost();
    }
  }, [id, autoFetch]);

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  };
};