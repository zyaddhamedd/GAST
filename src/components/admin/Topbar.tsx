"use client";

import { Search, Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex-1 max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="بحث..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/0 rounded-full text-sm text-white placeholder:text-gray-600 focus:ring-4 focus:ring-red-500/10 focus:bg-white/10 focus:border-red-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2 text-gray-400 hover:text-white bg-white/0 hover:bg-white/5 rounded-xl transition-all active:scale-90">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
        </button>
        
        <div className="h-9 w-9 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold border border-red-600/20 shadow-lg shadow-red-600/5 cursor-pointer hover:bg-red-600/20 transition-all active:scale-95">
          A
        </div>
      </div>
    </div>
  );
}
