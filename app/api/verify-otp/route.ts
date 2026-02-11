import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';

// Initialize Firebase Admin
const apps = getApps();
if (apps.length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface OTPData {
  otp: string;
  expiry: number;
  createdAt: number;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body: VerifyOtpRequest = await request.json();
    const { email, otp } = body;

    // Validate inputs
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Retrieve OTP from Firebase Realtime Database
    const db = getAdminDatabase();
    const emailKey = Buffer.from(email).toString('base64url');
    const otpRef = db.ref(`otp_verification/${emailKey}`);
    const snapshot = await otpRef.get();

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'OTP not found. Please request a new OTP.' },
        { status: 404 }
      );
    }

    const otpData: OTPData = snapshot.val();

    // Check if OTP is expired
    if (Date.now() > otpData.expiry) {
      // Delete expired OTP
      await otpRef.remove();
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 401 }
      );
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 401 }
      );
    }

    // OTP is valid - delete it from database
    await otpRef.remove();

    // Store verification record in database (for audit/tracking)
    const verificationRef = db.ref(
      `email_verifications/${emailKey}`
    );
    await verificationRef.set({
      verified: true,
      verifiedAt: Date.now(),
      email: email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
