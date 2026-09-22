'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatINR } from '@/lib/utils';

interface RevenueChartProps {
  data?: { date: string; revenue: number; orders: number }[];
}

const defaultData = [
  { date: 'Sep 15', revenue: 4250, orders: 8 },
  { date: 'Sep 16', revenue: 6890, orders: 14 },
  { date: 'Sep 17', revenue: 5400, orders: 11 },
  { date: 'Sep 18', revenue: 8900, orders: 18 },
  { date: 'Sep 19', revenue: 11250, orders: 22 },
  { date: 'Sep 20', revenue: 14800, orders: 29 },
  { date: 'Sep 21', revenue: 18450, orders: 36 },
];

export default function RevenueChart({ data = defaultData }: RevenueChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B6A5C" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8B6A5C" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EBDCCE" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#7A5C50"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#7A5C50"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-cocoa-dark text-[#FDF0E6] p-3 rounded-xl shadow-xl text-xs border border-truffle/30">
                    <p className="font-bold mb-1">{label}</p>
                    <p className="text-gold font-semibold">
                      Revenue: {formatINR(payload[0].value as number)}
                    </p>
                    <p className="text-[10px] text-card-soft">
                      Orders: {payload[0].payload.orders}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3D2218"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
