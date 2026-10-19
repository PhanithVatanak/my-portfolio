import { NextRequest, NextResponse } from 'next/server';
import { portfolioDb } from '@/lib/data';

// Helper for email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // Rate limiting: max 5 submissions per minute per IP
    const allowed = portfolioDb.checkRateLimit(`contact_${ip}`, 5, 60000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a minute before sending another message.'
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, message } = body;

    // Strict validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Please provide a valid name (at least 2 characters).';
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.message = 'Please provide a detailed message (at least 10 characters).';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      );
    }

    // Persist to database
    const savedMessage = portfolioDb.addMessage(name.trim(), email.trim(), message.trim());

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! Your message has been received, and I'll get back to you as soon as possible.",
        data: savedMessage
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal server error occurred while processing your message.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = portfolioDb.getMessages();
    return NextResponse.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Error in GET /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact inquiries.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !['unread', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid message ID or status value.' },
        { status: 400 }
      );
    }

    const updated = portfolioDb.updateMessageStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Message not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Status updated.' });
  } catch (error) {
    console.error('Error in PATCH /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update status.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing message ID.' },
        { status: 400 }
      );
    }

    const deleted = portfolioDb.deleteMessage(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Message not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error in DELETE /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message.' },
      { status: 500 }
    );
  }
}
