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
    <article className="group relative flex flex-col bg-surface-container rounded-2xl border border-outline-variant/20 hover:border-outline-variant/50 hover:shadow-xl hover:shadow-black/5 overflow-hidden transition-all duration-300 animate-fade-up">
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[4/5] bg-surface-container-lowest overflow-hidden flex items-center justify-center cursor-pointer group/img"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-4/5 h-4/5 object-contain transition-transform duration-700 group-hover/img:scale-110"
          onError={(e: any) => {
            e.target.src = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80";
          }}
        />
      </Link>

      <button
        onClick={handleWishlist}
        className={cn(
          "absolute top-3 right-3 w-8 h-8 rounded-full z-10 flex items-center justify-center transition-all duration-200 border border-outline-variant/20 bg-surface/80 backdrop-blur-sm",
          isWished 
            ? "text-primary fill-primary opacity-100" 
            : "opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
        )}
      >
        <Heart
          size={14}
          fill={isWished ? "currentColor" : "none"}
        />
      </button>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-headline text-base sm:text-lg font-light text-on-surface leading-snug line-clamp-2 flex-1 group-hover:text-primary transition-colors">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          
          <div className="flex items-center gap-1 bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary shrink-0">
            <IndianRupee
              size={13}
              strokeWidth={3}
              className="text-primary group-hover:text-white"
            />
            <span className="font-label text-sm font-bold tracking-tight">
              {product.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label text-[9px] uppercase tracking-widest text-[#B87333]">
            {product.brand || 'Montclair'}
          </span>
          <div className="w-1 h-1 rounded-full bg-outline-variant/50" />
          <Link 
            to={`/collection?category=${(product as any).category_slug || (product as any).category}`}
            className="font-label text-[9px] uppercase tracking-widest text-primary hover:underline"
          >
            {(product as any).category_name || 'Watch'}
          </Link>
          <div className="w-1 h-1 rounded-full bg-outline-variant/50" />
          <span className="font-label text-[9px] uppercase tracking-widest text-outline">
            {product.case_diameter}
          </span>
        </div>

        <div className="flex-1" />

        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-label text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
          >
            <ShoppingBag size={13} />
            Add to Bag
          </button>
        )}
      </div>
    </article>
  );
}
