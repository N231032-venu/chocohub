import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export const BRAND_PHONE = '+91 9845368540';
export const BRAND_PHONE_CLEAN = '919845368540';
export const BRAND_INSTAGRAM = '@happychoco_homemade';
export const BRAND_INSTAGRAM_URL = 'https://instagram.com/happychoco_homemade';
export const ADMIN_EMAIL_DEFAULT = 'boyillavenugopal@gmail.com';

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const envAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || ADMIN_EMAIL_DEFAULT;
  return email.trim().toLowerCase() === envAdmin.trim().toLowerCase() || email.trim().toLowerCase() === ADMIN_EMAIL_DEFAULT;
}

export function getWhatsAppOrderUrl(params: {
  orderId?: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod?: string;
}): string {
  const itemListText = params.items
    .map((item) => `• ${item.name} (${item.weight}) x${item.quantity} = ₹${item.price * item.quantity}`)
    .join('\n');

  const message = `🍫 *NEW HAPPY CHOCO ORDER* ${params.orderId ? `(#${params.orderId.slice(0, 8)})` : ''}\n\n` +
    `*Customer:* ${params.customerName}\n` +
    `*Phone:* ${params.phone}\n` +
    `*Delivery Address:* ${params.address}\n` +
    `*Payment Method:* ${params.paymentMethod?.toUpperCase() || 'COD'}\n\n` +
    `*Items Ordered:*\n${itemListText}\n\n` +
    `*Total Amount:* ₹${params.total}\n\n` +
    `_Thank you for supporting homemade healthy chocolates! Bangalore fresh on order._`;

  return `https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppDirectUrl(customMessage?: string): string {
  const text = customMessage || `Hi Happy Choco! 🍫 I would like to enquire about your healthy homemade chocolates & custom gifting boxes.`;
  return `https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppCustomerChatUrl(phone: string, orderId: string, customerName: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const text = `Hi ${customerName}! 🍫 Thank you for ordering from Happy Choco Homemade (Order #${orderId.slice(0, 8)}). We are preparing your fresh batch right now!`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}
