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
}

interface productStoreInterface {
    products: Product[];
    loading: boolean;
    setProducts: (products: Product[]) => void;
    createProduct: (productData: Product) => Promise<void>
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
      toast.success("Product created successfully")
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
}));
