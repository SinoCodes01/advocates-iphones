import { ReactNode } from "react";
import Link from "next/link";

export default function HelpLayout({ children }: { children: ReactNode }) {
  const categories = [
    { name: "Warranty Policy", href: "/help/warranty" },
    { name: "Delivery Info", href: "/help/delivery" },
    { name: "Returns & Refunds", href: "/help/returns" },
    { name: "FAQ", href: "/help/faq" },
    { name: "Privacy Policy", href: "/help/privacy" },
    { name: "Terms of Service", href: "/help/terms" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-navy-900 mb-6">Help Center</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">Need more help?</p>
                <Link
                  href="/contact"
                  className="block text-center bg-navy-900 text-white py-2 rounded-lg font-semibold hover:bg-navy-800 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8 md:p-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
