import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container py-10 md:py-16">
      <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-1">Curated Collection</p>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-heading text-3xl md:text-4xl">
          Your Private<br /><em>Gallery</em>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Your gallery is empty.</p>
          <Link to="/collection" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-primary">
            Explore Collection <ArrowRight size={12} />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} showAddToCart />
            ))}
          </div>

          <div className="mt-16 bg-secondary p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl italic">Bespoke Concierge</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Your wishlist represents the beginning of a legacy. Our master horologists are available for private consultations.
              </p>
            </div>
            <button className="border border-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-foreground hover:text-background transition-colors">
              Request Consultation
            </button>
          </div>
        </>
      )}
    </div>
  );
}
