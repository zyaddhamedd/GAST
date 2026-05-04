"use client";

import { useState } from "react";

interface ProductTabsProps {
  description: string;
  specs: { key: string; value: string }[];
}

export function ProductTabs({ description, specs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
      <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
        {["description", "specs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-5 text-lg font-bold transition-colors whitespace-nowrap relative ${
              activeTab === tab ? "text-[#ff6a00]" : "text-gray-500 hover:text-brand-blue"
            }`}
          >
            {tab === "description" ? "الوصف" : "المواصفات التقنية"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6a00] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="p-8 lg:p-10">
        {activeTab === "description" && (
          <div className="flex flex-col gap-8">
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
              <p>{description}</p>
            </div>

            {specs.length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-brand-blue font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#ff6a00] rounded-full" />
                  المواصفات الأساسية:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100/50">
                      <span className="text-gray-500 font-bold text-sm">{spec.key}</span>
                      <span className="text-brand-blue font-black text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-3xl" dir="rtl">
            {specs.length > 0 ? (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-6 text-sm font-bold text-brand-blue w-1/3">المواصفة</th>
                    <th className="py-3 px-6 text-sm font-bold text-brand-blue">القيمة</th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <th className="py-4 px-6 border-b border-gray-100 text-brand-blue font-semibold w-1/3">
                        {row.key}
                      </th>
                      <td className="py-4 px-6 border-b border-gray-100 text-gray-600 font-medium">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-center py-8">لا توجد مواصفات متاحة لهذا المنتج</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
