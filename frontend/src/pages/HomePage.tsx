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
  Clock,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useBanners, useTestimonials, useBrands, useServices } from "@/hooks/useModules";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";
import useEmblaCarousel from "embla-carousel-react";

const FALLBACK_SLIDES = [
  {
    image: "/hero-luxury-1.png",
    title: "Timeless Style, Modern Precision",
    subtitle: "Explore premium watches at best prices",
    cta1: "Shop Now",
    cta2: "Explore Collection",
  },
  {
    image: "/hero-luxury-2.png",
    title: "Engineered Excellence",
    subtitle: "Mastering the Art of Mechanical Perfection",
    cta1: "Shop Now",
    cta2: "View Technical Specs",
  },
  {
    image: "/hero-luxury-3.png",
    title: "The Heritage Legacy",
    subtitle: "A Testament to Horological Purity",
    cta1: "Discover",
    cta2: "Our Story",
  },
];

const FALLBACK_CATEGORIES = [
  { name: "Men Watches", img: "/cat-men.png", href: "/collection?category=men-watches" },
  { name: "Women Watches", img: "/cat-women.png", href: "/collection?category=women-watches" },
  { name: "Smart Watches", img: "/cat-smart.png", href: "/collection?category=smart-watches" },
  { name: "Luxury Watches", img: "/cat-luxury.png", href: "/collection?category=luxury-watches" },
  { name: "Sports Watches", img: "/cat-sport.png", href: "/collection?category=sports-watches" },
];

const FALLBACK_TRUST = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders above ₹5,000" },
  { icon: Lock, title: "Secure Payment", desc: "100% protected payments" },
  { icon: RotateCcw, title: "Easy Returns", desc: "15-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated expert help" },
  { icon: Award, title: "Premium Quality", desc: "Certified authentic brands" },
];

const FALLBACK_TESTIMONIALS = [
  { name: "Arjun Sharma", text: "The quality of the Montclair Heritage is beyond words. A truly premium experience from ordering to unboxing.", rating: 5 },
  { name: "Priya Patel", text: "Finally found a place that offers authentic luxury watches with great customer service in India.", rating: 5 },
  { name: "Vikram Singh", text: "The Smart watch I bought is sleek and functional. Delivery was super fast too!", rating: 4 },
];

const ICON_MAP = {
  'Truck': Truck, 'Lock': Lock, 'RotateCcw': RotateCcw, 'Headphones': Headphones, 'Award': Award, 'Star': Star
};

