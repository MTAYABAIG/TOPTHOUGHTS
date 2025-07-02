interface YouTubeChannelStats {
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
}

interface YouTubeApiResponse {
  items: Array<{
    statistics: YouTubeChannelStats;
  }>;
}

interface VideoUploadData {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  privacyStatus: 'private' | 'public' | 'unlisted';
}

export const fetchChannelStats = async (): Promise<YouTubeChannelStats | null> => {
  try {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;
    
    if (!apiKey || !channelId) {
      console.error('YouTube API key or channel ID not configured');
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data: YouTubeApiResponse = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].statistics;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching YouTube channel stats:', error);
    return null;
  }
};

export const formatNumber = (num: string): string => {
  const number = parseInt(num);
  
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  
  return number.toLocaleString();
};

// YouTube OAuth2 Authentication
export const initializeGoogleAuth = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window.gapi === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
          }).then(resolve).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      resolve(window.gapi.auth2.getAuthInstance());
    }
  });
};

export const signInToYouTube = async (): Promise<any> => {
  try {
    const authInstance = await initializeGoogleAuth();
    const user = await authInstance.signIn({
      scope: 'https://www.googleapis.com/auth/youtube.upload'
    });
    return user;
  } catch (error) {
    console.error('YouTube sign-in failed:', error);
    throw error;
  }
};

export const uploadVideoToYouTube = async (
  file: File, 
  videoData: VideoUploadData,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Get access token
    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const accessToken = user.getAuthResponse().access_token;

    // Create metadata
    const metadata = {
      snippet: {
        title: videoData.title,
        description: videoData.description,
        tags: videoData.tags,
        categoryId: videoData.categoryId,
      },
      status: {
        privacyStatus: videoData.privacyStatus,
      },
    };

    // Create form data for multipart upload
    const formData = new FormData();
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('video', file);

    // Upload video
    const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error('Video upload failed:', error);
    throw error;
  }
};

// Get video categories
export const getVideoCategories = async (): Promise<Array<{id: string, title: string}>> => {
  try {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
    }));
  } catch (error) {
    console.error('Error fetching video categories:', error);
    return [
      { id: '22', title: 'People & Blogs' },
      { id: '27', title: 'Education' },
      { id: '28', title: 'Science & Technology' },
    ];
  }
};