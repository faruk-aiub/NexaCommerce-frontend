import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      toast.success('Simulation: Password recovery link dispatched!');
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Forgot Password | NexaCommerce Premium</title>
      </Helmet>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E63946] to-[#C1121F] text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="font-poppins text-xl font-bold tracking-wider text-gray-900">
            NEXA<span className="text-[#E63946]">COMMERCE</span>
          </span>
        </Link>
        <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">Recover your password</h2>
        <p className="text-xs text-gray-500 font-inter">
          Enter your email to receive recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-xl sm:px-10 border border-gray-100 space-y-6">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 font-inter font-medium">
                We've sent a simulated recovery link to <strong>{email}</strong>. Please check your inbox or spam filters.
              </div>
              <Link 
                to="/login"
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-[#E63946] hover:text-[#C1121F]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                  placeholder="e.g. client@nexacommerce.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#E63946] py-3 text-sm font-semibold text-white hover:bg-[#C1121F] disabled:opacity-50 cursor-pointer shadow-lg shadow-red-100 transition-colors"
              >
                {submitting ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
