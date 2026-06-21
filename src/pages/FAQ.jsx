import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    {
      q: "What is your global shipping policy?",
      a: "NexaCommerce provides complimentary premium courier shipping on all orders over $150. For orders below this threshold, a flat carrier routing fee of $15 applies. We dispatch within 24 hours of payment authorization."
    },
    {
      q: "Are the designer watches and accessories fully authentic?",
      a: "Yes, every design hosted on NexaCommerce is 100% certified authentic. We establish direct partnerships with brands and authorized boutiques, eliminating third-party dealers completely."
    },
    {
      q: "How can I track my shipment package status?",
      a: "Once an order is paid, you can track real-time milestones using the 'Track Order' option in the navigation. Simply input your unique order number or invoice identifier to check progression."
    },
    {
      q: "What is your return and refund threshold?",
      a: "We offer a 30-day return policy for unused, unopened merchandise in its original packaging. Once items pass review by our quality coordinators, refunds are settled to your wallet."
    },
    {
      q: "How do variant modifiers affect item prices?",
      a: "Certain product options (e.g. titanium watch frames or expanded capacity) include price modifiers. These modifiers are listed directly in option pickers and adjust checkout prices dynamically."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <Helmet>
        <title>Frequently Asked Questions | NexaCommerce Premium</title>
      </Helmet>

      <div className="text-center space-y-2">
        <h1 className="font-poppins text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Client FAQ Guide</h1>
        <p className="text-sm text-gray-500 font-inter max-w-sm mx-auto">
          Find fast responses to inquiries regarding billing, deliveries, authentications, and returns.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div 
              key={idx}
              className="rounded-xl border border-gray-150 bg-white overflow-hidden shadow-sm transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-poppins font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-[#E63946] flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-gray-500 font-inter leading-relaxed border-t border-gray-50 bg-gray-50/30">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FAQ;
