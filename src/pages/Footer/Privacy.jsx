import React from 'react';
import { Link } from 'react-router-dom'; // Added Link
import { ArrowLeft } from 'lucide-react'; // Added Icon

const Privacy = () => {
  return (
    <div className="min-h-screen bg-nostro-black text-white pt-12 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        
        {/* BACK BUTTON */}
        <Link to="/" className="inline-flex items-center gap-2 text-nostro-orange hover:text-white transition mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-white/70 leading-relaxed">
          <p>Last updated: November 2025</p>
          <p>At Nostro ("we", "us", or "our"), we are committed to protecting your personal information and your right to privacy.</p>
          
          <h3 className="text-xl font-bold text-white mt-8">1. Information We Collect</h3>
          <p>We collect personal information that you voluntarily provide to us when you place an order, make a reservation, or contact us. This includes name, phone number, and delivery address.</p>

          <h3 className="text-xl font-bold text-white mt-8">2. How We Use Your Information</h3>
          <p>We use your information for fulfillment of orders, customer support, and to improve our services. We do not sell your data to third parties.</p>

          <h3 className="text-xl font-bold text-white mt-8">3. Contact Us</h3>
          <p>If you have questions about this policy, please contact us via WhatsApp or email at privacy@nostro.co.ke.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;