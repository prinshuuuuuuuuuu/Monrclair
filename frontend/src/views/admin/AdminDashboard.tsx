import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { TrendingUp, Users, ShoppingBag, Euro, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-10 text-[10px] tracking-luxury uppercase">Synchronizing Systems...</div>;
  }

  const statCards = [
    { name: 'Total Revenue', value: stats.totalSales, icon: Euro, change: '+12.5%', tendency: 'up' },
    { name: 'Order Volume', value: stats.totalOrders, icon: ShoppingBag, change: '+8.2%', tendency: 'up' },
    { name: 'Acquisition', value: stats.totalUsers, icon: Users, change: '-2.4%', tendency: 'down' },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-luxury uppercase text-primary font-bold mb-1">System Overview / Hub</p>
          <h2 className="font-heading text-5xl">Diagnostic Center</h2>
        </div>
        <div className="flex items-center gap-3 bg-secondary/50 px-6 py-3 border border-border text-[10px] tracking-luxury uppercase text-muted-foreground">
          <Clock size={14} /> Last Update: Just Now
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-background border border-border p-8 hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                  <Icon size={20} className="group-hover:text-primary transition-colors" />
                </div>
                <div className={cn(
                  "flex items-center text-[10px] tracking-luxury uppercase font-bold",
                  stat.tendency === 'up' ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change} {stat.tendency === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
              </div>
              <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-1 font-medium">{stat.name}</p>
              <span className="font-heading text-4xl block">
                {stat.name.includes('Revenue') ? `€${Number(stat.value).toLocaleString()}` : stat.value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Orders */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading text-2xl">Recent Transmissions</h3>
            <button className="text-[10px] tracking-luxury uppercase text-primary hover:underline">See Registry</button>
          </div>
          <div className="border border-border">
            {stats.recentOrders.map((order: any, i: number) => (
              <div key={order.id} className={cn(
                "p-5 flex items-center justify-between group hover:bg-secondary/20 transition-colors",
                i !== stats.recentOrders.length - 1 && "border-b border-border"
              )}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center font-heading text-[10px]">
                    #{order.id}
                  </div>
                  <div>
                    <p className="font-heading text-sm">{order.customer}</p>
                    <p className="text-[10px] tracking-luxury uppercase text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-sm font-bold">€{Number(order.total_amount).toLocaleString()}</p>
                  <p className={cn(
                    "text-[10px] tracking-luxury uppercase font-bold",
                    order.status === 'delivered' ? "text-green-600" : "text-orange-600"
                  )}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Products */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading text-2xl">High Frequency Units</h3>
            <button className="text-[10px] tracking-luxury uppercase text-primary hover:underline">View Analytics</button>
          </div>
          <div className="space-y-6">
            {stats.topProducts.map((product: any) => (
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] tracking-luxury uppercase font-medium">
                  <span>{product.name}</span>
                  <span className="text-muted-foreground">{product.sold} Despatched</span>
                </div>
                <div className="h-1 bg-secondary w-full">
                  <div 
                    className="h-full bg-[#B87333]" 
                    style={{ width: `${Math.min(100, (product.sold / stats.topProducts[0].sold) * 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
