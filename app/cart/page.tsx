'use client';

import { useCart } from '@/src/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
  const { items, updateQuantity, totalAmount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formError, setFormError] = useState('');

  const handleCheckout = () => {
    if (items.length === 0) return;

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const phoneIsValid = /^[0-9]{10}$/.test(trimmedPhone);

    if (!trimmedName || !trimmedPhone) {
      setFormError('Please enter your name and 10-digit phone number.');
      return;
    }

    if (!phoneIsValid) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }

    setFormError('');

    setIsCheckingOut(true);

    // Generate Order ID
    const orderId = `GRM-${Date.now()}`;

    // Create WhatsApp message
    const message = `Hello! I'm ${trimmedName} I would like to place an order.\n\nOrder ID: ${orderId}\n\nItems:\n${items
      .map(
        (item) =>
          `* ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
      )
      .join('\n')}\n\nTotal Amount: ₹${totalAmount}\n\nPlease confirm my order. Thank you!`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number with country code (India)
    const whatsappNumber = '918125902062';

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    const popup = window.open(whatsappUrl, '_blank');

    const finishCheckout = () => {
      clearCart();
      setIsCheckingOut(false);
    };

    if (popup) {
      let isSameOrigin = false;

      try {
        isSameOrigin = popup.location.origin === window.location.origin;
      } catch (error) {
        isSameOrigin = false;
      }

      if (isSameOrigin) {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            finishCheckout();
          }
        }, 500);
        return;
      }
    }

    // Fallback when popup is blocked or cross-origin.
    setTimeout(() => {
      finishCheckout();
    }, 3000);
  };

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

          {/* Customer Details */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#FEF7EF] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#FEF7EF] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>
            {formError && (
              <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">{formError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full px-8 py-4 sm:py-5 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white text-lg font-bold rounded-xl transition duration-200 active:scale-95 shadow-lg hover:shadow-xl disabled:shadow-md"
            >
              {isCheckingOut ? 'Opening WhatsApp...' : 'Proceed to WhatsApp'}
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

