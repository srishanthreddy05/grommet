'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/src/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useCart } from '@/src/context/CartContext';
import type { CartItem } from '@/src/context/CartContext';

interface CheckoutFormState {
  email: string;
  phone: string;
}

interface OTPState {
  sent: boolean;
  verified: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<CheckoutFormState>({
    email: '',
    phone: '',
  });

  const [otpState, setOtpState] = useState<OTPState>({
    sent: false,
    verified: false,
  });
  const [otpCode, setOtpCode] = useState('');

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        setFormData((prev) => ({
          ...prev,
          email: currentUser.email || '',
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && items.length === 0) {
      router.push('/cart');
    }
  }, [loading, items.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateEmail = (): boolean => {
    setError('');
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const validatePhone = (): boolean => {
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^[0-9]{10,}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      setError('Please enter a valid phone number (10+ digits)');
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateEmail() || !validatePhone()) return;

    setSendingOtp(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      setOtpState((prev) => ({ ...prev, sent: true }));
      setSuccessMessage('OTP sent to your email!');
    } catch (err) {
      setError('Error sending OTP. Check internet connection.');
      console.error('Send OTP error:', err);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setVerifyingOtp(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid OTP');
        return;
      }

      setOtpState((prev) => ({ ...prev, verified: true }));
      setSuccessMessage('Order initiated - continue through WhatsApp');
    } catch (err) {
      setError('Error verifying OTP');
      console.error('Verify OTP error:', err);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCheckoutWhatsApp = async () => {
    if (!validatePhone()) return;

    setCreatingOrder(true);
    setError('');

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.displayName || 'Guest',
          email: formData.email,
          phone: formData.phone,
          items: items,
          totalAmount: totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create order');
        setCreatingOrder(false);
        return;
      }

      clearCart();

      if (data.whatsappLink) {
        const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(
          navigator.userAgent
        );

        if (isMobile) {
          window.location.href = data.whatsappLink;
        } else {
          window.open(data.whatsappLink, '_blank', 'noopener,noreferrer');
        }

        router.push('/my-orders');
      }
    } catch (err) {
      setError('Error creating order');
      console.error('Create order error:', err);
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEF7EF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEF7EF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Form */}
          <div className="bg-[#FEF7EF] rounded-lg shadow-md p-6">
            {/* Email & OTP Section */}
            <div className="mb-8 pb-8 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Verification</h2>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  disabled={otpState.sent}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  disabled={otpState.sent}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Send OTP Button */}
              {!otpState.sent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={sendingOtp}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
                </button>
              ) : (
                <div>
                  {!otpState.verified ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter 6-digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        disabled={verifyingOtp}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-center text-lg tracking-widest mb-3"
                      />
                      <button
                        onClick={handleVerifyOTP}
                        disabled={verifyingOtp || otpCode.length !== 6}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg mb-2"
                      >
                        {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button
                        onClick={() => {
                          setOtpState((prev) => ({ ...prev, sent: false }));
                          setOtpCode('');
                        }}
                        className="w-full text-blue-600 border border-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <span className="text-green-600 text-2xl">✓</span>
                      <div>
                        <p className="text-green-800 font-medium">Email verified</p>
                        <p className="text-green-700 text-sm">{formData.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* WhatsApp Checkout - Show after OTP verified */}
            {otpState.verified && (
              <div className="mb-8">
                <button
                  onClick={handleCheckoutWhatsApp}
                  disabled={creatingOrder || !formData.phone.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {creatingOrder ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <span>💬</span>
                      Checkout via WhatsApp
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-[#FEF7EF] rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-900 font-medium">{item.name}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-gray-900 font-medium">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-900 font-medium">Free</p>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <p className="text-lg font-bold text-gray-900">Total</p>
                <p className="text-lg font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
