'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  Filter,
  MessageCircle,
  Clock,
  Truck,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatINR, formatDate, getWhatsAppCustomerChatUrl } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      } else {
        // Mock fallback orders for initial inspection
        setOrders([
          {
            id: 'ord-88912345-1234',
            customer_name: 'Priya Sharma',
            phone: '9845368540',
            email: 'priya.sharma@example.com',
            address: 'Flat 402, Green Glen Heights, Bellandur',
            city: 'Bangalore',
            pincode: '560103',
            items: [
              { id: '1', name: '75% Dark Single-Origin Cocoa Bar', price: 299, weight: '100g', quantity: 2 },
              { id: '2', name: 'Roasted Almond & Sea Salt Truffle Box', price: 449, weight: '180g', quantity: 1 },
            ],
            total_amount: 1047,
            status: 'confirmed',
            payment_status: 'completed',
            payment_method: 'upi',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'ord-99214432-5678',
            customer_name: 'Ananya Reddy',
            phone: '9845368540',
            email: 'ananya@example.com',
            address: 'Villa 12, Sobha Chrysanthemum, HSR Layout Sector 1',
            city: 'Bangalore',
            pincode: '560102',
            items: [
              { id: '5', name: 'Mom\'s Signature Artisan Tasting Box', price: 899, weight: '350g', quantity: 1 },
            ],
            total_amount: 899,
            status: 'preparing',
            payment_status: 'cod',
            payment_method: 'cod',
            created_at: new Date(Date.now() - 7200000).toISOString(),
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
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const supabase = createClient();
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-truffle/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
            Orders Manager
          </h1>
          <p className="text-xs text-truffle mt-0.5">
            Update kitchen status & communicate directly with customers via WhatsApp
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream-100 hover:bg-cream-200 text-cocoa-dark border border-truffle/20 text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {['all', 'confirmed', 'preparing', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-cocoa-dark text-[#FDF0E6] shadow-sm'
                  : 'bg-card text-cocoa hover:bg-cream-200 border border-truffle/15'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-truffle" />
          <input
            type="text"
            placeholder="Search name, phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FFFBF5] border border-truffle/20 text-xs text-cocoa-dark focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
          />
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-xs text-cocoa-muted">
          No matching orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const whatsappChat = getWhatsAppCustomerChatUrl(order.phone, order.id, order.customer_name);

            return (
              <div
                key={order.id}
                className="bg-[#FFFBF5] rounded-28 p-5 sm:p-6 border border-truffle/15 shadow-sm space-y-4 hover:border-truffle/30 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-truffle/15">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cocoa-dark">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[11px] text-truffle">
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-cocoa-dark">
                      <span>{order.customer_name}</span> • <span className="text-truffle">{order.phone}</span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-truffle uppercase">Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 rounded-full bg-card border border-truffle/30 text-xs font-bold text-cocoa-dark shadow-sm focus:outline-none cursor-pointer"
                      >
                        <option value="confirmed">🟡 Confirmed</option>
                        <option value="preparing">🟠 Preparing (Kitchen)</option>
                        <option value="shipped">🔵 Shipped / Out for Delivery</option>
                        <option value="delivered">🟢 Delivered</option>
                        <option value="cancelled">🔴 Cancelled</option>
                      </select>
                    </div>

                    {/* WhatsApp Chat Button */}
                    <a
                      href={whatsappChat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white hover:bg-emerald-600 text-xs font-semibold shadow-sm transition-all"
                      title="Open WhatsApp chat with customer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                </div>

                {/* Items and Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-cocoa">
                  {/* Items */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="text-[10px] font-bold text-truffle uppercase tracking-wider block">
                      Ordered Chocolates ({order.items?.reduce((a, b) => a + b.quantity, 0) || 1} packs)
                    </span>
                    <div className="space-y-1.5">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-card border border-truffle/10"
                        >
                          <span className="font-semibold text-cocoa-dark truncate max-w-[220px]">
                            {item.name} ({item.weight})
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-truffle">Qty: {item.quantity}</span>
                            <span className="font-bold text-cocoa-dark">
                              {formatINR(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery details & Payment */}
                  <div className="md:col-span-5 p-3 rounded-20 bg-card border border-truffle/15 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-truffle uppercase tracking-wider">
                        Delivery Address
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cream-100 text-cocoa-dark border border-truffle/20">
                        {order.payment_method?.toUpperCase() || 'COD'}
                      </span>
                    </div>

                    <p className="text-xs text-cocoa leading-relaxed">
                      {order.address}, {order.city} ({order.pincode})
                    </p>

                    {order.notes && (
                      <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <strong>Note:</strong> {order.notes}
                      </p>
                    )}

                    <div className="pt-2 border-t border-truffle/10 flex justify-between items-baseline">
                      <span className="font-bold text-cocoa-dark">Total Amount:</span>
                      <span className="font-serif text-base font-bold text-cocoa-dark">
                        {formatINR(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
