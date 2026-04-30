import { PRODUCTS } from "@/utils/products";
import ProductCard from "./ProductCard";
import StaggerReveal from "@/components/ui/StaggerReveal";

interface Props {
  productIds?: string[];
}

export default function ShopGrid({ productIds }: Props) {
  const products = productIds
    ? PRODUCTS.filter((p) => productIds.includes(p.id))
    : PRODUCTS;

  return (
    <StaggerReveal
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      stagger={0.08}
      y={30}
      duration={0.6}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </StaggerReveal>
  );
}
