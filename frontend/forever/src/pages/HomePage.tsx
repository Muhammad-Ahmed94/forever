import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const category = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/t-shirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  const { getFeaturedProduct, products, loading } = useProductStore();

  useEffect(() => {
    getFeaturedProduct();
  }, [getFeaturedProduct]);

  return (
    <div className="relative min-h-screen text-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold">
          Explore our collections
        </h1>
        <p className="text-center text-xl text-[#b2b2b2] mb-12">Discover our wide variety of collections at your tips</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {category.map(category => (
            <CategoryItem key={category.name} category={category} />
          ))}
        </div>

        {!loading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}

      </div>
    </div>
  );
};

export default HomePage