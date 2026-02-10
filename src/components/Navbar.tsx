'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Menu items in the exact order specified
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Car Frames', href: '/items?category=car-frames' },
    { label: 'Car Poster Frames', href: '/items?category=car-poster-frames' },
    { label: 'Hotwheels', href: '/items?category=hotwheels' },
    { label: 'Hotwheel Bouquets', href: '/items?category=hotwheel-bouquets' },
    { label: 'Keychains', href: '/items?category=keychains' },
    { label: 'Phone Cases', href: '/items?category=phone-cases' },
    { label: 'Posters', href: '/items?category=posters' },
    { label: 'T-Shirts', href: '/items?category=t-shirts' },
    { label: 'Valentine Gifts', href: '/items?category=valentine-gifts' },
  ];

  // Check if a route is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href.split('?')[0]);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Main Header - Sticky */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger (mobile) + Search */}
            <div className="flex items-center gap-2 flex-1">
              {/* Hamburger Menu - Mobile Only */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Search Button/Input */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition md:hidden"
                  aria-label="Search"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Desktop Search */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-4 py-2 w-64">
                  <svg
                    className="w-5 h-5 text-slate-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent outline-none text-slate-700 text-sm placeholder-slate-500 w-full"
                    aria-label="Search products"
                  />
                </div>
              </div>
            </div>

            {/* Center: Logo */}
            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl font-bold text-slate-900 hover:text-slate-700 transition duration-200"
            >
              Grommet
            </Link>

            {/* Right: Profile + Cart */}
            <div className="flex items-center gap-2 justify-end flex-1">
              {/* Profile Icon */}
              <Link
                href="/profile"
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                aria-label="Profile"
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
              </Link>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                aria-label={`Cart with ${cartCount} items`}
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
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <div className="hidden md:block border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-8 py-3">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-all duration-200 relative pb-1 ${
                      active
                        ? 'text-orange-500'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>
                    )}
                    {!active && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Search Bar (when opened) */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-slate-200">
              <svg
                className="w-5 h-5 text-slate-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-slate-700 text-sm placeholder-slate-500 w-full"
                aria-label="Search products"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu - Full Screen */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 w-screen h-screen bg-white z-50 md:hidden overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button - Top Right */}
        <div className="flex justify-end items-center p-4 border-b border-slate-200 bg-white">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-2 bg-white">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-6 py-4 text-lg font-semibold transition-colors duration-200 ${
                  active
                    ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                    : 'text-slate-900 hover:bg-slate-50 hover:text-orange-500'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-50 p-4 space-y-3">
          <Link
            href="/my-orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full px-4 py-3 text-base font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition text-center"
          >
            My Orders
          </Link>
          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full px-4 py-3 text-base font-semibold !text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition text-center"
          >
            My Profile
          </Link>
        </div>
      </div>
    </>
  );
}
