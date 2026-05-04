"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        // If query is empty, close. If not, keep it open.
        if (!query.trim()) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, query]);

  return (
    <div className="relative flex items-center">
      <div 
        className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${
          isOpen ? "w-32 md:w-64 opacity-100 mr-1" : "w-0 opacity-0 mr-0"
        }`}
      >
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="ابحث..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 border border-transparent rounded-full py-1.5 px-4 text-xs focus:outline-none focus:bg-white focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/10 text-gray-900 transition-all font-bold"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      <button 
        onClick={() => {
          if (isOpen && query.trim()) {
            handleSearch();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={`p-2 transition-all active:scale-90 ${
          isOpen ? "text-[#ff6a00]" : "text-gray-900 hover:text-[#ff6a00]"
        }`}
        title="بحث عن منتجات"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
}
