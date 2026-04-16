import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  ChevronRight,
  ArrowLeft,
  Download,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const statusConfig = {
  processing: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Processing Acquisition",
  },
  shipped: {
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "In Transmission",
  },
  out_for_delivery: {
    icon: Truck,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    label: "Near Destination",
  },
  delivered: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Acquisition Finalized",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "Archive Terminated",
  },
  refunded: {
    icon: XCircle,
    color: "text-stone-400",
    bg: "bg-stone-50",
    label: "Investment Reverted",
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (
      !window.confirm(
        "Initialize cancellation sequence for this archival record?",
      )
    )
      return;
    try {
      await api.post(`/orders/${id}/cancel`, {
        reason: "User requested termination",
      });
      toast({
        title: "Record Updated",
        description:
          "The archival transmission has been terminated successfully.",
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Protocol Failure",
        description: error.response?.data?.message || "Archival state locked.",
        variant: "destructive",
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 max-w-sm text-center">
          <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-primary font-bold mb-2">
              Syncing Archives
            </p>
            <p className="font-headline text-lg text-black">
              Accessing acquisition history protocols...
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-32 pb-24 px-6 lg:px-20 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/profile")}
              className="group flex items-center gap-2 text-[9px] font-label uppercase tracking-widest text-[#B87333] hover:opacity-70 transition-all"
            ></button>
            <div className="space-y-2">
              <p className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary/60">
                Registry Catalog
              </p>
              <h1 className="font-headline text-5xl lg:text-6xl text-black">
                Order <em className="text-[#B87333] not-italic">History</em>
              </h1>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40"
            />
            <input
              type="text"
              placeholder="SEARCH PROCUREMENT REF..."
              className="bg-white border border-[#F0F0F0] px-12 py-4 text-[10px] font-label tracking-widest uppercase outline-none focus:border-[#B87333] w-full shadow-sm rounded-xl transition-all"
            />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 bg-white border border-[#F0F0F0] rounded-[40px] shadow-sm flex flex-col items-center gap-8">
            <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center">
              <Package size={40} className="text-secondary/20" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-2xl">No Archives Found</h3>
              <p className="text-secondary text-xs uppercase tracking-widest opacity-60">
                Your clinical procurement history is currently void.
              </p>
            </div>
            <Link
              to="/collection"
              className="bg-black text-white px-12 py-5 text-[10px] font-label tracking-widest uppercase hover:bg-[#B87333] transition-colors rounded-3xl"
            >
              Initialize First Procurement
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => {
              const config = statusConfig[order.status] || {
                icon: Package,
                color: "text-black",
                bg: "bg-[#F9F9F9]",
                label: "Status Unknown",
              };
              const StatusIcon = config.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-[#F0F0F0] rounded-[40px] overflow-hidden hover:border-[#B87333]/20 transition-all shadow-sm hover:shadow-2xl hover:shadow-[#B87333]/5 group"
                >
                  <div className="bg-[#FAFAFA] px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#F5F5F5]">
                    <div className="flex flex-wrap gap-10">
                      <div className="space-y-1">
                        <p className="font-label text-[8px] uppercase tracking-widest text-secondary/50 font-bold">
                          Protocol ID
                        </p>
                        <p className="font-headline text-base text-black">
                          #{order.id}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-label text-[8px] uppercase tracking-widest text-secondary/50 font-bold">
                          Initialization
                        </p>
                        <p className="font-body text-xs text-black font-medium">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-CH",
                            { day: "2-digit", month: "long", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-label text-[8px] uppercase tracking-widest text-secondary/50 font-bold">
                          Investment
                        </p>
                        <p className="font-headline text-base text-black">
                          CHF {parseFloat(order.total_amount).toLocaleString()}
                          .00
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex items-center gap-3 px-5 py-2.5 rounded-full text-[9px] font-label uppercase tracking-widest font-bold border",
                        config.color,
                        config.bg,
                        "border-current/10",
                      )}
                    >
                      <StatusIcon size={14} />
                      {config.label}
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="space-y-8">
                      {order.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between pb-8 border-b border-[#F9F9F9] last:border-0 last:pb-0"
                        >
                          <div className="flex gap-8 items-center flex-1">
                            <div className="w-24 h-24 bg-[#F9F9F9] p-4 rounded-3xl overflow-hidden border border-[#F0F0F0] group-hover:border-[#B87333]/20 transition-all">
                              <img
                                src={item.image}
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-headline text-xl text-black leading-tight">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-3">
                                <p className="text-[10px] font-label uppercase tracking-widest text-secondary/60">
                                  QTY: {item.quantity}
                                </p>
                                <div className="w-1 h-1 bg-[#EAEAEA] rounded-full"></div>
                                <p className="text-[10px] font-label uppercase tracking-widest text-black font-bold">
                                  Unit Ref: CHF{" "}
                                  {parseFloat(item.price).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Link
                            to={`/product/${item.product_id}`}
                            className="p-4 border border-[#F0F0F0] rounded-2xl hover:border-[#B87333] hover:text-[#B87333] transition-all flex items-center gap-2 text-[10px] font-label uppercase tracking-widest"
                          >
                            Inspect Node <ExternalLink size={14} />
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div className="mt-12 pt-10 border-t border-[#F5F5F5] flex flex-col sm:flex-row gap-6 justify-between items-center w-full">
                      <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none bg-black text-white px-10 py-5 text-[10px] font-label tracking-widest uppercase hover:bg-[#B87333] transition-colors rounded-2xl flex items-center justify-center gap-2">
                          <Truck size={14} /> Track Node
                        </button>
                        {order.status === "processing" && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="flex-1 sm:flex-none border border-red-100 text-red-400 px-10 py-5 text-[10px] font-label tracking-widest uppercase hover:bg-red-50 transition-all rounded-2xl flex items-center justify-center gap-2"
                          >
                            <XCircle size={14} /> Terminate Record
                          </button>
                        )}
                        {order.status === "delivered" && (
                          <button className="flex-1 sm:flex-none border border-[#F0F0F0] text-secondary px-10 py-5 text-[10px] font-label tracking-widest uppercase hover:bg-[#F9F9F9] transition-all rounded-2xl">
                            Request Reversion
                          </button>
                        )}
                      </div>
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
