import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <Helmet>
        <title>Privacy Policy | NexaCommerce Premium</title>
      </Helmet>

      <div className="text-center space-y-2 pb-6 border-b border-gray-150">
        <h1 className="font-poppins text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy & Security Charter</h1>
        <p className="text-xs text-gray-500 font-inter">Last updated: June 21, 2026</p>
      </div>

      <div className="prose prose-red max-w-none font-inter text-sm text-gray-600 space-y-6 leading-relaxed">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-5 flex items-start space-x-3">
          <ShieldCheck className="h-6 w-6 text-emerald-600 flex-shrink-0" />
          <p className="text-xs text-emerald-800 font-medium">
            Your transactions and profile credentials are protected by bank-level SSL certificates and fully tokenized data connect endpoints. We never store raw debit cards or wallet details.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-poppins text-lg font-bold text-gray-950">1. Information Gathered</h2>
          <p>
            When registering an account with NexaCommerce, we collect basic identifiers such as your name, billing email, saved delivery locations, and contact phone numbers. This details is utilized strictly to coordinate shipping and process payment invoices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-lg font-bold text-gray-950">2. Cookies & Tracker Keys</h2>
          <p>
            We deploy standard browser session cookies and local storage state tokens to remember active shopping cart selections, favorites lists, and authentication credentials. Clearing your browser cache removes these records.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-poppins text-lg font-bold text-gray-950">3. Third-party Disclosures</h2>
          <p>
            NexaCommerce never exchanges, distributes, or leaks your profile parameters to marketing agencies. Details is shared exclusively with integrated payment processors (e.g. Stripe, bKash) and shipment couriers for transaction execution.
          </p>
        </section>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
