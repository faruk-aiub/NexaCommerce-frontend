import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success(`Welcome back, ${user?.name}!`);
      // If user is admin and redirect is default, send them to admin dashboard
      if (user?.roles?.some(r => r.name === 'admin') && redirect === '/') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, redirect, user, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to authenticate');
    }
  };

  return (
    <div className="flex min-h-[75vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Account Sign In | NexaCommerce Premium</title>
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
        <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p className="text-xs text-gray-500 font-inter">
          Or{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-[#E63946] hover:text-[#C1121F] underline">
            register for a new premium account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                placeholder="e.g. client@nexacommerce.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#E63946] hover:text-[#C1121F] underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                {...register('password')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 font-inter font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#E63946] py-3 text-sm font-semibold text-white hover:bg-[#C1121F] disabled:opacity-50 cursor-pointer shadow-lg shadow-red-100 transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Quick seeded login selectors */}
          <div className="mt-8 border-t border-gray-150 pt-6">
            <span className="block text-[10px] font-bold text-gray-400 uppercase font-poppins mb-3 text-center">Simulated Profiles</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onSubmit({ email: 'customer@nexacommerce.com', password: 'Password123!' });
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-colors text-center"
              >
                Customer Seed
              </button>
              <button
                onClick={() => {
                  onSubmit({ email: 'admin@nexacommerce.com', password: 'Password123!' });
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-colors text-center"
              >
                Admin Seed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
