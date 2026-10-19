import { NextRequest, NextResponse } from 'next/server';
import { portfolioDb } from '@/lib/data';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // Rate limiting: max 3 subscription attempts per minute per IP
    const allowed = portfolioDb.checkRateLimit(`subscribe_${ip}`, 3, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many subscription requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    portfolioDb.addSubscriber(email.trim());

    return NextResponse.json({
      success: true,
      message: 'Welcome to the telemetry digest loop! You will receive new research notes directly.'
    });
  } catch (error) {
    console.error('Error in /api/subscribe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription.' },
      { status: 500 }
    );
  }
}
