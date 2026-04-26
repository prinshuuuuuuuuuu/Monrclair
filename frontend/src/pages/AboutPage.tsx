import { ArrowRight, Award, ShieldCheck, Clock, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-110 hover:scale-100"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        <div className="relative container text-center z-10 px-6">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
            <span className="w-12 h-px bg-primary/60" />
            <span className="text-[10px] sm:text-xs font-label tracking-[0.4em] uppercase font-bold text-primary">
              Our Legacy
            </span>
            <span className="w-12 h-px bg-primary/60" />
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading text-white leading-none mb-8 animate-slide-up">
            The Spirit of <span className="italic font-light text-primary">Precision</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Montclair is more than a horological house; it is a testament to the 
            art of time itself. We curate instruments that transcend generations.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 sm:py-32 container px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-primary text-[10px] font-label tracking-[0.4em] uppercase font-bold">Philosophy</span>
              <span className="w-8 h-px bg-primary/30" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-heading leading-tight">
              Crafting <span className="italic font-light">Permanence</span> in a World of Change
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              Founded on the principles of Swiss precision and avant-garde design, 
              Montclair has stood as a beacon for collectors who demand nothing 
              less than excellence.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Award size={20} />
                </div>
                <h3 className="font-heading text-xl">Curated Excellence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every timepiece in our collection undergoes a rigorous multi-point 
                  authentication process by our master watchmakers.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-heading text-xl">Lifetime Trust</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We don't just sell watches; we build relationships. Our global 
                  warranty network ensures your legacy is protected.
                </p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square">
            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <img 
              src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80" 
              alt="Horological Mastery"
              className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-secondary/20 border-y border-border/40">
        <div className="container px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { icon: Clock, value: "15+", label: "Years of Heritage" },
              { icon: Users, value: "50k+", label: "Global Collectors" },
              { icon: Award, value: "120+", label: "Premium Brands" },
              { icon: Globe, value: "24", label: "Concierge Hubs" },
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-center text-primary opacity-60">
                  <stat.icon size={28} strokeWidth={1} />
                </div>
                <div className="text-4xl font-heading">{stat.value}</div>
                <div className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 sm:py-32 bg-black text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-primary/50" />
              <span className="text-[10px] font-label tracking-[0.5em] uppercase font-bold text-primary">
                The Founder's Vision
              </span>
              <span className="w-12 h-px bg-primary/50" />
            </div>
            <h2 className="text-5xl sm:text-7xl font-heading leading-tight italic">
              "Time is the only <span className="text-primary not-italic font-bold">true luxury</span>. We simply provide the vessel."
            </h2>
            <div className="space-y-4">
              <div className="w-16 h-px bg-primary/30 mx-auto" />
              <p className="text-xs font-label uppercase tracking-[0.4em] opacity-60">
                Alaric Montclair, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 container px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl sm:text-6xl font-heading leading-tight">
            Begin Your <span className="italic font-light">Legacy</span> Today
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Join the elite circle of collectors who understand that a watch is not 
            just for telling time, but for telling your story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link 
              to="/collection"
              className="bg-primary text-white px-12 py-5 text-xs font-label font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:border-black border border-transparent transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              Explore Collection <ArrowRight size={14} />
            </Link>
            <Link 
              to="/contact"
              className="border border-border px-12 py-5 text-xs font-label font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-all"
            >
              Consult an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
