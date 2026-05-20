export default function DeliveryPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Delivery Information</h1>
      
      <p className="text-gray-600 mb-6">
        We offer reliable and secure delivery services across South Africa. We understand you want your new iPhone as soon as possible, so we prioritize fast processing and shipping.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Shipping Methods & Times</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-100 rounded-xl bg-gray-50">
            <h3 className="font-bold text-navy-900 mb-2">KuGompo City & Surrounds</h3>
            <p className="text-sm text-gray-600">Same-day or next-day delivery. Delivery fee: R100.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-xl bg-gray-50">
            <h3 className="font-bold text-navy-900 mb-2">Major Cities (JHB, DBN, PTA)</h3>
            <p className="text-sm text-gray-600">2-3 business days. Delivery fee: R150.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-xl bg-gray-50">
            <h3 className="font-bold text-navy-900 mb-2">Regional Areas</h3>
            <p className="text-sm text-gray-600">3-5 business days. Delivery fee: R200.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Order Tracking</h2>
        <p className="text-gray-600">
          Once your order has been dispatched, you will receive a tracking number via WhatsApp and email. You can use this to monitor your shipment&apos;s progress directly on the courier&apos;s website.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Important Notes</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Deliveries are only made on business days (Mon-Fri).</li>
          <li>A physical address is required; we cannot deliver to P.O. Boxes.</li>
          <li>All shipments are fully insured until they reach your doorstep.</li>
          <li>A signature will be required upon delivery.</li>
        </ul>
      </section>
    </div>
  );
}
