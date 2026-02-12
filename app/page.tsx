'use client';

import HomeCategorySection from '@/src/components/HomeCategorySection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] overflow-x-hidden">

      {/* Premium Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">

        {/* Background Glow Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
           {/* Tagline */}
            <div className="max-w-4xl mb-16 px-8 py-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-amber-200/30 shadow-sm">
              <p className="text-lg sm:text-xl lg:text-2xl text-amber-900/80 font-light leading-relaxed">
                At Grommet, we believe cars are more than machines — they're{' '}
                <span className="font-bold text-orange-700">passion</span>,{' '}
                <span className="font-bold text-orange-700">power</span>, and{' '}
                <span className="font-bold text-orange-700">personality</span>.
              </p>
            </div>
           

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-10 tracking-tight px-4">
              <span className="block bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent mb-3">
                Built for Car Enthusiasts.
              </span>
              <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Crafted by Grommet.
              </span>
            </h1>

           

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <a
  href="#collections"
  className="inline-flex items-center justify-center 
  gap-2 bg-gradient-to-r from-amber-600 to-orange-600 
  text-white px-12 py-4 rounded-full 
  text-base sm:text-lg font-semibold 
  hover:from-amber-700 hover:to-orange-700 hover:shadow-2xl 
  transition-all duration-300 hover:scale-105 active:scale-95 
  min-w-[260px]"
>
  <span className="flex-1 text-center">
    Explore Collections
  </span>
  <svg
    className="w-6 h-4 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
</a>


<a
  href="/items"
  className="inline-flex items-center justify-center 
  gap-2 bg-gradient-to-r from-amber-100 to-orange-100 
  text-amber-900 px-12 py-4 rounded-full 
  text-base sm:text-lg font-semibold 
  hover:from-amber-200 hover:to-orange-200 hover:shadow-2xl 
  transition-all duration-300 hover:scale-105 active:scale-95 
  border border-amber-300/50 min-w-[260px]"
>
  <span className="flex-1 text-center">
    Shop All Products
  </span>
  <svg
    className="w-6 h-4 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
</a>

            </div>

          </div>
        </div>
      </section>

      {/* Collections */}
      <div id="collections" className="pt-8">
        <HomeCategorySection categorySlug="car-frames" categoryTitle="Car Frames" bgColor="#FFF9F0" />
        <HomeCategorySection categorySlug="car-poster-frames" categoryTitle="Car Poster Frames" bgColor="#FEF7EF" />
        <HomeCategorySection categorySlug="hotwheels" categoryTitle="Hotwheels" bgColor="#FFF9F0" />
        <HomeCategorySection categorySlug="hotwheel-bouquets" categoryTitle="Hotwheel Bouquets" bgColor="#FEF7EF" />
        <HomeCategorySection categorySlug="keychains" categoryTitle="Keychains" bgColor="#FFF9F0" />
        <HomeCategorySection categorySlug="phone-cases" categoryTitle="Phone Cases" bgColor="#FEF7EF" />
        <HomeCategorySection categorySlug="posters" categoryTitle="Posters" bgColor="#FFF9F0" />
        <HomeCategorySection categorySlug="t-shirts" categoryTitle="T-Shirts" bgColor="#FEF7EF" />
        <HomeCategorySection categorySlug="valentine-gifts" categoryTitle="Valentine Gifts" bgColor="#FFF9F0" />
      </div>

    </div>
  );
}