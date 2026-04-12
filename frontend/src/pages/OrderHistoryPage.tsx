import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Package, Truck, CheckCircle, Clock, XCircle, Search, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const statusConfig = {
  processing: { icon: Clock, color: 'text-amber-500', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-blue-500', label: 'Shipped' },
  out_for_delivery: { icon: Truck, color: 'text-indigo-500', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle, color: 'text-green-500', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-500', label: 'Cancelled' },
  refunded: { icon: XCircle, color: 'text-muted-foreground', label: 'Refunded' }
} as any;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Initialize cancellation sequence?')) return;
    try {
      await api.post(`/orders/${id}/cancel`, { reason: 'User requested cancellation' });
      toast({ title: 'Cancellation Successful', description: 'The archival transmission has been terminated.' });
      fetchOrders();
    } catch (error: any) {
      toast({ title: 'Protocol Error', description: error.response?.data?.message || 'Cannot cancel at this stage.', variant: 'destructive' });
    }
  };

  if (loading) return (
    <div className="container py-20 text-center animate-pulse">
      <p className="text-[10px] tracking-luxury uppercase text-muted-foreground">Accessing Archival Data...</p>
    </div>
  );

  return (
    <div className="container py-10 md:py-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-1">Acquisition History</p>
           <h1 className="font-heading text-4xl md:text-5xl">Your <em>Archives</em></h1>
        </div>
        <div className="relative">
           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <input 
            type="text" 
            placeholder="Search Reference..."
            className="bg-secondary border border-border px-10 py-3 text-[10px] tracking-luxury uppercase outline-none focus:border-primary w-full md:w-64"
           />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 border border-dashed border-border">
          <Package size={40} className="mx-auto text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground italic mb-6">Your acquisition archive is currently empty.</p>
          <Link to="/collection" className="bg-primary text-primary-foreground px-8 py-3 text-[10px] tracking-luxury uppercase">Initialize First Acquisition</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Package;
            return (
              <div key={order.id} className="border border-border group overflow-hidden transition-all duration-500 hover:border-primary/30">
                <div className="bg-secondary/50 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-luxury uppercase">
                   <div className="flex gap-8">
                      <div>
                         <span className="text-muted-foreground">Sequence</span>
                         <p className="font-bold text-foreground">#{order.id}</p>
                      </div>
                      <div>
                         <span className="text-muted-foreground">Initialized</span>
                         <p className="text-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                         <span className="text-muted-foreground">Investment</span>
                         <p className="text-foreground">CHF {parseFloat(order.total_amount).toLocaleString()}.00</p>
                      </div>
                   </div>
                   <div className={`flex items-center gap-2 ${statusConfig[order.status]?.color}`}>
                      <StatusIcon size={14} />
                      <span className="font-bold">{statusConfig[order.status]?.label}</span>
                   </div>
                </div>

                <div className="p-8">
                   <div className="space-y-6">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex gap-6 items-center">
                           <div className="w-16 h-16 bg-secondary p-2 shrink-0">
                              <img src={item.image} className="w-full h-full object-contain" />
                           </div>
                           <div className="flex-1">
                              <h3 className="font-heading text-lg">{item.name}</h3>
                              <p className="text-[10px] tracking-luxury uppercase text-muted-foreground">
                                Quantity: {item.quantity} · Reference Unit: CHF {parseFloat(item.price).toLocaleString()}
                              </p>
                           </div>
                           <Link to={`/product/${item.product_id}`} className="p-2 border border-border hover:border-primary transition-colors">
                              <ChevronRight size={16} />
                           </Link>
                        </div>
                      ))}
                   </div>

                   <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-4 justify-between items-center">
                      <div className="flex gap-4">
                         <button className="bg-foreground text-background px-6 py-3 text-[10px] tracking-luxury uppercase hover:opacity-90 transition-opacity">Track Transmission</button>
                         {order.status === 'processing' && (
                           <button 
                            onClick={() => handleCancel(order.id)}
                            className="border border-red-200 text-red-500 px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-red-50 transition-colors"
                           >
                            Terminate Order
                           </button>
                         )}
                         {order.status === 'delivered' && (
                            <button className="border border-border text-muted-foreground px-6 py-3 text-[10px] tracking-luxury uppercase hover:bg-secondary transition-colors">Request Return</button>
                         )}
                      </div>
                      <Link to={`/checkout`} className="text-[10px] tracking-luxury uppercase text-primary border-b border-primary/20">Documentation Download</Link>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
