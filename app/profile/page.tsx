'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, database } from '@/src/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User 
} from 'firebase/auth';
import { ref, set, get, serverTimestamp } from 'firebase/database';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const ordersRef = ref(database, 'orders');
          const snapshot = await get(ordersRef);
          if (snapshot.exists()) {
            const allOrders = snapshot.val() as Record<string, any>;
            const userOrders = Object.entries(allOrders)
              .filter(([_, order]: [string, any]) => 
                order.userId === currentUser.uid || 
                order.userEmail === currentUser.email ||
                order.email === currentUser.email
              )
              .map(([id, order]: [string, any]) => ({ id, ...order }))
              .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
            setOrders(userOrders);
          }
        } catch (err) {
          console.error('Failed to load orders:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createOrUpdateUser(user);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login popup was closed. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError(null);
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
      console.error('Login error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const createOrUpdateUser = async (user: User) => {
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const existingUser = snapshot.val();

      const userData: any = {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        provider: 'google',
        lastLoginAt: serverTimestamp(),
      };

      if (!existingUser) {
        userData.createdAt = serverTimestamp();
      }

      await set(userRef, userData);
    } catch (err) {
      console.error('Error creating/updating user:', err);
      throw err;
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    setError(null);

    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
      console.error('Logout error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#FBF9F6] to-[#F9F6F1] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-[#E8DFD4] border-t-[#8B7355]"></div>
          <p className="text-[#6B5D52] font-medium tracking-wide">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#FBF9F6] to-[#F9F6F1]">
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-[#E8DFD4]/50 p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#8B7355] to-[#6B5D52] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-[#FAF8F5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold text-[#3D3430] mb-2 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome Back
              </h1>
              <p className="text-[#6B5D52] text-sm">Sign in to access your account</p>
            </div>

            {error && (
              <div className="bg-[#FFF4F4] border border-[#FFD6D6] rounded-xl p-4 mb-6">
                <p className="text-sm text-[#C53030]">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-[#8B7355] to-[#6B5D52] hover:from-[#6B5D52] hover:to-[#8B7355] disabled:from-[#C4B5A8] disabled:to-[#C4B5A8] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {authLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p className="text-xs text-[#8B7D72] text-center mt-6">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged in - show profile and orders
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#FBF9F6] to-[#F9F6F1]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-[#E8DFD4]/50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#8B7355]/10 to-[#6B5D52]/10 px-8 py-10 border-b border-[#E8DFD4]">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <h1 className="text-3xl font-semibold text-[#3D3430] mb-1 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {user.displayName || 'Valued Customer'}
                  </h1>
                  <p className="text-[#6B5D52] text-sm">Premium Member</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/50 rounded-2xl p-5 border border-[#E8DFD4]/30">
                  <p className="text-xs text-[#8B7D72] font-semibold mb-2 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-[#3D3430] break-all">
                    {user.email || 'Not provided'}
                  </p>
                </div>

                <div className="bg-white/50 rounded-2xl p-5 border border-[#E8DFD4]/30">
                  <p className="text-xs text-[#8B7D72] font-semibold mb-2 uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-medium text-[#3D3430]">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-[#FFF4F4] border border-[#FFD6D6] rounded-xl p-4 mt-6">
                  <p className="text-sm text-[#C53030]">{error}</p>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleLogout}
                  disabled={authLoading}
                  className="bg-[#C53030] hover:bg-[#A52A2A] disabled:bg-[#C4B5A8] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {authLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Logging out...
                    </span>
                  ) : (
                    'Sign Out'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-[#E8DFD4]/50 overflow-hidden">
          <div className="px-8 py-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-[#3D3430] mb-2 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order History
                </h2>
                <p className="text-[#6B5D52] text-sm">Track and manage your purchases</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-[#FAF8F5] to-[#F5F2ED] rounded-2xl border border-[#E8DFD4]/30">
                  <div className="w-16 h-16 bg-[#E8DFD4] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#8B7D72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-[#6B5D52] font-medium mb-3">No orders yet</p>
                  <p className="text-sm text-[#8B7D72] mb-6">Start exploring our curated collection</p>
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B7355] to-[#6B5D52] hover:from-[#6B5D52] hover:to-[#8B7355] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Discover Products
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div 
                      key={order.id} 
                      className="bg-gradient-to-br from-white to-[#FAF8F5] rounded-2xl shadow-md hover:shadow-lg border border-[#E8DFD4]/50 p-6 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-[#8B7D72] font-semibold uppercase tracking-wider mb-1">Order ID</p>
                          <p className="text-sm font-mono font-medium text-[#3D3430] bg-[#F5F2ED] px-3 py-1 rounded-lg inline-block">
                            #{order.id.slice(0, 10).toUpperCase()}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
                          {order.status || 'Confirmed'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-end pt-4 border-t border-[#E8DFD4]/30">
                        <div className="flex items-center gap-2 text-xs text-[#8B7D72]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {order.createdAt 
                            ? new Date(order.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })
                            : 'Date unavailable'
                          }
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#8B7D72] font-semibold uppercase tracking-wider mb-1">Total</p>
                          <p className="text-xl font-semibold text-[#3D3430]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}