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
}

export default function HomeCategorySection({
  categorySlug,
  categoryTitle,
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

        // Filter products by category and enabled status, then take first 4
        const categoryProducts = Object.entries(data)
          .map(([id, product]) => ({ id, ...product }))
          .filter(
            (product) =>
              product.enabled === true && product.category === categorySlug
          )
          .slice(0, 4); // Only take first 4 products

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
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              {categoryTitle}
            </h2>
            <p className="text-slate-600">Discover our latest best-seller!</p>
          </div>
          <div className="text-center text-slate-500">Loading...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              {categoryTitle}
            </h2>
            <p className="text-slate-600">Discover our latest best-seller!</p>
          </div>
          <div className="text-center py-12">
            <p className="text-xl font-semibold text-slate-700">
              New Drop Coming Soon 🚀
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 bg-[#FEF7EF]">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {categoryTitle}
          </h2>
          <p className="text-slate-600 text-lg">
            Discover our latest best-seller!
          </p>
        </div>

        {/* Products Grid - Single Row Only */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {products.map((product) => {
            const hasDiscount = product.mrp && product.mrp > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
              : 0;

            return (
              <Link
                key={product.id}
                href={`/items/${product.id}`}
                className="group bg-[#FEF7EF] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                  <Image
                    src={product.displayImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded shadow-md">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition">
                    {product.name}
                  </h3>

                  {/* Pricing */}
                  <div className="mt-auto">
                    {hasDiscount && (
                      <p className="text-xs sm:text-sm text-slate-400 line-through mb-1">
                        ₹{product.mrp}
                      </p>
                    )}
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href={`/items?category=${categorySlug}`}
            className="inline-block bg-slate-900 text-white font-semibold px-8 py-3 rounded-lg hover:bg-slate-800 transition duration-200 shadow-md"
          >
            View All {categoryTitle}
          </Link>
        </div>
      </div>
    </section>
  );
}
