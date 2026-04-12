import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Props {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const addToCart = useStore((s) => s.addToCart);
  const isWished = wishlist.includes(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please register or login to save items to your archive.' });
      return navigate('/auth');
    }
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please register or login to manage your logistics.' });
      return navigate('/auth');
    }
    addToCart(product.id);
  };

  return (
    <div className="group animate-fade-in">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative bg-secondary aspect-square overflow-hidden mb-4">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-luxury uppercase px-2 py-1">
              Sale
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <Heart size={16} fill={isWished ? 'hsl(var(--primary))' : 'none'} className={isWished ? 'text-primary' : 'text-foreground'} />
          </button>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-heading text-base leading-tight hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-1">
            {product.specs.movement} · {product.specs.caseMaterial}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-primary font-body text-sm font-medium">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="block text-xs text-muted-foreground line-through">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
      {showAddToCart && (
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-primary text-primary-foreground py-3 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
