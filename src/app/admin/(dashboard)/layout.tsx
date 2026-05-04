import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check for the layout shell
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token');
  
  // Note: Middleware already handles basic protection, 
  // but we can check specifically for the layout parts here if needed.

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-600 selection:text-white">
      
      <div className="flex h-screen overflow-hidden">
        {/* Render Sidebar only if authenticated */}
        {token && <Sidebar />}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Render Topbar only if authenticated */}
          {token && <Topbar />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0a0a0a] p-4 md:p-8 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
