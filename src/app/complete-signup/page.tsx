'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks';
import toast from 'react-hot-toast';

export default function CompleteSignupPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { updateProfile, isLoading } = useUpdateProfile(token);

  const [formData, setFormData] = useState({
    hardPreferences: '',
    softPreferences: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading('Saving your preferences...');

    try {
      await updateProfile({
        hardPreferences: formData.hardPreferences,
        softPreferences: formData.softPreferences,
      });

      toast.success('Profile completed successfully!', { id: toastId });
      router.push('/');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to save preferences. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Welcome, {user?.name || 'there'}! 👋
          </h1>
          <p className="text-lg text-slate-600">
            Let's personalize your Fregister experience
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dietary Restrictions Field */}
            <div>
              <label
                htmlFor="hardPreferences"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Dietary Restrictions
              </label>
              <textarea
                id="hardPreferences"
                name="hardPreferences"
                value={formData.hardPreferences}
                onChange={handleChange}
                rows={4}
                placeholder="e.g., vegetarian, gluten-free, nut allergies..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none text-slate-800 placeholder-slate-400"
              />
              <p className="mt-1 text-xs text-slate-500">
                Tell us about any dietary restrictions or allergies
              </p>
            </div>

            {/* General Preferences Field */}
            <div>
              <label
                htmlFor="softPreferences"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                General Preferences
              </label>
              <textarea
                id="softPreferences"
                name="softPreferences"
                value={formData.softPreferences}
                onChange={handleChange}
                rows={4}
                placeholder="e.g., prefer organic, love spicy food, avoid processed foods..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none text-slate-800 placeholder-slate-400"
              />
              <p className="mt-1 text-xs text-slate-500">
                Share your food preferences and cooking habits
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>

            {/* Skip Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          You can always update these preferences later in your profile settings
        </p>
      </div>
    </div>
  );
}
