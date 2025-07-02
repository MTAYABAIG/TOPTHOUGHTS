import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  accessToken: string;
}

interface GoogleAuthContextType {
  user: GoogleUser | null;
  isSignedIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (context === undefined) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};

declare global {
  interface Window {
    google: any;
  }
}

export const GoogleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    document.head.appendChild(script);

    // Check for existing session
    const savedUser = localStorage.getItem('google-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsSignedIn(true);
      } catch (error) {
        localStorage.removeItem('google-user');
      }
    }
    setLoading(false);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
    }
  };

  const handleCredentialResponse = (response: any) => {
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData: GoogleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        accessToken: response.credential,
      };

      setUser(userData);
      setIsSignedIn(true);
      localStorage.setItem('google-user', JSON.stringify(userData));
      toast.success(`Welcome, ${userData.name}!`);
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  const signIn = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google API not loaded'));
        return;
      }

      // Use OAuth2 for YouTube access
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse: any) => {
          try {
            // Get user info
            const userInfoResponse = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
            );
            const userInfo = await userInfoResponse.json();

            const userData: GoogleUser = {
              id: userInfo.id,
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture,
              accessToken: tokenResponse.access_token,
            };

            setUser(userData);
            setIsSignedIn(true);
            localStorage.setItem('google-user', JSON.stringify(userData));
            toast.success(`Welcome, ${userData.name}!`);
            resolve();
          } catch (error) {
            toast.error('Failed to get user information');
            reject(error);
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  };

  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem('google-user');
    toast.success('Signed out successfully');
  };

  const value = {
    user,
    isSignedIn,
    signIn,
    signOut,
    loading,
  };

  return <GoogleAuthContext.Provider value={value}>{children}</GoogleAuthContext.Provider>;
};