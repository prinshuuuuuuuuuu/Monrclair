import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { HelpCircle, ChevronDown, Search, ArrowUpRight, Quote, Headset } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const response = await api.get("/faqs");
      return response.data.data;
    },
  });

  const filteredFaqs = faqs?.filter((f: any) => 
    f.status === 'active' && 
    (f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
     f.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-background transition-all duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header section with sophisticated typography */}
        <header className="text-center mb-12 md:mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6 shadow-inner ring-1 ring-primary/20">
            <HelpCircle size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter mb-6 text-foreground leading-[1.1]">
            Intelligence <span className="text-primary italic">& Guide</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Essential information regarding our luxury timepieces, global distribution, and bespoke horological services.
          </p>
        </header>

        {/* Search Bar with luxury feel */}
        <div className="relative mb-8 md:mb-12 group max-w-2xl mx-auto">
            <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input 
                placeholder="SEARCH KNOWLEDGE BASE..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 md:h-16 pl-14 md:pl-16 bg-secondary/5 border-border/50 rounded-2xl md:rounded-3xl text-xs md:text-sm font-bold tracking-[0.2em] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/30 uppercase"
            />
        </div>

        {/* Content list */}
        <div className="space-y-4 md:space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-20 bg-secondary/10 rounded-2xl md:rounded-[2.5rem] animate-pulse border border-border/20" />
              ))}
            </div>
          ) : filteredFaqs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {filteredFaqs.map((faq: any, idx: number) => (
                <div
                  key={faq.id}
                  className={cn(
                    "group bg-white dark:bg-neutral-900 border transition-all duration-500 overflow-hidden rounded-[2rem] md:rounded-[2.5rem]",
                    openId === faq.id 
                        ? "border-primary/30 shadow-2xl shadow-primary/5 ring-1 ring-primary/5" 
                        : "border-border/40 shadow-sm hover:border-primary/20 hover:shadow-md"
                  )}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full px-6 md:px-10 py-6 md:py-8 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-start gap-4">
                        <span className="hidden sm:inline text-[9px] font-black text-primary/30 mt-1.5 tabular-nums">
                            {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <span className={cn(
                            "font-bold text-base md:text-xl text-foreground tracking-tight transition-colors duration-300",
                            openId === faq.id ? "text-primary" : "group-hover:text-primary/70"
                        )}>
                            {faq.question}
                        </span>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full border border-border/50 flex items-center justify-center transition-all duration-500 shrink-0 ml-4",
                      openId === faq.id ? "rotate-180 bg-primary border-primary text-white shadow-lg shadow-primary/20" : "group-hover:border-primary/40 text-muted-foreground"
                    )}>
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  <div
                    className={cn(
                      "px-6 md:px-10 transition-all duration-500 ease-in-out overflow-hidden",
                      openId === faq.id ? "max-h-[800px] pb-8 md:pb-12 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="pl-0 sm:pl-13 relative">
                        <div 
                          className="prose prose-sm md:prose-lg max-w-none text-muted-foreground leading-relaxed md:leading-loose font-light selection:bg-primary/20 selection:text-primary"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                        <div className="mt-8 pt-8 border-t border-border/30 flex flex-wrap items-center gap-3">
                        <div className="px-3 py-1 bg-secondary rounded-full border border-border/50 flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary">Class:</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">{faq.category}</span>
                        </div>
                        <button className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors ml-auto group/link">
                            Share Entry <ArrowUpRight size={10} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground opacity-30">
                    <Search size={40} />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">No Matching Data</h3>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Refine your search parameters.</p>
                </div>
                <button 
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-2 border border-border rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                >
                    Clear Search
                </button>
            </div>
          )}
        </div>

        {/* Dynamic CTA Section */}
        <footer className="mt-20 md:mt-32 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] bg-foreground text-background overflow-hidden relative group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                        <Headset size={20} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/50">Human Intelligence</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-black mb-4 tracking-tight leading-tight">Complex Selection?</h3>
                    <p className="text-background/60 text-sm md:text-base max-w-sm leading-relaxed font-light">
                        Our specialized consultants are available for real-time horological advisory sessions.
                    </p>
                </div>
                <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <a 
                        href="mailto:support@monrclair.com"
                        className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-primary/90 transition-all hover:shadow-[0_20px_40px_rgba(184,115,51,0.3)] active:scale-95 group/btn"
                    >
                        Contact Specialist
                    </a>
                </div>
            </div>
            
            {/* Artistic background blur */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </footer>
      </div>
    </div>
  );
}
