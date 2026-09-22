'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, Phone, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isAdminEmail } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            address,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data?.user) {
        // Also ensure profile record exists
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            phone,
            address,
            role: isAdminEmail(email) ? 'admin' : 'customer',
          });
        } catch {
          // ignore
        }

        setSuccessMsg('Account created successfully!');
        if (isAdminEmail(email)) {
          router.push('/admin');
        } else {
          router.push('/account');
        }
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-lg mx-auto px-4 sm:px-6">
      <div className="bg-[#FDF0E6] rounded-32 p-8 sm:p-10 border border-truffle/20 shadow-soft-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-cream-100 text-truffle-dark text-[11px] font-bold uppercase tracking-wider border border-truffle/20">
            Join Happy Choco Family
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-dark">
            Create Your Account
          </h1>
          <p className="text-xs text-cocoa-muted font-light">
            Enjoy faster Bangalore deliveries, saved addresses & loyalty perks
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-xs text-red-800 font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-800 font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-truffle" />
              <input
                type="text"
                required
                placeholder="e.g. Kavitha Murthy"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-truffle" />
                <input
                  type="email"
                  required
                  placeholder="kavitha@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Phone / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-truffle" />
                <input
                  type="tel"
                  required
                  placeholder="9845368540"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
              Default Delivery Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-truffle" />
              <textarea
                rows={2}
                placeholder="House No, Apartment, Street, Bangalore"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
              Password (min 6 chars) *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-truffle" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-truffle/25 text-sm text-cocoa-dark placeholder:text-truffle/60 focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Sign Up & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-truffle/15 text-center text-xs text-cocoa">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-cocoa-dark hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
