import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import { cookies } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check for the layout shell
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-600 selection:text-white">
      <AdminLayoutShell isAuthenticated={!!token}>
        {children}
      </AdminLayoutShell>
    </div>
  );
}

