'use client';

import { useCart } from '@/src/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const PRODUCTS = [
  {
    id: 1,
    name: 'Car Frame Model A',
    price: 999,
    description: 'Premium quality car frame built for durability and style. Features high-grade materials and precision engineering.',
    features: [
      'High-strength steel construction',
      'Corrosion-resistant coating',
      'Easy installation',
      'Lifetime warranty',
    ],
  },
  {
    id: 2,
    name: 'Car Frame Model B',
    price: 999,
    description: 'Advanced car frame designed for performance and reliability. Perfect for all weather conditions.',
    features: [
      'Lightweight aluminum alloy',
      'Weather-resistant finish',
      'Professional-grade quality',
      '2-year warranty',
    ],
  },
  {
    id: 3,
    name: 'Car Frame Model C',
    price: 1299,
    description: 'Luxury car frame with premium features and exceptional build quality.',
    features: [
      'Carbon fiber reinforced',
      'Ultra-light design',
      'Custom color options',
      '3-year warranty',
    ],
  },
  {
    id: 4,
    name: 'Car Frame Model D',
    price: 1499,
    description: 'Top-of-the-line car frame with cutting-edge technology and superior performance.',
    features: [
      'Aerospace-grade materials',
      'Advanced shock absorption',
      'Smart sensor integration',
      '5-year warranty',
    ],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const productId = parseInt(params.id as string);
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <Link href="/items" className="text-slate-600 hover:text-slate-900 underline">
            ← Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/items"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition"
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-slate-200 to-slate-100 aspect-square flex items-center justify-center text-9xl">
              🚗
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                {product.name}
              </h1>

              <div className="text-4xl font-bold text-slate-900 mb-6">
                ₹{product.price}
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition duration-200 active:scale-95 shadow-md hover:shadow-lg ${
                    added
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
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
