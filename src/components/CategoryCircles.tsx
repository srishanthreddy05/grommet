'use client';

import Link from 'next/link';

interface Category {
  label: string;
  href: string;
  image: string;
}

export default function CategoryCircles() {
  const categories: Category[] = [
    {
      label: 'Car Frames',
      href: '/items?category=car-frames',
      image: '/images/categories/car-frames.jpg',
    },
    {
      label: 'Hotwheels',
      href: '/items?category=hotwheels',
      image: '/images/categories/hotwheels.jpg',
    },
    {
      label: 'Bouquets',
      href: '/items?category=hotwheel-bouquets',
      image: '/images/categories/bouquets.jpg',
    },
    {
      label: 'Keychains',
      href: '/items?category=keychains',
      image: '/images/categories/keychains.jpg',
    },
    {
      label: 'Phone Cases',
      href: '/items?category=phone-cases',
      image: '/images/categories/phone-cases.jpg',
    },
    {
      label: 'Posters',
      href: '/items?category=posters',
      image: '/images/categories/posters.jpg',
    },
    {
      label: 'T-Shirts',
      href: '/items?category=t-shirts',
      image: '/images/categories/tshirts.jpg',
    },
    {
      label: 'Valentine Gifts',
      href: '/items?category=valentine-gifts',
      image: '/images/categories/valentine.jpg',
    },
  ];

  return (
    <section className="bg-grommetBg py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Shop by Category
        </h2>
        
        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 overflow-hidden mb-3 group-hover:border-orange-500 transition-all duration-300 group-hover:shadow-lg">
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <span className="text-2xl">🏎️</span>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-700 text-center group-hover:text-orange-500 transition-colors">
                {category.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-6 pb-2 min-w-max">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="flex flex-col items-center group flex-shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-200 overflow-hidden mb-2 group-active:border-orange-500 transition-all duration-300">
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xl">🏎️</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-700 text-center max-w-[80px]">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
