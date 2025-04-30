import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import Formfield from "./Formfield";

import { Product } from "../types/Product";
// Add at the top of your file

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  const categories = [
    "jeans",
    "t-shirts",
    "shoes",
    "suits",
    "glasses",
    "jackets",
    "bags",
  ];

  const { createProduct, loading } = useProductStore();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.image
    ) {
      return alert("Please fill all required fields.");
    }

    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
      });
    } catch (error: any) {
      console.log("Product creation failed", error.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: (reader.result as string) || "",
        });
      };
      reader.readAsDataURL(file); //base 64-url
    }
  };
  return (
    <div className="min-w-1/2 relative border border-border rounded px-4 py-6 ">
      <h2 className="mb-4 text-font-main font-semibold text-2xl text-center">
        Add new product
      </h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        {/* PRODUCT NAME */}
        <Formfield
          type="text"
          title="Name"
          placeholder="Choose a name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <div className="flex flex-col">
          {/* DESCRIPTION */}
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="border border-gray-400 rounded shadow-sm mt-1 px-2 py-2"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </div>
        {/* PRICE */}
        <Formfield
          type="number"
          title="Price"
          value={newProduct.price.toString()}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
        />
        {/* CATEGORY */}
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          className="border border-gray-400 rounded px-2 py-2"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        >
          <option value="">select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* IMAGE */}
        {!newProduct.image ? (
          <Formfield
            type="file"
            title="Upload product image"
            accept="image/*"
            onChange={handleImageChange}
          />
        ) : (
          <img
            src={newProduct.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border mt-2"
          />
        )}
        <button
          type="submit"
          className="flex align-center gap-2 auth-btn cursor-pointer"
        >
          {loading ? (
            <>
              <div className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Plus />
              Create Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
