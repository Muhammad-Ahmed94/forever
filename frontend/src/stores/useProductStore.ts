import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInst from "../lib/axios";

import { Product } from "../types/Product";

interface productStoreInterface {
  products: Product[];
  loading: boolean;

  setProducts: (products: Product[]) => void;
  createProduct: (productData: Product) => Promise<void>;
  getAllProducts: () => void;
  getProductsByCategory: (category: string) => void;
  activeFeatureProduct: (productId: string) => void;
  getFeaturedProduct: () => void;
  deleteProduct: (productId: string) => void;
}

export const useProductStore = create<productStoreInterface>((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });

    try {
      const res = await axiosInst.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.message) {
        toast.error(
          error.response?.data.message || "Error posting new product",
        );
      } else {
        toast.error("Error occured while creating new product");
      }
    }
  },

  getAllProducts: async () => {
    set({ loading: true });

    try {
      const res = await axiosInst.get("/products");
      set({ products: res.data.products, loading: false });
      console.log(res.data);
      toast.success("Retrieving all products");
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response?.data.message ||
            "Error occured while getting products from DB",
        );
      } else {
        toast.error("Failed to load products.");
      }
    }
  },

  getProductsByCategory: async (category) => {
    set({ loading: true });

    try {
      const res = await axiosInst.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response.data.message || "Error fetching product by category",
        );
      }
    }
  },

  activeFeatureProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axiosInst.patch(`/products/${productId}`);

      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: res.data.isFeatured }
            : product,
        ),
        loading: false,
      }));
      toast.success("Product is now featured");
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response?.data.message ||
            "Error occured while getting products from DB",
        );
      } else {
        toast.error("Failed to load products.");
      }
    }
  },

  getFeaturedProduct: async () => {
    set({ loading: true });

    try {
      const res = await axiosInst.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log("Error fetching featured products:", error);
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });

    try {
      await axiosInst.delete(`/products/${productId}`);

      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId,
        ),
        loading: false,
      }));
      
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response?.data.message ||
            "Error occured while getting products from DB",
        );
      } else {
        toast.error("Failed to load products.");
      }
    }
  },
}));
