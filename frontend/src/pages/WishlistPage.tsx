import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Heart, ArrowLeft, Trash2, ShoppingBag, ExternalLink, Grid, Image as ImageIcon, Download, X, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

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
      const { data } = await api.get('/store/wishlist');
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch gallery items');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await toggleWishlist(productId);
      fetchWishlist();
      toast({ title: 'Exhibit Removed', description: 'Item has been purged from your Private Gallery.' });
    } catch (error: any) {
      toast({ title: 'Protocol Failure', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    toast({ title: 'Item Projected', description: 'Moving exhibit to procurement cart.' });
  };

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="pt-32 pb-24 min-h-screen max-w-7xl mx-auto px-8 animate-fade-in">
      {/* Dynamic Header from User Snippet */}
      <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-2xl">
          <div className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-4">Curated Collection</div>
          <h1 className="text-6xl md:text-7xl font-light tracking-tight leading-none text-on-surface font-headline">
            Your Private <br /><span className="italic">Gallery</span>
          </h1>
        </div>
        <button className="bg-white/70 backdrop-blur-xl px-8 py-3 flex items-center gap-3 border border-outline-variant/30 hover:bg-white/90 transition-all duration-300 active:scale-95 group">
          <Share2 size={16} className="text-secondary" />
          <span className="font-label text-[10px] uppercase tracking-widest font-medium">Share Collection</span>
        </button>
      </header>

      <div className="w-full h-[1px] bg-outline-variant/20 mb-20"></div>

      {wishlist.length === 0 ? (
        <div className="text-center py-40 border border-dashed border-outline-variant/30 rounded-3xl">
          <p className="font-headline text-3xl mb-8 opacity-40 italic text-on-surface">Your gallery is currently void.</p>
          <Link to="/collection" className="bg-primary text-white px-10 py-4 font-label text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">Explore Archives</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
          {wishlist.map((item) => (
            <article key={item.id} className="flex flex-col group animate-fade-up">
              <div className="aspect-[4/5] bg-surface-container-lowest overflow-hidden mb-8 flex items-center justify-center relative border border-transparent group-hover:border-outline-variant/30 transition-all duration-500">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-4/5 h-4/5 object-contain transition-transform duration-1000 group-hover:scale-105"
                  onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80"; }}
                />
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500"
                >
                  <X size={20} className="text-outline" />
                </button>
              </div>

              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-light font-headline">{item.name}</h3>
                <span className="font-label text-primary text-sm font-medium">CHF {Number(item.price).toLocaleString()}</span>
              </div>

              <p className="font-label text-[10px] text-outline uppercase tracking-tighter mb-6">Archive ID: #{item.product_id}</p>

              <button
                onClick={() => handleAddToCart(item.product_id)}
                className="w-full bg-primary py-4 text-white font-label text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#894d0d]/90 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Bespoke Concierge Section from User Snippet */}
      <section className="mt-40 bg-zinc-50 p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-outline-variant/20">
        <div className="flex-1">
          <h2 className="text-4xl mb-4 italic font-headline">Bespoke Concierge</h2>
          <p className="text-on-surface-variant max-w-md font-light leading-relaxed font-body">Your wishlist represents the beginning of a legacy. Our master horologists are available for private consultations regarding your selected pieces.</p>
        </div>
        <button className="border border-outline px-12 py-4 font-label text-[11px] uppercase tracking-[0.2em] hover:bg-on-surface hover:text-white transition-all duration-500">
          Request Consultation
        </button>
      </section>
    </main>
  );
}
