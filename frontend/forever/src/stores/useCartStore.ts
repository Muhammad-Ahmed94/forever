import { create } from "zustand";
import axiosInst from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

import { Product } from "../types/Product";

interface Coupon {
  discountPercentage: number;
  code: string;
}
interface cartInterface {
  cart: Product[];
  coupon: Coupon | null;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;

  getCartItems: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => void;
  clearCart: () => Promise<void>;
  calculateTotals: () => void;
  updateQuantity: (prouctId: string, quantity: number) => void;
}

export const useCartStore = create<cartInterface>((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axiosInst.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error("Could not retrieve products from cart");
      } else {
        toast.error("Unexpected error occurred while getting products");
      }
    }
  },

  addToCart: async (product) => {
    try {
      await axiosInst.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: (item.quantity || 0) + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });

      get().calculateTotals();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error("Could not add product to cart");
      } else {
        toast.error("Unexpected error occurred while adding to cart");
      }
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInst.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error("Could not remove product from cart");
    }
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    try {
      await axiosInst.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error("Could not update product quantity");
    }
  },
}));
