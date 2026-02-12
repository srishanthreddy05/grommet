'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  tags?: string[];
};

type Product = ProductRecord & { id: string };

export default function ItemsClient() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch all products from Firebase
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const snapshot = await get(ref(database, 'stock'));
        if (!isMounted) {
          return;
        }

        if (!snapshot.exists()) {
          setAllProducts([]);
          setHasError(false);
          return;
        }

        const data = snapshot.val() as Record<string, ProductRecord> | null;
        if (!data || typeof data !== 'object') {
          setAllProducts([]);
          setHasError(false);
          return;
        }

        const nextProducts = Object.entries(data)
          .map(([id, product]) => ({ id, ...product }))
          .filter((product) => product.enabled === true);

        setAllProducts(nextProducts);
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

  // Filter products based on selected category and search text
  useEffect(() => {
    const searchLower = search.trim().toLowerCase();

    const filtered = allProducts.filter((product) => {
      if (product.enabled !== true) return false;

      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      let matchesSearch = true;
      if (searchLower) {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const tagsMatch = product.tags 
          ? product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
          : false;
        matchesSearch = nameMatch || tagsMatch;
      }

      return matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [allProducts, selectedCategory, search]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Premium Page Header with Decorative Elements */}
        <div className="mb-12 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-96 h-96 bg-amber-200 rounded-full blur-3xl"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent mb-4 tracking-tight relative">
            Premium Collections
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-300"></div>
            <p className="text-base sm:text-lg text-amber-800/80 font-light tracking-wide">
              Curated Excellence
            </p>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-300"></div>
          </div>
        </div>

        {/* Enhanced Search Bar with Icon */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/50 to-orange-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative">
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600/60"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                type="text"
                placeholder="Discover your perfect piece..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-amber-200/60 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 text-amber-950 placeholder-amber-600/40 shadow-sm hover:shadow-md transition-all duration-300 font-light"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-amber-200/50 bg-white/60 backdrop-blur-sm p-12 shadow-lg text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mb-6"></div>
            <p className="text-amber-800 font-light text-lg">Curating your collection...</p>
          </div>
        ) : hasError ? (
          <div className="rounded-3xl border border-red-200/60 bg-red-50/80 backdrop-blur-sm p-12 shadow-lg text-center">
            <p className="font-medium text-red-700 text-lg">Unable to load products. Please try again shortly.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-amber-200/50 bg-white/60 backdrop-blur-sm p-16 shadow-xl text-center">
            <p className="text-2xl sm:text-3xl font-light text-amber-900 mb-2">
              {search.trim() ? 'No products found' : 'New Collection Arriving Soon'}
            </p>
            <p className="text-amber-700/60 text-sm mt-4">Stay tuned for exclusive pieces</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {filteredProducts.map((product) => {
              const hasDiscount = product.mrp && product.mrp > product.price;
              const discountPercent = hasDiscount
                ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/items/${product.id}`}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/40 shadow-md hover:shadow-2xl hover:border-amber-300/60 transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-1"
                >
                  {/* Image Container with Overlay Effect */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                    <Image
                      src={product.displayImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
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

                  {/* Product Info Card */}
                  <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-transparent to-amber-50/30">
                    <h3 className="text-sm sm:text-base font-semibold text-amber-950 mb-3 line-clamp-2 group-hover:text-amber-800 transition-colors duration-300 leading-snug">
                      {product.name}
                    </h3>
                    
                    {/* Category Tag */}
                    {product.category && (
                      <span className="text-xs text-amber-700/60 font-light mb-3 uppercase tracking-wider">
                        {product.category}
                      </span>
                    )}
                    
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-1">
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
                      <div className="flex items-center gap-1.5 mt-3 text-amber-700/0 group-hover:text-amber-700/70 transition-colors duration-300">
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
        )}

        {/* Products Count Footer */}
        {!isLoading && !hasError && filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-amber-700/60 font-light">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}