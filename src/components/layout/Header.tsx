'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { BRAND_PHONE_CLEAN, isAdminEmail } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { openDrawer, getTotalItems } = useCartStore();
  const totalItems = mounted ? getTotalItems() : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch active session user
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserEmail(session.user.email ?? null);
          setUserFullName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member');
        }
      } catch {
        // graceful offline
      }
    };
    checkUser();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = isAdminEmail(userEmail);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-cocoa-dark text-[#FDF0E6] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
        <span>Freshly made in small batches in Bangalore • 100% No Refined Sugar • Free Delivery on orders over ₹799</span>
        <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse hidden sm:inline" />
      </div>

      {/* Main Glassmorphic Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-soft py-3'
            : 'bg-[#FFFBF5]/90 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-cocoa-dark text-card flex items-center justify-center font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform duration-200">
                H
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-cocoa-dark group-hover:text-truffle-dark transition-colors">
                  Happy Choco
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-truffle -mt-1">
                  Homemade • Bangalore
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-cocoa">
              <Link
                href="/"
                className={`transition-colors hover:text-cocoa-dark ${
                  pathname === '/' ? 'text-cocoa-dark font-semibold border-b-2 border-cocoa-dark pb-0.5' : 'text-cocoa/80'
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`transition-colors hover:text-cocoa-dark ${
                  pathname.startsWith('/products') ? 'text-cocoa-dark font-semibold border-b-2 border-cocoa-dark pb-0.5' : 'text-cocoa/80'
                }`}
              >
                Chocolates
              </Link>
              <Link
                href="/#why-us"
                className="transition-colors hover:text-cocoa-dark text-cocoa/80"
              >
                Why Us
              </Link>
              <Link
                href="/#our-story"
                className="transition-colors hover:text-cocoa-dark text-cocoa/80"
              >
                Mom's Story
              </Link>
              <Link
                href="/#reviews"
                className="transition-colors hover:text-cocoa-dark text-cocoa/80"
              >
                Reviews
              </Link>
              <Link
                href="/#faq"
                className="transition-colors hover:text-cocoa-dark text-cocoa/80"
              >
                FAQ
              </Link>
            </nav>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* WhatsApp Direct Order Button */}
              <a
                href={`https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent('Hi Happy Choco! 🍫 I would like to order handcrafted healthy chocolates.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/10 text-emerald-800 hover:bg-emerald-700/20 text-xs font-semibold transition-all duration-200 border border-emerald-700/20"
                title="Direct WhatsApp Order"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Order on WhatsApp</span>
              </a>

              {/* Admin Link if Admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold hover:bg-amber-200 transition-colors"
                  title="Owner Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              {/* User Account / Auth */}
              {userEmail ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-cream-200 text-cocoa-dark transition-colors"
                  title={`Account: ${userFullName}`}
                >
                  <div className="w-8 h-8 rounded-full bg-cream-300 border border-truffle/20 flex items-center justify-center text-xs font-bold text-cocoa-dark">
                    {userFullName ? userFullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] truncate hidden xl:inline">
                    {userFullName}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="p-2 rounded-full hover:bg-cream-200 text-cocoa transition-colors"
                  title="Login / Register"
                >
                  <User className="w-5 h-5 text-cocoa" />
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={openDrawer}
                className="relative p-2.5 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa transition-all duration-200 shadow-sm group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-cocoa-dark font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-cocoa hover:bg-cream-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-truffle/20 bg-cream-100 px-4 pt-3 pb-6 space-y-3 mt-3 animate-fadeIn">
            <Link
              href="/"
              className="block py-2 text-base font-medium text-cocoa hover:text-cocoa-dark"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-2 text-base font-medium text-cocoa hover:text-cocoa-dark"
            >
              All Artisan Chocolates
            </Link>
            <Link
              href="/#why-us"
              className="block py-2 text-base font-medium text-cocoa hover:text-cocoa-dark"
            >
              Why Healthy Choco
            </Link>
            <Link
              href="/#our-story"
              className="block py-2 text-base font-medium text-cocoa hover:text-cocoa-dark"
            >
              Mompreneur Story
            </Link>
            <Link
              href="/#reviews"
              className="block py-2 text-base font-medium text-cocoa hover:text-cocoa-dark"
            >
              Customer Reviews (4.9/5)
            </Link>
            <Link
              href="/#faq"
              className="block py-2 text-base font-medium text-cocoa hover:text-cocoa-dark"
            >
              Frequently Asked Questions
            </Link>

            <div className="pt-4 border-t border-truffle/20 flex flex-col gap-2">
              <a
                href={`https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent('Hi Happy Choco! 🍫 I want to order freshly made healthy chocolates.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order directly on WhatsApp (+91 9845368540)</span>
              </a>

              {userEmail ? (
                <Link
                  href="/account"
                  className="w-full text-center py-2.5 rounded-xl bg-cream-200 text-cocoa-dark text-sm font-semibold border border-truffle/20"
                >
                  My Account ({userFullName})
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 rounded-xl bg-cream-200 text-cocoa-dark text-sm font-semibold border border-truffle/20"
                >
                  Sign In / Create Account
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full text-center py-2 rounded-xl bg-amber-100 text-amber-900 text-sm font-semibold border border-amber-300"
                >
                  🛡️ Access Owner Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
