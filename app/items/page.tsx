'use client';

import Link from 'next/link';

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
  {
    id: 3,
    name: 'Car Frame Model C',
    price: 1299,
  },
  {
    id: 4,
    name: 'Car Frame Model D',
    price: 1499,
  },
];

export default function ItemsPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Our Collections
          </h1>
          <p className="text-base text-slate-600">
            Premium quality car frames
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/items/${product.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-105 transition duration-300">
                🚗
              </div>
              
              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-slate-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-base font-bold text-slate-900">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
