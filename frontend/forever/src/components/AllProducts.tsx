import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { Star, Trash } from "lucide-react";

const AllProducts = () => {
  const { getAllProducts, activeFeatureProduct, deleteProduct, products } = useProductStore();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <table className=" min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700">
        <tr>
          <th scope="col" className="table-header">
            Product
          </th>
          <th scope="col" className="table-header">
            Price
          </th>
          <th scope="col" className="table-header">
            Category
          </th>

          <th scope="col" className="table-header">
            Featured
          </th>
          <th scope="col" className="table-header">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {products?.map((product) => (
          <tr key={product._id} className="hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-white">
                    {product.name}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-300">${product.price}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-300">{product.category}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => product._id && activeFeatureProduct(product._id)}
                className={`p-1 rounded-full ${
                  product.isFeatured
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-600 text-gray-300"
                } hover:bg-yellow-500 transition-colors duration-200`}
              >
                <Star className="h-5 w-5" />
                ""
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => product._id && deleteProduct(product._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash className="h-5 w-5" />
                ""
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllProducts;
