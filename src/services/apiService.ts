import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('auth-token');
      localStorage.removeItem('user-data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  youtubeUrl?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  imageUrl?: string;
  youtubeUrl?: string;
}

export interface UpdatePostData extends CreatePostData {}

export interface PostsResponse {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  // Get all posts with pagination and search
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PostsResponse> => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get single post by ID
  getPost: async (id: string): Promise<BlogPost> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (data: CreatePostData): Promise<BlogPost> => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // Update existing post
  updatePost: async (id: string, data: UpdatePostData): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;