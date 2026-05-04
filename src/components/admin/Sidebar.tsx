"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Mail,
  LogOut,
  ArrowRight
} from 'lucide-react';

const menuItems = [
  { name: 'الرئيسية', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'المنتجات', icon: Package, path: '/admin/products' },
  { name: 'الأقسام', icon: Tags, path: '/admin/categories' },
  { name: 'الطلبات', icon: ShoppingCart, path: '/admin/orders' },
  { name: 'الرسائل', icon: Mail, path: '/admin/messages' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-[#111111] border-r border-white/5 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col gap-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">GAST <span className="text-red-500">Admin</span></h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white md:hidden bg-white/5 rounded-lg"
            >
              <ArrowRight size={18} className="rotate-180" />
            </button>
          </div>
          
          <Link 
            href="/" 
            prefetch={false}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/5 transition-all text-xs font-bold active:scale-95"
          >
            <ArrowRight size={14} />
            العودة للموقع
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                prefetch={true}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group ${
                  isActive 
                    ? 'bg-red-600/10 text-red-500 font-bold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={`transition-colors duration-150 ${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-white'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-600/10 hover:text-red-500 rounded-xl transition-all active:scale-95"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

