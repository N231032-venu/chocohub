'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, ShieldCheck, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { Profile } from '@/types';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setProfiles(data);
      } else {
        // Mock fallback profiles
        setProfiles([
          {
            id: 'u-1',
            full_name: 'Venu Gopal (Owner)',
            phone: '9845368540',
            address: 'Bangalore Headquarters',
            role: 'admin',
            created_at: new Date().toISOString(),
          },
          {
            id: 'u-2',
            full_name: 'Priya Sharma',
            phone: '9845368540',
            address: 'Flat 402, Green Glen Heights, Bellandur, Bangalore',
            role: 'customer',
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'u-3',
            full_name: 'Ananya Reddy',
            phone: '9845368540',
            address: 'Villa 12, Sobha Chrysanthemum, HSR Layout, Bangalore',
            role: 'customer',
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: 'u-4',
            full_name: 'Kavitha Murthy',
            phone: '9845368540',
            address: '45, 4th Cross, Koramangala 4th Block, Bangalore',
            role: 'customer',
            created_at: new Date(Date.now() - 259200000).toISOString(),
          },
        ]);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = profiles.filter((p) =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone && p.phone.includes(searchQuery)) ||
    (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-truffle/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
            Registered Customers & Users
          </h1>
          <p className="text-xs text-truffle mt-0.5">
            Database of Happy Choco customers and their delivery details
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream-100 hover:bg-cream-200 text-cocoa-dark border border-truffle/20 text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold text-cocoa-dark">
          Total Users: {filtered.length}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-truffle" />
          <input
            type="text"
            placeholder="Search customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FFFBF5] border border-truffle/20 text-xs text-cocoa-dark focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-cocoa">
          <thead className="bg-[#FFFBF5] text-cocoa-dark font-bold uppercase tracking-wider border-b border-truffle/15">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Delivery Address</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-truffle/10">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-[#FFFBF5]/60 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-cocoa-dark flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-card text-cocoa-dark font-serif font-bold text-xs flex items-center justify-center border border-truffle/15">
                      {user.full_name[0]?.toUpperCase() || 'U'}
                    </div>
                    <span>{user.full_name}</span>
                  </div>
                </td>
                <td className="p-3 font-medium text-cocoa-dark">
                  {user.phone || '—'}
                </td>
                <td className="p-3 text-cocoa-muted max-w-xs truncate">
                  {user.address || '—'}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      user.role === 'admin'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-cream-100 text-cocoa-dark border-truffle/20'
                    }`}
                  >
                    {user.role || 'customer'}
                  </span>
                </td>
                <td className="p-3 text-truffle">
                  {user.created_at ? formatDate(user.created_at) : 'Recent'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
