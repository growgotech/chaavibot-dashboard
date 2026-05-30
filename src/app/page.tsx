import { fetchUsers } from '@/lib/api';
import DashboardClient from '@/components/dashboard/dashboard-client';

export default async function DashboardPage() {
  let initialData;

  try {
    initialData = await fetchUsers();
  } catch (error) {
    console.warn('API endpoint failed during SSR/Build. Initializing with empty state for browser sync...', error);
    initialData = { success: true, count: 0, users: [] };
  }

  return <DashboardClient initialData={initialData} />;
}
