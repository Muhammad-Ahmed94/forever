import { ShoppingCart } from "lucide-react";
import useUserStore from "../stores/useUserStore";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";

import { Product } from "../types/Product";

const Item = ({ product }: { product: Product }) => {
    const { user } = useUserStore();
    const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if(!user) {
        return toast.error("Login to add to cart");
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt="product image"
        />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-2xl font-semibold tracking-tight text-font-main capitalize">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-xl font-bold text-black/60">
              ${product.price}
            </span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg auth-btn px-5 py-2.5 text-center text-sm font-medium
           text-white focus:outline-none focus:ring-4"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Item;
