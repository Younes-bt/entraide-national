import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Matches the UserProfileSerializer more closely, though password won't be stored here.
export interface User {
  id: number;
  email: string;
  username?: string; // username might be blank if not explicitly set or derived
  first_name: string;
  last_name: string;
  role: string; // e.g., 'student', 'admin'
  role_display?: string; // From get_role_display()
  profile_picture?: string | null;
  birth_date?: string | null;
  birth_city?: string | null;
  CIN_id?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  date_joined?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email_param: string, password_param: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean; // Helper to check if user and token exist
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [isLoading, setIsLoading] = useState<boolean>(false); // Initially true if we auto-fetch user
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserProfile = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) { // Token might be expired
          // Attempt to refresh token here if implemented, for now just logout
          console.error('Unauthorized fetching profile, token might be expired.');
          handleLogoutInternal(false); // Don't try to call API logout if token is already invalid
        }
        throw new Error('Failed to fetch user profile');
      }
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (e) {
      console.error('Fetch user profile error:', e);
      setError((e as Error).message);
      return null;
    }
  };
  
  // Effect to load user on initial mount or when accessToken changes externally
  useEffect(() => {
    const currentToken = localStorage.getItem('accessToken');
    if (currentToken) {
      setAccessToken(currentToken);
      setIsLoading(true);
      fetchUserProfile(currentToken).finally(() => setIsLoading(false));
    } else {
      setUser(null); // No token, no user
    }
  }, []); // Run once on mount

  const login = async (email_param: string, password_param: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email_param, password: password_param }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      
      // Fetch user profile after successful token retrieval
      const fetchedUser = await fetchUserProfile(data.access);
      setIsLoading(false);
      if (fetchedUser) {
        navigateBasedOnRole(fetchedUser.role); // Navigate after setting user
        return true;
      }
      return false; // User fetch failed

    } catch (e) {
      setError((e as Error).message);
      setIsLoading(false);
      return false;
    }
  };

  const navigateBasedOnRole = (role: string) => {
    switch (role) {
      case 'admin': navigate('/admin/dashboard'); break;
      case 'center_supervisor': navigate('/center/dashboard'); break;
      case 'association_supervisor': navigate('/association/dashboard'); break;
      case 'trainer': navigate('/trainer/dashboard'); break;
      case 'student': navigate('/student/dashboard'); break;
      default: navigate('/');
    }
  };

  const handleLogoutInternal = (callApi = true) => {
    if (callApi && refreshToken) {
        fetch(`${API_BASE_URL}/accounts/users/logout/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        }).catch(e => console.error('API Logout failed:', e)); // Log error but proceed with client logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setError(null); // Clear any previous errors
  };

  const logout = () => {
    handleLogoutInternal(true);
    navigate('/');
  };
  
  const isAuthenticated = () => !!user && !!accessToken;

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, error, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 