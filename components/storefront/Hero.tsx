import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Shield, Truck, MessageCircle, Award } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 to-transparent" />

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-300">
                Trusted iPhone Reseller in South Africa
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Premium iPhones at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-300">
                Unbeatable Prices
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              Discover our collection of brand new and refurbished iPhones.
              Every device comes with warranty and authenticity guarantee.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-400 hover:to-brand-300 text-navy-900 font-bold"
                >
                  Shop Now
                </Button>
              </Link>
              <a
                href="https://wa.me/27612345678"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-brand-400">500+</p>
                <p className="text-sm text-gray-400">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-400">100%</p>
                <p className="text-sm text-gray-400">Authentic Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-400">2 Year</p>
                <p className="text-sm text-gray-400">Warranty</p>
              </div>
            </div>
          </div>

          {/* Right content - iPhone showcase */}
          <div className="relative hidden md:block">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Glowing circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-navy-700/20 rounded-full blur-3xl" />

              {/* iPhone illustration */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-64 h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-4 border-gray-700 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 rounded-[2.5rem] m-3 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl font-bold text-white">A</span>
                      <p className="text-brand-400 mt-2">Advocates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-brand-400" />
              <div>
                <p className="font-semibold text-white">100% Authentic</p>
                <p className="text-xs text-gray-400">Verified genuine Apple products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-brand-400" />
              <div>
                <p className="font-semibold text-white">Nationwide Delivery</p>
                <p className="text-xs text-gray-400">Reliable shipping across SA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-brand-400" />
              <div>
                <p className="font-semibold text-white">WhatsApp Support</p>
                <p className="text-xs text-gray-400">Direct communication with us</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-brand-400" />
              <div>
                <p className="font-semibold text-white">2 Year Warranty</p>
                <p className="text-xs text-gray-400">Comprehensive coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}