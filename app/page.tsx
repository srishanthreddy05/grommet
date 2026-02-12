'use client';

import HomeCategorySection from '@/src/components/HomeCategorySection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] overflow-x-hidden">
      
      {/* Premium Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">

        {/* Background Glow Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-5xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-amber-200/50 shadow-md">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm uppercase tracking-widest text-amber-800 font-semibold">
                Premium Automotive Collection
              </span>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8 tracking-tight">
              <span className="block bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent">
                Built for Car Enthusiasts.
              </span>
              <span className="block mt-2 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Crafted by Grommet.
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-amber-900/80 font-light leading-relaxed max-w-4xl mx-auto mb-10 px-6 py-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-amber-200/30 shadow-sm">
              At Grommet, we believe cars are more than machines — they're{' '}
              <span className="font-bold text-orange-700">passion</span>,{' '}
              <span className="font-bold text-orange-700">power</span>, and{' '}
              <span className="font-bold text-orange-700">personality</span>.
            </p>

            {/* Statements */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <div className="px-5 py-3 bg-white/50 rounded-full border border-amber-200/40 shadow-sm">
                <p className="text-sm sm:text-base text-amber-800 italic">
                  Speed excites us
                </p>
              </div>

              <div className="px-5 py-3 bg-white/50 rounded-full border border-amber-200/40 shadow-sm">
                <p className="text-sm sm:text-base text-amber-800 italic">
                  Design inspires us
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">

              {/* Explore Button */}
              <a
                href="#collections"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-sm sm:text-base font-semibold hover:from-amber-700 hover:to-orange-700 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Explore Collections
              </a>

              {/* Shop All Button */}
              <a
                href="/items"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 px-8 py-4 rounded-full text-sm sm:text-base font-semibold hover:from-amber-200 hover:to-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-300/50"
              >
                Shop All Products
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <div id="collections">
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
