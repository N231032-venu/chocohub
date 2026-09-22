# 🍫 Happy Choco Homemade - Premium D2C Web Platform

A production-ready, ultra-luxury D2C e-commerce website built for **Happy Choco Homemade** — handcrafted healthy dark chocolates by a Bangalore mompreneur.

![Happy Choco Homemade Banner](https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1200&auto=format&fit=crop)

---

## 🌟 Brand Highlights & USPs
- **Zero Refined Sugar**: Sweetened with organic Medjool dates, raw wild honey, and coconut palm jaggery.
- **100% Preservative Free**: Zero artificial waxes, zero palm oil, zero chemical emulsifiers.
- **70–80% Single Origin Cocoa**: Pure South Indian & Belgian cocoa rich in polyphenols.
- **Fresh on Order**: Handcrafted in small batches in Bangalore upon receiving every order.
- **Direct WhatsApp Orders**: 1-click integration with `+91 9845368540`.
- **Social Proof**: 4.9/5 average rating from 200+ Bangalore moms.

---

## 🚀 Tech Stack
- **Framework**: [Next.js 14 App Router](https://nextjs.org/) (React 18, TypeScript)
- **Styling**: Tailwind CSS + Custom Luxury Palette (`#FFFBF5`, `#3D2218`, `#8B6A5C`, `#FDF0E6`, `#2B1A12`)
- **Typography**: Playfair Display (Serif Headings) & Inter (Sans Body)
- **Animations**: Framer Motion & Canvas Confetti
- **State**: Zustand with local storage persistence for shopping cart & slide-over drawer
- **Database, Auth & Storage**: Supabase (PostgreSQL, Row Level Security, Storage Buckets)
- **Analytics & Graphs**: Recharts
- **Icons**: Lucide React

---

## 🗄️ Database & Storage Setup (Supabase)

1. Create a new Supabase project at [database.new](https://database.new).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open [`supabase/schema.sql`](./supabase/schema.sql) in this repository, copy all contents, and click **RUN**.
4. This will automatically configure:
   - `profiles` table with automatic auth trigger.
   - `products` table seeded with 6 artisan chocolate products.
   - `orders` table with status workflow (`confirmed`, `preparing`, `shipped`, `delivered`).
   - `reviews` table seeded with 5-star mom reviews and moderation flag (`is_approved`).
   - `product-images` and `review-images` public storage buckets.
   - Strict Row Level Security (RLS) policies protecting customer and owner records.

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the keys from your **Supabase Dashboard -> Settings -> API**:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Owner Admin Settings
NEXT_PUBLIC_ADMIN_EMAIL=boyillavenugopal@gmail.com
ADMIN_EMAIL=boyillavenugopal@gmail.com
ADMIN_PASSWORD=HappyChocoAdmin2026!

# Brand Contact Details
NEXT_PUBLIC_BRAND_PHONE=919845368540
NEXT_PUBLIC_BRAND_INSTAGRAM=happychoco_homemade
```

---

## 🛠️ Local Development

Install dependencies and run dev server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Owner Admin Access (`/admin`)

- The owner portal is protected at `/admin`.
- Only accessible when signed in as `boyillavenugopal@gmail.com` (or the configured `ADMIN_EMAIL`).
- Non-admin users attempting to access `/admin` will be redirected to the login screen.
- Features inside `/admin`:
  1. **Dashboard**: Revenue trajectory charts, total order stats, customer count, pending kitchen batches.
  2. **Orders Manager**: Real-time orders feed, status transition selector, 1-click customer WhatsApp chat link.
  3. **Product Inventory**: Add new recipes, upload images to Supabase Storage, update prices, stock, and bestseller highlights.
  4. **Customers Manager**: Registered customer database with addresses and contact numbers.
  5. **Reviews Manager**: Moderation queue to approve 5-star customer reviews before displaying on the live site.

---

## 🚢 Deploy to Vercel in 1 Click

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local` to the Vercel project settings.
4. Click **Deploy**!

---

## 📦 Project Directory Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root luxury layout with Header & Footer
│   │   ├── page.tsx                # High-converting artisan landing page
│   │   ├── globals.css             # Glassmorphism, animations & color tokens
│   │   ├── products/               # Products catalog & [id] detail pages
│   │   ├── checkout/               # Multi-step checkout with address & payment choice
│   │   ├── order-success/          # Confetti celebration + WhatsApp live tracking CTA
│   │   ├── login/ & register/      # Supabase email/password authentication
│   │   ├── account/                # Customer portal (Orders timeline, Addresses, Reviews)
│   │   └── admin/                  # Protected Owner Admin Dashboard & Managers
│   ├── components/
│   │   ├── layout/                 # Header, Footer
│   │   ├── cart/                   # Slide-over Cart Drawer with free shipping progress
│   │   ├── product/                # ProductCard, QuickViewModal
│   │   ├── home/                   # Hero, USPs, Catalog, Story, Reviews, FAQ, Gifting CTA
│   │   └── admin/                  # Recharts Revenue graph & admin components
│   ├── lib/
│   │   ├── supabase/               # Client, Server, Admin & Middleware clients
│   │   ├── store/                  # Zustand persistent cart store
│   │   ├── seed-data.ts            # Seed artisan chocolates & mom reviews
│   │   └── utils.ts                # INR formatting, WhatsApp URL builder, admin guard
│   ├── types/                      # TypeScript schemas
│   └── middleware.ts               # Route guard for /admin and /account
├── supabase/
│   └── schema.sql                  # Complete Supabase PostgreSQL schema & RLS policies
├── package.json
└── tailwind.config.ts
```
