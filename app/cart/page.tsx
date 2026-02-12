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

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Premium Page Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300"></div>
              <span className="text-xs uppercase tracking-widest text-amber-700/60 font-semibold">Your Cart</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>

          {/* Empty Cart Message */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-amber-200/50 shadow-2xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 opacity-50"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Animated Icon */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-amber-200/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative text-7xl sm:text-8xl animate-bounce">🛒</div>
              </div>
              
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
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 text-base sm:text-lg">Start Shopping</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Premium Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300"></div>
            <span className="text-xs uppercase tracking-widest text-amber-700/60 font-semibold">Your Cart</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300"></div>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <div className="px-4 py-2 bg-amber-100/60 backdrop-blur-sm rounded-full border border-amber-200/50">
              <span className="text-amber-800 font-semibold text-sm">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-5 mb-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/40 shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 group hover:scale-[1.01]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4 sm:gap-6">
                {/* Item Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex-shrink-0 overflow-hidden border border-amber-200/30 group-hover:border-amber-300/60 transition-colors">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-amber-950 mb-2 line-clamp-2 group-hover:text-amber-800 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-amber-700/70 text-sm mb-4 font-light">
                    ₹{item.price.toLocaleString('en-IN')} per item
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-1.5 w-fit mt-auto border border-amber-200/40">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-amber-900 hover:bg-amber-100 transition-all duration-200 active:scale-90"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-10 text-center font-bold text-amber-900 text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-amber-900 hover:bg-amber-100 transition-all duration-200 active:scale-90"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Item Total & Remove */}
                <div className="text-right flex flex-col justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs sm:text-sm text-amber-700/60 font-light">
                      {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => updateQuantity(item.id, 0)}
                    className="mt-4 px-3 py-1.5 text-xs text-red-700 hover:text-red-800 hover:bg-red-100/80 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-amber-200/50 shadow-2xl p-6 sm:p-8 space-y-6 sticky bottom-4">
         

          <div className="space-y-4 pt-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center py-3 border-b border-amber-200/30">
              <span className="text-amber-800 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-amber-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Shipping */}
            <div className="flex justify-between items-center py-3 border-b border-amber-200/30">
              <span className="text-amber-800 font-medium">Shipping</span>
              <span className="text-emerald-700 font-semibold">FREE</span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-bold text-amber-900">Total</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 border-t border-amber-200/50 pt-6">
            <button
              onClick={() => router.push('/checkout')}
              className="group w-full px-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg font-semibold rounded-2xl transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="relative z-10">Secure Checkout</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/items"
                className="text-center px-4 py-4 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 border border-amber-300/50 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm sm:text-base">Continue</span>
              </Link>
              <button
                onClick={clearCart}
                className="px-4 py-4 bg-red-100/80 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 border border-red-300/50 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm sm:text-base">Clear</span>
              </button>
            </div>
          </div>

         
        </div>
      </div>
    </main>
  );
}