'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of hero image URLs from public/images
  const heroImages = [
    '/images/hero1.jpg',
    '/images/hero2.jpg',
    '/images/hero3.jpg',
  ];

  useEffect(() => {
    // Set up auto-rotation every 2 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-xl text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Order Car Frames Easily
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            Browse our premium collection of car frames and place your order in just a few taps. Fast, reliable, and secure.
          </p>
        </div>

        {/* Auto-Rotating Hero Images */}
        <div className="flex justify-center">
          <div className="relative bg-white rounded-2xl aspect-square overflow-hidden shadow-lg w-full max-w-xs flex items-center justify-center">
            {heroImages.map((imageUrl, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`Hero image ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/items"
          className="inline-block w-full max-w-xs px-8 py-4 sm:py-5 bg-slate-900 hover:bg-slate-800 text-white text-lg sm:text-xl font-bold rounded-xl transition duration-200 shadow-lg hover:shadow-xl active:scale-95"
        >
          Shop Now
        </Link>

        {/* Trust Badges */}
        <div className="pt-4 space-y-3 text-sm text-slate-600">
          <p>✓ Premium Quality | ✓ Fast Delivery | ✓ Secure Checkout</p>
        </div>
      </div>
    </main>
  );
}
