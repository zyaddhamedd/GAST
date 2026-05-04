import { Package, ShoppingCart, Mail } from 'lucide-react';
import Card from '@/components/admin/Card';
import { prisma } from '@/lib/prisma';
import { getAdminStats } from '@/lib/dal';

async function getRecentOrders() {
  return await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      customerName: true,
      total: true,
      status: true,
      createdAt: true,
    }
  });
}

export default async function DashboardPage() {
  // Use cached stats for instant cold-start
  const stats = await getAdminStats();
  // Recent orders are less critical but we can fetch them in parallel
  const recentOrders = await getRecentOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Products" value={stats.products} icon={Package} />
        <Card title="Total Orders" value={stats.orders} icon={ShoppingCart} />
        <Card title="New Messages" value={stats.messages} icon={Mail} />
      </div>

      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{order.customerName}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold
                      ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                        order.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500' : 
                        order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-700 border-green-200' : 
                        'bg-gray-500/10 text-gray-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-white">${order.total.toFixed(2)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
