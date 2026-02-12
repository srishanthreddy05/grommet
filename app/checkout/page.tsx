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
  }, [loading, items.length, router]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6]">
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-amber-200/50 shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto mb-6"></div>
          <p className="text-amber-800 font-light text-lg">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FEF7EF] to-[#FDF5E6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Premium Page Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300"></div>
            <span className="text-xs uppercase tracking-widest text-amber-700/60 font-semibold">Secure Checkout</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 bg-clip-text text-transparent mb-3">
            Complete Your Order
          </h1>
          <p className="text-amber-800/70 text-base sm:text-lg font-light">
            Just a few steps away from your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email & OTP Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-amber-200/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-amber-900">Email Verification</h2>
              </div>

              {/* Email Field */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  disabled={otpState.sent}
                  className="w-full px-4 py-3.5 border border-amber-200/60 bg-white/80 rounded-xl focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 disabled:bg-amber-50/50 disabled:cursor-not-allowed text-amber-950 placeholder-amber-600/40 transition-all duration-300 shadow-sm"
                />
              </div>

              {/* Phone Field */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  disabled={otpState.sent}
                  className="w-full px-4 py-3.5 border border-amber-200/60 bg-white/80 rounded-xl focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 disabled:bg-amber-50/50 disabled:cursor-not-allowed text-amber-950 placeholder-amber-600/40 transition-all duration-300 shadow-sm"
                />
              </div>

              {/* Send OTP Button */}
              {!otpState.sent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={sendingOtp}
                  className="group w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-amber-300 disabled:to-orange-300 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {sendingOtp ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span className="relative z-10">Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="relative z-10">Send OTP to Email</span>
                    </>
                  )}
                </button>
              ) : (
                <div>
                  {!otpState.verified ? (
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-amber-900 mb-2">
                        Enter 6-digit OTP sent to {formData.email}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        disabled={verifyingOtp}
                        className="w-full px-4 py-4 border-2 border-amber-300/60 bg-white/80 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 disabled:bg-amber-50/50 text-center text-2xl tracking-[0.5em] font-bold text-amber-900 placeholder-amber-400/40 shadow-sm"
                      />
                      <button
                        onClick={handleVerifyOTP}
                        disabled={verifyingOtp || otpCode.length !== 6}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-amber-300 disabled:to-orange-300 text-white font-semibold py-4 px-6 rounded-xl mb-3 transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
                      >
                        {verifyingOtp ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Verifying...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verify OTP
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setOtpState((prev) => ({ ...prev, sent: false }));
                          setOtpCode('');
                        }}
                        className="w-full text-amber-700 bg-amber-100/60 hover:bg-amber-200/60 border border-amber-300/50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md active:scale-95"
                      >
                        Resend OTP
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-300/60 rounded-2xl p-6 flex items-start gap-4 shadow-md">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-emerald-900 font-bold text-lg mb-1">Email Verified!</p>
                        <p className="text-emerald-800 text-sm">{formData.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* WhatsApp Checkout - Show after OTP verified */}
            {otpState.verified && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-amber-200/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-900">Complete via WhatsApp</h2>
                </div>

                <p className="text-amber-800/70 text-sm mb-6">
                  Click below to finalize your order through WhatsApp. We'll send you payment details and order confirmation.
                </p>

                <button
                  onClick={handleCheckoutWhatsApp}
                  disabled={creatingOrder || !formData.phone.trim()}
                  className="group w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 disabled:from-amber-300 disabled:to-orange-300 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {creatingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent relative z-10"></div>
                      <span className="relative z-10">Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="relative z-10">Continue to WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-300/60 rounded-2xl p-5 flex items-start gap-4 shadow-md animate-shake">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-semibold flex-1">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-300/60 rounded-2xl p-5 flex items-start gap-4 shadow-md">
                <svg className="w-6 h-6 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-emerald-800 font-semibold flex-1">{successMessage}</p>
              </div>
            )}
          </div>

          {/* Order Summary - Right Column (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-amber-200/40 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-amber-900">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-amber-200/40 max-h-[400px] overflow-y-auto">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex justify-between items-start gap-3 p-3 bg-amber-50/40 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-950 font-semibold text-sm mb-1 line-clamp-2">{item.name}</p>
                      <p className="text-amber-700/60 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-amber-900 font-bold text-sm whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <p className="text-amber-800 font-medium">Subtotal</p>
                  <p className="text-amber-900 font-bold">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between items-center py-2 pb-4 border-b border-amber-200/40">
                  <p className="text-amber-800 font-medium">Shipping</p>
                  <p className="text-emerald-700 font-bold">FREE</p>
                </div>
                <div className="pt-3 flex justify-between items-center">
                  <p className="text-lg font-bold text-amber-900">Total</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-amber-200/40">
                <div className="flex items-center justify-center gap-2 text-amber-700/70 text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}