"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Shield, MessageCircle, ShoppingBag, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-white overflow-hidden min-h-[80vh] flex items-center">
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

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-2 mb-8">
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                Value You Can Trust
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy-900 leading-[1.1] mb-8">
              Premium iPhones. <br />
              <span className="text-brand-500">Unbeatable Prices.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 font-medium">
              Discover the perfect balance of luxury and affordability. 
              Brand new and certified refurbished iPhones with guaranteed authenticity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white px-10 h-14 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-xl"
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
                  className="w-full sm:w-auto border-2 border-navy-900 text-navy-900 hover:bg-navy-50 px-10 h-14 rounded-full text-lg font-bold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </Button>
              </a>
            </div>

          </div>

          {/* Right content - Premium Showcase */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Pedestal effect */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-gradient-to-t from-gray-100 to-transparent rounded-[100%] blur-2xl opacity-50" />
              
              {/* Concentric circles bg */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full border border-brand-500/10 rounded-full animate-ping-slow" />
                <div className="absolute w-[80%] h-[80%] border border-brand-500/20 rounded-full" />
                <div className="absolute w-[60%] h-[60%] border border-brand-500/30 rounded-full shadow-[inset_0_0_50px_rgba(0,127,255,0.1)]" />
              </div>

              {/* iPhone Image Placeholder / Illustration */}
              <div className="relative z-10 flex items-center justify-center h-full group">
                <div className="relative w-64 h-[520px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-100 p-2 transform rotate-3 transition-transform group-hover:rotate-0 duration-500">
                  <div className="w-full h-full bg-navy-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full opacity-40">
                       <Image 
                        src="/images/advocates-logo.png"
                        alt="Watermark"
                        fill
                        className="object-contain p-12 brightness-0 invert"
                       />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                        <ShoppingBag className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-bold text-xl uppercase tracking-tighter italic">Advocates</p>
                      <p className="text-brand-400 font-bold text-sm tracking-[0.3em] -mt-1 uppercase">iPhones</p>
                    </div>
                  </div>
                </div>
                {/* Secondary iPhone hint */}
                <div className="absolute w-56 h-[460px] bg-gray-200 rounded-[2.5rem] shadow-xl border-4 border-white -translate-x-32 translate-y-12 -rotate-6 z-0 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="absolute bottom-0 w-full bg-navy-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between gap-8 md:gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/20">
                <Shield className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-xs md:text-sm font-bold text-white tracking-widest uppercase">Authentic Products</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/20">
                <CheckCircle2 className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-xs md:text-sm font-bold text-white tracking-widest uppercase">Trusted Service</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/20">
                <ShoppingBag className="w-5 h-5 text-brand-400" />
              </div>
              <span className="text-xs md:text-sm font-bold text-white tracking-widest uppercase">Great Prices Everytime</span>
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