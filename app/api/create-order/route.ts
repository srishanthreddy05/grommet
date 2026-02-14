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

// WhatsApp configuration
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE_NUMBER || '919876543210'; // Format: country code + number without +

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CreateOrderRequest {
  name: string;
  email: string;
  phone: string;
  items: CartItem[];
  totalAmount: number;
}

interface OrderData {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  itemNames: string[];
  items: CartItem[];
  totalAmount: number;
  cartValue: number;
  status: string;
  paymentMode: string;
  createdAt: number;
}

interface WhatsAppMessage {
  orderId: string;
  message: string;
  link: string;
}

function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GMT-${code}`;
}

function generateWhatsAppMessage(order: OrderData): WhatsAppMessage {
  const itemsList = order.items
    .map((item) => `• ${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const message = `Hello! 👋\n\nI would like to place an order:\n\n*Order ID:* ${order.orderId}\n*Name:* ${order.name}\n*Email:* ${order.email}\n*Phone:* ${order.phone}\n\n*Items:*\n${itemsList}\n\n*Total Amount:* ₹${order.totalAmount.toFixed(2)}\n\nPlease confirm if this order is ready for checkout.\n\nThank you!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

  return {
    orderId: order.orderId,
    message,
    link: whatsappLink,
  };
}

// Validate phone number format
function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned.length >= 10;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body: CreateOrderRequest = await request.json();
    const { name, email, phone, items, totalAmount } = body;

    // Validate inputs
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (totalAmount === undefined || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Get database instance
    const db = getAdminDatabase();

    // Check stock availability and decrease stock for each item
    for (const item of items) {
      const stockRef = db.ref(`stock/${item.id}`);
      const stockSnapshot = await stockRef.get();

      if (!stockSnapshot.exists()) {
        return NextResponse.json(
          { error: `Product ${item.name} not found in stock` },
          { status: 400 }
        );
      }

      const productData = stockSnapshot.val();
      const currentStock = productData.stock || 0;

      // Check if sufficient stock is available
      if (currentStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}` },
          { status: 400 }
        );
      }

      // Decrease stock
      const newStock = currentStock - item.quantity;
      await stockRef.update({ stock: newStock });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Create order object
    const order: OrderData = {
      orderId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.replace(/[^\d]/g, ''), // Store only digits
      itemNames: items.map((item) => item.name),
      items,
      totalAmount,
      cartValue: totalAmount,
      status: 'Pending',
      paymentMode: 'WhatsApp',
      createdAt: Date.now(),
    };

    // Store order in Firebase Realtime Database
    const ordersRef = db.ref(`orders/${orderId}`);

    await ordersRef.set(order);

    // Also store user's order references for easy lookup
    const emailKey = Buffer.from(email).toString('base64url');
    const userOrdersRef = db.ref(`user_orders/${emailKey}/${orderId}`);
    await userOrdersRef.set({
      orderId,
      createdAt: Date.now(),
      totalAmount,
      cartValue: totalAmount,
    });

    // Generate WhatsApp message and link
    const whatsappPayload = generateWhatsAppMessage(order);

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        orderId,
        whatsappLink: whatsappPayload.link,
        orderData: {
          orderId: order.orderId,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
