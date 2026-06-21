import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, Compass, Eye, ShieldCheck } from 'lucide-react';

export const About = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <Helmet>
        <title>Our Story | NexaCommerce Premium</title>
      </Helmet>

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E63946] font-poppins">Nexa Heritage</span>
        <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Crafting the Future of Premium Retail
        </h1>
        <p className="text-lg leading-relaxed text-gray-500 font-inter">
          Founded in 2026, NexaCommerce represents the intersection of state-of-the-art technological design and curated luxury collections.
        </p>
      </div>

      {/* Hero Photo Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80')" }}></div>
        <div className="absolute inset-0 bg-[#0B0F19]/40"></div>
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <h2 className="font-poppins text-3xl font-bold text-white tracking-wide max-w-lg">
            "A seamless bridge between timeless design and effortless e-commerce."
          </h2>
        </div>
      </div>

      {/* Value pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm space-y-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E63946] mx-auto">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="font-poppins text-lg font-bold text-gray-900">Curated Discovery</h3>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Our expert merchandisers comb global design houses to secure authentic, high-demand items that set the pace of modern retail.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm space-y-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E63946] mx-auto">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-poppins text-lg font-bold text-gray-900">Elite Craftsmanship</h3>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            We hold our production lines to the highest certification standard. Authenticity isn't a promise — it is our heritage.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm space-y-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E63946] mx-auto">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-poppins text-lg font-bold text-gray-900">Uncompromised Privacy</h3>
          <p className="text-sm text-gray-500 font-inter leading-relaxed">
            Your transactions and user details are guarded with enterprise-grade tokenization and secure SSL protocols.
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;
