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
    <article className="group relative flex flex-col bg-white rounded-2xl border border-[#EEEEEE] hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl">
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full aspect-square bg-[#FBFBFB] overflow-hidden group/img"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.01] to-transparent" />
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover/img:scale-110"
          onError={(e: any) => {
            e.target.src = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80";
          }}
        />
        
        {/* Detail Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-foreground/40 border border-[#F0F0F0] opacity-0 group-hover:opacity-100 transition-opacity">
          Ref. {product.id.toString().padStart(4, '0')}
        </div>
      </Link>

      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-3 right-3 w-8 h-8 rounded-full z-10 flex items-center justify-center transition-all duration-300",
          isWished 
            ? "bg-primary text-white" 
            : "bg-white/60 backdrop-blur-md text-foreground/30 hover:text-red-500 opacity-0 group-hover:opacity-100"
        )}
      >
        <Heart size={14} fill={isWished ? "currentColor" : "none"} />
      </button>

      <div className="flex flex-col p-4 gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
            {product.brand || 'Montclair'}
          </p>
          <h3 className="text-sm font-heading font-medium leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-primary">₹</span>
            <span className="text-base font-semibold tracking-tight">
              {product.price.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-widest">
            {product.case_diameter}
          </span>
        </div>

        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 mt-1"
          >
            <ShoppingBag size={12} />
            Add to Bag
          </button>
        )}
      </div>
    </article>
  );
}
