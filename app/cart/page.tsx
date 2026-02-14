'use client';

import { useCart } from '@/src/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, totalAmount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  /* ================= EMPTY CART ================= */

  if (items.length === 0) {
    return (
      <main className="bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] flex flex-col items-center px-4 sm:px-6 pt-12 pb-12">
        <div className="w-full max-w-3xl">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300"></div>
              <span className="text-xs uppercase tracking-widest text-amber-700/60 font-semibold">
                Your Cart
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>

          {/* Empty Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-amber-200/50 shadow-2xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden">
            
            <div className="relative z-10 space-y-8">

              <div className="text-7xl sm:text-8xl animate-bounce">🛒</div>

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
                  Your cart is empty
                </h2>
                <p className="text-amber-800/70 text-base sm:text-lg font-light max-w-md mx-auto">
                  Discover our premium collection and add items to your cart.
                </p>
              </div>

              <Link
                href="/items"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                Start Shopping →
              </Link>

            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ================= CART WITH ITEMS ================= */

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300"></div>
            <span className="text-xs uppercase tracking-widest text-amber-700/60 font-semibold">
              Your Cart
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300"></div>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent">
              Shopping Cart
            </h1>

            <div className="px-4 py-2 bg-amber-100/60 rounded-full border border-amber-200/50">
              <span className="text-amber-800 font-semibold text-sm">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/40 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex gap-6"
              >
                {/* Image */}
                <div className="relative w-28 h-28 bg-amber-50 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-amber-950 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-amber-700/70 text-sm mb-4">
                    ₹{item.price.toLocaleString('en-IN')} per item
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-2 w-fit mt-auto">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-amber-900 hover:bg-amber-200"
                    >
                      -
                    </button>

                    <span className="w-10 text-center font-bold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-amber-900 hover:bg-amber-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="text-right flex flex-col justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <p className="text-sm text-amber-700/60">
                      {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => updateQuantity(item.id, 0)}
                    className="text-sm text-red-600 hover:text-red-800 mt-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-amber-200/50 shadow-2xl p-8 space-y-6 lg:sticky lg:top-24">
              
              {/* Subtotal */}
              <div className="flex justify-between border-b pb-4">
                <span className="text-amber-800 font-medium">
                  Subtotal
                </span>
                <span className="font-bold text-amber-900">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between border-b pb-4">
                <span className="text-amber-800 font-medium">
                  Shipping
                </span>
                <span className="text-emerald-700 font-semibold">
                  FREE
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between pt-4">
                <span className="text-lg font-bold text-amber-900">
                  Total
                </span>
                <span className="text-3xl font-bold text-amber-900">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-6 border-t">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-2xl transition-all duration-300"
                >
                  Secure Checkout
                </button>

                <Link
                  href="/items"
                  className="block text-center px-4 py-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-xl transition-all duration-300"
                >
                  Continue Shopping
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full px-4 py-4 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Clear Cart
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
