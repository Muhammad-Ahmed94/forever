import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInst from "../lib/axios";
import axios from "axios";

interface Product {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  _id?: string;
  isFeatured?:boolean;
}

interface productStoreInterface {
  products: Product[];
  loading: boolean;
  setProducts: (products: Product[]) => void;
  createProduct: (productData: Product) => Promise<void>;
  getAllProducts: () => void;
  activeFeatureProduct: (productId: string) => void;
  deleteProduct: (productId: string) => void;
}

export const useProductStore = create<productStoreInterface>((set, get) => ({
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
          error.response?.data.message || "Error posting new product"
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
            "Error occured while getting products from DB"
        );
      } else {
        toast.error("Failed to load products.");
      }
    }
  },

  activeFeatureProduct: async (productId) => {
    console.log("before loading false");

    set({ loading: true });
    try {
      console.log("before res");
      const res = await axiosInst.patch(`/products/${productId}`);
      console.log("after res");

      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success("Product is now featured");
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response?.data.message ||
            "Error occured while getting products from DB"
        );
      } else {
        toast.error("Failed to load products.");
      }
    }
  },

  deleteProduct: async (productId) => {
    console.log("before loading false");
    set({ loading: true });
    console.log("after loading false");

    try {
    console.log("before axios");

      await axiosInst.delete(`/products/${productId}`);
    console.log("after axios");

      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    console.log("after ssetting delete");

      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error) && error.response) {
        return toast.error(
          error.response?.data.message ||
            "Error occured while getting products from DB"
        );
      } else {
        toast.error("Failed to load products.");
      }
    }
  },
}));
