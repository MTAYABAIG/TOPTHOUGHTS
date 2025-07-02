import { useState, useEffect } from 'react';
import { fetchChannelStats, formatNumber } from '../services/youtubeService';

interface FormattedStats {
  subscribers: string;
  videos: string;
  views: string;
  loading: boolean;
  error: string | null;
}

export const useYouTubeStats = (): FormattedStats => {
  const [stats, setStats] = useState<FormattedStats>({
    subscribers: '0',
    videos: '0',
    views: '0',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));
        
        const channelStats = await fetchChannelStats();
        
        if (channelStats) {
          setStats({
            subscribers: formatNumber(channelStats.subscriberCount),
            videos: formatNumber(channelStats.videoCount),
            views: formatNumber(channelStats.viewCount),
            loading: false,
            error: null,
          });
        } else {
          setStats(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load channel statistics',
          }));
        }
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error loading YouTube statistics',
        }));
      }
    };

    loadStats();
  }, []);

  return stats;
};