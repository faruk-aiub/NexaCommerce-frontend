import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "Passwords must match",
  path: ["password_confirmation"],
});

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' }
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success(`Welcome to NexaCommerce, ${user?.name}!`);
      navigate(redirect);
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, redirect, user, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser({ 
        name: data.name, 
        email: data.email, 
        password: data.password, 
        password_confirmation: data.password_confirmation 
      })).unwrap();
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Create Premium Account | NexaCommerce Premium</title>
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
        <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">Create client profile</h2>
        <p className="text-xs text-gray-500 font-inter">
          Or{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-[#E63946] hover:text-[#C1121F] underline">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Full Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                placeholder="e.g. Alexander Mercer"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

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
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                placeholder="Minimum 6 characters"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Confirm Password</label>
              <input
                type="password"
                {...register('password_confirmation')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                placeholder="Re-enter password"
              />
              {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>}
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
                <span>Register</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
