"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayoutShell({ 
  children,
  isAuthenticated 
}: { 
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - only rendered if authenticated */}
      {isAuthenticated && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar - only rendered if authenticated */}
        {isAuthenticated && (
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        )}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0a0a0a] p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
