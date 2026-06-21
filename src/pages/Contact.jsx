import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Your message has been dispatched to our support concierge.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <Helmet>
        <title>Concierge Support | NexaCommerce Premium</title>
      </Helmet>

      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="font-poppins text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Contact Our Concierge</h1>
        <p className="text-sm text-gray-500 font-inter leading-relaxed">
          Need details regarding an order placement, design parameters, or returns? Our client managers are on standby.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support coordinates */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946] flex-shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-gray-900 text-sm">Email Inquiry</h3>
              <p className="text-xs text-gray-500 font-inter mt-1">concierge@nexacommerce.com</p>
              <p className="text-[10px] text-gray-400 font-inter mt-1">Responds within 3 business hours</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946] flex-shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-gray-900 text-sm">Direct Phone</h3>
              <p className="text-xs text-gray-500 font-inter mt-1">+1 (800) 555-NEXA</p>
              <p className="text-[10px] text-gray-400 font-inter mt-1">Mon-Fri, 9:00 AM - 6:00 PM EST</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946] flex-shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-gray-900 text-sm">Global HQ</h3>
              <p className="text-xs text-gray-500 font-inter mt-1">100 Luxury Plaza, Suite 400</p>
              <p className="text-[10px] text-gray-400 font-inter mt-1">New York, NY 10001, USA</p>
            </div>
          </div>
        </div>

        {/* Message entry form */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Message Inquiry</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors resize-none"
                placeholder="Details of your request..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-fit rounded-full bg-[#E63946] text-white px-8 py-3 text-sm font-semibold hover:bg-[#C1121F] shadow-lg shadow-red-100 cursor-pointer transition-colors"
            >
              {submitting ? 'Dispatching...' : 'Dispatch Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;
