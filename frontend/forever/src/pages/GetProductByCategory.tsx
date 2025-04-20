import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";


const GetProductByCategory = () => {
    const { getProductsByCategory, products } = useProductStore();
    const { category } = useParams();
    useEffect(() => {
      if (category) {
        getProductsByCategory(category);
      } else {
        console.error("Category is undefined");
      }
      console.log("Products", products);
    }, [getProductsByCategory, category]);
  return (
    <div>GetProductByCategory</div>
  )
}

export default GetProductByCategory