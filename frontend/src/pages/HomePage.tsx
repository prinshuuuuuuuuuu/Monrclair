import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

const categories = [
  {
    name: "Classic",
    desc: "Timeless elegance",
    href: "/collection?category=classic",
  },
  {
    name: "Sport",
    desc: "Built for performance",
    href: "/collection?category=sport",
  },
  {
    name: "Premium",
    desc: "Haute horlogerie",
    href: "/collection?category=premium",
  },
];

const testimonials = [
  {
    name: "Alexander V.",
    date: "12.04.24",
    text: '"The tension between the brushed steel and the copper hands is masterfully executed. A true technical marvel."',
    rating: 5,
  },
  {
    name: "Catherine M.",
    date: "08.02.24",
    text: '"Impeccable craftsmanship. The moonphase complication is mesmerizing — a piece that commands attention."',
    rating: 5,
  },
  {
    name: "James R.",
    date: "15.01.24",
    text: '"From the packaging to the weight on the wrist, every detail speaks of uncompromising quality."',
    rating: 5,
  },
];

const slides = [
  {
    image: "/hero-1.jpg",
    title: (
      <>
        The Horology
        <br />
        <em>Collection.</em>
      </>
    ),
    subtitle: "Clinical Precision & Asymmetric Equilibrium",
  },
  {
    image: "/hero-2.png",
    title: (
      <>
        Engineered
        <br />
        <em>Elegance.</em>
      </>
    ),
    subtitle: "Mastering the Art of Mechanical Excellence",
  },
  {
    image: "/hero-3.png",
    title: (
      <>
        Timeless
        <br />
        <em>Legacy.</em>
      </>
    ),
    subtitle: "Defining the Future of Haute Horlogerie",
  },
];

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featured = products.filter((p: Product) => p.featured);
  const trending = products.filter((p: Product) => p.trending);

  return (
    <div>
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out ease-out-expo",
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105 pointer-events-none",
            )}
          >
            <img
              src={slide.image}
              alt={`Montclair slide ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/50 transition-opacity duration-1000" />

            <div
              className={cn(
                "relative container h-full flex flex-col justify-end pb-16 md:pb-24 transition-all duration-1000 delay-300",
                index === currentSlide
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              <h1 className="font-heading text-4xl md:text-7xl text-background leading-tight max-w-xl">
                {slide.title}
              </h1>
              <p className="text-[11px] tracking-luxury uppercase text-background/70 mt-4">
                {slide.subtitle}
              </p>
              <Link
                to="/collection"
                className="mt-8 inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase w-fit hover:opacity-90 transition-opacity"
              >
                Explore Collection <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-1 transition-all duration-500 rounded-full",
                index === currentSlide
                  ? "w-12 bg-primary"
                  : "w-4 bg-background/20 hover:bg-background/40",
              )}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
