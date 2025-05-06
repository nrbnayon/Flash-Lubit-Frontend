"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, handleLogout } from "@/lib/axios";
import { User } from "@/lib/types";
import api from "@/lib/axios";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  checkAuth: async () => false,
  logout: async () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const clearError = () => setError(null);

  const fetchUser = async (): Promise<User | null> => {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user profile");
      return null;
    }
  };

  const checkAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    if (!isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return false;
    }

    try {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
        setIsLoading(false);
        return true;
      } else {
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setUser(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = async () => {
    try {
      // You might want to call a logout endpoint here
      // await api.post("/auth/logout");
      handleLogout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to logout properly");
      // Still clear tokens even if the API call fails
      handleLogout();
      setUser(null);
      router.push("/login");
    }
  };

  // Check authentication on mount and when pathname changes
  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname || "");

    // Don't check auth for public routes
    if (isPublicRoute) {
      setIsLoading(false);
      return;
    }

    const runAuthCheck = async () => {
      const isAuthed = await checkAuth();
      if (!isAuthed && !isPublicRoute) {
        router.push("/login");
      }
    };

    runAuthCheck();
  }, [pathname, router, checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        checkAuth,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
