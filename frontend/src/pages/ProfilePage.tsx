import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Package,
  Lock,
  Camera,
  Verified,
  Mail,
  ArrowLeft,
  X,
  Image as ImageIcon,
  ChevronRight,
  Phone,
  Edit2,
  Check,
  LogOut,
  Shield,
  Bell,
  User,
  Heart,
  History,
  Settings,
  CreditCard,
  CreditCard as PaymentIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ─────────────────────────────────────────────
   Types
 ───────────────────────────────────────────── */
type PanelId = "orders" | "wishlist" | "security" | "addresses" | "payments" | null;

interface NavItem {
  id: PanelId;
  label: string;
  sub: string;
  icon: React.ElementType;
  description: string;
}

/* ─────────────────────────────────────────────
   Panel Content Component
 ───────────────────────────────────────────── */
function PanelContent({ id }: { id: PanelId }) {
  if (!id) return null;

  const panels: Record<NonNullable<PanelId>, React.ReactNode> = {
    orders: (
      <div className="space-y-4 py-2">
        {[
          { id: "#ORD‑9182", item: "Antique Bronze Vase", status: "Delivered", date: "Apr 10, 2026", price: "₹4,200", img: "https://images.unsplash.com/photo-1578500484748-482c361e515d?w=100&h=100&fit=crop" },
          { id: "#ORD‑8741", item: "Silk Cushion Set", status: "In Transit", date: "Apr 14, 2026", price: "₹2,800", img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=100&h=100&fit=crop" },
          { id: "#ORD‑8209", item: "Marble Table Lamp", status: "Processing", date: "Apr 15, 2026", price: "₹6,500", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop" },
        ].map((o) => (
          <div key={o.id} className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-[#F0F0F0] hover:border-[#B87333]/30 transition-all group cursor-pointer shadow-sm hover:shadow-md">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
               <img src={o.img} alt={o.item} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-black truncate">{o.item}</p>
                <p className="text-sm font-black text-[#B87333]">{o.price}</p>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mb-2">{o.id} • {o.date}</p>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider",
                  o.status === "Delivered" && "bg-green-50 text-green-600 border border-green-100",
                  o.status === "In Transit" && "bg-blue-50 text-blue-600 border border-blue-100",
                  o.status === "Processing" && "bg-amber-50 text-amber-600 border border-amber-100",
                )}>{o.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    wishlist: (
      <div className="grid grid-cols-2 gap-4 py-2">
        {[
          { name: "Gold Leaf Mirror", price: "₹12,000", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop" },
          { name: "Ceramic Vase", price: "₹3,400", img: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=300&h=300&fit=crop" },
          { name: "Linen Throw", price: "₹1,800", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop" },
          { name: "Brass Candle Stand", price: "₹2,200", img: "https://images.unsplash.com/photo-1603205431551-0af42dd6af02?w=300&h=300&fit=crop" },
        ].map((p) => (
          <div key={p.name} className="relative group rounded-3xl overflow-hidden border border-[#F0F0F0] bg-white hover:shadow-xl transition-all duration-500">
            <div className="aspect-[4/5] overflow-hidden bg-gray-50">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-red-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Heart size={14} fill="currentColor" />
              </button>
            </div>
            <div className="p-4 bg-white">
              <p className="text-xs font-bold text-black truncate mb-1">{p.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-[#B87333] font-black">{p.price}</p>
                <button className="text-[10px] font-bold text-black border-b border-black pb-0.5 hover:text-[#B87333] hover:border-[#B87333] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    security: (
      <div className="space-y-3 py-2">
        {[
          { label: "Password", icon: Lock, desc: "Last updated 32 days ago", action: "Change" },
          { label: "Two-Factor Authentication", icon: Shield, desc: "Add an extra layer of security", action: "Enable" },
          { label: "Login Notifications", icon: Bell, desc: "Active on primary devices", action: "Configure" },
          { label: "Active Sessions", icon: History, desc: "Logged in on 2 devices", action: "Manage" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-[#F0F0F0] hover:border-[#B87333]/30 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#B87333]/5 flex items-center justify-center shrink-0 group-hover:bg-[#B87333]/10 transition-colors">
              <s.icon size={18} className="text-[#B87333]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-black">{s.label}</p>
              <p className="text-[11px] text-gray-400 font-medium">{s.desc}</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-gray-50 text-[11px] font-bold text-black hover:bg-[#B87333] hover:text-white transition-all">
              {s.action}
            </button>
          </div>
        ))}
      </div>
    ),
    addresses: (
      <div className="space-y-4 py-2">
        {[
          { tag: "Home", addr: "42, Shyamal Cross Roads, Satellite, Ahmedabad – 380015", primary: true, icon: MapPin },
          { tag: "Work", addr: "501, Titanium City Centre, Anand Nagar, Ahmedabad – 380051", primary: false, icon: Package },
        ].map((a) => (
          <div key={a.tag} className="p-5 rounded-3xl bg-white border border-[#F0F0F0] hover:border-[#B87333]/30 transition-all shadow-sm relative overflow-hidden group">
             {a.primary && (
               <div className="absolute top-0 right-0 px-3 py-1 bg-[#B87333]/10 text-[#B87333] text-[9px] font-black uppercase tracking-widest rounded-bl-2xl border-b border-l border-[#B87333]/20">
                 Default
               </div>
             )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <a.icon size={16} className="text-[#B87333]" />
              </div>
              <h4 className="text-sm font-bold text-black">{a.tag} Address</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4 pr-10">{a.addr}</p>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-black transition-colors">
                <Edit2 size={14} />
              </button>
              <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        <button className="w-full py-5 rounded-3xl border-2 border-dashed border-[#E8E8E8] text-sm text-gray-400 hover:border-[#B87333] hover:text-[#B87333] hover:bg-[#B87333]/5 transition-all font-bold flex flex-col items-center justify-center gap-2 bg-white">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
            <span className="text-xl">+</span>
          </div>
          Add New Delivery Point
        </button>
      </div>
    ),
    payments: (
      <div className="space-y-4 py-2">
         {[
          { brand: "Visa", last4: "4242", expiry: "12/28", type: "Credit Card", primary: true },
          { brand: "Mastercard", last4: "8891", expiry: "05/27", type: "Debit Card", primary: false },
        ].map((card) => (
          <div key={card.last4} className="p-6 rounded-[32px] bg-gradient-to-br from-black to-zinc-800 text-white shadow-xl shadow-black/10 relative overflow-hidden group">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#B87333]/20 rounded-full blur-[60px] group-hover:bg-[#B87333]/30 transition-all duration-700" />
             <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-8 bg-zinc-700/50 backdrop-blur-md rounded-lg flex items-center justify-center border border-zinc-600">
                   <div className="w-4 h-3 bg-amber-400/40 rounded-sm" />
                </div>
                {card.primary && <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Primary</span>}
             </div>
             <div className="mb-6">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mb-1">Card Number</p>
                <p className="text-lg font-mono tracking-[0.2em]">•••• •••• •••• {card.last4}</p>
             </div>
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mb-1">Expiry</p>
                   <p className="text-sm font-bold">{card.expiry}</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black italic">{card.brand}</p>
                </div>
             </div>
          </div>
        ))}
        <button className="w-full py-5 rounded-3xl border-2 border-dashed border-[#E8E8E8] text-sm text-gray-400 hover:border-[#B87333] hover:text-[#B87333] hover:bg-[#B87333]/5 transition-all font-bold flex items-center justify-center gap-3 bg-white">
          <CreditCard size={18} /> Add New Payment Method
        </button>
      </div>
    )
  };
  return panels[id!] ?? null;
}

/* ─────────────────────────────────────────────
   Main Profile Page Component
 ───────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, phone: user.phone || "", avatar: user.avatar || "" });
    }
  }, [user]);

  const handleUpdateProfile = async (overrides?: Partial<typeof profileData>) => {
    setLoading(true);
    try {
      await updateProfile({ ...profileData, ...overrides });
      toast({ title: "Profile Updated", description: "Your changes have been saved." });
      setEditingName(false);
    } catch (e: any) {
      toast({ title: "Update Failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setProfileData((p) => ({ ...p, avatar: base64 }));
      await handleUpdateProfile({ avatar: base64 });
    };
    reader.readAsDataURL(file);
  };

  const navItems: NavItem[] = [
    { id: "orders", label: "Orders", sub: "History", description: "Track your antique collection and orders", icon: Package },
    { id: "wishlist", label: "Wishlist", sub: "Gallery", description: "Your curated list of luxury items", icon: Heart },
    { id: "addresses", label: "Addresses", sub: "Details", description: "Manage your delivery and billing points", icon: MapPin },
    { id: "payments", label: "Payments", sub: "Methods", description: "Securely manage your payment options", icon: PaymentIcon },
    { id: "security", label: "Security", sub: "Privacy", description: "Update passwords and secure your account", icon: Shield },
  ];

  const openPanel = (id: PanelId) => {
    setActivePanel(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4 sm:p-8 font-sans">
    
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

     
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
       
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[48px] p-8 lg:p-10 shadow-2xl shadow-black/[0.03] border border-[#F0F0F0] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87333]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#B87333]/10 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
               <button onClick={() => navigate(-1)} className="absolute left-0 top-0 p-3 rounded-2xl hover:bg-gray-50 text-gray-400 transition-all">
                  <ArrowLeft size={18} />
               </button>

              
               <div className="relative mb-8 mt-4">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[40px] p-1.5 bg-gradient-to-tr from-[#B87333] to-amber-200 shadow-xl shadow-[#B87333]/20 transition-transform duration-500 hover:scale-105">
                     <div className="w-full h-full rounded-[36px] overflow-hidden bg-white border-2 border-white relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <img
                          src={profileData.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt="profile"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Camera size={24} className="text-white" />
                        </div>
                        {loading && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <div className="w-6 h-6 border-3 border-[#B87333] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-2xl flex items-center justify-center border border-[#F0F0F0]">
                     <Verified size={20} className="text-[#B87333]" />
                  </div>
               </div>

        
               <div className="mb-10 w-full px-4">
                 {editingName ? (
                   <div className="flex items-center gap-2 justify-center">
                     <input
                       autoFocus
                       value={profileData.name}
                       onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                       className="text-center text-2xl font-black text-black border-none outline-none bg-transparent w-full"
                     />
                     <div className="flex gap-1">
                        <button onClick={() => handleUpdateProfile()} className="p-2 bg-[#B87333] text-white rounded-xl shadow-lg shadow-[#B87333]/20">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingName(false)} className="p-2 bg-gray-100 text-gray-500 rounded-xl">
                          <X size={14} />
                        </button>
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-1">
                      <div className="flex items-center justify-center gap-3">
                        <h1 className="text-2xl font-black text-black tracking-tight">{user?.name}</h1>
                        <button onClick={() => setEditingName(true)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-300 hover:text-[#B87333] transition-all">
                          <Edit2 size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-gray-400">{user?.email}</p>
                   </div>
                 )}
               </div>

               {/* Contact Pills */}
               <div className="grid grid-cols-2 gap-3 w-full mb-8">
                  <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-3xl bg-[#FAFAF9] border border-[#F0F0F0]">
                     <Phone size={14} className="text-[#B87333]" />
                     <span className="text-[11px] font-bold text-gray-600">{profileData.phone || "Add Phone"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-3xl bg-[#FAFAF9] border border-[#F0F0F0]">
                     <Mail size={14} className="text-[#B87333]" />
                     <span className="text-[11px] font-bold text-gray-600">Verified</span>
                  </div>
               </div>

               {/* Stats / Quick Info */}
               <div className="flex justify-between w-full px-4 py-6 border-t border-b border-[#F5F5F5] mb-8">
                  <div className="text-center">
                     <p className="text-xs font-black text-black">12</p>
                     <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Orders</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center">
                     <p className="text-xs font-black text-black">₹45k</p>
                     <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Spent</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center">
                     <p className="text-xs font-black text-black">8</p>
                     <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Saved</p>
                  </div>
               </div>

               <button onClick={logout} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:tracking-[0.3em] transition-all duration-300">
                  <LogOut size={14} /> Sign Out Account
               </button>
            </div>
          </div>
        </div>

        {/* ── Right: Navigation Grid ── */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
           {navItems.map((item, idx) => (
             <button
               key={item.id}
               onClick={() => openPanel(item.id)}
               style={{ animationDelay: `${idx * 100}ms` }}
               className="group p-6 rounded-[36px] bg-white border border-[#F0F0F0] hover:border-[#B87333]/50 hover:shadow-2xl hover:shadow-[#B87333]/5 transition-all duration-500 text-left relative overflow-hidden animate-slide-up"
             >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#B87333]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-[#B87333]/10 flex items-center justify-center mb-6 group-hover:bg-[#B87333] transition-colors duration-500">
                     <item.icon size={20} className="text-[#B87333] group-hover:text-white transition-colors duration-500" />
                   </div>
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black text-black tracking-tight">{item.label}</h3>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#B87333] group-hover:translate-x-1 transition-all" />
                   </div>
                   <p className="text-xs font-medium text-gray-400 leading-relaxed">{item.description}</p>
                   
                   <div className="mt-6 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#B87333] bg-[#B87333]/10 px-3 py-1 rounded-full">{item.sub}</span>
                   </div>
                </div>
             </button>
           ))}

        </div>
      </div>

      {/* ── Detail Panel Popup (Dialog) ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl sm:rounded-[40px] border-none shadow-3xl p-0 overflow-hidden bg-[#FAFAF9]">
           <div className="h-[80vh] sm:h-auto max-h-[85vh] flex flex-col">
              {/* Custom Header */}
              <div className="bg-white px-8 py-6 border-b border-[#F5F5F5] sticky top-0 z-20">
                 <div className="flex items-center justify-between">
                    <div>
                       <DialogTitle className="text-2xl font-black tracking-tight text-black">
                         {navItems.find(n => n.id === activePanel)?.label}
                       </DialogTitle>
                       <DialogDescription className="text-xs font-bold uppercase tracking-widest text-[#B87333] mt-1">
                         {navItems.find(n => n.id === activePanel)?.sub} Details
                       </DialogDescription>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-3 rounded-2xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                    >
                       <X size={20} />
                    </button>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
                 <PanelContent id={activePanel} />
              </div>

              <div className="bg-white px-8 py-4 border-t border-[#F5F5F5] flex justify-end gap-3 sticky bottom-0 z-20">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                 >
                   Dismiss
                 </button>
                 <button className="px-8 py-3 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#B87333] transition-colors shadow-lg shadow-black/10">
                    Refresh List
                 </button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}