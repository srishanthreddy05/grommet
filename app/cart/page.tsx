'use client';

import { useCart } from '@/src/context/CartContext';
import Link from 'next/link';
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
    window.open(whatsappUrl, '_blank');

      // Clear cart after 3 seconds
      setTimeout(() => {
        clearCart();
        setIsCheckingOut(false);
      }, 3000);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Your Cart</h1>

          {/* Empty Cart Message */}
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center space-y-6">
            <div className="text-7xl sm:text-8xl">🛒</div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
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
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:py-12 pb-32 sm:pb-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Your Cart</h1>

        {/* Cart Items */}
        <div className="space-y-4 sm:space-y-5 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    ₹{item.price} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
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
              
              {/* Item Total on same line */}
              <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-sm text-slate-600">Item Total ({item.quantity} × ₹{item.price})</span>
                <span className="text-xl font-bold text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary - Sticky on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 sm:relative bg-white shadow-xl sm:shadow-md border-t border-slate-200 sm:border-t-0 p-4 sm:p-6 rounded-t-xl sm:rounded-2xl space-y-4 sm:space-y-5">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center text-base sm:text-lg mb-3 sm:mb-4">
              <span className="text-slate-700 font-medium">Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{totalAmount}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 sm:pt-4 flex justify-between items-center text-xl sm:text-2xl mb-4 sm:mb-6">
              <span className="font-bold text-slate-900">Total:</span>
              <span className="font-bold text-slate-900">₹{totalAmount}</span>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              {formError && (
                <p className="text-sm text-red-600 font-medium">{formError}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3 mt-4">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white text-base sm:text-lg font-bold rounded-xl transition duration-200 active:scale-95 shadow-lg hover:shadow-xl disabled:shadow-md"
              >
                {isCheckingOut ? 'Opening WhatsApp...' : 'Proceed to WhatsApp'}
              </button>
              <div className="grid grid-cols-2 gap-2">
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
      </div>
    </main>
  );
}

