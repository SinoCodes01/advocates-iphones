import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Contact Us</h1>
            <p className="text-gray-600 text-lg">
              Have questions or need assistance? Our team is here to help you get the best iPhone experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-card border border-gray-100">
                <h2 className="text-2xl font-bold text-navy-900 mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">Phone & WhatsApp</p>
                      <p className="text-gray-600">0735152402</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">Email</p>
                      <p className="text-gray-600">hello@advocatesiphones.co.za</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">Location</p>
                      <p className="text-gray-600">KuGompo City, Eastern Cape, South Africa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">Business Hours</p>
                      <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sat: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/27735152402"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Support Card */}
            <div className="bg-navy-900 text-white p-8 md:p-12 rounded-2xl shadow-xl flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-10 h-10 text-brand-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Fast Support</h2>
              <p className="text-navy-200 mb-8">
                Our support team is highly responsive. We usually respond within 30 minutes during business hours.
              </p>
              <div className="space-y-4">
                <div className="bg-navy-800/50 p-4 rounded-xl border border-navy-700">
                  <p className="text-sm text-navy-300">Order Inquiries</p>
                  <p className="font-medium text-brand-400">orders@advocatesiphones.co.za</p>
                </div>
                <div className="bg-navy-800/50 p-4 rounded-xl border border-navy-700">
                  <p className="text-sm text-navy-300">Warranty & Returns</p>
                  <p className="font-medium text-brand-400">support@advocatesiphones.co.za</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
