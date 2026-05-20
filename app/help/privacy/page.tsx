export default function PrivacyPage() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Privacy Policy</h1>
      
      <p className="text-gray-600 mb-6 italic">Last updated: May 20, 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">1. Introduction</h2>
        <p className="text-gray-600">
          Advocates iPhones (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website and purchase our products.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">2. Information We Collect</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li><strong>Personal Details:</strong> Name, phone number, and email address provided during checkout.</li>
          <li><strong>Delivery Information:</strong> Physical address and delivery instructions.</li>
          <li><strong>Usage Data:</strong> Information about how you use our website, including your IP address and browser type.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">3. How We Use Your Information</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>To process and fulfill your orders.</li>
          <li>To communicate with you regarding your order status via WhatsApp or email.</li>
          <li>To improve our website and customer service.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">4. Data Security</h2>
        <p className="text-gray-600">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or theft. However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">5. Third-Party Services</h2>
        <p className="text-gray-600">
          We may share your information with trusted third parties, such as courier services for delivery purposes, and Supabase for database management and hosting.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-navy-900 mb-4">6. Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about this Privacy Policy, please contact us at <strong>privacy@advocatesiphones.co.za</strong>.
        </p>
      </section>
    </div>
  );
}
