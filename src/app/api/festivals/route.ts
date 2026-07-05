import { NextResponse } from 'next/server';

const FESTIVALS_ENDPOINT = 'https://chaavibot-production.up.railway.app/api/festivals';

export async function GET() {
  try {
    const res = await fetch(FESTIVALS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour since festivals change very rarely
    });

    if (!res.ok) {
      console.warn(`Railway Festivals API responded with status: ${res.status}. Returning empty list.`);
      return NextResponse.json({
        success: false,
        error: `Railway API responded with status: ${res.status}`,
        festivals: []
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in proxy API festivals route:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch festivals from live API',
      festivals: []
    });
  }
}
