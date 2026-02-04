'use client';

import { useCart } from '@/src/context/CartContext';
import { useState } from 'react';

const PRODUCTS = [
  {
    id: 1,
    name: 'Car Frame Model A',
    price: 999,
  },
  {
    id: 2,
    name: 'Car Frame Model B',
    price: 999,
  },
];

export default function ItemsPage() {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    
    // Show feedback
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 1500);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
            Our Car Frames
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Premium quality car frames for your needs
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-full"
            >
              {/* Product Image Placeholder */}
              <div className="w-full aspect-square bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-6xl sm:text-7xl">
                🚗
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mb-5 sm:mb-6 flex-1 leading-relaxed">
                  High-quality car frame built for durability and style.
                </p>

                {/* Price */}
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5 sm:mb-6">
                  ₹{product.price}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-4 sm:py-5 px-4 rounded-xl font-bold text-white transition duration-200 active:scale-95 shadow-md hover:shadow-lg ${
                    addedIds.has(product.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {addedIds.has(product.id) ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
