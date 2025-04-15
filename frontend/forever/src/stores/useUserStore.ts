import {create} from 'zustand';
import {toast} from 'react-hot-toast';
import axiosInst from '../lib/axios';
import axios from 'axios';

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axiosInst.post("/auth/signup", { name, email, password });
      set({ user: res.data.user, loading: false });
      console.log(res.data.user);
    } catch (error:unknown) {
      set({ loading: false });

      if(axios.isAxiosError(error) && error.response){
          toast.error(error.response.data.message || "An error occured");
      } else {
        toast.error("An unexpected error occured")
      }
    }
  },
}));
export default useUserStore;