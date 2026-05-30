import { UsersAPIResponse } from '@/types/user';

const API_ENDPOINT = 'https://chaavibot-production.up.railway.app/api/users';

export async function fetchUsers(): Promise<UsersAPIResponse> {
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache the response and revalidate it every 15 seconds to keep dashboard fresh
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data: UsersAPIResponse = await res.json();
    
    if (!data.success) {
      throw new Error('API reported unsuccessful response status');
    }

    return data;
  } catch (error) {
    console.error('Error fetching users from chaavibot API:', error);
    throw error;
  }
}
