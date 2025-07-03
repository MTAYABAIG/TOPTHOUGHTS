import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
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
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [pendingSignIn, setPendingSignIn] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
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
      setShowRecaptcha(false);
      setPendingSignIn(false);
    } catch (error) {
      toast.error('Failed to sign in with Google');
      setShowRecaptcha(false);
      setPendingSignIn(false);
    }
  };

  const onRecaptchaChange = (token: string | null) => {
    if (token && pendingSignIn) {
      proceedWithGoogleSignIn();
    }
  };

  const proceedWithGoogleSignIn = () => {
    if (!window.google) {
      toast.error('Google API not loaded');
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
          setShowRecaptcha(false);
          setPendingSignIn(false);
        } catch (error) {
          toast.error('Failed to get user information');
          setShowRecaptcha(false);
          setPendingSignIn(false);
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  };

  const signIn = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Show reCAPTCHA first
      setShowRecaptcha(true);
      setPendingSignIn(true);
      
      // Set up promise resolution
      const checkSignIn = setInterval(() => {
        if (isSignedIn) {
          clearInterval(checkSignIn);
          resolve();
        }
      }, 1000);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(checkSignIn);
        if (!isSignedIn) {
          setShowRecaptcha(false);
          setPendingSignIn(false);
          reject(new Error('Sign in timeout'));
        }
      }, 120000);
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

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
      
      {/* reCAPTCHA Modal */}
      {showRecaptcha && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Security Verification</h3>
              <p className="text-neutral-600">Please complete the verification to continue with Google sign-in</p>
            </div>
            
            <div className="flex justify-center mb-6">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.RECAPTHCA_API_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                onChange={onRecaptchaChange}
                theme="light"
              />
            </div>
            
            <button
              onClick={() => {
                setShowRecaptcha(false);
                setPendingSignIn(false);
              }}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </GoogleAuthContext.Provider>
  );
};