"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, CheckCheck, MessageSquare } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email?: string;
  phone: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

const AVATAR_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700", accent: "border-violet-200" },
  { bg: "bg-sky-100",    text: "text-sky-700",    accent: "border-sky-200"    },
  { bg: "bg-emerald-100",text: "text-emerald-700",accent: "border-emerald-200"},
  { bg: "bg-amber-100",  text: "text-amber-700",  accent: "border-amber-200"  },
  { bg: "bg-rose-100",   text: "text-rose-700",   accent: "border-rose-200"   },
  { bg: "bg-indigo-100", text: "text-indigo-700", accent: "border-indigo-200" },
];

function getColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "منذ لحظات";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return new Date(iso).toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ readStatus: true }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, readStatus: true } : m)));
  };

  const unread = messages.filter((m) => !m.readStatus).length;

  return (
    <div className="space-y-6" dir="rtl">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">صندوق الرسائل</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {messages.length} رسالة {unread > 0 && `· ${unread} غير مقروءة`}
          </p>
        </div>
        {unread > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 text-xs font-bold px-4 py-2 rounded-xl border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {unread} جديدة
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-36 bg-[#111111] rounded-2xl border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="bg-[#111111] rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">لا توجد رسائل بعد</p>
            </div>
          )}

          {/* Cards */}
          <div className="space-y-4">
            {messages.map((msg) => {
              const color = getColor(msg.name);
              return (
                <div
                  key={msg.id}
                  className={`relative bg-[#111111] rounded-2xl border overflow-hidden transition-all hover:shadow-2xl hover:border-white/10 ${
                    msg.readStatus ? "border-white/5" : "border-red-500/20 shadow-lg shadow-red-500/5"
                  }`}
                >
                  {/* Unread accent bar */}
                  {!msg.readStatus && (
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-red-500 rounded-r-2xl" />
                  )}

                  <div className="p-5 pr-7">
                    {/* Top: avatar + name + time */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border ${color.bg.replace('bg-', 'bg-opacity-20 bg-')} ${color.text} ${color.accent.replace('border-', 'border-opacity-30 border-')} shrink-0`}>
                          {msg.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base leading-tight">{msg.name}</p>
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1">
                            <a
                              href={`tel:${msg.phone}`}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            >
                              <Phone className="w-3 h-3" /> {msg.phone}
                            </a>
                            {msg.email && (
                              <a
                                href={`mailto:${msg.email}`}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                              >
                                <Mail className="w-3 h-3" /> {msg.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Time + badge */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs text-gray-500">{timeAgo(msg.createdAt)}</span>
                        {!msg.readStatus ? (
                          <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20">جديدة</span>
                        ) : (
                          <span className="text-[10px] font-medium text-gray-600">مقروءة</span>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/5 mb-4" />

                    {/* Message text */}
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      {msg.message}
                    </p>

                    {/* Actions */}
                    {!msg.readStatus && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => markAsRead(msg.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 transition-all"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          تحديد كمقروءة
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
