import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Activity,
  ArrowRight,
  Package,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${Number(stats.totalSales).toLocaleString()}`,
      icon: IndianRupee,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Order Volume",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrdersCount,
      icon: AlertCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Cancelled",
      value: stats.cancelledOrdersCount,
      icon: XCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tighter text-[#1e293b] dark:text-white">
          Dashboard <span className="text-primary italic">Overview</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your store's performance and key order metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-[#64748b] font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-[#0f172a] mt-1">{stat.value}</h3>
              </div>
              <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", stat.bgColor)}>
                <stat.icon className={stat.color} size={28} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-muted/5 rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-none shadow-premium overflow-hidden bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-muted/20 border-b border-muted/30">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Recent Orders
              </CardTitle>
              <p className="text-xs text-muted-foreground">Showing the latest store activity.</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-primary hover:bg-primary/5" asChild>
              <Link to="/admin/orders">View All <ArrowRight size={14} /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-black font-bold">Order</TableHead>
                  <TableHead className="text-black font-bold">Customer</TableHead>
                  <TableHead className="text-black text-center font-bold">Status</TableHead>
                  <TableHead className="text-black text-right font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((order: any) => (
                  <TableRow key={order.id} className="group hover:bg-muted/30 transition-colors border-muted/20">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">#{order.id}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock size={10} /> {format(new Date(order.created_at), "MMM dd, HH:mm")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">{order.customer.charAt(0)}</div>
                         <span className="font-medium text-sm truncate max-w-[120px]">{order.customer}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold text-[9px] uppercase tracking-wider px-2 py-0",
                          order.status === "delivered" ? "border-emerald-500 text-emerald-600 bg-emerald-50" : 
                          order.status === "cancelled" ? "border-rose-500 text-rose-600 bg-rose-50" :
                          "border-amber-500 text-amber-600 bg-amber-50"
                        )}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">₹{Number(order.total_amount).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-none shadow-premium overflow-hidden bg-background/50 backdrop-blur-sm">
           <CardHeader className="pb-4 bg-muted/20 border-b border-muted/30">
             <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Top Products
             </CardTitle>
             <p className="text-xs text-muted-foreground">Highest selling items by volume.</p>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-muted/20">
                 {stats.topProducts.map((product: any, idx: number) => (
                   <div key={idx} className="p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-300 italic">0{idx+1}</div>
                      <div className="flex-1 min-w-0">
                         <p className="font-bold text-sm truncate text-slate-900">{product.name}</p>
                         <p className="text-xs text-slate-500">{product.sold} units sold</p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500">
                         <TrendingUp size={12} />
                         <span className="text-[10px] font-black">TOP</span>
                      </div>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
