'use client';

import HomeCategorySection from '@/src/components/HomeCategorySection';

export default function HomePage() {
  return (
      <div className="min-h-screen bg-[#FEF7EF] overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
          
          <div className="mx-auto max-w-5xl">
            
            {/* Main Headline */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6 lg:mb-8"
              style={{ fontFamily: 'Playfair Display' }}
            >
              Built for Car Enthusiasts.
              <br className="hidden sm:block" />
              <span className="text-orange-500 block sm:inline">
                Crafted by Grommet.
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg lg:text-2xl text-slate-700 font-light leading-relaxed mb-6 lg:mb-8">
              At Grommet, we believe cars are more than machines — they’re{' '}
              <span className="font-semibold text-slate-900">passion</span>,{' '}
              <span className="font-semibold text-slate-900">power</span>, and{' '}
              <span className="font-semibold text-slate-900">personality</span>.
            </p>

            {/* Short statements */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base lg:text-lg text-slate-600 italic mb-6 lg:mb-8">
              <p>Speed excites us.</p>
              <span className="hidden sm:block text-slate-400">•</span>
              <p>Design inspires us.</p>
            </div>

            {/* Final message */}
            <p className="text-sm sm:text-base lg:text-xl text-slate-800 font-medium leading-relaxed max-w-3xl mx-auto">
              We bring automotive passion into your everyday life — through
              products made for true enthusiasts.
            </p>

          </div>
        </div>
      </section>

      <HomeCategorySection 
        categorySlug="car-frames" 
        categoryTitle="Car Frames"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="car-poster-frames" 
        categoryTitle="Car Poster Frames"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="hotwheels" 
        categoryTitle="Hotwheels"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="hotwheel-bouquets" 
        categoryTitle="Hotwheel Bouquets"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="keychains" 
        categoryTitle="Keychains"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="phone-cases" 
        categoryTitle="Phone Cases"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="posters" 
        categoryTitle="Posters"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="t-shirts" 
        categoryTitle="T-Shirts"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="valentine-gifts" 
        categoryTitle="Valentine Gifts"
        bgColor="#FEF7EF"
      />
    </div>
  );
}
