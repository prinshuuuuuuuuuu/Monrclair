import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ShieldAlert, Terminal, Lock, ScrollText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PrivacyPolicyPage() {
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "privacy"],
    queryFn: async () => {
      const response = await api.get("/pages");
      const privacyPage = response.data.data.find((p: any) => p.slug === 'privacy');
      return privacyPage;
    },
  });

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-[#fafafb] dark:bg-[#0c0c0c] transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Context & Navigation (Sticky on Desktop) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-10 animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="space-y-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                        <Lock size={28} strokeWidth={1.5} />
                    </div>
                    <header>
                        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground mb-4 leading-tight">
                        {page?.title || "Privacy Protocol"}
                        </h1>
                        <p className="text-muted-foreground text-xs md:text-sm font-light leading-relaxed max-w-xs uppercase tracking-widest italic">
                        Last Manifest Update: <br/>
                        <span className="text-primary font-bold not-italic">
                             {page?.updated_at ? new Date(page.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "VERSION 1.0.4"}
                        </span>
                        </p>
                    </header>
                </div>

                <div className="hidden lg:block space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-6">Manifest Overview</p>
                    {[
                        "Collection of Information",
                        "Usage Protocols",
                        "Data Custody & Shielding",
                        "Collector Rights",
                        "Third-Party Integrations"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-help transition-all hover:translate-x-1">
                             <div className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors" />
                             <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="p-6 rounded-[2rem] bg-white dark:bg-neutral-900 border border-border shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                         <CheckCircle2 size={16} className="text-emerald-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Compliance Status</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground font-medium italic">
                        "Your horological journey and associated data are protected under international encryption standards & GDPR compliance frameworks."
                    </p>
                </div>
            </aside>

            {/* Right Column: Main Content */}
            <main className="lg:col-span-8 flex flex-col gap-8 md:gap-12 order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                
                {isLoading ? (
                <div className="space-y-8 animate-pulse w-full">
                    <div className="h-[600px] bg-white dark:bg-neutral-900 rounded-[3rem] border border-border/50" />
                </div>
                ) : page ? (
                <div className="relative group">
                    {/* Shadow Accent */}
                    <div className="absolute inset-0 bg-primary/5 rounded-[3.5rem] md:rounded-[4.5rem] blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-1000" />
                    
                    <div className="bg-white dark:bg-neutral-900 p-8 md:p-14 lg:p-20 rounded-[3rem] md:rounded-[4rem] border border-border shadow-xl shadow-black/[0.02] backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-10 opacity-30">
                            <ScrollText size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Official Monrclair Documentation</span>
                        </div>
                        
                        <article 
                            className="prose prose-sm md:prose-lg dark:prose-invert max-w-none 
                                prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground
                                prose-p:leading-loose prose-p:text-muted-foreground/80 prose-p:font-light 
                                prose-strong:text-foreground prose-strong:font-bold
                                prose-li:text-muted-foreground/80
                                selection:bg-primary/20 selection:text-primary"
                            dangerouslySetInnerHTML={{ __html: page.content }} 
                        />
                    </div>
                </div>
                ) : (
                <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900 p-12 md:p-20 rounded-[3rem] text-center space-y-6">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto">
                         <ShieldAlert className="text-rose-500" size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-rose-900 dark:text-rose-400 mb-2 uppercase tracking-tighter">Protocol Terminated</h2>
                        <p className="text-rose-600/70 dark:text-rose-300/40 text-sm md:text-base font-light italic">The requested manifest could not be synchronized with the central server repository.</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20">
                        Attempt Reconnection
                    </button>
                </div>
                )}

                {/* Footer Detail */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 opacity-30 group">
                    <div className="flex items-center gap-4">
                        <Terminal size={14} className="group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">End of Official Manuscript</span>
                    </div>
                    <div className="text-[10px] italic font-medium">Authentication Hash: 0X8B3C...71E5</div>
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}
