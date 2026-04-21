import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Quote, Star, CheckCircle, Award, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TestimonialsPage() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response = await api.get("/testimonials");
      return response.data.data;
    },
  });

  const activeTestimonials = testimonials?.filter((t: any) => t.status === 'active') || [];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-background transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cinematic Header */}
        <header className="relative text-center mb-20 md:mb-32 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 text-primary rounded-full mb-8 border border-primary/10 shadow-sm">
             <Sparkles size={14} fill="currentColor" strokeWidth={0} className="animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Collector's Circle</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
            Acclaimed <span className="text-primary italic">Heritage</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-xl font-light max-w-2xl mx-auto leading-relaxed selection:bg-primary/20">
            Voices from a global community of horological connoisseurs, detailing their journey with Monrclair's rare calibers.
          </p>
          
          {/* Subtle decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[300px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        </header>

        {/* Content Section */}
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-secondary/10 rounded-[2.5rem] animate-pulse border border-border/20 shadow-inner" />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 animate-in fade-in duration-1000 delay-300">
            {activeTestimonials.map((t: any, idx: number) => (
              <div
                key={t.id}
                className={cn(
                    "break-inside-avoid relative overflow-hidden bg-white dark:bg-neutral-900 border border-border/40 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem]",
                    "shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-700 group",
                )}
              >
                {/* Large Background Icon */}
                <div className="absolute -top-6 -right-6 opacity-[0.03] text-primary group-hover:opacity-[0.08] transition-opacity rotate-12 group-hover:rotate-0 duration-1000">
                    <Quote size={180} />
                </div>

                {/* Rating Display */}
                <div className="flex items-center gap-1 mb-8 text-amber-500 transform group-hover:scale-105 transition-transform duration-500 origin-left">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                            key={i} 
                            size={12} 
                            fill={i < t.rating ? "currentColor" : "none"} 
                            strokeWidth={i < t.rating ? 0 : 2} 
                            className={cn(i < t.rating ? "animate-in fade-in zoom-in duration-500" : "")}
                            style={{ animationDelay: `${i * 100}ms` }}
                        />
                    ))}
                </div>

                {/* Main Content */}
                <p className="text-lg md:text-xl text-foreground font-heading italic leading-relaxed mb-10 tracking-tight selection:bg-primary/20 relative z-10">
                  "{t.content}"
                </p>

                {/* Identity Header */}
                <div className="flex items-center justify-between pt-8 border-t border-border/30 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center font-black text-primary border border-primary/10 shadow-inner overflow-hidden">
                        {t.user_name.charAt(0)}
                    </div>
                    <div>
                        <span className="font-heading font-black text-xs md:text-sm uppercase tracking-widest text-foreground block mb-1">
                        {t.user_name}
                        </span>
                        {t.is_verified_purchase && (
                        <div className="flex items-center gap-2">
                            <CheckCircle size={10} className="text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/80">Verified Artifact Owner</span>
                        </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {activeTestimonials.length === 0 && !isLoading && (
            <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                <MessageSquare size={48} className="text-muted-foreground" />
                <p className="text-xs font-black uppercase tracking-[0.3em] font-medium">The Council has not yet published new testimonials.</p>
            </div>
        )}

        {/* Action Section */}
        <footer className="mt-20 md:mt-32 py-20 px-8 relative overflow-hidden bg-[#121212] rounded-[3rem] md:rounded-[5rem] text-center border border-white/5 space-y-10 group/footer">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 text-primary opacity-50 px-4 py-1.5 border border-primary/20 rounded-full mx-auto">
                    <Award size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Client Engagement</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-heading font-black text-white leading-tight">Authorize Your Experience</h3>
                <p className="text-white/40 text-sm md:text-lg font-light leading-relaxed max-w-lg mx-auto">
                    We invite you to share your personal horological acquisitions and experiences with the international community.
                </p>
                <div className="pt-4">
                    <button className="relative px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] md:text-xs overflow-hidden shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group/btn">
                        <span className="relative z-10">Dispatch Endorsement</span>
                        <div className="absolute inset-x-0 h-full w-4 bg-white/20 skew-x-12 -translate-x-20 group-hover/btn:translate-x-64 transition-all duration-1000 ease-in-out" />
                    </button>
                </div>
            </div>
            
            {/* Visual background dynamics */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/footer:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/2 opacity-0 group-hover/footer:opacity-100 transition-opacity duration-1000" />
        </footer>
      </div>
    </div>
  );
}
