import { useState } from "react";
import Formfield from "./Formfield";
import { Plus } from "lucide-react";

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const categories = [
    "jeans",
    "t-shirt",
    "shoes",
    "suits",
    "glasses",
    "jackets",
    "bags",
  ];

  const loading = false;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newProduct);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct({...newProduct, image: reader.result as string || ""});
        }
        reader.readAsDataURL(file); //base 64-url
    }
  }
  return (
    <div className="min-w-1/2 relative border border-border rounded px-4 py-6 ">
      <h2 className="mb-4 text-font-main font-semibold text-2xl text-center">
        Add new product
      </h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
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
        <Formfield
          type="number"
          title="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
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

        <Formfield
          type="file"
          title="Upload product image"
          value={newProduct.image}
          onChange={handleImageChange}
        />
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
