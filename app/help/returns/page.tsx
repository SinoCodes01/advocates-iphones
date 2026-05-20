export default function ReturnsPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Returns & Refunds</h1>
      
      <p className="text-gray-600 mb-6">
        We want you to be completely satisfied with your purchase. If you are not happy with your device, we offer a straightforward return process.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">7-Day Money-Back Guarantee</h2>
        <p className="text-gray-600 mb-4">
          You can return your device within 7 days of delivery for a full refund or exchange, provided that:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>The device is in the exact same condition as when it was received.</li>
          <li>All original packaging and accessories are included.</li>
          <li>The iCloud account has been removed and the device is factory reset.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Return Process</h2>
        <ol className="list-decimal pl-5 text-gray-600 space-y-3">
          <li>Contact us via WhatsApp (073 561 7081) to notify us of the return.</li>
          <li>We will arrange for a courier to collect the device from you.</li>
          <li>Once we receive and inspect the device (usually within 2 business days), we will process your refund.</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Refunds</h2>
        <p className="text-gray-600">
          Refunds are processed via EFT to your chosen bank account. Please allow 3-5 business days for the funds to reflect in your account once the refund has been approved.
        </p>
      </section>

      <section className="mb-10 bg-red-50 p-6 rounded-xl border border-red-100 text-red-800">
        <h2 className="text-xl font-bold mb-2">Exclusions</h2>
        <p>
          Returns will not be accepted if the device has been damaged, exposed to liquid, or tampered with by the customer. Original shipping fees are non-refundable.
        </p>
      </section>
    </div>
  );
}
