import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Simulation: Password reset successful! Please log in.');
      setSubmitting(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Reset Password | NexaCommerce Premium</title>
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
        <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">Configure new password</h2>
        <p className="text-xs text-gray-500 font-inter">
          Enter your new credentials below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                placeholder="Re-enter password"
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
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
