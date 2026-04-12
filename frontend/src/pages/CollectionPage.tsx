import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const collections = ['All', 'Chronograph', 'Heritage', 'Diver', 'Aviator'];
const strapTypes = ['Leather', 'Metal', 'Silicone'];
const sortOptions = [
  { label: 'Popularity', value: 'popular' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
];

export default function CollectionPage() {
  const [params] = useSearchParams();
  const categoryParam = params.get('category');
  const searchParam = params.get('search') || '';

  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedStrap, setSelectedStrap] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState(searchParam);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products;

    if (categoryParam) {
      result = result.filter((p) => p.category === categoryParam);
    }
    if (selectedCollection !== 'All') {
      result = result.filter((p) => p.collection === selectedCollection.toLowerCase());
    }
    if (selectedStrap.length > 0) {
      result = result.filter((p) => selectedStrap.includes(p.strapType));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.collection.includes(q));
    }

    switch (sort) {
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price);
      default: return [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [categoryParam, selectedCollection, selectedStrap, priceRange, sort, search]);

  const title = categoryParam
    ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Collection`
    : 'The Horology Collection.';

  return (
    <div className="container py-10 md:py-16">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-5xl italic">{title}</h1>
        <p className="text-[11px] tracking-luxury uppercase text-muted-foreground mt-2">
          Clinical Precision & Asymmetric Equilibrium
        </p>
      </div>

      <div className="flex gap-10">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-56 shrink-0 space-y-8">
          <div>
            <h3 className="text-[10px] tracking-luxury uppercase font-medium mb-4">Collections</h3>
            {collections.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCollection(c)}
                className={`block text-sm mb-2 ${selectedCollection === c ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
              >
                {c}
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-[10px] tracking-luxury uppercase font-medium mb-4">Materials</h3>
            {strapTypes.map((s) => (
              <label key={s} className="flex items-center gap-2 mb-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                <input
                  type="checkbox"
                  checked={selectedStrap.includes(s.toLowerCase())}
                  onChange={() =>
                    setSelectedStrap((prev) =>
                      prev.includes(s.toLowerCase()) ? prev.filter((x) => x !== s.toLowerCase()) : [...prev, s.toLowerCase()]
                    )
                  }
                  className="accent-primary"
                />
                {s}
              </label>
            ))}
          </div>

          <div>
            <h3 className="text-[10px] tracking-luxury uppercase font-medium mb-4">Price Range</h3>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$0</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 gap-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search instruments..."
              className="bg-secondary px-4 py-2 text-sm w-full max-w-xs outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-4">
              <button className="md:hidden text-xs tracking-luxury uppercase text-muted-foreground" onClick={() => setFiltersOpen(!filtersOpen)}>
                Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-secondary px-3 py-2 text-xs outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="md:hidden mb-6 p-4 bg-secondary space-y-4">
              <div>
                <h3 className="text-[10px] tracking-luxury uppercase font-medium mb-2">Collections</h3>
                <div className="flex flex-wrap gap-2">
                  {collections.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCollection(c)}
                      className={`text-xs px-3 py-1 border ${selectedCollection === c ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] tracking-luxury uppercase font-medium mb-2">Price up to ${priceRange[1].toLocaleString()}</h3>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm py-20 text-center">No instruments match your criteria.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
