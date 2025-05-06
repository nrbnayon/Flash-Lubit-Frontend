// lib\axios.ts
// lib\axios.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.10.251:8000/api';
const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

// Type for auth tokens
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Create a configured axios instance with interceptors for authentication
 */
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  // Create base axios instance
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true, // Important for cookies
    ...config,
  });

  // Variable to track if we're currently refreshing token
  let isRefreshing = false;
  // Queue of failed requests to retry after token refresh
  let failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }[] = [];

  // Function to process the queue of failed requests
  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else if (token) {
        if (request.config.headers) {
          request.config.headers['Authorization'] = `Bearer ${token}`;
        }
        request.resolve(instance(request.config));
      }
    });
    failedQueue = [];
  };

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
      if (accessToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      
      // If error is not 401 (Unauthorized) or request has already been retried, reject
      if (!error.response || error.response.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
        
        if (!refreshToken) {
          // No refresh token available, force logout
          handleLogout();
          return Promise.reject(new Error('No refresh token available'));
        }

        // Call refresh token endpoint
        const { data }: AxiosResponse<AuthTokens> = await axios.post(
          `${API_BASE_URL}/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        // Update tokens in cookies
        saveTokens(data);

        // Update Authorization header for original request
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        }

        // Process queued requests
        processQueue(null, data.accessToken);
        
        // Retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, force logout
        processQueue(refreshError as Error);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return instance;
};

/**
 * Save authentication tokens to cookies
 */
export const saveTokens = (tokens: AuthTokens): void => {
  // Set secure cookie options
  const cookieOptions = {
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'strict' as const,
    path: '/',
    // You might want to set expires based on your token expiration time
  };

  Cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, cookieOptions);
  Cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, cookieOptions);
};

/**
 * Remove authentication tokens from cookies
 */
export const clearTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: '/' });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: '/' });
};

/**
 * Handle logout - clear tokens and redirect if needed
 */
export const handleLogout = (): void => {
  clearTokens();
  
  // In a browser environment, you might want to redirect to login
  // This is now handled by the AuthContext
};

/**
 * Get the current access token
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_COOKIE);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Create and export default axios instance
const api = createAxiosInstance();
export default api;

// Also export a function to create custom instances
export const createApi = createAxiosInstance;