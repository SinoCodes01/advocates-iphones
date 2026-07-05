import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Shield,
  ShoppingBag,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Trust badges */}
      <div className="border-b border-navy-800 bg-navy-900/50">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-brand-500 transition-colors">
                <div className="relative w-8 h-8">
                  <Shield className="w-8 h-8 text-brand-400" />
                </div>
              </div>
              <div>
                <p className="font-bold text-lg">AUTHENTIC PRODUCTS</p>
                <p className="text-sm text-gray-400">Verified genuine Apple devices</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-brand-500 transition-colors">
                <MessageCircle className="w-8 h-8 text-brand-400" />
              </div>
              <div>
                <p className="font-bold text-lg uppercase">Trusted Service</p>
                <p className="text-sm text-gray-400">Exceptional support & care</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-brand-500 transition-colors">
                <ShoppingBag className="w-8 h-8 text-brand-400" />
              </div>
              <div>
                <p className="font-bold text-lg uppercase">Great Prices Everytime</p>
                <p className="text-sm text-gray-400">Unbeatable value guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/advocates-logo.png"
                  alt="Advocates iPhones Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div>
                <span className="font-bold text-xl block leading-tight">Advocates</span>
                <span className="text-brand-400 font-bold text-sm block leading-none uppercase tracking-widest">iPhones</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium iPhones and accessories in South
              Africa.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/advocates_iphones"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-800 hover:bg-brand-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/27735152402"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-800 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/shop?condition=new" className="text-gray-400 hover:text-brand-400 transition-colors">
                  New iPhones
                </Link>
              </li>
              <li>
                <Link href="/shop?condition=refurbished" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Refurbished
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help/warranty" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/help/delivery" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="text-gray-400 hover:text-brand-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-brand-400" />
                <span>KuGompo City, South Africa</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-brand-400" />
                <span>0735152402</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-brand-400" />
                <span>hello@advocatesiphones.co.za</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Advocates iPhones. All rights reserved. Made by SinoCodes01.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/help/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/help/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}