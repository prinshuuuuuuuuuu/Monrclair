import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ChevronLeft, ChevronRight, FileDown, Filter, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders');
      return data;
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      await api.put(`/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Status Synchronized', description: 'Order progression updated successfully.' });
    }
  });

  const stats = {
    totalVolume: orders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0),
    pendingCalibration: orders.filter((o: any) => o.status === 'processing').length
  };

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-primary font-bold mb-1">Registry / Transactional Logs</p>
          <h2 className="font-heading text-5xl">Order Management</h2>
        </div>
        <div className="flex gap-4">
          <button className="border border-border px-6 py-2 text-[10px] tracking-luxury uppercase flex items-center gap-2 hover:bg-secondary transition-colors">
            <FileDown size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium">Order ID</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium">Placement Date</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium">Customer Entity</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium text-right">Total Value</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium text-center">Status</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium text-right">Protocol Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              <tr><td colSpan={6} className="py-10 text-center text-xs tracking-luxury uppercase">Accessing Archives...</td></tr>
            ) : orders.map((order: any) => (
              <tr key={order.id} className="group">
                <td className="py-6 font-heading text-sm">#CP-{String(order.id).padStart(5, '0')}-X</td>
                <td className="py-6 text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="py-6 italic font-heading text-sm">{order.customer}</td>
                <td className="py-6 font-heading text-sm text-right font-bold">€{Number(order.total_amount).toLocaleString()}</td>
                <td className="py-6 text-center">
                  <select 
                    value={order.status}
                    onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                    className={cn(
                      "px-4 py-1.5 text-[10px] tracking-luxury uppercase font-medium border bg-transparent",
                      order.status === 'processing' && "text-orange-600 border-orange-100",
                      order.status === 'shipped' && "text-blue-600 border-blue-100",
                      order.status === 'delivered' && "text-green-600 border-green-100",
                      order.status === 'refunded' && "text-red-600 border-red-100",
                    )}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
                <td className="py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-secondary border border-border"><CheckCircle2 size={14} /></button>
                    <button className="p-2 hover:bg-red-50 text-red-600 border border-border"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16 grid grid-cols-3 border-t border-border pt-10">
        <div>
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">Total Monthly Volume</p>
          <span className="font-heading text-3xl">€{stats.totalVolume.toLocaleString()}</span>
        </div>
        <div className="border-x border-border px-10">
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">Pending Despatch</p>
          <span className="font-heading text-3xl">{stats.pendingCalibration} Units</span>
        </div>
      </div>
    </div>
  );
}
