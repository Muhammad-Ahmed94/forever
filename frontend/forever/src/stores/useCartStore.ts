import { create } from "zustand";
import axiosInst from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

interface cartInterface {
  cart: [];
  coupon: null;
  total: number;
  subtotal: number;

  getCartItems: () => {};
//   addToCart: (product: Product) => {};
}

interface Product {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  _id?: string;
  isFeatured?: boolean;
}

export const useCartStrore = create<cartInterface>((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    try {
      const res = await axiosInst.get("/cart");
      set({ cart: res.data });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return toast.error("Could not retrieve prodcuts from cart");
      } else {
        toast.error(
          "Unexpected error happend while getting prodcuts from the cart"
        );
      }
    }
  },

  /* addToCart: async (product) => {
    try {
        await axiosInst.post("/", { productId: product._id });
        toast.success("Product added to cart");

        set((prevState) => {
            const existingItem = prevState.cart.find(item => item._id === product._id);
        })
    } catch (error) {
        
    }
  } */
}));
