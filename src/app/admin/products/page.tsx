'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Search,
  Upload,
  Check,
  X,
  Star,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatINR } from '@/lib/utils';
import { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/seed-data';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('Dark Chocolates');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('40');
  const [isBestseller, setIsBestseller] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('is_bestseller', { ascending: false });

      if (!error && data && data.length > 0) {
        setProducts(data);
      }
    } catch {
      // fallback to seed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setWeight('150g');
    setCategory('Dark Chocolates');
    setDescription('');
    setIngredientsText('70% Dark Cocoa, Organic Dates, Pure Cocoa Butter');
    setImageUrl('https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800');
    setStock('40');
    setIsBestseller(false);
    setFormMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setWeight(product.weight);
    setCategory(product.category);
    setDescription(product.description);
    setIngredientsText(product.ingredients?.join(', ') || '');
    setImageUrl(product.images?.[0] || '');
    setStock(product.stock?.toString() || '40');
    setIsBestseller(product.is_bestseller || false);
    setFormMsg('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        setImageUrl(publicUrl);
        setFormMsg('Image uploaded to Supabase Storage successfully!');
      } else {
        // Use object url preview
        setImageUrl(URL.createObjectURL(file));
      }
    } catch {
      setImageUrl(URL.createObjectURL(file));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) return;

    const ingredients = ingredientsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const productPayload: Partial<Product> = {
      name,
      price: parseFloat(price),
      weight: weight || '150g',
      category,
      description,
      ingredients,
      images: [imageUrl || 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800'],
      stock: parseInt(stock, 10) || 30,
      is_bestseller: isBestseller,
    };

    try {
      const supabase = createClient();

      if (editingProduct) {
        // Update
        await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? ({ ...p, ...productPayload } as Product) : p
          )
        );
      } else {
        // Insert
        const newId = `prod-${Date.now()}`;
        const newRecord = { id: newId, ...productPayload } as Product;

        const { data } = await supabase
          .from('products')
          .insert(newRecord)
          .select()
          .single();

        setProducts([data || newRecord, ...products]);
      }

      setIsModalOpen(false);
    } catch {
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? ({ ...p, ...productPayload } as Product) : p
          )
        );
      } else {
        const newRecord = { id: `prod-${Date.now()}`, ...productPayload } as Product;
        setProducts([newRecord, ...products]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this chocolate recipe?')) return;

    try {
      const supabase = createClient();
      await supabase.from('products').delete().eq('id', productId);
      setProducts(products.filter((p) => p.id !== productId));
    } catch {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FDF0E6] rounded-32 p-6 sm:p-8 border border-truffle/15 shadow-soft space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-truffle/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cocoa-dark">
            Product Inventory & Recipes
          </h1>
          <p className="text-xs text-truffle mt-0.5">
            Add new chocolate variants, edit pricing, ingredients, and upload photos
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-cocoa-dark text-[#FDF0E6] hover:bg-cocoa text-xs font-semibold shadow-md transition-all group"
        >
          <Plus className="w-4 h-4 text-gold group-hover:rotate-90 transition-transform" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-semibold text-cocoa-dark">
          Showing {filteredProducts.length} chocolate creations
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-truffle" />
          <input
            type="text"
            placeholder="Search chocolate name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-full bg-[#FFFBF5] border border-truffle/20 text-xs text-cocoa-dark focus:outline-none focus:ring-2 focus:ring-cocoa-dark/20"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-[#FFFBF5] rounded-24 p-4 sm:p-5 border border-truffle/15 shadow-sm hover:shadow-soft transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-card mb-3">
                <Image
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=600'}
                  alt={prod.name}
                  fill
                  className="object-cover"
                />
                {prod.is_bestseller && (
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-gold text-cocoa-dark font-bold text-[9px] uppercase shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-cocoa-dark" />
                    Bestseller
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-truffle mb-1">
                <span className="font-semibold uppercase">{prod.category}</span>
                <span>{prod.weight}</span>
              </div>

              <h3 className="font-serif text-base font-bold text-cocoa-dark leading-snug truncate">
                {prod.name}
              </h3>

              <p className="text-xs text-cocoa-muted line-clamp-2 mt-1 leading-relaxed">
                {prod.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-truffle/15 flex items-center justify-between">
              <div>
                <span className="font-serif text-lg font-bold text-cocoa-dark">
                  {formatINR(prod.price)}
                </span>
                <span className="text-[10px] text-truffle block">Stock: {prod.stock || 40} units</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(prod)}
                  className="p-2 rounded-full bg-card hover:bg-cream-200 text-cocoa-dark border border-truffle/20 transition-colors"
                  title="Edit Product"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(prod.id)}
                  className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-cocoa-dark/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-[#FFFBF5] rounded-32 p-6 sm:p-8 shadow-2xl border border-truffle/20 z-10 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-truffle/15">
              <h2 className="font-serif text-xl font-bold text-cocoa-dark">
                {editingProduct ? 'Edit Artisan Chocolate' : 'Add New Chocolate Creation'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-cream-200 text-cocoa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formMsg && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-800 font-medium">
                {formMsg}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Chocolate Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 75% Dark Single-Origin Cocoa Bar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Weight / Pieces *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 180g (8 pcs)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark font-medium"
                  >
                    <option value="Dark Chocolates">Dark Chocolates</option>
                    <option value="Nut Loaded">Nut Loaded</option>
                    <option value="Sugar-Free">Sugar-Free</option>
                    <option value="Gift Boxes">Gift Boxes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Description & Taste Notes *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Rich description of chocolate flavor, sweetness source, and texture"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Natural Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="75% Cocoa, Organic Dates, Almonds, Cocoa Butter"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
                  />
                </div>

                {/* Image Upload & URL */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-cocoa-dark uppercase tracking-wider">
                    Product Image (Upload or Image URL)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-card border border-truffle/25 text-xs text-cocoa-dark"
                    />

                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-cocoa-dark text-xs font-semibold border border-truffle/20 flex items-center gap-1.5 whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Bestseller Toggle */}
                <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-card border border-truffle/15">
                  <input
                    type="checkbox"
                    id="bestseller-toggle"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 rounded text-cocoa-dark focus:ring-0"
                  />
                  <label htmlFor="bestseller-toggle" className="text-xs font-bold text-cocoa-dark cursor-pointer flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    Feature as Mom's Bestseller on Homepage
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-truffle/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-cream-200 text-cocoa-dark text-xs font-semibold hover:bg-cream-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-cocoa-dark text-[#FDF0E6] text-xs font-semibold hover:bg-cocoa shadow-md"
                >
                  {editingProduct ? 'Update Product' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
