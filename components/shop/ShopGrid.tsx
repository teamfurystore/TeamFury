import { PRODUCTS, Product } from "@/utils/products";
import ProductCard from "./ProductCard";

interface ShopGridProps {
  productIds?: string[];
  onAddToCart?: (product: Product) => void;
}

export default function ShopGrid({ productIds, onAddToCart }: ShopGridProps) {
  const products = productIds
    ? PRODUCTS.filter((p) => productIds.includes(p.id))
    : PRODUCTS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={(p) => onAddToCart?.(p)}
        />
      ))}
    </div>
  );
}
