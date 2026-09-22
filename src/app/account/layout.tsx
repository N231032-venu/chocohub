'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  MapPin,
  Star,
  LogOut,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isAdminEmail } from '@/lib/utils';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          // Check local mock user if offline/preview
          const localUser = localStorage.getItem('happy_choco_user');
          if (localUser) {
            setUser(JSON.parse(localUser));
          }
        }
      } catch {
        // offline fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('happy_choco_user');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Account Overview', href: '/account', icon: User },
    { label: 'My Orders & Tracking', href: '/account/orders', icon: ShoppingBag },
    { label: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
    { label: 'My Reviews & Ratings', href: '/account/reviews', icon: Star },
  ];

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Customer';
  const isAdmin = isAdminEmail(user?.email);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-4 bg-[#FDF0E6] rounded-32 p-6 sm:p-7 border border-truffle/15 shadow-soft space-y-6">
          {/* User Profile Card */}
          <div className="flex items-center gap-4 pb-6 border-b border-truffle/15">
            <div className="w-14 h-14 rounded-2xl bg-cocoa-dark text-card flex items-center justify-center font-serif text-2xl font-bold shadow-md">
              {userName[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-lg font-bold text-cocoa-dark truncate">
                {userName}
              </h2>
              <p className="text-xs text-truffle truncate">{user?.email || 'Logged In'}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" /> Owner Admin
                </span>
              )}
            </div>
          </div>

          {/* Links list */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cocoa-dark text-[#FDF0E6] shadow-md'
                      : 'text-cocoa hover:bg-[#FFFBF5] hover:text-cocoa-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-truffle'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-gold' : ''}`} />
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-amber-950 bg-amber-100/80 hover:bg-amber-100 border border-amber-300/60 mt-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Go to Admin Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors pt-3 mt-2 border-t border-truffle/10"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-8">
          {children}
        </main>
      </div>
    </div>
  );
}
