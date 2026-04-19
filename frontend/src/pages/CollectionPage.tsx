import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Check 
} from "lucide-react";

const collections = ["All", "Chronograph", "Heritage", "Diver", "Aviator"];
const strapTypes = ["Leather", "Metal", "Silicone"];
const sortOptions = [
  { label: "Featured", value: "popular" },
  { label: "Price: Low-High", value: "price-asc" },
  { label: "Price: High-Low", value: "price-desc" },
];

export default function CollectionPage() {
  const [params] = useSearchParams();
  const categoryParam = params.get("category");
  const searchParam = params.get("search") || "";

  const [selectedCollection, setSelectedCollection] = useState("All");
  const [selectedStrap, setSelectedStrap] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sort, setSort] = useState("popular");
  const [search, setSearch] = useState(searchParam);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products;

    if (categoryParam) {
      result = result.filter((p) => p.category === categoryParam);
    }
    if (selectedCollection !== "All") {
      result = result.filter(
        (p) => p.collection === selectedCollection.toLowerCase(),
      );
    }
    if (selectedStrap.length > 0) {
      result = result.filter((p) => selectedStrap.includes(p.strapType));
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.collection.includes(q),
      );
    }

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      default:
        return [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [
    categoryParam,
    selectedCollection,
    selectedStrap,
    priceRange,
    sort,
    search,
  ]);

  const title = categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : "All Collections";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col md:flex-row max-w-screen-2xl mx-auto w-full">
        <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-border/60 px-5 py-7 gap-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide bg-background/95 backdrop-blur-sm">
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground/70">
              Search
            </h3>
            <div className="relative group">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors duration-200"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Reference number..."
                className="w-full bg-muted/40 hover:bg-muted/60 focus:bg-muted/80 border border-border/40 focus:border-primary/30 rounded-md pl-8 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200 placeholder:text-muted-foreground/40 text-foreground"
              />
            </div>
          </div>

          <div className="h-px bg-border/40" />

          <div className="space-y-2.5">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground/70">
              Collections
            </h3>
            <nav className="space-y-0.5">
              {collections.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCollection(c)}
                  className={`flex items-center justify-between w-full text-xs px-2.5 py-2 rounded-md transition-all duration-200 ${
                    selectedCollection === c
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <span>{c}</span>
                  {selectedCollection === c && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="h-px bg-border/40" />
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground/70">
              Material
            </h3>
            <div className="space-y-1">
              {strapTypes.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-muted/40 group cursor-pointer transition-all duration-150"
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedStrap.includes(s.toLowerCase())}
                      onChange={() =>
                        setSelectedStrap((prev) =>
                          prev.includes(s.toLowerCase())
                            ? prev.filter((x) => x !== s.toLowerCase())
                            : [...prev, s.toLowerCase()],
                        )
                      }
                      className="peer appearance-none w-4 h-4 border border-border/70 rounded-sm checked:bg-primary checked:border-primary hover:border-primary/60 transition-all duration-150 cursor-pointer"
                    />
                    <Check className="absolute w-2.5 h-2.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none" />
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-150 select-none">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/40" />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground/70">
                Price
              </h3>
              <span className="text-[10px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                ₹{priceRange[1].toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="flex justify-between text-[9px] font-semibold text-muted-foreground/60 tracking-wide">
              <span>₹0</span>
              <span>₹50,000+</span>
            </div>
          </div>
        </aside>

        <div className="md:hidden border-b border-border flex divide-x divide-border sticky top-0 z-20 bg-background/80 backdrop-blur-md">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <SlidersHorizontal size={12} />
            Filters {selectedStrap.length > 0 && `(${selectedStrap.length})`}
          </button>
          <div className="flex-1 relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-full bg-transparent appearance-none text-[10px] font-bold uppercase tracking-[0.2em] text-center px-4 outline-none active:bg-secondary"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={10}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-end px-4 sm:px-6 md:px-8 lg:px-10 py-3 md:py-4 border-b border-border/60 bg-background/70 backdrop-blur-md sticky top-0 z-20 gap-4 md:gap-6 shadow-sm">
            <div className="flex items-center gap-2 md:gap-3 group">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground/70 select-none">
                <ArrowUpDown className="w-3 h-3 opacity-60" />
                Sort By
              </span>

              <div className="relative flex items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="
          appearance-none cursor-pointer
          bg-muted/40 hover:bg-muted/70
          border border-border/50 hover:border-primary/40
          text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em]
          text-foreground/80 hover:text-primary
          rounded-md
          pl-2.5 md:pl-3 pr-7 md:pr-8 py-1.5 md:py-2
          outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50
          transition-all duration-200 ease-in-out
          min-w-[100px] md:min-w-[120px]
          shadow-sm
        "
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-2 md:right-2.5 w-3 h-3 text-muted-foreground/60 group-hover:text-primary/60 transition-colors duration-200" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-10 text-center animate-fade-in">
              <div className="w-16 h-16 bg-secondary flex items-center justify-center rounded-full mb-6">
                <Search size={24} className="text-muted-foreground/50" />
              </div>
              <h2 className="text-sm font-semibold mb-2 uppercase tracking-widest">
                No Matches Found
              </h2>
              <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                Adjust your filters or search terms to discover our other
                instruments.
              </p>
              <button
                onClick={() => {
                  setSelectedCollection("All");
                  setSelectedStrap([]);
                  setPriceRange([0, 50000]);
                  setSearch("");
                }}
                className="mt-8 text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 hover:text-primary transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 p-5 md:p-8 lg:p-10">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
          <div className="relative h-full flex flex-col p-8 pt-20">
            <button
              onClick={() => setFiltersOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-12 overflow-y-auto">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  Search
                </h3>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter model or series..."
                  className="w-full bg-transparent border-b border-border py-4 text-lg font-medium outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                  Collections
                </h3>
                <div className="flex flex-wrap gap-2">
                  {collections.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCollection(c)}
                      className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                        selectedCollection === c
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground active:bg-border"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                    Price Cap
                  </h3>
                  <span className="font-mono font-bold">
                    ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full h-2 bg-secondary rounded-full appearance-none accent-primary"
                />
              </div>
            </div>

            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-auto w-full bg-foreground text-background py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors"
            >
              View {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}