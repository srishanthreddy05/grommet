'use client';

import { useState, useEffect } from 'react';
import { auth, database } from '@/src/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  User 
} from 'firebase/auth';
import { ref, get } from 'firebase/database';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  paymentMode: string;
  createdAt: number;
}

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export default function MyOrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Fetch orders if user is logged in
      if (currentUser) {
        fetchOrders(currentUser.email!);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const fetchOrders = async (userEmail: string) => {
    setOrdersLoading(true);
    setError(null);

    try {
      // Fetch orders from user_orders structure
      const emailKey = toBase64Url(userEmail);
      const userOrdersRef = ref(database, `user_orders/${emailKey}`);
      const snapshot = await get(userOrdersRef);
      
      if (snapshot.exists()) {
        const orderIds = snapshot.val();
        const ordersArray: Order[] = [];

        // Fetch full order details for each order ID
        for (const orderId of Object.keys(orderIds)) {
          const orderRef = ref(database, `orders/${orderId}`);
          const orderSnapshot = await get(orderRef);
          
          if (orderSnapshot.exists()) {
            ordersArray.push(orderSnapshot.val() as Order);
          }
        }
        
        // Sort by createdAt descending
        ordersArray.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSearchOrder = async () => {
    if (!emailInput.trim()) {
      setError('Please enter an email address');
      return;
    }

    await fetchOrders(emailInput.trim());
    setSearchMode(false);
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state while checking auth
  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white px-4">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </main>
    );
  }

  // Not logged in - show options
  if (!user) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Orders</h1>
            <p className="text-slate-600">Track your orders</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!searchMode ? (
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-3"
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
                    Login with Google
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">or</span>
                </div>
              </div>

              <button
                onClick={() => setSearchMode(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200"
              >
                Search Order by Email
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearchOrder}
                disabled={ordersLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-xl transition duration-200"
              >
                {ordersLoading ? 'Searching...' : 'Search Orders'}
              </button>
              <button
                onClick={() => {
                  setSearchMode(false);
                  setEmailInput('');
                  setOrders([]);
                  setError(null);
                }}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 px-6 rounded-xl transition duration-200"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">My Orders</h1>
          <p className="text-slate-600 text-base sm:text-lg">Track and manage your orders</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {ordersLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No orders yet</h2>
            <p className="text-slate-600 mb-8">You have no orders yet. Make your first order.</p>
            <Link
              href="/items"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition duration-200"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{order.orderId}</h3>
                    <p className="text-sm text-slate-600 mt-1">{formatDate(order.createdAt)}</p>
                    <p className="text-sm text-slate-600">{order.email}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-slate-600">{order.paymentMode}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Items:</h4>
                  <ul className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-700">
                          {item.name} <span className="text-slate-600">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-slate-900">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    <p><strong>Phone:</strong> {order.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
