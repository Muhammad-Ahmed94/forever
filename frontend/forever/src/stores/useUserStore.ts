import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInst from "../lib/axios";
import axios from "axios";

interface userStoreInterface {
  user: any;
  loading: boolean;
  checkingAuth: boolean;
  signup: (name: string, email: string, password: string, confirmPassword: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  checkAuth: () => void;
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
      set({ user: res.data, loading: false });
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
      console.log(`Loggin in and: ${res.data.user}`);
      set({ user: res.data, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return toast.error(
          error.response?.data.message || "Login error occured"
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return toast.error(
          error.response?.data?.message || "An error occured while logging out"
        );
      }
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axiosInst.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
}));
export default useUserStore;
