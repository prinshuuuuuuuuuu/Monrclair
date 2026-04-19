import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Truck, 
  Lock, 
  RotateCcw, 
  Headphones, 
  Award, 
  Star, 
  Mail,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Zap,
  Flame,
  Clock
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";
import useEmblaCarousel from 'embla-carousel-react';

const slides = [
  {
    image: "/hero-luxury-1.png",
    title: "Timeless Style, Modern Precision",
    subtitle: "Explore premium watches at best prices",
    cta1: "Shop Now",
    cta2: "Explore Collection"
  },
  {
    image: "/hero-luxury-2.png",
    title: "Engineered Excellence",
    subtitle: "Mastering the Art of Mechanical Perfection",
    cta1: "Shop Now",
    cta2: "View Technical Specs"
  },
  {
    image: "/hero-luxury-3.png",
    title: "The Heritage Legacy",
    subtitle: "A Testament to Horological Purity",
    cta1: "Discover",
    cta2: "Our Story"
  },
];

const categories = [
  { name: "Men Watches", img: "/cat-men.png", href: "/collection?category=men" },
  { name: "Women Watches", img: "/cat-women.png", href: "/collection?category=women" },
  { name: "Smart Watches", img: "/cat-smart.png", href: "/collection?category=smart" },
  { name: "Luxury Watches", img: "/cat-luxury.png", href: "/collection?category=luxury" },
  { name: "Sports Watches", img: "/cat-sport.png", href: "/collection?category=sport" },
];

const trustPoints = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders above ₹5,000" },
  { icon: Lock, title: "Secure Payment", desc: "100% protected payments" },
  { icon: RotateCcw, title: "Easy Returns", desc: "15-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated expert help" },
  { icon: Award, title: "Premium Quality", desc: "Certified authentic brands" },
];

