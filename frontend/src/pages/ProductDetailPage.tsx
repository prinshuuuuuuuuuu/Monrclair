import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Package,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useStore } from "@/store/useStore";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: dbProducts = [] } = useProducts();
  const [imgIndex, setImgIndex] = useState(0);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please register or login to manage your logistics.",
      });
      return navigate("/auth");
    }
    if (product) addToCart(product.id);
  };

  const handleWishlist = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please register or login to save items to your archive.",
      });
      return navigate("/auth");
    }
    if (product) toggleWishlist(product.id);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-10 text-center animate-fade-in container">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-sm font-semibold mb-2 uppercase tracking-widest">
          Querying Archive...
        </h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link
          to="/collection"
          className="text-primary text-sm mt-4 inline-block"
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);
  const related = dbProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const specGroups = [
    {
      title: "Case & Dial",
      items: [
        { label: "Diameter", value: product.case_diameter },
        { label: "Material", value: product.case_material },
        { label: "Thickness", value: product.case_thickness },
        { label: "Lug Width", value: product.lug_width },
        { label: "Dial Colour", value: product.dial_colour },
        { label: "Crystal", value: product.crystal },
      ]
    },
    {
      title: "Movement & Power",
      items: [
        { label: "Type", value: product.movement_type },
        { label: "Caliber", value: product.caliber },
        { label: "Power Reserve", value: product.power_reserve },
        { label: "Water Resistance", value: product.water_resistance },
      ]
    },
    {
      title: "Additional Details",
      items: [
        { label: "Strap Material", value: product.strap_material },
        { label: "Warranty", value: product.warranty },
        { label: "Model Number", value: product.model_number },
      ]
    }
  ];

  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="container py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">

          <div className="sticky top-24">
            <div className="relative bg-secondary/30 aspect-square overflow-hidden border border-border group">
              <img
                src={product.images && product.images.length > 0 ? product.images[imgIndex] : product.image}
                alt={product.name}
                className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700"
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => i > 0 ? i - 1 : product.images.length - 1)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-md p-3 hover:bg-background transition-colors border border-border"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => i < product.images.length - 1 ? i + 1 : 0)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-md p-3 hover:bg-background transition-colors border border-border"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-none justify-center">
              {product.images && product.images.length > 0 ? product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-20 h-20 bg-secondary/30 p-2 border transition-all ${i === imgIndex ? "border-primary scale-105" : "border-border hover:border-primary/50"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              )) : (
                <button className="w-20 h-20 bg-secondary/30 p-2 border border-primary">
                  <img src={product.image} className="w-full h-full object-contain" />
                </button>
              )}
            </div>
          </div>


          <div className="space-y-12">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-luxury uppercase text-primary font-bold">{product.brand}</span>
                <span className="h-px w-8 bg-border" />
                <Link
                  to={`/collection?category=${product.category_slug || product.category}`}
                  className="text-[10px] tracking-luxury uppercase text-primary font-bold hover:underline"
                >
                  {product.category_name}
                </Link>
                <span className="h-px w-8 bg-border" />
                <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">{product.collection}</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-3xl font-body">₹{Number(product.price).toLocaleString("en-IN")}</span>
                  {product.mrp && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">₹{Number(product.mrp).toLocaleString()}</span>
                      <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</span>
                    </div>
                  )}
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] tracking-luxury uppercase font-bold">
                    {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} Units)` : "Out of Stock"}
                  </span>
                </div>
              </div>
            </header>


            {product.key_highlights && (
              <div className="bg-secondary/20 p-8 border border-border space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={16} />
                  <h3 className="text-[10px] tracking-luxury uppercase font-bold">Key Highlights</h3>
                </div>
                <ul className="space-y-4">
                  {product.key_highlights.split('\n').map((point: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground items-start">
                      <span className="text-primary mt-1">●</span>
                      <span>{point.replace(/^[•●*-]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className="flex-1 bg-primary text-primary-foreground py-6 text-[10px] tracking-luxury uppercase font-bold disabled:opacity-50 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
              >
                {product.stock_quantity > 0 ? "Initiate Acquisition" : "Registry Full"} <ArrowRight size={14} />
              </button>
              <button
                onClick={handleWishlist}
                className="border border-border p-6 hover:border-primary transition-colors bg-background group"
              >
                <Heart
                  size={20}
                  fill={isWished ? "hsl(var(--primary))" : "none"}
                  className={isWished ? "text-primary" : "group-hover:text-primary transition-colors"}
                />
              </button>
            </div>


            <div className="space-y-8 pt-8">
              <h3 className="text-[10px] tracking-luxury uppercase font-bold border-b border-border pb-4">Technical Blueprint</h3>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                {specGroups.map((group, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-[9px] tracking-widest uppercase text-primary/70 font-bold">{group.title}</h4>
                    <div className="space-y-3">
                      {group.items.map((item, i) => item.value && (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{item.label}</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {product.whats_in_the_box && (
              <div className="flex items-start gap-4 p-6 border border-dashed border-border bg-secondary/5">
                <Package className="text-primary shrink-0" size={20} />
                <div className="space-y-1">
                  <h4 className="text-[10px] tracking-luxury uppercase font-bold">Unboxing Experience</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{product.whats_in_the_box}</p>
                </div>
              </div>
            )}


            <div className="flex items-center gap-3 py-6 border-y border-border">
              <ShieldCheck className="text-primary" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] tracking-luxury uppercase font-bold">Certified Protection</span>
                <span className="text-xs text-muted-foreground">{product.warranty || "Standard Manufacturer Warranty"}</span>
              </div>
            </div>
          </div>
        </div>


        {related.length > 0 && (
          <section className="mt-32 pt-24 border-t border-border">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-[10px] tracking-luxury uppercase text-muted-foreground font-bold">Related Archives</h2>
              <Link to="/collection" className="text-[10px] tracking-luxury uppercase font-bold text-primary hover:underline">View Full Registry</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
