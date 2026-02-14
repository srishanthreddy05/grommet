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
            <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
               
                  
                
                
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