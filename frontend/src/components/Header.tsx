import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

const navLinks = [
  { label: 'Classic', href: '/collection?category=classic' },
  { label: 'Sport', href: '/collection?category=sport' },
  { label: 'Premium', href: '/collection?category=premium' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const cartTotal = cart.reduce((s, i) => s + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Montclair" className="h-16 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="text-xs font-body tracking-luxury uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground hover:text-primary transition-colors">
            <Search size={18} />
          </button>
          <Link to="/wishlist" className="relative text-foreground hover:text-primary transition-colors">
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag size={18} />
            {cartTotal > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                {cartTotal}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-border hover:border-primary transition-all active:scale-95">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
              </Link>
              <button onClick={logout} className="text-muted-foreground hover:text-red-500 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-foreground hover:text-primary transition-colors">
              <User size={18} />
            </Link>
          )}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border py-4">
          <form onSubmit={handleSearch} className="container">
            <input
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search collections..."
              className="w-full bg-transparent text-sm font-body outline-none placeholder:text-muted-foreground"
            />
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-6 flex flex-col gap-4">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-luxury uppercase text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