const testimonials = [
  { name: "Arjun Sharma", text: "The quality of the Montclair Heritage is beyond words. A truly premium experience from ordering to unboxing.", rating: 5 },
  { name: "Priya Patel", text: "Finally found a place that offers authentic luxury watches with great customer service in India.", rating: 5 },
  { name: "Vikram Singh", text: "The Smart watch I bought is sleek and functional. Delivery was super fast too!", rating: 4 },
];

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"new" | "bestseller" | "trending">("new");
  const [timeLeft, setTimeLeft] = useState({ days: 10, hrs: 15, mins: 42, secs: 30 });
  
  // Carousel for New Arrivals
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { ...prev, hrs: prev.hrs - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hrs: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countdown);
    };
  }, []);

  // Filter logic
  const filteredProducts = products.filter(p => {
    if (activeFilter === "new") return true; 
    if (activeFilter === "bestseller") return p.rating >= 4.8;
    if (activeFilter === "trending") return p.trending;
    return true;
  }).slice(0, 8);

  const newArrivals = products.slice(0, 10); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary tracking-widest uppercase text-xs font-bold">Monclair Horology</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? "scale(1.1)" : "scale(1)"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            <div className="relative container h-full flex flex-col justify-center items-start pt-20">
              <div className={cn(
                "max-w-2xl transition-all duration-1000 delay-300 transform",
                index === currentSlide ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              )}>
                <h1 className="text-5xl md:text-8xl font-heading text-white leading-[1.1] mb-6 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 font-light tracking-wide max-w-lg">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/collection"
                    className="bg-primary text-primary-foreground px-8 py-4 text-sm font-label font-bold tracking-widest uppercase hover:bg-white hover:text-primary transition-all flex items-center gap-2 group"
                  >
                    {slide.cta1} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/collection"
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 text-sm font-label font-bold tracking-widest uppercase hover:bg-white/20 transition-all"
                  >
                    {slide.cta2}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Scroll Discovery Indicator */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center gap-4 z-20">
          <span className="[writing-mode:vertical-lr] text-[10px] uppercase tracking-[0.4em] text-white/40 font-label">Scroll to Discover</span>
          <div className="w-px h-16 bg-gradient-to-t from-primary via-white/20 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[move-down_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* 3. Categories Section */}
      <section className="py-24 container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-heading mb-4">Curated Collections</h2>
            <p className="text-muted-foreground">Discover the perfect timepiece for every occasion, from heritage classics to modern performance.</p>
          </div>
          <Link to="/collection" className="text-primary font-label font-bold tracking-widest uppercase text-sm flex items-center gap-2 group">
            View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              to={cat.href}
              className="group relative aspect-[4/5] overflow-hidden bg-secondary"
            >
              <img 
                src={cat.img} 
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-xs font-label tracking-[0.3em] uppercase mb-1 opacity-70">Shop</p>
                <h3 className="text-lg font-heading font-medium tracking-wide">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Showcase Marquee */}
      <section className="py-12 border-y border-border/50 bg-secondary/10 overflow-hidden relative group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-marquee whitespace-nowrap gap-12 sm:gap-24 group-hover:[animation-play-state:paused] items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 sm:gap-24 items-center">
              {[
                { name: "Rolex", logo: "/Rolex.png", isPremium: true },
                { name: "Titan", logo: "/titan.webp" },
                { name: "Casio", logo: "/Casio.avif" },
                { name: "Timex", logo: "/Timex.png" },
                { name: "Fossil", logo: "/Fossil.webp" },
                { name: "Fastrack", logo: "/Fastract.webp" }
              ].map((brand) => (
                <div key={brand.name} className="flex flex-col items-center gap-4 py-8">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                    {/* Rounded Logo Container */}
                    <div className="w-full h-full rounded-full bg-white border border-border/40 shadow-lg flex items-center justify-center p-8 overflow-hidden">
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {brand.isPremium && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full z-20 shadow-lg">
                        Premium
                      </div>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-label font-bold uppercase tracking-[0.3em] text-foreground opacity-60">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trending / Featured Products */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading mb-8">Premium Timepieces</h2>
            
            <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar">
              {[
                { id: "new", label: "New Arrivals", icon: Zap },
                { id: "bestseller", label: "Best Sellers", icon: Star },
                { id: "trending", label: "Trending", icon: Flame }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-xs font-label tracking-widest uppercase font-bold transition-all border shrink-0",
                    activeFilter === filter.id 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  )}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showAddToCart />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/collection"
              className="inline-flex items-center gap-3 border-2 border-primary text-primary px-10 py-5 text-sm font-label font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all"
            >
              Explore Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Special Offers Banner */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden bg-black text-white p-12 md:p-24 group">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <span className="w-12 h-px bg-primary/50" />
                  <span className="text-[10px] font-label tracking-[0.4em] uppercase font-bold text-primary">Limited Procurement Window</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-heading mb-8 leading-[1.1]">The Platinum<br/>Standard</h2>
                <p className="text-lg text-white/60 mb-10 font-light italic leading-relaxed max-w-lg">“Horology is the fusion of engineering discipline and artistic expression. Access our most prestigious calibers at an exceptional acquisition value.”</p>
                
                <div className="flex justify-center md:justify-start gap-3 mb-12">
                  <CountdownBox value={timeLeft.days} unit="Days" />
                  <CountdownBox value={timeLeft.hrs} unit="Hrs" />
                  <CountdownBox value={timeLeft.mins} unit="Mins" />
                  <CountdownBox value={timeLeft.secs} unit="Secs" />
                </div>
                
                <Link 
                  to="/collection?category=luxury"
                  className="inline-block bg-primary text-white px-12 py-5 text-xs font-label font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20"
                >
                  Explore The Collection
                </Link>
              </div>
              
              <div className="relative w-full max-w-md aspect-square lg:scale-125">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <img 
                  src="/hero-luxury-2.png" 
                  alt="Promo Watch" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us */}
      <section className="py-24 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-background border flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500">
                  <point.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg mb-2 tracking-wide uppercase">{point.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-4">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. New Arrivals Carousel */}
      <section className="py-24 overflow-hidden">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary text-xs font-label tracking-widest uppercase font-bold mb-2 block">Just Landed</span>
              <h2 className="text-4xl font-heading">New Arrivals</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={scrollPrev}
                className="p-3 border hover:border-primary hover:text-primary transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={scrollNext}
                className="p-3 border hover:border-primary hover:text-primary transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex gap-6">
              {newArrivals.map((product) => (
                <div key={product.id} className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_22%] min-w-0">
                  <div className="relative group">
                    <ProductCard product={product} />
                    <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-label font-bold tracking-widest uppercase px-3 py-1 pointer-events-none">
                      NEW
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews */}
      <section className="py-24 bg-black text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading mb-6">Customer Voices</h2>
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={cn("w-4 h-4", j < t.rating ? "fill-primary text-primary" : "text-white/20")} />
                  ))}
                </div>
                <p className="text-lg italic text-white/80 mb-8 font-light">"{t.text}"</p>
                <p className="text-xs font-label tracking-widest uppercase font-bold text-primary">{t.name}</p>
                <p className="text-[10px] font-label text-white/40 mt-1 uppercase tracking-tighter">Verified Purchase</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-12 h-12 mx-auto mb-8 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-heading mb-6 uppercase tracking-wider">Join the Elite Circle</h2>
            <p className="text-lg mb-12 opacity-90 font-light">Get latest offers & new arrivals directly in your inbox. Be the first to hear about our limited editions.</p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-white/10 border-2 border-primary-foreground/20 px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button className="bg-white text-primary px-10 py-4 font-label font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all whitespace-nowrap shadow-xl">
                Subscribe
              </button>
            </form>
            <p className="mt-6 text-[10px] font-label opacity-60 uppercase tracking-[0.2em]">By subscribing, you agree to our Privacy Policy</p>
          </div>
        </div>
      </section>
      
      <div className="h-20" />
    </div>
  );
}

function CountdownBox({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 p-4 min-w-[70px]">
      <span className="text-2xl font-heading font-bold">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] font-label tracking-widest uppercase opacity-60 mt-1">{unit}</span>
    </div>
  );
}
