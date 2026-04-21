import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Tag, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("/posts");
      return response.data.data;
    },
  });

  const activePosts = posts?.filter((p: any) => p.status === 'published') || [];

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-background transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <header className="mb-12 md:mb-20 animate-in fade-in slide-in-from-left-4 duration-1000">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 md:w-16 h-[1px] bg-primary/40"></div>
             <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">The Heritage Journal</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
                Timeless <span className="text-primary italic">Stories</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-xl font-light leading-relaxed max-w-xl">
                Exploring the confluence of fine watchmaking, artisanal heritage, and contemporary luxury culture.
              </p>
            </div>
            
            {/* View Toggle - Hidden on Mobile */}
            <div className="hidden sm:flex items-center gap-2 border border-border p-1.5 rounded-2xl bg-secondary/10 shrink-0">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-white dark:bg-neutral-800 shadow-md text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                    <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-white dark:bg-neutral-800 shadow-md text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                    <List size={18} />
                </button>
            </div>
          </div>
        </header>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-6">
                <div className="aspect-[16/10] bg-secondary/10 rounded-[2.5rem] animate-pulse border border-border/20" />
                <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-secondary/10 rounded animate-pulse" />
                    <div className="h-4 w-full bg-secondary/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn(
            "transition-all duration-500",
            viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16" 
                : "flex flex-col gap-12"
          )}>
            {activePosts.map((post: any, idx: number) => (
              <article 
                key={post.id} 
                className={cn(
                    "group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700",
                    viewMode === 'list' ? "md:flex-row md:items-center gap-8 lg:gap-16 pb-12 border-b border-border/50 last:border-0" : ""
                )}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Image Container */}
                <Link 
                  to={`/blog/${post.slug}`} 
                  className={cn(
                    "relative overflow-hidden rounded-[2.5rem] group-hover:rounded-[1.5rem] transition-all duration-700 shadow-xl shadow-black/5 ring-1 ring-border/20",
                    viewMode === 'grid' ? "aspect-[4/3]" : "md:w-1/3 lg:w-1/4 aspect-video md:aspect-[4/3] shrink-0"
                  )}
                >
                  <img 
                    src={post.featured_image_url || "/placeholder-blog.jpg"} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md dark:bg-black/80 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                        {post.category}
                    </span>
                  </div>
                </Link>

                {/* Text Container */}
                <div className={cn(
                    "flex-1 flex flex-col",
                    viewMode === 'grid' ? "pt-8" : "md:pt-0"
                )}>
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4">
                     <div className="flex items-center gap-1.5">
                        <Calendar size={12} strokeWidth={2.5} />
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                     </div>
                  </div>

                  <Link to={`/blog/${post.slug}`} className="group/title">
                    <h3 className={cn(
                        "font-heading font-black text-foreground transition-colors duration-500 leading-tight mb-4 tracking-tighter",
                        viewMode === 'grid' ? "text-2xl md:text-3xl" : "text-3xl lg:text-4xl"
                    )}>
                      {post.title}
                    </h3>
                  </Link>

                  <p className={cn(
                    "text-muted-foreground font-light leading-relaxed mb-8 selection:bg-primary/20",
                    viewMode === 'grid' ? "text-sm line-clamp-3" : "text-base line-clamp-2 max-w-2xl"
                  )}>
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary group/link"
                    >
                      <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary after:transition-all group-hover/link:after:w-full">
                        Full Manuscript
                      </span>
                      <ArrowRight size={14} className="transition-transform duration-500 group-hover/link:translate-x-2" />
                    </Link>
                    
                    {viewMode === 'list' && (
                        <div className="hidden lg:flex items-center gap-2">
                             <div className="w-1 h-1 rounded-full bg-border" />
                             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Est. 5 min read</span>
                        </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {activePosts.length === 0 && !isLoading && (
            <div className="py-32 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-700">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
                    <Tag size={48} className="text-primary/20 relative z-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">Archives Unavailable</h3>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">New artifacts are being curated for this collection.</p>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                >
                    Refresh Repository
                </button>
            </div>
        )}

        {/* Pagination placeholder with luxury styling */}
        {activePosts.length > 0 && (
            <div className="mt-20 md:mt-32 pt-12 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Repository Page 01 of 01</div>
                <div className="flex gap-4">
                    <button disabled className="px-8 py-3 border border-border/30 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-20 cursor-not-allowed">Prior</button>
                    <button disabled className="px-8 py-3 border border-border/30 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-20 cursor-not-allowed">Next</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
