import { ShopClient } from "@/components/storefront/ShopClient";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "Shop iPhones | Advocates iPhones",
  description: "Browse our premium selection of new, refurbished, and pre-owned iPhones. Verified quality and nationwide delivery.",
};

export default async function ShopPage() {
  // Fetch initial products on the server for instant loading
  const initialProducts = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4 tracking-tight">
            Shop iPhones
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Premium quality, verified devices. Find the perfect iPhone that fits your needs and budget.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ShopClient initialProducts={initialProducts} />
      </div>
    </div>
  );
}
