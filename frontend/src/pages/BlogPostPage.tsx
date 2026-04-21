import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useParams, Link } from "react-router-dom";
import { Calendar, ChevronLeft, Share2, Bookmark } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data: serverResponse, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      // Assuming we can find by slug or there's an endpoint
      // For now, let's look in the full list and find the match
      const response = await api.get("/posts");
      const post = response.data.data.find((p: any) => p.slug === slug);
      return post;
    },
  });

  const post = serverResponse;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 animate-pulse">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-4 w-24 bg-muted rounded mb-8" />
          <div className="h-12 w-full bg-muted rounded mb-6" />
          <div className="aspect-video bg-muted rounded-[2rem] mb-12" />
          <div className="space-y-4">
             <div className="h-4 w-full bg-muted rounded" />
             <div className="h-4 w-5/6 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Link to="/blogs" className="text-primary hover:underline">Return to journal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          to="/blogs" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-12 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded">
                Portal: {post.category}
             </span>
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground border-l border-border pl-3">
                <Calendar size={12} className="text-primary" />
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
             </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1e293b] leading-[1.1] mb-8">
            {post.title}
          </h1>
        </header>

        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 ring-1 ring-border/50">
           <img 
             src={post.featured_image_url || "/placeholder-blog.jpg"} 
             alt={post.title}
             className="w-full h-full object-cover"
           />
        </div>

        <div className="relative">
            {/* Share Sidebar - Desktop Only */}
            <div className="hidden lg:flex flex-col gap-4 absolute -left-20 top-0">
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                    <Share2 size={16} />
                </button>
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                    <Bookmark size={16} />
                </button>
            </div>

            <article className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed prose-img:rounded-3xl">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
        </div>

        <footer className="mt-20 pt-12 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-black">
                        M
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Written By</p>
                        <p className="font-bold text-lg">Monrclair Editorial Team</p>
                    </div>
                </div>

                <div className="flex gap-4">
                     <button className="px-6 py-3 border border-border rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all">
                        Share Article
                     </button>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
}
