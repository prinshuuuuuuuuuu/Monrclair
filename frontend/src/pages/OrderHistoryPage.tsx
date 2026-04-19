import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  ExternalLink,
  IndianRupee,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { products as localProducts } from "@/data/products";

const statusConfig = {
  processing: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Shipped",
  },
  out_for_delivery: {
    icon: Truck,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    label: "Out for Delivery",
  },
  delivered: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "Cancelled",
  },
  refunded: {
    icon: XCircle,
    color: "text-stone-500",
    bg: "bg-stone-50",
    label: "Refunded",
  },
} as any;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.post(`/orders/${id}/cancel`, {
        reason: "User requested cancellation",
      });
      toast({ title: "Order Cancelled", description: "Success." });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Unable to cancel.",
        variant: "destructive",
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B87333]/20 border-t-[#B87333] rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20 selection:bg-[#B87333]/10">
      <div className="max-w-4xl mx-auto px-4 pt-20 sm:pt-28">
        {/* Simple Header */}
        <div className="mb-8 sm:mb-12">
          <button
            onClick={() => navigate("/profile")}
            className="group flex items-center gap-2 mb-4 text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A]/40 hover:text-[#B87333] transition-colors"
          >
            <ArrowLeft
              size={12}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Profile
          </button>
          <h1 className="font-serif text-4xl text-[#1A1A1A]">
            Orders <span className="text-[#B87333] italic">History</span>
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F0EBE3] shadow-sm">
            <Package size={32} className="text-[#B87333]/20 mx-auto mb-4" />
            <Link
              to="/collection"
              className="text-[10px] font-bold tracking-widest uppercase text-[#B87333] hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const cfg = statusConfig[order.status] || {
                icon: Package,
                color: "text-gray-500",
                bg: "bg-gray-50",
                label: order.status,
              };
              const StatusIcon = cfg.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="divide-y divide-[#F5F0EA]">
                    {order.items?.map((item: any) => {
                      const localProduct = localProducts.find(
                        (p) => String(p.id) === String(item.product_id),
                      );
                      const displayImage = localProduct?.image || item.image;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 group"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F9F6F2] rounded-xl flex-shrink-0 border border-[#F0EBE3] overflow-hidden p-2">
                            <img
                              src={displayImage}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-[15px] sm:text-base text-[#1A1A1A] truncate">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] text-[#1A1A1A]/40 font-bold uppercase">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-[#E8E0D8]">·</span>
                              <span className="text-xs text-[#B87333] font-bold flex items-center gap-0.5">
                                <IndianRupee size={10} strokeWidth={3} />
                                {parseFloat(item.price).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          <Link
                            to={`/product/${item.product_id}`}
                            className="p-2 text-[#1A1A1A]/20 hover:text-[#B87333] transition-colors"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 py-3 bg-[#FAFAF9] border-t border-[#F0EBE3] flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
                    <div
                      className={cn(
                        "flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold uppercase",
                        cfg.bg,
                        cfg.color,
                      )}
                    >
                      <StatusIcon size={12} /> {cfg.label}
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="flex-shrink-0 text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A] hover:text-[#B87333] transition-colors whitespace-nowrap">
                        Track Order
                      </button>
                      {order.status === "processing" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="flex-shrink-0 text-[10px] font-bold tracking-widest uppercase text-red-500 hover:text-red-600 transition-colors whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
