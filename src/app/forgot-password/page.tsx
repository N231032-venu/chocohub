'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setMessage('Password reset link sent to your email inbox!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4 sm:px-6">
      <div className="bg-[#FDF0E6] rounded-32 p-8 sm:p-10 border border-truffle/20 shadow-soft-xl space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa hover:text-cocoa-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-dark">
            Reset Password
          </h1>
          <p className="text-xs text-cocoa-muted font-light leading-relaxed">
            Enter the email associated with your Happy Choco account and we'll send a password recovery link.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-xs text-red-800 font-medium">
            {errorMsg}
          </div>
        )}

        {message ? (
          <div className="p-5 rounded-24 bg-emerald-50 border border-emerald-300 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <p className="text-xs text-emerald-900 font-medium">{message}</p>
            <Link
              href="/login"
              className="inline-block px-5 py-2 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-truffle" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <span>Sending...</span> : <span>Send Reset Link</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
