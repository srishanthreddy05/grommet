import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, ref, set } from 'firebase/database';
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

// Brevo API configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Grommet';

interface SendOtpRequest {
  email: string;
}

interface BrevoResponse {
  id?: number;
  success?: boolean;
  code?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body: SendOtpRequest = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check Brevo API key
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expiry: 5 minutes from now
    const expiryTime = Date.now() + 5 * 60 * 1000;

    // Store OTP in Firebase Realtime Database
    const db = getAdminDatabase();
    const emailKey = Buffer.from(email).toString('base64url');
    const otpRef = db.ref(`otp_verification/${emailKey}`);

    await otpRef.set({
      otp: otp,
      expiry: expiryTime,
      createdAt: Date.now(),
    });

    // Send OTP via Brevo Email API
    const brevoPayload = {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: 'Your OTP for Email Verification',
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { padding: 20px; background-color: #fff; border: 1px solid #ddd; }
              .otp-box { 
                background-color: #f0f0f0; 
                padding: 15px; 
                border-radius: 5px; 
                text-align: center; 
                margin: 20px 0;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #333;
              }
              .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
              .warning { color: #dc3545; font-size: 12px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Verify Your Email</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Your one-time password (OTP) for email verification is:</p>
                <div class="otp-box">${otp}</div>
                <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <div class="warning">⚠️ Never share this OTP with anyone. We will never ask for it.</div>
              </div>
              <div class="footer">
                <p>&copy; 2026 Grommet. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    const brevoData: BrevoResponse = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error('Brevo API error:', brevoData);
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent successfully',
        expiryTime: expiryTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
