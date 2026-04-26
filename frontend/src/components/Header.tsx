import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronRight } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { useCategories } from '@/hooks/useModules';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collection', href: '/collection' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { data: categories = [] } = useCategories();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const cartTotal = cart.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  return (
    <header className="sticky top-0 z-[60] bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-20">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Montclair" className="h-16 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="text-[10px] font-label font-bold tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-all hover:translate-y-[-1px]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center bg-secondary/30 border border-border/50 rounded-full px-4 py-1.5 focus-within:border-primary/30 transition-all">
            <Search size={14} className="text-muted-foreground" />
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest font-bold px-3 w-32 focus:w-48 transition-all"
              />
            </form>
          </div>

          <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden text-foreground hover:text-primary transition-colors">
            <Search size={18} />
          </button>

          <Link to="/wishlist" className="relative text-foreground hover:text-primary transition-colors p-2">
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors p-2">
            <ShoppingBag size={18} />
            {cartTotal > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center rounded-full">
                {cartTotal}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-border hover:border-primary transition-all active:scale-95">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
              </Link>
              <button onClick={logout} className="hidden sm:block text-muted-foreground hover:text-red-500 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-foreground hover:text-primary transition-colors p-2">
              <User size={18} />
            </Link>
          )}

          <button className="lg:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="sm:hidden border-t border-border py-4 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="container relative">
            <input
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search collections..."
              className="w-full bg-secondary/50 rounded-lg px-10 py-3 text-xs font-label uppercase tracking-widest outline-none border border-transparent focus:border-primary/20"
            />
            <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-50 bg-background overflow-y-auto animate-in slide-in-from-right duration-500">
          <div className="container py-8 flex flex-col gap-10">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-primary/30" /> Navigation
              </h3>
              <nav className="flex flex-col gap-5">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-heading tracking-wide text-foreground flex items-center justify-between group"
                  >
                    {l.label}
                    <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-primary/30" /> Categories
              </h3>
              <nav className="flex flex-col gap-5">
                <Link
                  to="/collection"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-heading tracking-wide text-foreground flex items-center justify-between group"
                >
                  All Collections
                  <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
                {Array.isArray(categories) && categories.map((c: any) => (
                  <Link
                    key={c.id}
                    to={`/collection?category=${c.slug || c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-heading tracking-wide text-foreground flex items-center justify-between group"
                  >
                    {c.name}
                    <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </nav>
            </div>

            {user && (
              <button 
                onClick={() => { logout(); setMobileOpen(false); }}
                className="mt-4 flex items-center gap-3 text-red-500 text-sm font-label uppercase tracking-widest font-bold"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
