'use client';

import { useState, useEffect } from 'react';

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = [
    "We are Live Now!",
    "Sign in to get exclusive updates & offers",
    "Premium collectibles delivered nationwide",
    "New arrivals added weekly"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
  <div className="sticky top-0 z-50 bg-black border-b border-white/20 text-white py-2.5 text-center text-sm overflow-hidden shadow-md">
    <div className="relative h-5">
      {announcements.map((message, index) => (
        <p
          key={index}
          className={`absolute inset-0 flex items-center justify-center font-medium tracking-wide transition-all duration-700 ${
            index === currentIndex
              ? 'opacity-100 translate-y-0'
              : index < currentIndex
              ? 'opacity-0 -translate-y-5'
              : 'opacity-0 translate-y-5'
          }`}
        >
          {message}
        </p>
      ))}
    </div>
  </div>
);
}