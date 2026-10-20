import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioFromDb, savePortfolioToDb, resetPortfolioInDb, isTursoConfigured } from '@/lib/turso';
import { PortfolioData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, source } = await getPortfolioFromDb();
    return NextResponse.json({
      success: true,
      data,
      source,
      tursoConfigured: isTursoConfigured(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: Expected JSON object' },
        { status: 400 }
      );
    }

    const updatedData = await savePortfolioToDb(body as Partial<PortfolioData>);

    return NextResponse.json({
      success: true,
      message: 'Portfolio data synchronized successfully',
      data: updatedData,
      tursoConfigured: isTursoConfigured(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating portfolio data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio data' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const resetData = await resetPortfolioInDb();
    return NextResponse.json({
      success: true,
      message: 'Portfolio data reset to factory defaults',
      data: resetData,
      tursoConfigured: isTursoConfigured(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error resetting portfolio data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset portfolio data' },
      { status: 500 }
    );
  }
}
