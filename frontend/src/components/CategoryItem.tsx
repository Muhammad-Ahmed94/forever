import { Link } from "react-router-dom";
import { CategoryProps } from "../types/Product";

const CategoryItem: React.FC<CategoryProps> = ({ category }) => {
  return (
    <Link
      to={"/category" + category.href}
      className="relative rounded-xl overflow-hidden h-64 group shadow-2xl"
    >
      {/* Background Image */}
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
      />

      {/* Overlay Text */}
      <div className="absolute bottom-4 left-4 text-font-main/80 drop-shadow">
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <p className="text-sm text-black/50">Explore {category.name}</p>
      </div>

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition duration-300" />
    </Link>
  );
};

export default CategoryItem;
