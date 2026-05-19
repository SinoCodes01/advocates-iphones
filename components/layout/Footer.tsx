import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Shield,
  RefreshCw,
  Truck,
  CreditCard,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Trust badges */}
      <div className="border-b border-navy-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-800 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold">100% Authentic</p>
                <p className="text-sm text-gray-400">Verified genuine products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-800 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold">Easy Returns</p>
                <p className="text-sm text-gray-400">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-800 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold">Nationwide Delivery</p>
                <p className="text-sm text-gray-400">Reliable shipping</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-800 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold">Secure Payment</p>
                <p className="text-sm text-gray-400">EFT & WhatsApp pay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="font-bold text-xl">Advocates</span>
                <span className="text-brand-400 font-bold"> iPhones</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium iPhones and accessories in South
              Africa.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-navy-800 hover:bg-brand-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-navy-800 hover:bg-brand-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/27612345678"
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
                <a href="#warranty" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Warranty Policy
                </a>
              </li>
              <li>
                <a href="#delivery" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#returns" className="text-gray-400 hover:text-brand-400 transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-brand-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-brand-400" />
                <span>Cape Town, South Africa</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-brand-400" />
                <span>061 234 5678</span>
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
            © {new Date().getFullYear()} Advocates iPhones. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}