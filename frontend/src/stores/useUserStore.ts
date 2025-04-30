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
      console.log(res.data);
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
      if (axios.isAxiosError(error) && error.message) {
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
      if (axios.isAxiosError(error) && error.message) {
        return toast.error(
          error.response?.data?.message || "An error occured while logging out",
        );
      }
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axiosInst.get("/auth/profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        set({ checkingAuth: false, user: null });
      } else {
        console.error("Error checking auth", error);
      }
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

//* Axios interceptor to refresh access token
// Updated axios interceptor in useUserStore.ts
axiosInst.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check for token expiration or unauthorized error
    if (
      (error.response?.status === 401 ||
        error.response?.data?.message === "Token expired") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("Token expired, attempting refresh");

      try {
        // if refresh is already in progress
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // start new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        useUserStore.getState().logout();
        toast.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
