import type { Metadata } from "next";
import "./globals.css";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Advocates iPhones | Premium iPhones & Accessories",
  description:
    "Your trusted source for brand new and refurbished iPhones. Premium quality, authentic products, and excellent warranty.",
  openGraph: {
    title: "Advocates iPhones | Premium iPhones & Accessories",
    description:
      "Your trusted source for brand new and refurbished iPhones. Shop with confidence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}