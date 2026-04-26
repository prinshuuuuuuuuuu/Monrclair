import { Link } from "react-router-dom";
import { Heart, ShoppingBag, IndianRupee } from "lucide-react";
import { Product } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const addToCart = useStore((s) => s.addToCart);
  
  const productId = String(product.id);
  const isWished = wishlist.includes(productId);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please register or login to save items to your archive.",
      });
      return navigate("/auth");
    }
    toggleWishlist(productId);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please register or login to manage your logistics.",
      });
      return navigate("/auth");
    }
    addToCart(productId);
    toast({
      title: "Success",
      description: "Added to your procurement bag.",
    });
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-3xl border border-[#F0F0F0] hover:border-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 animate-fade-up">
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square sm:aspect-[4/5] bg-[#F9F9F9] overflow-hidden flex items-center justify-center cursor-pointer group/img"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.02]" />
        <img
          src={product.image}
          alt={product.name}
          className="w-[65%] h-[65%] object-contain transition-transform duration-1000 group-hover/img:scale-110 drop-shadow-2xl"
          onError={(e: any) => {
            e.target.src = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80";
          }}
        />
        
        {/* Quick View Overlay (Desktop only) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
           <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             Explore Details
           </span>
        </div>
      </Link>

      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-4 right-4 w-9 h-9 rounded-full z-10 flex items-center justify-center transition-all duration-300",
          isWished 
            ? "bg-primary text-white shadow-lg" 
            : "bg-white/80 backdrop-blur-md text-foreground/40 border border-[#F0F0F0] hover:text-red-500 hover:border-red-100 hover:bg-red-50 opacity-0 group-hover:opacity-100"
        )}
      >
        <Heart
          size={16}
          fill={isWished ? "currentColor" : "none"}
        />
      </button>

      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3 sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-label text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-primary">
              {product.brand || 'Montclair'}
            </span>
            <span className="w-1 h-1 rounded-full bg-primary/20" />
            <span className="font-label text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {(product as any).category_name || 'Watch'}
            </span>
          </div>
          <h3 className="font-heading text-sm sm:text-base font-medium text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-primary">₹</span>
            <span className="font-body text-base sm:text-lg font-semibold tracking-tight">
              {product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 opacity-40">
             <span className="text-[8px] font-bold uppercase tracking-widest">{product.case_diameter}</span>
          </div>
        </div>

        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-xl font-label text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-primary hover:text-white transition-all duration-300 mt-2"
          >
            <ShoppingBag size={12} />
            Acquire
          </button>
        )}
      </div>
    </article>
  );
}
