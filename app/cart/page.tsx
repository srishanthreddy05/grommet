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
      <main className="min-h-[calc(100vh-64px)] bg-[#FEF7EF] px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Your Cart</h1>

          {/* Empty Cart Message */}
          <div className="bg-[#FEF7EF] rounded-2xl border border-slate-200 shadow-lg p-8 sm:p-12 text-center space-y-6">
            <div className="text-7xl sm:text-8xl">🛒</div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Start shopping to add items to your cart.
              </p>
            </div>
            <Link
              href="/items"
              className="inline-block px-8 py-4 sm:py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FEF7EF] px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Your Cart</h1>

        {/* Cart Items */}
        <div className="space-y-4 sm:space-y-5 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#FEF7EF] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 p-5 sm:p-6"
            >
              <div className="flex gap-4 sm:gap-6">
                {/* Item Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    ₹{item.price} each
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 w-fit mt-auto">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded font-bold text-slate-900 hover:bg-slate-200 transition duration-200 active:bg-slate-300"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded font-bold text-slate-900 hover:bg-slate-200 transition duration-200 active:bg-slate-300"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right flex flex-col justify-between">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-[#FEF7EF] rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6 sticky bottom-0">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Subtotal:</span>
              <span className="text-xl font-bold text-slate-900">₹{totalAmount}</span>
            </div>
            <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total:</span>
              <span className="text-2xl font-bold text-slate-900">₹{totalAmount}</span>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full px-8 py-4 sm:py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-bold rounded-xl transition duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>💬</span>
              Secure Checkout
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/items"
                className="text-center px-4 py-3 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition duration-200 text-sm sm:text-base"
              >
                Continue
              </Link>
              <button
                onClick={clearCart}
                className="px-4 py-3 sm:py-4 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg transition duration-200 text-sm sm:text-base"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

