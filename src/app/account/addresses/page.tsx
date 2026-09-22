'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserAddress } from '@/types';

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([
    {
      id: 'addr-1',
      label: 'Home',
      full_name: 'Priya Sharma',
      phone: '9845368540',
      address_line: 'Flat 402, Green Glen Heights, Bellandur',
      city: 'Bangalore',
      pincode: '560103',
      is_default: true,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const loadFromProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && profile.address) {
            setAddresses([
              {
                id: 'profile-primary',
                label: 'Default Address',
                full_name: profile.full_name || 'Customer',
                phone: profile.phone || '',
                address_line: profile.address,
                city: 'Bangalore',
                pincode: '560001',
                is_default: true,
              },
            ]);
          }
        }
      } catch {
        // fallback
      }
    };
    loadFromProfile();
  }, []);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine || !fullName || !phone || !pincode) return;

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label,
      full_name: fullName,
      phone,
      address_line: addressLine,
      city,
      pincode,
      is_default: addresses.length === 0,
    };

    setAddresses([...addresses, newAddr]);
    setIsAdding(false);
    setAddressLine('');
    setPincode('');
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        is_default: a.id === id,
      }))
    );
  };

  return (
    <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-truffle/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs text-truffle mt-0.5">
            Manage your Bangalore and pan-India shipping addresses
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddAddress}
          className="bg-[#FFFBF5] rounded-28 p-6 border border-truffle/20 shadow-sm space-y-4"
        >
          <h3 className="font-serif text-base font-bold text-cocoa-dark">
            Add New Shipping Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Address Tag
              </label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
              >
                <option value="Home">Home</option>
                <option value="Office / Work">Office / Work</option>
                <option value="Parents / Friends">Parents / Friends</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Recipient Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Recipient Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Pincode *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 560038"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Street Address / Apartment *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Flat/House No, Building, Street Name, Area"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-full bg-cream-200 text-cocoa-dark text-xs font-semibold hover:bg-cream-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold hover:bg-cocoa shadow-sm"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-[#FFFBF5] rounded-24 p-5 border transition-all relative ${
              addr.is_default ? 'border-cocoa-dark ring-1 ring-cocoa-dark/20 shadow-sm' : 'border-truffle/15'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-card text-truffle-dark font-bold text-[10px] uppercase border border-truffle/15">
                {addr.label}
              </span>
              {addr.is_default && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Default
                </span>
              )}
            </div>

            <h4 className="font-serif text-sm font-bold text-cocoa-dark">
              {addr.full_name}
            </h4>
            <p className="text-xs text-cocoa-muted mt-1 leading-relaxed">
              {addr.address_line}
            </p>
            <p className="text-xs text-truffle font-medium mt-1">
              {addr.city}, {addr.pincode} • Ph: {addr.phone}
            </p>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-truffle/10">
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs text-cocoa font-semibold hover:underline"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-xs text-red-600 hover:text-red-700 ml-auto p-1"
                aria-label="Delete address"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
