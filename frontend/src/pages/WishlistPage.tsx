import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import {
  Heart,
  ArrowLeft,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Grid,
  Image as ImageIcon,
  Download,
  X,
  Share2,
  ArrowRight,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/store/wishlist");
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch gallery items");
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await toggleWishlist(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.product_id !== productId),
      );
      toast({
        title: "Exhibit Removed",
        description: "Item has been purged from your Private Gallery.",
      });
    } catch (error: any) {
      toast({
        title: "Protocol Failure",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    toast({
      title: "Item Projected",
      description: "Moving exhibit to procurement cart.",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fcfbf9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-[1px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="font-label text-[9px] uppercase tracking-[0.4em] text-primary/40">
            Syncing Archives
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-[#fcfbf9] min-h-screen selection:bg-primary selection:text-white pb-20">
     
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <header className="pt-28 pb-10 px-6 max-w-7xl mx-auto border-b border-primary/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary/40 font-label text-[9px] uppercase tracking-[0.2em] mb-2">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight size={10} />
              <span className="text-primary/70">Gallery</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light font-heading text-foreground tracking-tight flex items-baseline gap-3">
              Private Gallery
              <span className="text-xs font-label uppercase tracking-widest text-primary/40 font-normal">
                [{wishlist.length}]
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/collection"
              className="px-6 py-2.5 border border-primary/10 rounded-full font-label text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 animate-slide-up">
            <div className="w-16 h-16 rounded-full border border-primary/5 flex items-center justify-center mb-8 bg-white shadow-sm">
              <Heart className="text-primary/10" size={24} strokeWidth={1} />
            </div>
            <h2 className="font-heading text-2xl mb-2 text-foreground italic">
              Your gallery is currently void
            </h2>
            <p className="text-muted-foreground font-body text-xs mb-10 max-w-xs text-center opacity-70">
              Discover unique exhibits to build your personal collection.
            </p>
            <Link
              to="/collection"
              className="group flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-full font-label text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all"
            >
              Explore Collection
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-slide-up">
            {wishlist.map((item, idx) => (
              <article
                key={item.id}
                className="group relative bg-white border border-primary/5 rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(36,24,9,0.08)]"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
               
                <div className="relative aspect-square bg-[#fcfbf9] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-1000 group-hover:scale-105"
                    onError={(e: any) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80";
                    }}
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-foreground/30 hover:text-red-500 hover:bg-white transition-all shadow-sm translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-500"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={() => navigate(`/product/${item.product_id}`)}
                      className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-foreground/30 hover:text-primary hover:bg-white transition-all shadow-sm translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-500 delay-75"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-lg font-heading leading-snug group-hover:text-primary transition-colors duration-500 line-clamp-1">
                        {item.name}
                      </h3>
                    </div>
                    <p className="font-label text-[8px] text-primary/40 uppercase tracking-widest">
                      ID: {item.product_id.toString().substring(0, 10)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-primary/5">
                    <span className="font-label text-primary text-sm font-bold">
                      CHF {Number(item.price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item.product_id)}
                      className="flex items-center gap-2 text-primary font-label text-[9px] uppercase tracking-widest font-semibold hover:gap-3 transition-all duration-300"
                    >
                      Add to Cart
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

              
                <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-700"></div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
