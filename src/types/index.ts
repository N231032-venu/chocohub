export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  description: string;
  ingredients: string[];
  images: string[];
  category: 'Dark Chocolates' | 'Nut Loaded' | 'Sugar-Free' | 'Gift Boxes' | string;
  is_bestseller: boolean;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cod';
export type PaymentMethod = 'cod' | 'upi' | 'whatsapp';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  address?: string;
  role?: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  user_id?: string;
  customer_name: string;
  product_id: string;
  product_name?: string;
  rating: number;
  comment: string;
  image?: string;
  is_approved: boolean;
  created_at: string;
}

export interface UserAddress {
  id: string;
  label: string; // 'Home', 'Work', etc.
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  pincode: string;
  is_default: boolean;
}
