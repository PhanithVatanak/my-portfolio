import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    const expectedPasscode = process.env.ADMIN_PASSCODE || 'spv-admin-2025';

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Passcode is required.' },
        { status: 400 }
      );
    }

    if (passcode.trim() === expectedPasscode.trim()) {
      return NextResponse.json({
        success: true,
        role: 'admin',
        message: 'Administrator authorization successful.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid administrator passcode. Please try again.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error verifying admin passcode:', error);
    return NextResponse.json(
      { success: false, error: 'Server error during authentication.' },
      { status: 500 }
    );
  }
}
