"use client";

import { useOptimistic, useState, memo, useCallback } from "react";
import { Package, Phone, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const OrderDrawer = dynamic(() => import("./OrderDrawer"), {
  ssr: false,
  loading: () => null,
});

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { name: string; images: { url: string }[] };
}

interface Order {
  id: number;
  customerName: string;
  phone: string;
  email?: string | null;
  address: string;
  total: number;
  status: string;
  createdAt: string | Date;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PENDING:   { label: "قيد الانتظار", classes: "bg-amber-500/10 text-amber-500 border-amber-500/20"   },
  CONFIRMED: { label: "مؤكد",         classes: "bg-blue-500/10 text-blue-500 border-blue-500/20"       },
  SHIPPED:   { label: "قيد الشحن",   classes: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  DELIVERED: { label: "تم التسليم",  classes: "bg-green-500/10 text-green-500 border-green-500/20"    },
};

/**
 * Optimized Order Row Component
 */
const OrderRow = memo(({ 
  order, 
  onStatusChange, 
  onViewDetails 
}: { 
  order: Order; 
  onStatusChange: (id: number, status: string) => void;
  onViewDetails: (order: Order) => void;
}) => {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  
  return (
    <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden shadow-sm hover:shadow-2xl hover:border-white/10 transition-all group">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">#{order.id}</span>
              <span className="text-gray-700">·</span>
              <span className="font-semibold text-gray-200 truncate">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3" /> {order.phone}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 truncate max-w-[220px]">
                <MapPin className="w-3 h-3" /> {order.address}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-xl font-black text-[#ff6a00]">
              {order.total.toLocaleString("ar-EG")}
              <span className="text-xs font-normal text-gray-500 mr-1">ج.م</span>
            </p>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>

          <div className="relative">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border appearance-none outline-none cursor-pointer pr-7 transition-all active:scale-95 ${cfg.classes}`}
            >
              {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                <option key={val} value={val} className="bg-[#111111] text-white">{label}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
          </div>

          <button
            onClick={() => onViewDetails(order)}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all active:scale-95"
          >
            التفاصيل
          </button>
        </div>
      </div>
    </div>
  );
});

OrderRow.displayName = "OrderRow";

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Order | null>(null);

  const [optimisticOrders, updateOptimisticStatus] = useOptimistic(
    initialOrders,
    (state, { id, status }: { id: number, status: string }) => 
      state.map(o => o.id === id ? { ...o, status } : o)
  );

  const handleStatusChange = useCallback(async (id: number, status: string) => {
    updateOptimisticStatus({ id, status });
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("Failed to update status");
      router.refresh();
    }
  }, [selected?.id, updateOptimisticStatus, router]);

  const handleViewDetails = useCallback((order: Order) => {
    setSelected(order);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div className="space-y-3" dir="rtl">
      {optimisticOrders.map((order) => (
        <OrderRow 
          key={order.id} 
          order={order} 
          onStatusChange={handleStatusChange} 
          onViewDetails={handleViewDetails} 
        />
      ))}

      {selected && (
         <OrderDrawer
           order={selected}
           onClose={handleCloseDrawer}
         />
      )}
    </div>
  );
}
