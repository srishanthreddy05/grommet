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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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
      <main className="min-h-screen bg-[#FEF7EF] px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center bg-[#FEF7EF] rounded-2xl shadow-lg p-12 border border-slate-200">
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
      <main className="min-h-screen bg-[#FEF7EF] px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center bg-[#FEF7EF] rounded-2xl shadow-lg p-12 border border-slate-200">
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
      <main className="min-h-screen bg-[#FEF7EF] px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="rounded-2xl bg-[#FEF7EF] p-12 text-slate-700 shadow-lg text-center border border-slate-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-900 mb-4"></div>
          <p>Loading product...</p>
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

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <main className="min-h-screen bg-[#FEF7EF] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/items"
          className="inline-flex items-center text-slate-700 hover:text-slate-900 mb-6 transition font-medium"
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

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div>
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-[#FEF7EF] rounded-2xl overflow-hidden shadow-lg mb-4 border border-slate-200">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imageList.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square w-20 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg transition ${
                      index === currentImageIndex
                        ? 'ring-2 ring-slate-900 ring-offset-2'
                        : 'ring-1 ring-slate-200 hover:ring-slate-400'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover bg-[#FEF7EF]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-3">
                {product.brand}
              </p>
            )}

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                  ₹{product.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-slate-400 line-through">
                      ₹{product.mrp}
                    </span>
                    <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-emerald-600 font-medium">
                  Save {discountPercent}% on this item
                </p>
              )}
            </div>

            {/* Stock Status */}
            {!isOutOfStock && (
              <p className="text-sm text-slate-600 mb-6">
                In Stock • {product.stock} available
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-slate-700 mb-8 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition duration-200 ${
                  isOutOfStock
                    ? 'border-2 border-slate-300 text-slate-400 cursor-not-allowed'
                    : added
                      ? 'border-2 border-green-600 text-green-600 bg-green-50'
                      : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : added
                    ? '✓ Added to Cart'
                    : 'Add to Cart'}
              </button>

              <Link
                href="/cart"
                className={`block w-full py-4 px-6 rounded-lg font-semibold transition duration-200 text-center ${
                  isOutOfStock
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-900 text-white hover:bg-amber-950 shadow-md'
                }`}
                aria-disabled={isOutOfStock}
              >
                View Cart
              </Link>
            </div>

            {/* Accordion Section */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              {/* Product Details Accordion */}
              <div className="border-b border-slate-200">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-semibold text-slate-900">Product Details</span>
                  <svg
                    className={`w-5 h-5 text-slate-600 transition-transform ${
                      openAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openAccordion === 'details' ? 'max-h-96 pb-4' : 'max-h-0'
                  }`}
                >
                  <div className="text-slate-600 space-y-2">
                    <p><strong>Product ID:</strong> {product.id}</p>
                    {product.category && <p><strong>Category:</strong> {product.category}</p>}
                    <p><strong>Availability:</strong> {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Accordion */}
              <div className="border-b border-slate-200">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-semibold text-slate-900">Shipping & Returns</span>
                  <svg
                    className={`w-5 h-5 text-slate-600 transition-transform ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openAccordion === 'shipping' ? 'max-h-96 pb-4' : 'max-h-0'
                  }`}
                >
                  <div className="text-slate-600 space-y-2">
                    <p>• Free shipping on orders over ₹999</p>
                    <p>• Estimated delivery: 3-5 business days</p>
                    <p>• 30-day return policy</p>
                    <p>• Free returns on all orders</p>
                  </div>
                </div>
              </div>

              {/* Care Instructions Accordion */}
              <div className="border-b border-slate-200">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-semibold text-slate-900">Care Instructions</span>
                  <svg
                    className={`w-5 h-5 text-slate-600 transition-transform ${
                      openAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openAccordion === 'care' ? 'max-h-96 pb-4' : 'max-h-0'
                  }`}
                >
                  <div className="text-slate-600 space-y-2">
                    <p>• Handle with care to avoid damage</p>
                    <p>• Clean with a soft, dry cloth</p>
                    <p>• Store in a cool, dry place</p>
                    <p>• Avoid exposure to direct sunlight</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
