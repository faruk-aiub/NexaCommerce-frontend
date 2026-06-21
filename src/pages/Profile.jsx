import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProfile, clearError } from '../redux/slices/authSlice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

export const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Profile details updated successfully');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h2 className="font-poppins text-lg font-bold text-gray-900">Profile Details</h2>
        <p className="text-xs text-gray-500 font-inter mt-1">Configure your personal account identifiers.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Full Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Email Address</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-600 font-inter">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center space-x-1.5 rounded-lg bg-[#E63946] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#C1121F] disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </form>
    </div>
  );
};
export default Profile;
