import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Watch, ShoppingBag, Users, Settings, HelpCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';


const sidebarLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Products', icon: Watch, href: '/admin/products' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Users', icon: Users, href: '/admin/users' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-[10px] tracking-luxury uppercase animate-pulse">Checking Authorization Protocol...</p>
      </div>
    );
  }

  return (


    <div className="flex min-h-screen bg-background text-foreground font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col pt-10 px-4">
        <div className="mb-12 px-4">
          <h2 className="font-heading text-xl tracking-tight uppercase">Atelier Admin</h2>
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-1">System Controller</p>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href || (link.href !== '/admin' && location.pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-[10px] tracking-luxury uppercase transition-all",
                  isActive 
                    ? "text-primary border-r-2 border-primary bg-secondary/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                )}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pb-10 space-y-6">
          <button className="w-full bg-[#B87333] text-white py-4 text-[10px] tracking-luxury uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={14} /> New Product
          </button>
          
          <div className="space-y-1">
            <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-foreground">
              <Settings size={14} /> Settings
            </Link>
            <Link to="/admin/support" className="flex items-center gap-3 px-4 py-2 text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-foreground">
              <HelpCircle size={14} /> Support
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-border flex items-center justify-between px-10">
          <h1 className="font-heading text-lg">Chronos Precision</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Archives..." 
                className="bg-secondary/50 border-none px-4 py-2 text-xs w-64 outline-none focus:ring-1 ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link to="/notifications"><Settings size={18} /></Link>
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold">JD</div>
            </div>
          </div>
        </header>

        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
