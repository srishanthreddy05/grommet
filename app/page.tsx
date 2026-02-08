'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
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

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          return;
        }

        const data = snapshot.val() as Record<string, ProductRecord> | null;
        if (!data || typeof data !== 'object') {
          setProducts([]);
          return;
        }

        const nextProducts = Object.entries(data)
          .map(([id, product]) => ({ id, ...product }))
          .filter((product) => product.enabled === true && product.stock > 0);

        setProducts(nextProducts);
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
  }, []);

  const heroImages = useMemo(
    () => products.slice(0, 4).map((product) => product.displayImage),
    [products]
  );

  useEffect(() => {
    if (heroImages.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12 sm:py-16 md:py-20">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="space-y-8 sm:space-y-10">
          <div className="space-y-4 sm:space-y-6 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Order Car Frames Easily
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Browse our premium collection of car frames and place your order in just a few taps. Fast, reliable, and secure.
            </p>
          </div>

          {/* Auto-Rotating Hero Images */}
          <div className="flex justify-center">
            <div className="relative bg-white rounded-2xl aspect-square overflow-hidden shadow-lg w-full max-w-sm flex items-center justify-center">
              {isLoading ? (
                <div className="text-slate-500 text-sm">Loading highlights...</div>
              ) : heroImages.length === 0 ? (
                <div className="text-slate-500 text-sm">No featured items yet.</div>
              ) : (
                heroImages.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Featured product ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 90vw, 400px"
                      className="object-cover object-center"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/items"
              className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-slate-900 hover:bg-slate-800 text-white text-lg sm:text-xl font-bold rounded-xl transition duration-200 shadow-lg hover:shadow-xl active:scale-95 text-center"
            >
              Shop Now
            </Link>

            {/* Trust Badges */}
            <div className="text-sm text-slate-600 text-center space-y-2">
              <p className="font-medium">✓ Premium Quality | ✓ Fast Delivery | ✓ Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
