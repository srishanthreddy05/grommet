import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import AnnouncementBar from "@/src/components/AnnouncementBar";
import Navbar from "@/src/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grommet – Order Car Frames",
  description: "Easy car frame ordering app. Browse, add to cart, and checkout via WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#FEF7EF] text-[#374151] font-sans`}
      >
        <CartProvider>
          {/* Top Announcement Bar */}
          <AnnouncementBar />
          
          {/* Header + Navigation */}
          <Navbar />
          
          {/* Main Content */}
          <main className="min-h-[calc(100vh-400px)] bg-[#FEF7EF]">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="border-t border-[#E8DFD4]/50 bg-[#FEF7EF] mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-[#3D3430] mb-4 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>About</h3>
                  <p className="text-sm text-[#6B5D52] leading-relaxed">
                    Premium car frames and collectibles for enthusiasts across India.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-[#3D3430] mb-4 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Quick Links</h3>
                  <ul className="space-y-2.5 text-sm text-[#6B5D52]">
                    <li><a href="/items" className="hover:text-[#8B7355] transition-colors duration-200">Shop</a></li>
                    <li><a href="/my-orders" className="hover:text-[#8B7355] transition-colors duration-200">Orders</a></li>
                    <li><a href="/profile" className="hover:text-[#8B7355] transition-colors duration-200">Profile</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-[#3D3430] mb-4 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Support</h3>
                  <ul className="space-y-2.5 text-sm text-[#6B5D52]">
                    <li><a href="#" className="hover:text-[#8B7355] transition-colors duration-200">Contact Us</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-[#3D3430] mb-4 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Connect</h3>
                  <p className="text-sm text-[#6B5D52] mb-3">Follow us on social media</p>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#8B7355] hover:to-[#6B5D52] hover:text-white transition-all duration-300 shadow-sm border border-[#E8DFD4]/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#8B7355] hover:to-[#6B5D52] hover:text-white transition-all duration-300 shadow-sm border border-[#E8DFD4]/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="border-t border-[#E8DFD4]/50 pt-8 pb-4">
                <div className="text-center mb-6">
                  <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[#6B5D52]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center border border-[#E8DFD4]/30">
                        <svg className="w-4 h-4 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center border border-[#E8DFD4]/30">
                        <svg className="w-4 h-4 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center border border-[#E8DFD4]/30">
                        <svg className="w-4 h-4 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-[#8B7D72]">
                  © 2026 Grommet. Currently in testing phase.
                </p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}