'use client';

export default function HeroStats() {
  return (
    <section className="relative bg-grommetBg">
      {/* Wave SVG at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-8 sm:h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
          10,000+
        </h2>
        <p className="text-lg sm:text-xl text-slate-800 font-medium">
          Happy customers across India
        </p>
        <p className="text-sm sm:text-base text-slate-700 mt-2">
          Trusted for quality car frames and collectibles
        </p>
      </div>

    </section>
  );
}
