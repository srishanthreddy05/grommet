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
  bgColor = '#FFF9F0',
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
      <section style={{ backgroundColor: bgColor }} className="py-12 sm:py-16 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-300"></div>
                <span className="text-xs uppercase tracking-widest text-amber-700/60 font-semibold">Collection</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-300"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent mb-2 tracking-tight">
                {categoryTitle}
              </h2>
              <p className="text-sm sm:text-base text-amber-700/70 font-light">Discover our curated selection</p>
            </div>

            {/* Loading Animation */}
            <div className="flex items-center justify-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show categories with no products
  }

  return (
    <section style={{ backgroundColor: bgColor }} className="py-12 sm:py-16 relative overflow-hidden">
      {/* Premium Background Decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-8">
          {/* Enhanced Section Header */}
          <div className="text-center sm:text-left mb-8">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-300 to-amber-400"></div>
              <span className="text-xs uppercase tracking-widest text-amber-700/60 font-semibold">Featured Collection</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-amber-300 to-amber-400"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent mb-3 tracking-tight">
              {categoryTitle}
            </h2>
            <p className="text-sm sm:text-base text-amber-700/70 font-light tracking-wide">
              Handpicked pieces crafted with excellence
            </p>
          </div>

          {/* Premium Products Horizontal Scroll */}
          <div className="relative group">
            <div 
              className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
              style={{
                flexWrap: 'nowrap',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
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
                    className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/40 shadow-md hover:shadow-2xl hover:border-amber-300/60 transition-all duration-500 overflow-hidden flex flex-col group hover:-translate-y-2 snap-start"
                  >
                    {/* Product Image */}
                    <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                      <Image
                        src={product.displayImage}
                        alt={product.name}
                        fill
                        sizes="320px"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      


                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                          {discountPercent}% OFF
                        </div>
                      )}

                      {/* Stock Badge */}
                      {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-3 right-3 bg-amber-100/90 backdrop-blur-sm text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                          Only {product.stock} left
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-transparent to-amber-50/30">
                      <h3 className="text-sm sm:text-base font-semibold text-amber-950 mb-3 line-clamp-2 group-hover:text-amber-800 transition-colors duration-300 leading-snug">
                        {product.name}
                      </h3>

                      {/* Pricing Section */}
                      <div className="mt-auto space-y-2">
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                          {hasDiscount && (
                            <p className="text-xs sm:text-sm text-amber-600/50 line-through font-light">
                              ₹{product.mrp!.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>

                        {/* Quick View Indicator */}
                        <div className="flex items-center gap-1.5 text-amber-700/0 group-hover:text-amber-700/70 transition-colors duration-300">
                          <span className="text-xs font-medium">View Details</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Enhanced View All Button */}
          <div className="flex justify-center mt-16">
            <Link
              href={`/items?category=${categorySlug}`}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 px-8 py-4 rounded-full text-sm font-semibold hover:from-amber-200 hover:to-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-300/50 overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative z-10">View All {categoryTitle}</span>
              <svg 
                className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}