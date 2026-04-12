import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/data/products';

const categories = [
  { name: 'Classic', desc: 'Timeless elegance', href: '/collection?category=classic' },
  { name: 'Sport', desc: 'Built for performance', href: '/collection?category=sport' },
  { name: 'Premium', desc: 'Haute horlogerie', href: '/collection?category=premium' },
];

const testimonials = [
  { name: 'Alexander V.', date: '12.04.24', text: '"The tension between the brushed steel and the copper hands is masterfully executed. A true technical marvel."', rating: 5 },
  { name: 'Catherine M.', date: '08.02.24', text: '"Impeccable craftsmanship. The moonphase complication is mesmerizing — a piece that commands attention."', rating: 5 },
  { name: 'James R.', date: '15.01.24', text: '"From the packaging to the weight on the wrist, every detail speaks of uncompromising quality."', rating: 5 },
];

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  
  const featured = products.filter((p: Product) => p.featured);
  const trending = products.filter((p: Product) => p.trending);

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-xs tracking-luxury uppercase">Synchronizing Instruments...</p>
      </div>
    );
  }


  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <img src={heroBg} alt="Montclair movement" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative container h-full flex flex-col justify-end pb-16 md:pb-24">
          <h1 className="font-heading text-4xl md:text-7xl text-background leading-tight max-w-xl">
            The Horology<br />
            <em>Collection.</em>
          </h1>
          <p className="text-[11px] tracking-luxury uppercase text-background/70 mt-4">
            Clinical Precision & Asymmetric Equilibrium
          </p>
          <Link
            to="/collection"
            className="mt-8 inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase w-fit hover:opacity-90 transition-opacity"
          >
            Explore Collection <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-20">
        <h2 className="text-xs tracking-luxury uppercase text-muted-foreground mb-10">Collections</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="group border border-border p-8 hover:border-primary transition-colors"
            >
              <h3 className="font-heading text-2xl">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{cat.desc}</p>
              <span className="inline-flex items-center gap-2 mt-6 text-xs tracking-luxury uppercase text-primary group-hover:gap-3 transition-all">
                Discover <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-2xl md:text-3xl">Featured Instruments</h2>
          <Link to="/collection" className="text-xs tracking-luxury uppercase text-primary hover:opacity-70 transition-opacity">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {featured.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="bg-secondary py-20">
        <div className="container">
          <h2 className="font-heading text-2xl md:text-3xl mb-10">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} showAddToCart />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <h2 className="font-heading text-2xl md:text-3xl mb-10">Provenance & Feedback</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-body font-medium tracking-luxury uppercase">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.date}</span>
              </div>
              <p className="font-heading text-sm italic leading-relaxed">{t.text}</p>
              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-primary text-xs">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-foreground text-background py-20">
        <div className="container max-w-lg text-center">
          <h2 className="font-heading text-2xl md:text-3xl mb-3">Join the Archive</h2>
          <p className="text-sm text-background/60 mb-8">Receive exclusive previews of new instruments and private collection events.</p>
          <form className="flex gap-0" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-background/20 px-4 py-3 text-sm text-background placeholder:text-background/40 outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
