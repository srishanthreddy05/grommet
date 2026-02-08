'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { database } from '@/src/lib/firebase';

type ProductRecord = {
  name: string;
  price: number;
  stock: number;
  description?: string;
  displayImage: string;
  album?: string[];
  enabled: boolean;
};

type Product = ProductRecord & { id: string };

export default function ItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const snapshot = await get(ref(database, 'stock'));
        if (!isMounted) {
          return;
        }

        if (!snapshot.exists()) {
          setProducts([]);
          setHasError(false);
          return;
        }

        const data = snapshot.val() as Record<string, ProductRecord> | null;
        if (!data || typeof data !== 'object') {
          setProducts([]);
          setHasError(false);
          return;
        }

        const nextProducts = Object.entries(data)
          .map(([id, product]) => ({ id, ...product }))
          .filter((product) => product.enabled === true && product.stock > 0);

        setProducts(nextProducts);
        setHasError(false);
      } catch (error) {
        console.error('Failed to load products:', error);
        if (isMounted) {
          setHasError(true);
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
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
            Collections
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Explore our premium collection of car frames
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-900 mb-4"></div>
            <p>Loading products...</p>
          </div>
        ) : hasError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm text-center">
            <p className="font-medium">Unable to load products. Please try again shortly.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm text-center">
            <p>No products available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/items/${product.id}`}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                  <Image
                    src={product.displayImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition">
                    {product.name}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-auto">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
