export default function FAQPage() {
  const faqs = [
    {
      q: "Are your iPhones authentic?",
      a: "Yes, 100%. We only sell authentic Apple iPhones. Each device undergoes a rigorous verification process to ensure its legitimacy and quality.",
    },
    {
      q: "What is the difference between 'New' and 'Refurbished'?",
      a: "New devices are brand new, sealed in their original packaging. Refurbished devices have been previously owned but have been professionally inspected, tested, and restored to full working order. They may have minor cosmetic marks but are functionally perfect.",
    },
    {
      q: "Do you offer a warranty?",
      a: "Yes! New iPhones come with a 12-month manufacturer warranty. Refurbished and pre-owned devices come with our 6-month limited store warranty.",
    },
    {
      q: "How do I pay for my order?",
      a: "Currently, we accept payments via EFT (Electronic Funds Transfer). Once you place your order, we will provide you with our banking details and a reference number.",
    },
    {
      q: "Where are you located?",
      a: "We are based in KuGompo City, South Africa, but we deliver nationwide to all major cities and regional areas.",
    },
    {
      q: "Can I collect my order?",
      a: "Yes, local collection in KuGompo City can be arranged by appointment once payment has been confirmed.",
    },
  ];

  return (
    <div className="prose prose-blue max-w-none">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
            <h3 className="text-lg font-bold text-navy-900 mb-3">{faq.q}</h3>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-brand-50 rounded-2xl border border-brand-100 text-center">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">Our team is ready to help you via WhatsApp.</p>
        <a
          href="https://wa.me/27735152402"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
        >
          Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}
