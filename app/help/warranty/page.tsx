export default function WarrantyPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Warranty Policy</h1>
      
      <p className="text-gray-600 mb-6">
        At Advocates iPhones, we stand behind the quality of every device we sell. Our warranty is designed to give you peace of mind and ensure your investment is protected.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Warranty Period</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li><strong>New iPhones:</strong> 12-month manufacturer warranty.</li>
          <li><strong>Refurbished/Pre-owned iPhones:</strong> 6-month limited store warranty.</li>
          <li><strong>Accessories:</strong> 3-month limited warranty.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">What is Covered</h2>
        <p className="text-gray-600 mb-4">Our warranty covers manufacturing defects and hardware failures, including:</p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Screen/Display issues (not caused by physical damage).</li>
          <li>Internal hardware failures (camera, speakers, microphones).</li>
          <li>Battery issues (if capacity drops significantly below expected levels).</li>
          <li>Charging port malfunctions.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">What is NOT Covered</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>Physical damage (cracked screens, dents, casing damage).</li>
          <li>Liquid damage (water ingress).</li>
          <li>Software modifications or jailbreaking.</li>
          <li>Repairs carried out by unauthorized third parties.</li>
          <li>Normal wear and tear.</li>
        </ul>
      </section>

      <section className="mb-10 text-brand-700 bg-brand-50 p-6 rounded-xl border border-brand-100">
        <h2 className="text-xl font-bold mb-2">How to Claim</h2>
        <p>
          To initiate a warranty claim, please contact us via WhatsApp at <strong>073 515 2402</strong> or email <strong>warranty@advocatesiphones.co.za</strong> with your order number and a description of the issue.
        </p>
      </section>
    </div>
  );
}
