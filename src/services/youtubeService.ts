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

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenResponse {
        access_token: string;
        expires_in: number;
        token_type: string;
        scope: string;
      }

      interface TokenClientConfig {
        client_id: string;
        scope: string;
        prompt?: string;
        callback: (tokenResponse: TokenResponse) => void;
      }

      interface TokenClient {
        requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
    }
  }
}

interface VideoUploadData {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  privacyStatus: "private" | "public" | "unlisted";
}

// ---- CHANNEL STATS ----
export const fetchChannelStats =
  async (): Promise<YouTubeChannelStats | null> => {
    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

      if (!apiKey || !channelId) {
        console.error("YouTube API key or channel ID not configured");
        return null;
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );

      if (!response.ok)
        throw new Error(`YouTube API error: ${response.status}`);

      const data: YouTubeApiResponse = await response.json();
      return data.items?.[0]?.statistics || null;
    } catch (error) {
      console.error("Error fetching YouTube channel stats:", error);
      return null;
    }
  };

// ---- NUMBER FORMATTER ----
export const formatNumber = (num: string): string => {
  const number = parseInt(num);
  return number >= 1_000_000
    ? (number / 1_000_000).toFixed(1) + "M"
    : number >= 1_000
    ? (number / 1_000).toFixed(1) + "K"
    : number.toLocaleString();
};

// ---- NEW GIS TOKEN CLIENT ----
let accessToken: string | null = null;
let tokenClient: google.accounts.oauth2.TokenClient | null = null;

export const initializeYouTubeAuth = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID!,
        scope: "https://www.googleapis.com/auth/youtube.upload",
        callback: (tokenResponse) => {
          accessToken = tokenResponse.access_token;
          resolve();
        },
      });
    }

    tokenClient.requestAccessToken({ prompt: "consent" });
  });
};

// ---- VIDEO UPLOAD ----
export const uploadVideoToYouTube = async (
  file: File,
  videoData: VideoUploadData,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    if (!accessToken) {
      await initializeYouTubeAuth();
    }

    if (!accessToken) throw new Error("Access token not available");

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

    const formData = new FormData();
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    formData.append("metadata", metadataBlob);
    formData.append("video", file);

    const response = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error("Video upload failed:", error);
    throw error;
  }
};

// ---- VIDEO CATEGORIES ----
export const getVideoCategories = async (): Promise<
  Array<{ id: string; title: string }>
> => {
  try {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=${apiKey}`
    );

    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
    }));
  } catch (error) {
    console.error("Error fetching video categories:", error);
    return [];
  }
};
