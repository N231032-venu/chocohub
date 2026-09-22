import { Product, Review } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: '75% Dark Single-Origin Cocoa Bar',
    price: 299,
    weight: '100g',
    description: 'Intense, rich & velvety single-origin South Indian cocoa sweetened solely with organic Medjool dates. Zero refined sugar, zero preservatives. Crafted fresh on order in Bangalore.',
    ingredients: ['75% Single Origin Cocoa', 'Organic Dates', 'Pure Cocoa Butter', 'Vanilla Pod'],
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1000&auto=format&fit=crop'
    ],
    category: 'Dark Chocolates',
    is_bestseller: true,
    stock: 45,
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Roasted Almond & Sea Salt Truffle Box',
    price: 449,
    weight: '180g (8 pcs)',
    description: 'Slow-roasted Californian almonds layered in 70% dark Belgian cocoa and sprinkled with hand-harvested pink Himalayan sea salt. The ultimate guilt-free indulgence.',
    ingredients: ['70% Dark Cocoa', 'Roasted Almonds', 'Organic Raw Honey', 'Himalayan Pink Salt', 'Pure Cocoa Butter'],
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000&auto=format&fit=crop'
    ],
    category: 'Nut Loaded',
    is_bestseller: true,
    stock: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Pistachio & Cranberry Velvet Bark',
    price: 389,
    weight: '150g',
    description: 'A vibrant artisanal bark bursting with Turkish pistachios, ruby cranberries, and rich stone-ground dark cocoa sweetened with organic coconut jaggery.',
    ingredients: ['70% Dark Cocoa', 'Turkish Pistachios', 'Dried Cranberries', 'Organic Coconut Sugar', 'Pure Cocoa Butter'],
    images: [
      'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1000&auto=format&fit=crop'
    ],
    category: 'Dark Chocolates',
    is_bestseller: false,
    stock: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Hazelnut Praline Date Cups',
    price: 499,
    weight: '200g (6 large cups)',
    description: 'Stuffed Arabian Medjool dates filled with 100% stone-ground hazelnut butter and drenched in luscious 80% dark homemade chocolate.',
    ingredients: ['Medjool Dates', '80% Dark Cocoa', 'Roasted Hazelnuts', 'Pure Vanilla Bean', 'Cold Pressed Coconut Oil'],
    images: [
      'https://images.unsplash.com/photo-1575372587186-500e3915e61e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?q=80&w=1000&auto=format&fit=crop'
    ],
    category: 'Sugar-Free',
    is_bestseller: true,
    stock: 35,
    created_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Mom\'s Signature Artisan Tasting Box',
    price: 899,
    weight: '350g (16 pcs assortment)',
    description: 'A luxurious handcrafted gift hamper featuring our 4 signature flavours: Almond Rocks, Pistachio Bark, Sea Salt Dark Bites, and Date Truffles. Perfect for celebrations.',
    ingredients: ['Assorted 70-80% Dark Cocoa', 'Californian Almonds', 'Pistachios', 'Dates', 'Organic Jaggery', 'Pink Salt'],
    images: [
      'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1000&auto=format&fit=crop'
    ],
    category: 'Gift Boxes',
    is_bestseller: true,
    stock: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: '80% Sugar-Free Espresso Cocoa Thins',
    price: 349,
    weight: '120g',
    description: 'Ultra-crisp dark chocolate thins infused with freshly roasted Chikmagalur Arabica coffee beans and naturally sweetened with Monk Fruit extract.',
    ingredients: ['80% Dark Cocoa', 'Chikmagalur Arabica Coffee', 'Monk Fruit Extract', 'Pure Cocoa Butter'],
    images: [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1000&auto=format&fit=crop'
    ],
    category: 'Sugar-Free',
    is_bestseller: false,
    stock: 40,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    customer_name: 'Priya Sharma (Indiranagar, Bangalore)',
    product_id: '11111111-1111-1111-1111-111111111111',
    product_name: '75% Dark Single-Origin Cocoa Bar',
    rating: 5,
    comment: 'Finally a chocolate I can guilt-free give to my 4-year-old son! No sugar rush, perfectly sweetened with dates. We are officially hooked!',
    is_approved: true,
    created_at: '2026-09-10T14:32:00Z',
  },
  {
    id: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    customer_name: 'Ananya Reddy (HSR Layout, Bangalore)',
    product_id: '22222222-2222-2222-2222-222222222222',
    product_name: 'Roasted Almond & Sea Salt Truffle Box',
    rating: 5,
    comment: 'The Roasted Almond Sea Salt Truffle is to die for. You can literally taste the freshness of small-batch craftsmanship. 10/10!',
    is_approved: true,
    created_at: '2026-09-12T10:15:00Z',
  },
  {
    id: 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    customer_name: 'Deepa Narayan (Whitefield, Bangalore)',
    product_id: '55555555-5555-5555-5555-555555555555',
    product_name: 'Mom\'s Signature Artisan Tasting Box',
    rating: 5,
    comment: 'Ordered the Signature Box for festive gifting to my family. Everyone was blown away and asked where I bought it from. The packaging and taste are world-class!',
    is_approved: true,
    created_at: '2026-09-15T18:45:00Z',
  },
  {
    id: 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    customer_name: 'Kavitha Murthy (Koramangala, Bangalore)',
    product_id: '44444444-4444-4444-4444-444444444444',
    product_name: 'Hazelnut Praline Date Cups',
    rating: 5,
    comment: 'As a diabetic mom who craves chocolate, these date cups are a blessing. Rich, luxurious, and doesn\'t spike my glucose levels!',
    is_approved: true,
    created_at: '2026-09-18T12:00:00Z',
  },
];
