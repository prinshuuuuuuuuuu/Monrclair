import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Heart, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

const items = [
  { icon: ShoppingBag, label: 'Shop', href: '/collection' },
  { icon: Search, label: 'Search', href: '/collection?search=' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: User, label: 'Profile', href: '/auth' },
];

export default function MobileNav() {
  const location = useLocation();
  const wishlist = useStore((s) => s.wishlist);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon size={20} />
              {item.label === 'Wishlist' && wishlist.length > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
              <span className="text-[10px] tracking-luxury uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
