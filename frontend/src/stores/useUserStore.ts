/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import axiosInst from "../lib/axios";

interface userStoreInterface {
  user: any;
  loading: boolean;
  checkingAuth: boolean;

  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  checkAuth: () => void;
  refreshToken: () => Promise<void>;
}

const useUserStore = create<userStoreInterface>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (name, email, password, confirmPassword) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axiosInst.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data.user, loading: false });
      toast.success("Account created successfully");
    } catch (error) {
      set({ loading: false });

      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "An error occured");
      } else {
        toast.error("An unexpected error occured");
      }
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axiosInst.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
      toast.success("User logged in successfully");
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response?.data.message || "Login error occured",
        );
      } else {
        toast.error("Unexpected error occured");
      }
    }
  },

  logout: async () => {
    try {
      await axiosInst.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successfully");
    } catch (error) {
      set({ user: null }); // Still clear user state even if logout fails
      if (axios.isAxiosError(error) && error.response) {
        console.error("Logout error:", error.response.data?.message);
      }
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axiosInst.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status !== 401) {
          console.error("Error checking auth:", error.response?.data?.message);
        }
      }
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const res = await axiosInst.post("/auth/refresh-access-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

export default useUserStore;

let refreshPromise: Promise<any> | null = null;

axiosInst.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/signup')) {
      return Promise.reject(error);
    }

    // Check for token expiration or unauthorized error
    if (
      (error.response?.status === 401 ||
        error.response?.data?.message === "Token expired") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("Token expired, attempting refresh");

      try {
        // If refresh is already in progress, wait for it
        if (refreshPromise) {
          await refreshPromise;
          return axiosInst(originalRequest);
        }

        // Start new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInst(originalRequest); // Use axiosInst instead of axios
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        refreshPromise = null;

        // Only logout if we are not already on login/signup pages or checkout success
        const currentPath = window.location.pathname;
        if (!['/login', '/signup', '/purchase-success'].includes(currentPath)) {
          useUserStore.getState().logout();
          toast.error("Session expired. Please log in again.");
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);