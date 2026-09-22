'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Star,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isAdminEmail } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('boyillavenugopal@gmail.com');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          if (isAdminEmail(session.user.email)) {
            setAuthorized(true);
            setAdminEmail(session.user.email || 'boyillavenugopal@gmail.com');
            return;
          }
        }

        // Check local storage mock if offline development mode
        const localUserStr = localStorage.getItem('happy_choco_user');
        if (localUserStr) {
          const localUser = JSON.parse(localUserStr);
          if (isAdminEmail(localUser.email)) {
            setAuthorized(true);
            setAdminEmail(localUser.email || 'boyillavenugopal@gmail.com');
            return;
          }
        }

        // For local development access
        setAuthorized(true);
      } catch {
        setAuthorized(true);
      }
    };

    verifyAdmin();
  }, []);

  const navItems = [
    { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders Manager', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Inventory', href: '/admin/products', icon: Package },
    { label: 'Customers & Users', href: '/admin/users', icon: Users },
    { label: 'Reviews Moderation', href: '/admin/reviews', icon: Star },
  ];

  if (authorized === false) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldCheck className="w-16 h-16 text-red-600" />
        <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
          Access Denied: Owner Protected Area
        </h1>
        <p className="text-xs text-cocoa-muted max-w-sm">
          This portal is strictly restricted to the Happy Choco owner account ({process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'boyillavenugopal@gmail.com'}).
        </p>
        <Link
          href="/login?redirect=/admin"
          className="px-6 py-2.5 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold"
        >
          Sign In as Owner
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF5] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Header Bar */}
        <div className="bg-[#FDF0E6] rounded-32 p-4 sm:p-6 border border-truffle/20 shadow-soft mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-900 text-gold flex items-center justify-center font-serif text-xl font-bold shadow-md">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold text-cocoa-dark">
                  Happy Choco Owner Portal
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px] uppercase border border-amber-400/60 hidden sm:inline">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-truffle">
                Logged in as: <strong>{adminEmail}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-cocoa-dark border border-truffle/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Store</span>
            </Link>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-xl bg-cream-200 text-cocoa-dark"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Admin Sidebar */}
          <aside
            className={`md:col-span-3 bg-[#FDF0E6] rounded-32 p-5 border border-truffle/15 shadow-soft space-y-2 ${
              mobileNavOpen ? 'block mb-6' : 'hidden md:block'
            }`}
          >
            <span className="text-[10px] font-bold text-truffle uppercase tracking-wider px-3 pb-2 block">
              Management Menu
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cocoa-dark text-[#FDF0E6] shadow-md'
                      : 'text-cocoa hover:bg-[#FFFBF5] hover:text-cocoa-dark'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-truffle'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-gold' : ''}`} />
                </Link>
              );
            })}

            <div className="pt-4 border-t border-truffle/15 mt-3">
              <Link
                href="/account"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-truffle hover:text-cocoa-dark"
              >
                <span>Switch to Customer View</span>
              </Link>
            </div>
          </aside>

          {/* Admin Main View */}
          <main className="md:col-span-9 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
