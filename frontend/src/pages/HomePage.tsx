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
    <div className="bg-background text-foreground overflow-hidden selection:bg-primary/30 selection:text-primary">
      {/* Hero Section */}
      <section className="relative h-[85vh] sm:h-[90vh] lg:h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? "scale(1.1)" : "scale(1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            
            {/* Subtle Overlay Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative container h-full flex flex-col justify-center items-start px-6 sm:px-10 lg:px-20 pt-20">
              <div
                className={cn(
                  "max-w-3xl transition-all duration-1000 delay-300 transform",
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0",
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 sm:w-12 h-px bg-primary/60" />
                  <span className="text-[10px] sm:text-xs font-label tracking-[0.4em] uppercase font-bold text-primary drop-shadow-md">
                    Exquisite Horology
                  </span>
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-8xl font-heading text-white leading-[1.05] mb-8 drop-shadow-2xl">
                  {slide.title.split(', ').map((part, i) => (
                    <span key={i} className="block italic first:not-italic first:font-bold">
                      {part}
                    </span>
                  ))}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-white/70 mb-10 font-light tracking-wide max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/collection"
                    className="bg-primary text-primary-foreground px-10 py-5 text-xs sm:text-sm font-label font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group shadow-xl shadow-primary/20"
                  >
                    {slide.cta1}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/about"
                    className="bg-white/5 backdrop-blur-xl text-white border border-white/20 px-10 py-5 text-xs sm:text-sm font-label font-bold tracking-[0.2em] uppercase hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    {slide.cta2}
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={cn(
                    "h-1 transition-all duration-500 rounded-full",
                    i === currentSlide ? "w-12 bg-primary" : "w-6 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Categories Section */}
      <section className="py-24 sm:py-32 container px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-primary text-[10px] font-label tracking-[0.4em] uppercase font-bold">Discover</span>
              <span className="w-8 h-px bg-primary/30" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading mb-6 leading-tight">
              Curated <span className="italic font-light">Collections</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
              Explore our masterfully crafted categories, from timeless heritage 
              classics to cutting-edge modern complications.
            </p>
          </div>
          <Link
            to="/collection"
            className="group inline-flex items-center gap-3 text-primary font-label font-bold tracking-[0.2em] uppercase text-xs sm:text-sm border-b border-primary/20 pb-2 hover:border-primary transition-all"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={cat.href}
              className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-secondary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-8 left-8 right-8 text-white translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <p className="text-[10px] font-label tracking-[0.3em] uppercase mb-2 opacity-60">
                  Shop
                </p>
                <h3 className="text-xl sm:text-2xl font-heading font-medium tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-16 border-y border-border/50 bg-secondary/5 overflow-hidden relative group">
        <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap gap-16 sm:gap-32 group-hover:[animation-play-state:paused] items-center py-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-16 sm:gap-32 items-center">
              {brandList.map((brand) => (
                <div
                  key={brand.name}
                  className="flex flex-col items-center gap-5 group/brand"
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                    <div className="w-full h-full rounded-full bg-white border border-border/40 shadow-sm flex items-center justify-center p-6 sm:p-8 overflow-hidden group-hover/brand:shadow-xl group-hover/brand:border-primary/20 transition-all duration-500">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain grayscale opacity-60 group-hover/brand:grayscale-0 group-hover/brand:opacity-100 transition-all duration-500"
                      />
                    </div>

                    {brand.isPremium && (
                      <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full z-20 shadow-lg border border-white/20">
                        Elite
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-label font-bold uppercase tracking-[0.3em] text-foreground opacity-40 group-hover/brand:opacity-100 transition-opacity">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 sm:py-32 bg-secondary/20">
        <div className="container px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary/40" />
              <span className="text-primary text-[10px] font-label tracking-[0.4em] uppercase font-bold">Showcase</span>
              <span className="w-8 h-px bg-primary/40" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading mb-10 leading-tight">
              Masterpieces of <span className="italic font-light text-primary">Precision</span>
            </h2>

            <div className="flex justify-center gap-2 sm:gap-4 overflow-x-auto pb-6 no-scrollbar">
              {[
                { id: "new", label: "New", icon: Zap },
                { id: "bestseller", label: "Top Rated", icon: Star },
                { id: "trending", label: "Hot", icon: Flame },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={cn(
                    "flex items-center gap-2.5 px-8 py-4 text-[10px] font-label tracking-[0.2em] uppercase font-bold transition-all border rounded-full shrink-0",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  )}
                >
                  <filter.icon className="w-3.5 h-3.5" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showAddToCart />
            ))}
          </div>

          <div className="mt-24 text-center">
            <Link
              to="/collection"
              className="inline-flex items-center gap-4 bg-foreground text-background px-12 py-6 text-xs sm:text-sm font-label font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all rounded-full shadow-2xl"
            >
              Discover Full Inventory
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-24 sm:py-32 px-6">
        <div className="container p-0">
          <div className="relative overflow-hidden bg-black text-white p-12 sm:p-20 lg:p-32 rounded-[2rem] sm:rounded-[4rem] group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/5 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-1000" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
              <div className="max-w-2xl text-center lg:text-left order-2 lg:order-1">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                  <span className="w-12 h-px bg-primary/50" />
                  <span className="text-[10px] font-label tracking-[0.5em] uppercase font-bold text-primary">
                    Private Reserve
                  </span>
                </div>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-heading mb-10 leading-[1] tracking-tight">
                  The <span className="italic text-primary font-light">Platinum</span>
                  <br />
                  Standard
                </h2>
                <p className="text-lg sm:text-xl text-white/60 mb-12 font-light italic leading-relaxed max-w-lg">
                  “Access our most prestigious calibers at an exceptional 
                  acquisition value. A true testament to horological mastery.”
                </p>

                <div className="flex justify-center lg:justify-start gap-4 sm:gap-6 mb-16">
                  <CountdownBox value={timeLeft.days} unit="Days" />
                  <CountdownBox value={timeLeft.hrs} unit="Hrs" />
                  <CountdownBox value={timeLeft.mins} unit="Mins" />
                  <CountdownBox value={timeLeft.secs} unit="Secs" />
                </div>

                <Link
                  to="/collection?category=luxury-watches"
                  className="inline-block bg-primary text-white px-16 py-6 text-xs sm:text-sm font-label font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/40 rounded-full"
                >
                  Access Collection
                </Link>
              </div>

              <div className="relative w-full max-w-lg aspect-square lg:scale-125 order-1 lg:order-2">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <img
                  src="/hero-luxury-2.png"
                  alt="Exclusive Timepiece"
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,1)] hover:scale-110 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Points */}
      <section className="py-24 bg-secondary/10 border-y border-border/40 px-6">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-16">
            {trustPoints.map((point, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-background border flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-xl">
                  <point.icon size={32} strokeWidth={1.2} />
                </div>
                <h3 className="font-heading text-xl mb-3 tracking-wide uppercase font-medium">
                  {point.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-4 opacity-70">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Slider */}
      <section className="py-24 sm:py-32 overflow-hidden px-6">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-16 gap-8">
            <div className="text-center sm:text-left">
              <span className="text-primary text-[10px] font-label tracking-[0.5em] uppercase font-bold mb-3 block">
                Seasonal Drops
              </span>
              <h2 className="text-4xl sm:text-5xl font-heading">New <span className="italic font-light">Arrivals</span></h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={scrollPrev}
                className="p-4 rounded-full border border-border hover:border-primary hover:text-primary transition-all active:scale-90"
                aria-label="Previous slide"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={scrollNext}
                className="p-4 rounded-full border border-border hover:border-primary hover:text-primary transition-all active:scale-90"
                aria-label="Next slide"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex gap-8">
              {newArrivals.map((product) => (
                <div
                  key={product.id}
                  className="embla__slide flex-[0_0_90%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0"
                >
                  <div className="relative group p-1">
                    <ProductCard product={product} />
                    <div className="absolute top-6 left-6 bg-primary text-primary-foreground text-[9px] font-label font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full shadow-lg z-20 pointer-events-none">
                      NEW
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 bg-zinc-50 text-zinc-900 relative overflow-hidden px-6">
        <div className="container relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="text-primary text-[10px] font-label tracking-[0.5em] uppercase font-bold mb-4 block">
              The Experience
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading mb-6 tracking-tight">
              Customer <span className="italic font-light">Voices</span>
            </h2>
            <div className="flex justify-center gap-1.5 mb-6 opacity-80">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-primary text-primary"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="group relative bg-white border border-zinc-200/60 p-10 sm:p-12 rounded-[2.5rem] flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-700"
              >
                <div className="absolute top-0 inset-x-0 h-1.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center rounded-full" />

                <span className="text-6xl font-serif text-primary/5 absolute top-10 left-10 italic pointer-events-none group-hover:text-primary/10 transition-colors">
                  &ldquo;
                </span>

                <div className="mb-8 flex gap-1.5 transform group-hover:scale-110 transition-transform duration-500">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "w-4 h-4 transition-colors duration-500",
                        j < t.rating
                          ? "fill-primary text-primary"
                          : "text-zinc-200",
                      )}
                    />
                  ))}
                </div>

                <p className="text-base sm:text-lg italic text-zinc-600 mb-10 font-light leading-relaxed relative z-10">
                  {t.text}
                </p>

                <div className="mt-auto">
                  <div className="w-10 h-[2px] bg-primary/30 mx-auto mb-6 group-hover:w-20 transition-all duration-700" />
                  <p className="text-xs font-label tracking-[0.3em] uppercase font-extrabold text-zinc-900 mb-2">
                    {t.name}
                  </p>
                  <p className="text-[10px] font-label text-zinc-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Verified Collector
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 sm:py-32 bg-primary text-primary-foreground relative overflow-hidden group px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black/40" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-10 backdrop-blur-md">
              <Mail className="w-7 h-7 opacity-90" />
            </div>

            <h2 className="text-4xl sm:text-6xl font-heading mb-6 uppercase tracking-wider leading-tight">
              The <span className="opacity-70 italic font-light">Elite Circle</span>
            </h2>
            <p className="text-base sm:text-lg mb-12 opacity-80 font-light leading-relaxed max-w-xl mx-auto">
              Experience the pinnacle of horological exclusivity. Receive early 
              notifications on rare vintage drops and private collection launches.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl overflow-hidden p-1.5 shadow-2xl"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Official Email Address"
                className="flex-1 bg-transparent px-8 py-5 text-white placeholder:text-white/40 focus:outline-none font-label text-xs sm:text-sm tracking-[0.2em] uppercase w-full"
                required
              />
              <button className="bg-white text-primary px-12 py-5 font-label font-bold tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all whitespace-nowrap text-xs sm:text-sm rounded-xl">
                Subscribe
              </button>
            </form>

            <p className="mt-8 text-[10px] font-label uppercase tracking-[0.4em] opacity-40">
              Discreet & Secured Communication
            </p>
          </div>
        </div>
      </section>

      <div className="h-24 sm:h-32" />
    </div>

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
