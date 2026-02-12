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
            // Filter by either userId (uid) or email
            const userOrders = Object.entries(allOrders)
              .filter(([_, order]: [string, any]) => 
                order.userId === currentUser.uid || 
                order.userEmail === currentUser.email ||
                order.email === currentUser.email
              )
              .map(([id, order]: [string, any]) => ({ id, ...order }))
              .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
            setOrders(userOrders);
            console.log('User orders loaded:', userOrders);
          } else {
            console.log('No orders found in database');
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

      // Create or update user in Realtime Database
      await createOrUpdateUser(user);
    } catch (err: any) {
      // Handle specific error cases
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login popup was closed. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Multiple popups opened, just ignore
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
      <div className="max-w-md mx-auto rounded-2xl shadow-lg overflow-hidden min-h-screen bg-[#FFF7EF] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login button
  if (!user) {
    return (
      <div className="max-w-md mx-auto rounded-2xl shadow-lg overflow-hidden min-h-screen bg-[#FFF7EF]">
        <div className="py-8 px-4 space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display' }}>Profile</h1>
            <p className="text-sm text-gray-500">Login to view your profile</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full bg-black hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-full transition duration-200 flex items-center justify-center gap-2 text-sm"
          >
            {authLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                Login with Google
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Logged in - show user profile and orders
  return (
    <div className="max-w-md mx-auto rounded-2xl shadow-lg overflow-hidden min-h-screen bg-[#FFF7EF]">
      {/* User Profile Section */}
      <section className="py-8 px-4 bg-white">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display' }}>Your Profile</h1>
            <p className="text-sm text-gray-500">View your account details</p>
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 border-4 border-white shadow-md">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-300">
                  <svg
                    className="w-10 h-10 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Name</p>
              <p className="text-sm font-semibold text-slate-900">
                {user.displayName || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
              <p className="text-sm font-semibold text-slate-900 break-all">
                {user.email || 'Not provided'}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={authLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-full transition duration-200 text-sm"
          >
            {authLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Logging out...
              </span>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </section>

      {/* My Orders Section */}
      <section className="py-8 px-4 bg-[#FEF7EF]">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display' }}>My Orders</h2>
            <p className="text-sm text-gray-500">Your recent purchases</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-sm text-gray-500 font-medium">No orders yet</p>
              <Link href="/" className="text-xs text-orange-600 hover:text-orange-700 font-semibold mt-2 inline-block">
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Order ID</p>
                      <p className="text-sm font-semibold text-slate-900">{order.id.slice(0, 8)}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700">
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unavailable'}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{order.totalAmount || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
