'use client';

import HomeCategorySection from '@/src/components/HomeCategorySection';

export default function HomePage() {
  return (
    <>
      <HomeCategorySection 
        categorySlug="car-frames" 
        categoryTitle="Car Frames" 
      />
      
      <div className="bg-slate-50">
        <HomeCategorySection 
          categorySlug="car-poster-frames" 
          categoryTitle="Car Poster Frames" 
        />
      </div>
      
      <HomeCategorySection 
        categorySlug="hotwheels" 
        categoryTitle="Hotwheels" 
      />
      
      <div className="bg-slate-50">
        <HomeCategorySection 
          categorySlug="hotwheel-bouquets" 
          categoryTitle="Hotwheel Bouquets" 
        />
      </div>
      
      <HomeCategorySection 
        categorySlug="keychains" 
        categoryTitle="Keychains" 
      />
      
      <div className="bg-slate-50">
        <HomeCategorySection 
          categorySlug="phone-cases" 
          categoryTitle="Phone Cases" 
        />
      </div>
      
      <HomeCategorySection 
        categorySlug="posters" 
        categoryTitle="Posters" 
      />
      
      <div className="bg-slate-50">
        <HomeCategorySection 
          categorySlug="t-shirts" 
          categoryTitle="T-Shirts" 
        />
      </div>
      
      <HomeCategorySection 
        categorySlug="valentine-gifts" 
        categoryTitle="Valentine Gifts" 
      />
    </>
  );
}
