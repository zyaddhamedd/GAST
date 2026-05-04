"use client";

import { X, ShoppingBag } from "lucide-react";
import { normalizeImagePath } from "@/lib/utils";
import { OrderStatus, PaymentMethod } from "@prisma/client";

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
  onStatusChange?: (id: number, status: OrderStatus) => void;
}

export default function OrderDrawer({ order, onClose, onStatusChange }: OrderDrawerProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-[#111111] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in duration-200" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">تفاصيل الطلب #{order.id}</h2>
            <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString("ar-EG")}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">بيانات العميل</p>
              <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 uppercase">
                {order.paymentMethod === PaymentMethod.INSTAPAY ? 'Instapay' : 'Cash on Delivery'}
              </span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{order.customerName}</p>
              <p className="text-blue-400 text-sm font-medium" dir="ltr">{order.phone}</p>
              {order.email && <p className="text-gray-400 text-sm">{order.email}</p>}
              <p className="text-gray-300 text-sm mt-2">{order.address}</p>
            </div>
          </div>

          {order.paymentMethod === PaymentMethod.INSTAPAY && order.paymentProofImage && (
            <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-3">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">إيصال الدفع (Instapay Proof)</p>
              <div className="relative aspect-video rounded-xl border border-white/10 overflow-hidden bg-black/40 group cursor-pointer">
                <a href={order.paymentProofImage} target="_blank" rel="noopener noreferrer">
                  {order.paymentProofImage && (
                    <img 
                      src={order.paymentProofImage} 
                      alt="Payment Proof" 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20">عرض الحجم الكامل</span>
                  </div>
                </a>
              </div>
              {order.status === OrderStatus.PENDING_VERIFICATION && onStatusChange && (
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => onStatusChange(order.id, OrderStatus.CONFIRMED)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-600/20"
                  >
                    قبول الدفع
                  </button>
                  <button 
                    onClick={() => onStatusChange(order.id, OrderStatus.REJECTED)}
                    className="flex-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 text-xs font-bold py-3 rounded-xl transition-all active:scale-95"
                  >
                    رفض الدفع
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">المنتجات ({order.items.length})</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/5 overflow-hidden shrink-0">
                    {item.product.images?.[0] ? (
                      <img src={normalizeImagePath(item.product.images[0].url)} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="text-gray-700"/></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{item.product.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.price.toLocaleString()} ج.م × {item.quantity}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-white font-black">{(item.price * item.quantity).toLocaleString()} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">الإجمالي الكلي</p>
              <p className="text-lg font-bold text-white">شامل الضريبة والتوصيل</p>
            </div>
            <div className="text-left">
              <span className="text-3xl font-black text-[#ff6a00]">{order.total.toLocaleString()}</span>
              <span className="text-sm text-gray-500 mr-1 font-bold">ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
