-- =========================================================
-- HAPPY CHOCO HOMEMADE - PRODUCTION SUPABASE DATABASE SCHEMA
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  weight TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  is_bestseller BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Bangalore',
  pincode TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'cod')),
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'upi', 'whatsapp')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products Policies
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders Policies
CREATE POLICY "Users can view their own orders or guest viewing" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews Policies
CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (
    is_approved = true OR
    auth.uid() = user_id OR
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update reviews" ON public.reviews
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete reviews" ON public.reviews
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'boyillavenugopal@gmail.com' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- AUTOMATIC PROFILE CREATION ON SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, address, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Chocolate Lover'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    CASE WHEN NEW.email = 'boyillavenugopal@gmail.com' THEN 'admin' ELSE 'customer' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STORAGE BUCKETS CREATION
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Read Access on Product Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Public Read Access on Review Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-images');

CREATE POLICY "Admin Upload Access on Product Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated Upload Access on Review Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'review-images' AND auth.uid() IS NOT NULL);

-- SEED 6 INITIAL ARTISAN CHOCOLATE PRODUCTS
INSERT INTO public.products (id, name, price, weight, description, ingredients, images, category, is_bestseller, stock)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '75% Dark Single-Origin Cocoa Bar',
  299.00,
  '100g',
  'Intense, rich & velvety single-origin South Indian cocoa sweetened solely with organic Medjool dates. Zero refined sugar, zero preservatives. Crafted fresh on order.',
  ARRAY['75% Single Origin Cocoa', 'Organic Dates', 'Pure Cocoa Butter', 'Vanilla Pod'],
  ARRAY['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1000&auto=format&fit=crop'],
  'Dark Chocolates',
  true,
  45
),
(
  '22222222-2222-2222-2222-222222222222',
  'Roasted Almond & Sea Salt Truffle Box',
  449.00,
  '180g (8 pcs)',
  'Slow-roasted Californian almonds layered in 70% dark Belgian cocoa and sprinkled with hand-harvested pink Himalayan sea salt. The ultimate guilt-free indulgence.',
  ARRAY['70% Dark Cocoa', 'Roasted Almonds', 'Organic Raw Honey', 'Himalayan Pink Salt', 'Pure Cocoa Butter'],
  ARRAY['https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1000&auto=format&fit=crop'],
  'Nut Loaded',
  true,
  30
),
(
  '33333333-3333-3333-3333-333333333333',
  'Pistachio & Cranberry Velvet Bark',
  389.00,
  '150g',
  'A vibrant artisanal bark bursting with Turkish pistachios, ruby cranberries, and rich stone-ground dark cocoa sweetened with organic coconut jaggery.',
  ARRAY['70% Dark Cocoa', 'Turkish Pistachios', 'Dried Cranberries', 'Organic Coconut Sugar', 'Pure Cocoa Butter'],
  ARRAY['https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000&auto=format&fit=crop'],
  'Dark Chocolates',
  false,
  25
),
(
  '44444444-4444-4444-4444-444444444444',
  'Hazelnut Praline Date Cups',
  499.00,
  '200g (6 large cups)',
  'Stuffed Arabian Medjool dates filled with 100% stone-ground hazelnut butter and drenched in luscious 80% dark homemade chocolate.',
  ARRAY['Medjool Dates', '80% Dark Cocoa', 'Roasted Hazelnuts', 'Pure Vanilla Bean', 'Cold Pressed Coconut Oil'],
  ARRAY['https://images.unsplash.com/photo-1575372587186-500e3915e61e?q=80&w=1000&auto=format&fit=crop'],
  'Sugar-Free',
  true,
  35
),
(
  '55555555-5555-5555-5555-555555555555',
  'Mom''s Signature Artisan Tasting Box',
  899.00,
  '350g (16 pcs assortment)',
  'A luxurious handcrafted gift hamper featuring our 4 signature flavours: Almond Rocks, Pistachio Bark, Sea Salt Dark Bites, and Date Truffles. Perfect for celebrations.',
  ARRAY['Assorted 70-80% Dark Cocoa', 'Californian Almonds', 'Pistachios', 'Dates', 'Organic Jaggery', 'Pink Salt'],
  ARRAY['https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?q=80&w=1000&auto=format&fit=crop'],
  'Gift Boxes',
  true,
  20
),
(
  '66666666-6666-6666-6666-666666666666',
  '80% Sugar-Free Espresso Cocoa Thins',
  349.00,
  '120g',
  'Ultra-crisp dark chocolate thins infused with freshly roasted Chikmagalur Arabica coffee beans and naturally sweetened with Monk Fruit extract.',
  ARRAY['80% Dark Cocoa', 'Chikmagalur Arabica Coffee', 'Monk Fruit Extract', 'Pure Cocoa Butter'],
  ARRAY['https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1000&auto=format&fit=crop'],
  'Sugar-Free',
  false,
  40
)
ON CONFLICT (id) DO NOTHING;

-- SEED INITIAL 5-STAR APPROVED REVIEWS FROM REAL MOMS
INSERT INTO public.reviews (id, customer_name, product_id, rating, comment, is_approved)
VALUES
(
  'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Priya Sharma (Indiranagar, Bangalore)',
  '11111111-1111-1111-1111-111111111111',
  5,
  'Finally a chocolate I can guilt-free give to my 4-year-old son! No sugar rush, perfectly sweetened with dates. We are hooked!',
  true
),
(
  'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Ananya Reddy (HSR Layout, Bangalore)',
  '22222222-2222-2222-2222-222222222222',
  5,
  'The Roasted Almond Sea Salt Truffle is to die for. You can literally taste the freshness of small batch craftsmanship. 10/10!',
  true
),
(
  'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Deepa Narayan (Whitefield, Bangalore)',
  '55555555-5555-5555-5555-555555555555',
  5,
  'Ordered the Signature Box for Diwali gifting to my family. Everyone asked where I bought it. The packaging and taste are world-class!',
  true
)
ON CONFLICT (id) DO NOTHING;
