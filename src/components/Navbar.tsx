'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/src/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Name */}
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-bold text-white hover:text-slate-100 transition duration-200"
          >
            Grommet
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <Link
              href="/"
              className="text-slate-100 hover:text-white transition duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/items"
              className="text-slate-100 hover:text-white transition duration-200 font-medium"
            >
              Items
            </Link>
            <Link
              href="/cart"
              className="relative text-slate-100 hover:text-white transition duration-200 font-medium"
              aria-label="Cart"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition duration-200"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden pb-4 space-y-2 border-t border-slate-700 pt-4 animate-in fade-in duration-200"
          >
            <Link
              href="/"
              className="block px-4 py-3 rounded-lg text-slate-100 hover:bg-slate-800 hover:text-white transition duration-200 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/items"
              className="block px-4 py-3 rounded-lg text-slate-100 hover:bg-slate-800 hover:text-white transition duration-200 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Items
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-100 hover:bg-slate-800 hover:text-white transition duration-200 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Cart
              {cartCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
