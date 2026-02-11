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
          <main className="min-h-[calc(100vh-400px)] bg-grommetBg">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="border-t border-slate-200 bg-[#FEF7EF] mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">About</h3>
                  <p className="text-sm text-slate-600">
                    Premium car frames and collectibles for enthusiasts across India.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Quick Links</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><a href="/items" className="hover:text-orange-500">Shop</a></li>
                    <li><a href="/my-orders" className="hover:text-orange-500">Orders</a></li>
                    <li><a href="/profile" className="hover:text-orange-500">Profile</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Support</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li><a href="#" className="hover:text-orange-500">Contact Us</a></li>
                    <li><a href="#" className="hover:text-orange-500">Shipping Info</a></li>
                    <li><a href="#" className="hover:text-orange-500">Returns</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Connect</h3>
                  <p className="text-sm text-slate-600 mb-2">Follow us on social media</p>
                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                      <span className="text-sm">f</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                      <span className="text-sm">i</span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="border-t border-slate-300 pt-6 pb-4 text-center">
                <p className="text-sm font-medium text-slate-700 mb-4">
                  ✓ Premium Quality | ✓ Fast Delivery | ✓ Secure Checkout
                </p>
                <p className="text-sm text-slate-600">
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
