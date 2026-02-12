'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { get, ref } from 'firebase/database';
import { database } from '@/src/lib/firebase';

type ProductRecord = {
  name: string;
  price: number;
  mrp?: number;
  stock: number;
  description?: string;
  displayImage: string;
  album?: string[];
  enabled: boolean;
  category?: string;
};

type Product = ProductRecord & { id: string };

interface HomeCategorySectionProps {
  categorySlug: string;
  categoryTitle: string;
  bgColor?: string;
}

export default function HomeCategorySection({
  categorySlug,
  categoryTitle,
  bgColor = 'white',
}: HomeCategorySectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const snapshot = await get(ref(database, 'stock'));
        if (!isMounted) return;

        if (!snapshot.exists()) {
          setProducts([]);
          return;
        }

        const data = snapshot.val() as Record<string, ProductRecord> | null;
        if (!data || typeof data !== 'object') {
          setProducts([]);
          return;
        }

        // Filter products by category and enabled status
        const categoryProducts = Object.entries(data)
          .map(([id, product]) => ({ id, ...product }))
          .filter(
            (product) =>
              product.enabled === true && product.category === categorySlug
          );

        setProducts(categoryProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  if (isLoading) {
    return (
      <section style={{ backgroundColor: bgColor }} className="py-8">
        <div className="container">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display' }}>
                {categoryTitle}
              </h2>
              <p className="text-sm text-gray-500">Discover our latest best-seller!</p>
            </div>
            <div className="text-center text-slate-500">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show categories with no products
  }

  return (
    <section style={{ backgroundColor: bgColor }} className="py-8">
      <div className="container">
        <div className="space-y-6">
          {/* Section Header */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display' }}>
              {categoryTitle}
            </h2>
            <p className="text-sm text-gray-500">Discover our latest best-seller!</p>
          </div>

          {/* Products Flex Container - Horizontal scroll */}
          <div 
            className="flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5"
            style={{
              flexWrap: 'nowrap',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
          {products.map((product) => {
            const hasDiscount = product.mrp && product.mrp > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
              : 0;

            return (
              <Link
                key={product.id}
                href={`/items/${product.id}`}
                className="bg-[#FEF7EF] rounded-xl shadow-md p-4 flex flex-col group product-card"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={product.displayImage}
                    alt={product.name}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition">
                    {product.name}
                  </h3>

                  {/* Pricing */}
                  <div className="mt-auto">
                    {hasDiscount && (
                      <p className="text-xs text-slate-400 line-through mb-1">
                        ₹{product.mrp}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-slate-900">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-6">
          <Link
            href={`/items?category=${categorySlug}`}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition duration-200"
          >
            View All
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}