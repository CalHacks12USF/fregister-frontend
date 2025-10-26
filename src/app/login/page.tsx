'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Logo } from "./Logo";

export default function LoginPage() {
  const { handleLoginSuccess } = useAuth();

  const handleLoginError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Logo Section (nudged up slightly) */}
        <div className="mb-12 -mt-1">
          <Logo size="md" showTagline={true} />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10">
          <div className="mb-8 text-center">
            <h2 className="text-slate-800 mb-2">Welcome to Fregister</h2>
            <p className="text-slate-600">
              Sign in to access your smart refrigerator dashboard
            </p>
          </div>

          {/* Google OAuth (simple component) */}
          <div className="w-full flex justify-center">
            <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-center text-slate-500 mt-6 leading-relaxed">
            By continuing, you agree to our{" "}
            <button type="button" className="text-emerald-700 hover:underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="text-emerald-700 hover:underline">
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Need help?{" "}
          <button type="button" className="text-emerald-700 hover:text-emerald-800 hover:underline">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
}