export default function HomePage() {
  const { data: dbProducts = [], isLoading: pLoad } = useProducts();
  const { data: rawBanners } = useBanners();
  const { data: rawTestimonials } = useTestimonials();
  const { data: rawBrands } = useBrands();
  const { data: rawServices } = useServices();
  const { data: rawCategories } = useQuery({ queryKey: ['categories'], queryFn: async () => { const res = await api.get('/categories'); return res.data || []; }});

  const products = dbProducts;
  const slides = (rawBanners && rawBanners.length > 0) ? rawBanners.map((b: any) => ({ image: b.image_url, title: b.title, subtitle: b.subtitle, cta1: b.cta_1_text, cta2: b.cta_2_text })) : FALLBACK_SLIDES;
  const categories = (rawCategories?.data && rawCategories.data.length > 0) 
    ? rawCategories.data.map((c: any) => {
        const slugValue = c.slug || c.name.toLowerCase().replace(/\s+/g, '-');
        return { 
          name: c.name, 
          img: c.image_url || c.image || FALLBACK_CATEGORIES[0].img, 
          href: `/collection?category=${slugValue}` 
        };
      }) 
    : FALLBACK_CATEGORIES;
  const testimonials = (rawTestimonials && rawTestimonials.length > 0) ? rawTestimonials.map((t: any) => ({ name: t.user_name, text: t.content, rating: Math.round(t.rating) })) : FALLBACK_TESTIMONIALS;
  const trustPoints = (rawServices && rawServices.length > 0) ? rawServices.map((s: any) => ({ icon: ICON_MAP[s.icon_name as keyof typeof ICON_MAP] || Star, title: s.title, desc: s.description })) : FALLBACK_TRUST;
  const brandList = (rawBrands && rawBrands.length > 0) ? rawBrands.map((b: any) => ({ name: b.name, logo: b.logo_url, isPremium: b.is_premium === 1 })) : [
    { name: "Rolex", logo: "/Rolex.png", isPremium: true }, { name: "Titan", logo: "/titan.webp" }, { name: "Casio", logo: "/Casio.avif" }, { name: "Timex", logo: "/Timex.png" }, { name: "Fossil", logo: "/Fossil.webp" }, { name: "Fastrack", logo: "/Fastract.webp" }
  ];

  const isLoading = pLoad;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState<
    "new" | "bestseller" | "trending"
  >("new");
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hrs: 15,
    mins: 42,
    secs: 30,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0)
          return { ...prev, hrs: prev.hrs - 1, mins: 59, secs: 59 };
        if (prev.days > 0)
          return { ...prev, days: prev.days - 1, hrs: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countdown);
    };
  }, []);

  const filteredProducts = products
    .filter((p) => {
      if (activeFilter === "new") return true;
      if (activeFilter === "bestseller") return p.rating >= 4.8;
      if (activeFilter === "trending") return p.trending;
      return true;
    })
    .slice(0, 8);

  const newArrivals = products.slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary tracking-widest uppercase text-xs font-bold">
            Montclair Horology
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground overflow-hidden">
      <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? "scale(1.1)" : "scale(1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            <div className="relative container h-full flex flex-col justify-center items-start pt-20">
              <div
                className={cn(
                  "max-w-2xl transition-all duration-1000 delay-300 transform",
                  index === currentSlide
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-12 opacity-0",
                )}
              >
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
                    {slide.cta1}{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      </section>

      <section className="py-24 container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-heading mb-4">
              Curated Collections
            </h2>
            <p className="text-muted-foreground">
              Discover the perfect timepiece for every occasion, from heritage
              classics to modern performance.
            </p>
          </div>
          <Link
            to="/collection"
            className="text-primary font-label font-bold tracking-widest uppercase text-sm flex items-center gap-2 group"
          >
            View All Categories{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                <p className="text-xs font-label tracking-[0.3em] uppercase mb-1 opacity-70">
                  Shop
                </p>
                <h3 className="text-lg font-heading font-medium tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 border-y border-border/50 bg-secondary/10 overflow-hidden relative group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap gap-12 sm:gap-24 group-hover:[animation-play-state:paused] items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 sm:gap-24 items-center">
              {brandList.map((brand) => (
                <div
                  key={brand.name}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36">
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
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading mb-8">
              Premium Timepieces
            </h2>

            <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar">
              {[
                { id: "new", label: "New Arrivals", icon: Zap },
                { id: "bestseller", label: "Best Sellers", icon: Star },
                { id: "trending", label: "Trending", icon: Flame },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-xs font-label tracking-widest uppercase font-bold transition-all border shrink-0",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50",
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
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden bg-black text-white p-12 md:p-24 group">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-1000" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <span className="w-12 h-px bg-primary/50" />
                  <span className="text-[10px] font-label tracking-[0.4em] uppercase font-bold text-primary">
                    Limited Procurement Window
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-heading mb-8 leading-[1.1]">
                  The Platinum
                  <br />
                  Standard
                </h2>
                <p className="text-lg text-white/60 mb-10 font-light italic leading-relaxed max-w-lg">
                  “Horology is the fusion of engineering discipline and artistic
                  expression. Access our most prestigious calibers at an
                  exceptional acquisition value.”
                </p>

                <div className="flex justify-center md:justify-start gap-3 mb-12">
                  <CountdownBox value={timeLeft.days} unit="Days" />
                  <CountdownBox value={timeLeft.hrs} unit="Hrs" />
                  <CountdownBox value={timeLeft.mins} unit="Mins" />
                  <CountdownBox value={timeLeft.secs} unit="Secs" />
                </div>

                <Link
                  to="/collection?category=luxury-watches"
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
      <section className="py-24 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {trustPoints.map((point, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-background border flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500">
                  <point.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg mb-2 tracking-wide uppercase">
                  {point.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-4">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 overflow-hidden">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary text-xs font-label tracking-widest uppercase font-bold mb-2 block">
                Just Landed
              </span>
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
                <div
                  key={product.id}
                  className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_22%] min-w-0"
                >
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

      <section className="py-16 bg-zinc-50 text-zinc-900 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-12 max-w-xl mx-auto">
            <span className="text-primary text-[10px] font-label tracking-[0.4em] uppercase font-bold mb-3 block">
              Testimonials
            </span>
            <h2 className="text-2xl md:text-3xl font-heading mb-4 tracking-tight">
              Customer Voices
            </h2>
            <div className="flex justify-center gap-1 mb-4 opacity-80">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-primary text-primary"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="group relative bg-white border border-zinc-200/60 p-8 lg:p-10 rounded-2xl flex flex-col items-center text-center hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-primary/20 transition-all duration-700 overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />

                <span className="text-4xl font-serif text-primary/5 absolute top-6 left-8 italic pointer-events-none group-hover:text-primary/10 transition-colors">
                  &ldquo;
                </span>

                <div className="mb-6 flex gap-1 transform group-hover:scale-105 transition-transform duration-500">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "w-3.5 h-3.5 transition-colors duration-500",
                        j < t.rating
                          ? "fill-primary text-primary"
                          : "text-zinc-200",
                      )}
                    />
                  ))}
                </div>

                <p className="text-sm italic text-zinc-600 mb-8 font-light leading-relaxed relative z-10">
                  {t.text}
                </p>

                <div className="mt-auto">
                  <div className="w-8 h-[2px] bg-primary/30 mx-auto mb-4 group-hover:w-16 transition-all duration-700" />
                  <p className="text-[11px] font-label tracking-[0.2em] uppercase font-bold text-zinc-900 mb-1">
                    {t.name}
                  </p>
                  <p className="text-[9px] font-label text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <span className="w-1 h-1 bg-green-500 rounded-full" />
                    Verified Purchase
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-primary text-primary-foreground relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black/20" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-6">
              <Mail className="w-5 h-5 opacity-90" />
            </div>

            <h2 className="text-2xl md:text-4xl font-heading mb-4 uppercase tracking-wider leading-tight">
              Join the <span className="opacity-70 italic">Elite Circle</span>
            </h2>
            <p className="text-xs md:text-sm mb-8 opacity-80 font-light leading-relaxed max-w-lg mx-auto">
              Experience the pinnacle of horology. Receive exclusive updates on
              rare acquisitions and private collection previews.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto bg-white/5 backdrop-blur-md border border-white/20 p-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Official Email Address"
                className="flex-1 bg-transparent px-5 py-3 text-white placeholder:text-white/40 focus:outline-none font-label text-[10px] tracking-widest uppercase w-full"
                required
              />
              <button className="bg-white text-primary px-8 py-3 font-label font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all whitespace-nowrap text-[10px]">
                Subscribe
              </button>
            </form>

            <p className="mt-6 text-[8px] font-label uppercase tracking-[0.3em] opacity-40">
              Privacy Protected & Secure Subscription
            </p>
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
      <span className="text-2xl font-heading font-bold">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-[10px] font-label tracking-widest uppercase opacity-60 mt-1">
        {unit}
      </span>
    </div>
  );
}
