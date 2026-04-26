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
  const { data: categories = [], isLoading } = useCategories();
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
    <>
      <header className="sticky top-0 z-[60] bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
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

            <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden text-foreground hover:text-primary transition-colors p-2">
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
                <button onClick={logout} className="hidden sm:block text-muted-foreground hover:text-red-500 transition-colors p-2">
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
          <div className="sm:hidden border-t border-border py-4 animate-in slide-in-from-top duration-300 bg-background">
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
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-[100] bg-white overflow-y-auto">
          <div className="container py-10 flex flex-col gap-12">
            {/* Search for Mobile Menu */}
            <div className="sm:hidden relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
                placeholder="Search Collection..."
                className="w-full bg-secondary/30 rounded-xl px-12 py-4 text-[10px] font-label font-bold uppercase tracking-widest outline-none border border-transparent focus:border-primary/20"
              />
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="space-y-8">
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary/60 px-2 flex items-center gap-3">
                <span className="w-6 h-px bg-primary/20" /> Explore
              </h3>
              <nav className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-6 py-5 rounded-2xl bg-secondary/20 text-lg font-heading tracking-wide text-foreground hover:bg-secondary transition-all"
                  >
                    {l.label}
                    <ChevronRight size={18} className="text-muted-foreground/30" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary/60 flex items-center gap-3">
                  <span className="w-6 h-px bg-primary/20" /> Collections
                </h3>
                {isLoading && <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
              </div>
              <nav className="flex flex-col gap-3">
                <Link
                  to="/collection"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-6 py-5 rounded-2xl bg-primary text-primary-foreground text-lg font-heading tracking-wide shadow-xl shadow-primary/20"
                >
                  All Masterpieces
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </Link>
                
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((c: any) => (
                      <Link
                        key={c.id}
                        to={`/collection?category=${c.slug || c.id}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-6 py-5 rounded-2xl bg-secondary/20 text-lg font-heading tracking-wide text-foreground hover:bg-secondary transition-all group"
                      >
                        <span>{c.name}</span>
                        <ChevronRight size={18} className="text-muted-foreground/30 group-hover:text-primary transition-all" />
                      </Link>
                    ))
                  ) : !isLoading && (
                    <div className="px-6 py-5 text-sm text-muted-foreground italic font-light">
                      No collections currently available.
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {user && (
              <div className="pt-8 border-t border-border mt-auto">
                <button 
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-500 py-5 rounded-2xl text-xs font-label font-bold uppercase tracking-[0.2em] hover:bg-red-100 transition-all"
                >
                  <LogOut size={18} /> Secure Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
