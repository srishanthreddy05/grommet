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
  stock: number;
  description?: string;
  displayImage: string;
  album?: string[];
  enabled: boolean;
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
      <main className="min-h-[calc(100vh-64px)] bg-white px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <Link href="/items" className="text-slate-600 hover:text-slate-900 underline font-medium">
            ← Back to Collections
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
      <main className="min-h-[calc(100vh-64px)] bg-white px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Unable to Load Product</h1>
          <p className="text-slate-600 mb-6">Please try again in a moment.</p>
          <Link href="/items" className="text-slate-600 hover:text-slate-900 underline font-medium">
            ← Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading || !product) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-white px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-900 mb-4"></div>
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0 || product.enabled === false;
  const currentImage = imageList[currentImageIndex];
  const hasMultipleImages = imageList.length > 1;

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/items"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
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

        {/* Product Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-6 sm:p-8 lg:p-10">
            {/* Image Section with Slider */}
            <div>
              <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden group">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300"
                  priority
                />

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {imageList.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 rounded-full p-2 transition duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-6 h-6"
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
                    </button>

                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 rounded-full p-2 transition duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Image Thumbnails */}
              {hasMultipleImages && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {imageList.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-${index}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        index === currentImageIndex
                          ? 'border-slate-900'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>

              <div className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                ₹{product.price}
              </div>

              {/* Stock Status */}
              {isOutOfStock ? (
                <div className="mb-6 inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 w-fit">
                  Out of Stock
                </div>
              ) : (
                <div className="mb-6 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 w-fit">
                  In Stock ({product.stock} available)
                </div>
              )}

              {/* Description */}
              <p className="text-slate-600 mb-8 leading-relaxed text-base sm:text-lg">
                {product.description || 'No description available for this product.'}
              </p>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition duration-200 shadow-md ${
                    isOutOfStock
                      ? 'bg-slate-300 cursor-not-allowed'
                      : added
                        ? 'bg-green-600 hover:bg-green-700 active:scale-95'
                        : 'bg-slate-900 hover:bg-slate-800 active:scale-95'
                  }`}
                >
                  {isOutOfStock
                    ? 'Out of Stock'
                    : added
                      ? '✓ Added to Cart!'
                      : 'Add to Cart'}
                </button>

                <Link
                  href="/cart"
                  className="block w-full py-4 px-6 rounded-xl font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition duration-200 text-center"
                >
                  Go to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
