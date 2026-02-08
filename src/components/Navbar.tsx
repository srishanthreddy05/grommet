'use client';

import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-bold hover:text-slate-200 transition duration-200 flex-shrink-0"
          >
            Grommet
          </Link>

          {/* Nav items */}
          <div className="flex gap-4 sm:gap-6 items-center">
            <Link
              href="/items"
              className="text-slate-100 hover:text-white transition duration-200 font-medium text-sm sm:text-base"
            >
              Collections
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-slate-100 hover:text-white transition duration-200 flex-shrink-0"
              aria-label="Cart"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="text-slate-100 hover:text-white transition duration-200 flex-shrink-0"
                aria-label="Profile Menu"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-lg shadow-xl py-2 z-50 border border-slate-200">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-100 hover:text-slate-900 transition duration-200 font-medium text-sm"
                  >
                    Profile
                  </Link>

                  <div className="h-px bg-slate-200 my-1" />

                  <Link
                    href="/my-orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-100 hover:text-slate-900 transition duration-200 font-medium text-sm"
                  >
                    My Orders
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
