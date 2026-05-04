"use client";

import { useOptimistic, useState, memo, useCallback } from "react";
import { Package, Phone, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { OrderStatus, PaymentMethod } from "@prisma/client";

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
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProofImage?: string | null;
  createdAt: string | Date;
  items: OrderItem[];
}

interface OrderDrawerProps {
  order: Order;
  onClose: () => void;
  onStatusChange?: (id: number, status: string) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING:   { label: "قيد الانتظار", classes: "bg-amber-500/10 text-amber-500 border-amber-500/20"   },
  PENDING_VERIFICATION: { label: "مراجعة الدفع", classes: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  CONFIRMED: { label: "مؤكد",         classes: "bg-blue-500/10 text-blue-500 border-blue-500/20"       },
  SHIPPED:   { label: "قيد الشحن",   classes: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  DELIVERED: { label: "تم التسليم",  classes: "bg-green-500/10 text-green-500 border-green-500/20"    },
  REJECTED:  { label: "مرفوض",       classes: "bg-red-500/10 text-red-500 border-red-500/20"          },
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
  onStatusChange: (id: number, status: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
}) => {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  
  return (
    <div className="bg-[#111111] rounded-2xl border border-white/5 overflow-hidden shadow-sm hover:shadow-2xl hover:border-white/10 transition-all group">
      <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between lg:justify-start gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">#{order.id}</span>
                {order.paymentMethod === PaymentMethod.INSTAPAY && (
                  <span className="bg-indigo-500/20 text-indigo-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">INSTAPAY</span>
                )}
                <span className="text-gray-700">·</span>
                <span className="font-semibold text-gray-200 truncate max-w-[120px] md:max-w-none">{order.customerName}</span>
              </div>
              <div className="lg:hidden text-right">
                <p className="text-lg font-black text-[#ff6a00]">
                  {order.total.toLocaleString("ar-EG")}
                  <span className="text-[10px] font-normal text-gray-500 mr-1">ج.م</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3" /> {order.phone}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 truncate max-w-[180px] md:max-w-[300px]">
                <MapPin className="w-3 h-3" /> {order.address}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 md:gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5 shrink-0">
          <div className="hidden lg:block text-right">
            <p className="text-xl font-black text-[#ff6a00]">
              {order.total.toLocaleString("ar-EG")}
              <span className="text-xs font-normal text-gray-500 mr-1">ج.م</span>
            </p>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            <div className="relative flex-1 lg:flex-none">
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                className={`w-full lg:w-auto text-[10px] font-bold px-3 py-2 md:py-1.5 rounded-xl border appearance-none outline-none cursor-pointer pr-8 transition-all active:scale-95 ${cfg.classes}`}
              >
                {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                  <option key={val} value={val} className="bg-[#111111] text-white">{label}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
            </div>

            <button
              onClick={() => onViewDetails(order)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 text-xs md:text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 md:py-2 rounded-xl transition-all active:scale-95 whitespace-nowrap"
            >
              التفاصيل
            </button>
          </div>
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
    (state, { id, status }: { id: number, status: OrderStatus }) => 
      state.map(o => o.id === id ? { ...o, status } : o)
  );

  const handleStatusChange = useCallback(async (id: number, status: OrderStatus) => {
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
           onStatusChange={handleStatusChange}
         />
      )}
    </div>
  );
}
