import { NextResponse } from 'next/server';

const API_ENDPOINT = 'https://chaavibot-production.up.railway.app/api/users';

export async function GET() {
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Keep revalidation to ensure fresh data
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Railway API responded with status: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in proxy API users route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Proxy Server Error' },
      { status: 500 }
    );
  }
}
