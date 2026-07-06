import type { Metadata } from "next";
import "./globals.css";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.advocatesiphones.com"),
  title: {
    default: "Advocates iPhones | Premium iPhones & Accessories",
    template: "%s | Advocates iPhones",
  },
  description:
    "Discover premium new and refurbished iPhones, accessories, and reliable warranty support from Advocates iPhones.",
  keywords: [
    "iPhones",
    "refurbished iPhones",
    "Apple accessories",
    "phone accessories",
    "premium phones",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Advocates iPhones | Premium iPhones & Accessories",
    description:
      "Shop premium new and refurbished iPhones with trusted quality, warranty support, and fast delivery.",
    url: "/",
    type: "website",
    siteName: "Advocates iPhones",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advocates iPhones | Premium iPhones & Accessories",
    description:
      "Shop premium new and refurbished iPhones with trusted quality, warranty support, and fast delivery.",
  },
  robots: {
    index: true,
    follow: true,
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
        <QueryProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}