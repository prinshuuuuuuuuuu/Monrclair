import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Heart, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = products.find((p) => p.id === id);
  const [imgIndex, setImgIndex] = useState(0);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please register or login to manage your logistics.' });
      return navigate('/auth');
    }
    if (product) addToCart(product.id);
  };

  const handleWishlist = () => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please register or login to save items to your archive.' });
      return navigate('/auth');
    }
    if (product) toggleWishlist(product.id);
  };

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/collection" className="text-primary text-sm mt-4 inline-block">Back to Collection</Link>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 2);

  return (
    <div className="container py-8 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Images */}
        <div>
          <div className="relative bg-secondary aspect-square overflow-hidden">
            <img
              src={product.images[imgIndex]}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-contain p-8"
            />
            {product.images.length > 1 && (
              <>
                <button onClick={() => setImgIndex((i) => (i > 0 ? i - 1 : product.images.length - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 p-2">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setImgIndex((i) => (i < product.images.length - 1 ? i + 1 : 0))} className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 p-2">
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`w-16 h-16 bg-secondary p-1 border ${i === imgIndex ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-1">
            Precision Atelier · SKU: {product.reference}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-body">CHF {product.price.toLocaleString()}.00</span>
            {product.inStock ? (
              <span className="flex items-center gap-1 text-xs text-green-600">● In Stock</span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-destructive">● Sold Out</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          {/* Specs */}
          <div className="border-t border-border py-6 space-y-3">
            <h3 className="text-[10px] tracking-luxury uppercase font-medium mb-4">Technical Specifications</h3>
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-medium">{val}</span>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 my-6">
            <span className="font-heading text-lg">{product.rating}</span>
            <Star size={14} className="text-primary fill-primary" />
            <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-primary text-primary-foreground py-4 text-xs tracking-luxury uppercase disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {product.inStock ? 'Add to Cart' : 'Sold Out'} <ArrowRight size={14} />
            </button>
            <button
              onClick={handleWishlist}
              className="border border-border p-4 hover:border-primary transition-colors"
            >
              <Heart size={18} fill={isWished ? 'hsl(var(--primary))' : 'none'} className={isWished ? 'text-primary' : ''} />
            </button>
          </div>

          {/* Sticky mobile button */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 p-4 bg-background border-t border-border">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-luxury uppercase disabled:opacity-50"
            >
              {product.inStock ? `Add to Cart · CHF ${product.price.toLocaleString()}` : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-6">Related Archives</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
