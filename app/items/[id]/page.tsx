'use client';

import { useCart } from '@/src/context/CartContext';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
  brand?: string;
  category?: string;
};

type Product = ProductRecord & { id: string };

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productId = useMemo(() => {
    const idParam = params.id;
    if (Array.isArray(idParam)) {
      return idParam[0] ?? '';
    }
    return idParam ?? '';
  }, [params.id]);

  // Build image array combining displayImage and album
  const imageList = useMemo(() => {
    if (!product) return [];
    const images = [product.displayImage];
    if (Array.isArray(product.album) && product.album.length > 0) {
      images.push(...product.album);
    }
    return images;
  }, [product]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % imageList.length
    );
  };

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      try {
        const snapshot = await get(ref(database, `stock/${productId}`));
        if (!isMounted) {
          return;
        }

        if (!snapshot.exists()) {
          setProduct(null);
          setHasError(false);
          return;
        }

        const data = snapshot.val() as ProductRecord;
        const nextProduct = { id: productId, ...data };
        setProduct(nextProduct);
        setCurrentImageIndex(0);
        setHasError(false);
      } catch (error) {
        console.error('Failed to load product:', error);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (!isLoading && !product && !hasError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border border-amber-200/50 max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Product Not Found</h1>
          <p className="text-amber-700/70 mb-8">This item may have been removed or doesn't exist</p>
          <Link 
            href="/items" 
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 font-medium transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      displayImage: product.displayImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (hasError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border border-red-200/50 max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-900 mb-4">Unable to Load Product</h1>
          <p className="text-red-700/70 mb-8">Please try again in a moment</p>
          <Link 
            href="/items" 
            className="inline-flex items-center gap-2 text-red-800 hover:text-red-900 font-medium transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading || !product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-16 shadow-2xl text-center border border-amber-200/50">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mb-6"></div>
          <p className="text-amber-800 font-light text-lg">Loading your selection...</p>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0 || product.enabled === false;
  const currentImage = imageList[currentImageIndex];
  const hasMultipleImages = imageList.length > 1;
  
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Back Button */}
        <Link
          href="/items"
          className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-8 transition-all duration-300 font-medium group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Collections
        </Link>

        {/* Premium Product Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery Section */}
          <div className="space-y-5">
            {/* Main Image with Navigation */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl overflow-hidden shadow-2xl border border-amber-200/40 group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Image Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-amber-200/50 shadow-lg flex items-center justify-center text-amber-900 hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-amber-200/50 shadow-lg flex items-center justify-center text-amber-900 hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 right-4 bg-amber-900/80 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
                  {currentImageIndex + 1} / {imageList.length}
                </div>
              )}
            </div>

            {/* Enhanced Thumbnail Images */}
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imageList.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square w-20 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'ring-3 ring-amber-600 ring-offset-2 ring-offset-[#FEF7EF] scale-105 shadow-lg'
                        : 'ring-1 ring-amber-200/60 hover:ring-amber-400/80 hover:scale-105 shadow-md'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover bg-gradient-to-br from-amber-50 to-orange-50"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Premium Product Details Section */}
          <div className="flex flex-col space-y-6">
            {/* Brand & Category Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              {product.brand && (
                <span className="inline-block px-4 py-1.5 bg-amber-100/60 backdrop-blur-sm text-amber-800 text-xs uppercase tracking-widest font-semibold rounded-full border border-amber-200/50">
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span className="inline-block px-4 py-1.5 bg-orange-100/60 backdrop-blur-sm text-orange-800 text-xs uppercase tracking-widest font-medium rounded-full border border-orange-200/50">
                  {product.category}
                </span>
              )}
            </div>

            {/* Product Title with Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Premium Price Section */}
            <div className="py-6 px-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-amber-200/40 shadow-md">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-2xl text-amber-600/50 line-through font-light">
                      ₹{product.mrp!.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You save ₹{(product.mrp! - product.price).toLocaleString('en-IN')}
                </p>
              )}
            </div>

           

            {/* Description with Premium Styling */}
            {product.description && (
              <div className="py-6 px-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-amber-200/30">
                <p className="text-amber-900/80 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>
            )}

            {/* Premium Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-5 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                  isOutOfStock
                    ? 'bg-amber-200/40 text-amber-600/50 cursor-not-allowed border border-amber-300/50'
                    : added
                      ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-2 border-emerald-400 scale-95'
                      : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 hover:from-amber-200 hover:to-orange-200 hover:shadow-xl hover:scale-105 active:scale-95 border border-amber-300/50'
                }`}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : added
                    ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Added to Cart
                      </span>
                    )
                    : 'Add to Cart'}
              </button>

              <Link
                href="/cart"
                className={`block w-full py-5 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 text-center shadow-lg ${
                  isOutOfStock
                    ? 'bg-amber-300/30 text-amber-700/50 cursor-not-allowed border border-amber-300/50'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
                aria-disabled={isOutOfStock}
              >
                View Cart
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200/50">
              <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs text-amber-800 font-medium">Quality Assured</p>
              </div>
              <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="text-xs text-amber-800 font-medium">Secure Payment</p>
              </div>
              <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl">
                <div className="w-10 h-10 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-xs text-amber-800 font-medium">Fast Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}