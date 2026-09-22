'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  ShoppingBag,
  Check,
  ShieldCheck,
  Heart,
  Sparkles,
  ArrowLeft,
  Truck,
  RotateCcw,
  MessageCircle
} from 'lucide-react';
import { Product, Review } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '@/lib/seed-data';
import { useCartStore } from '@/lib/store/cart-store';
import { formatINR, BRAND_PHONE_CLEAN } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (!error && data) {
          setProduct(data);
        } else {
          // fallback to seed data
          const found = INITIAL_PRODUCTS.find((p) => p.id === productId);
          setProduct(found || INITIAL_PRODUCTS[0]);
        }

        // fetch reviews for this product
        const { data: revData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .eq('is_approved', true);

        if (revData && revData.length > 0) {
          setReviews(revData);
        } else {
          const matchingSeed = INITIAL_REVIEWS.filter((r) => r.product_id === productId);
          setReviews(matchingSeed.length > 0 ? matchingSeed : INITIAL_REVIEWS.slice(0, 2));
        }
      } catch {
        const found = INITIAL_PRODUCTS.find((p) => p.id === productId);
        setProduct(found || INITIAL_PRODUCTS[0]);
        setReviews(INITIAL_REVIEWS.slice(0, 2));
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cocoa border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800'
  ];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa hover:text-cocoa-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Chocolates</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-32 overflow-hidden bg-card border border-truffle/20 shadow-soft-lg">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
            {product.is_bestseller && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-gold text-cocoa-dark font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-cocoa-dark" />
                Bestseller
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-cocoa-dark scale-105 shadow-md'
                      : 'border-truffle/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-card text-truffle-dark text-xs font-bold uppercase tracking-wider border border-truffle/20">
                {product.category}
              </span>
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Made Fresh on Order in Bangalore
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-dark leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold" />
                ))}
              </div>
              <span className="text-xs font-semibold text-cocoa">
                4.9/5 ({reviews.length + 15} mom reviews)
              </span>
            </div>
          </div>

          {/* Price & Weight */}
          <div className="p-4 rounded-24 bg-[#FDF0E6] border border-truffle/15 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-truffle block">Price</span>
              <span className="font-serif text-3xl font-bold text-cocoa-dark">
                {formatINR(product.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-truffle block">Pack Net Weight</span>
              <span className="text-sm font-bold text-cocoa-dark">{product.weight}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-cocoa-muted leading-relaxed font-light">
            {product.description}
          </p>

          {/* Ingredients list */}
          {product.ingredients?.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                Wholesome Natural Ingredients:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-cream-200 text-cocoa-dark text-xs font-medium border border-truffle/20"
                  >
                    🌱 {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart controls */}
          <div className="space-y-4 pt-4 border-t border-truffle/15">
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-truffle/30 rounded-full bg-cream-50 px-3 py-2 shadow-inner">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-cocoa hover:text-cocoa-dark font-bold text-base"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-cocoa-dark min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-cocoa hover:text-cocoa-dark font-bold text-base"
                >
                  +
                </button>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added {quantity} to Box!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add {quantity > 1 ? `${quantity} items` : 'to Cart'} • {formatINR(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Quick Order */}
            <a
              href={`https://wa.me/${BRAND_PHONE_CLEAN}?text=${encodeURIComponent(`Hi! I would like to order ${quantity}x ${product.name} (${product.weight}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-emerald-700/10 text-emerald-800 hover:bg-emerald-700/20 border border-emerald-700/30 text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-700" />
              <span>Order this variant directly on WhatsApp</span>
            </a>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-truffle/15 text-xs text-cocoa">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-truffle-dark shrink-0" />
              <span>Free Bangalore delivery over ₹799</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-truffle-dark shrink-0" />
              <span>Zero refined sugar guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-16 sm:mt-24 pt-12 border-t border-truffle/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-dark">
              Mom Customer Reviews
            </h2>
            <p className="text-xs text-truffle mt-1">Verified reviews for this handcrafted recipe</p>
          </div>
          <Link
            href="/account/reviews"
            className="px-4 py-2 rounded-full bg-card hover:bg-cream-200 text-cocoa-dark text-xs font-semibold border border-truffle/20 transition-colors"
          >
            Write a Review
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FDF0E6] rounded-24 p-6 border border-truffle/15 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified Purchase
                </span>
              </div>
              <p className="text-xs text-cocoa leading-relaxed italic">
                "{rev.comment}"
              </p>
              <div className="pt-2 border-t border-truffle/10">
                <p className="text-xs font-bold text-cocoa-dark">{rev.customer_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
