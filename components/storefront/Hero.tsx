"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Shield, MessageCircle, ShoppingBag, CheckCircle2, Phone } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-white overflow-hidden flex flex-col min-h-screen">
      {/* Wave Background Pattern */}
      <div className="absolute inset-0 z-0">
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 right-0 w-full h-full object-cover opacity-10"
        >
          <path
            d="M0 640C240 640 480 320 720 320C960 320 1200 640 1440 640V0H0V640Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="720"
              y1="0"
              x2="720"
              y2="640"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#007FFF" />
              <stop offset="1" stopColor="#001A33" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-navy-900/10 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 flex-grow flex items-center py-0 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-6 py-2.5 mb-8 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                Value You Can Trust
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-navy-900 leading-[1.1] mb-6">
              Premium iPhones. <br />
              <span className="text-brand-500">Unbeatable Prices.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 font-medium">
              Discover the perfect balance of luxury and affordability. 
              Brand new and certified refurbished iPhones with guaranteed authenticity.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-12 h-16 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-2xl shadow-brand-500/30"
                >
                  Shop Now
                </Button>
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27735617081"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-navy-900/20 text-navy-900 hover:bg-navy-50 px-10 h-16 rounded-full text-lg font-semibold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </Button>
              </a>
            </div>

          </div>

          {/* Right content - Premium Showcase */}
          <div className="relative pt-12 lg:pt-0">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Pedestal effect */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-gradient-to-t from-brand-500/10 to-transparent rounded-[100%] blur-3xl opacity-60" />
              
              {/* Concentric circles bg */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full border border-brand-500/10 rounded-full animate-ping-slow" />
                <div className="absolute w-[80%] h-[80%] border border-brand-500/20 rounded-full" />
                <div className="absolute w-[60%] h-[60%] border border-brand-500/30 rounded-full shadow-[inset_0_0_50px_rgba(0,127,255,0.05)]" />
              </div>

              {/* iPhone Illustration */}
              <div className="relative z-10 flex items-center justify-center h-full group">
                {/* Main iPhone device */}
                <div className="relative w-64 h-[520px] bg-white rounded-[3rem] shadow-xl border-4 border-gray-200 p-4 transform rotate-3 transition-transform group-hover:rotate-0 duration-500">
                  {/* iPhone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-b-xl z-20"></div>

                  {/* iPhone screen */}
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                    {/* Screen content with simplified branding */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      {/* Centered logo with premium sizing */}
                      <Image
                        src="/images/advocates-logo.png"
                        alt="Advocates iPhones Logo"
                        width={120}
                        height={120}
                        priority
                        className="object-contain mb-4"
                      />
                      {/* Business name underneath */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-navy-900">Advocates</h3>
                        <p className="text-brand-500 text-sm tracking-widest uppercase">iPhones</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary iPhone (shadow effect) */}
                              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="w-full bg-navy-900/95 backdrop-blur-sm py-8 border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Authentic</span>
                <span className="text-xs text-gray-400">Guaranteed quality</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Trusted</span>
                <span className="text-xs text-gray-400">Verified service</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Value</span>
                <span className="text-xs text-gray-400">Best prices always</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}