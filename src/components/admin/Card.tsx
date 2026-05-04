export default function Card({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: any;
  trend?: string;
}) {
  return (
    <div className="bg-[#111111] p-6 rounded-2xl border border-white/5 shadow-sm hover:shadow-2xl transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-semibold text-white">{value}</h3>
          {trend && (
            <p className="text-sm font-medium text-green-500 mt-2">
              {trend}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
