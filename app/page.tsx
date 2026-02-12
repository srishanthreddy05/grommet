'use client';

import HomeCategorySection from '@/src/components/HomeCategorySection';

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto rounded-2xl shadow-lg overflow-hidden min-h-screen bg-[#FFF7EF]">
      <HomeCategorySection 
        categorySlug="car-frames" 
        categoryTitle="Car Frames"
        bgColor="white"
      />
      
      <HomeCategorySection 
        categorySlug="car-poster-frames" 
        categoryTitle="Car Poster Frames"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="hotwheels" 
        categoryTitle="Hotwheels"
        bgColor="white"
      />
      
      <HomeCategorySection 
        categorySlug="hotwheel-bouquets" 
        categoryTitle="Hotwheel Bouquets"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="keychains" 
        categoryTitle="Keychains"
        bgColor="white"
      />
      
      <HomeCategorySection 
        categorySlug="phone-cases" 
        categoryTitle="Phone Cases"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="posters" 
        categoryTitle="Posters"
        bgColor="white"
      />
      
      <HomeCategorySection 
        categorySlug="t-shirts" 
        categoryTitle="T-Shirts"
        bgColor="#FEF7EF"
      />
      
      <HomeCategorySection 
        categorySlug="valentine-gifts" 
        categoryTitle="Valentine Gifts"
        bgColor="white"
      />
    </div>
  );
}
