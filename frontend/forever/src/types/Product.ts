export interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image: string;
  isFeatured?: boolean;
  quantity?: number;
}

export interface CategoryProps {
  category: {
    href: string;
    name: string;
    imageUrl: string;
  };
}