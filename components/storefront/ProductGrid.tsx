import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="py-12">
      {title && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-navy-900 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium iPhones, each device
            verified for quality and authenticity.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}