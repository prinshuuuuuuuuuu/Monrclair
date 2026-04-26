import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Camera,
  Package,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Lock,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      fetchAddresses();
      fetchWishlist();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/auth/addresses");
      setAddresses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/store/wishlist");
      setWishlist(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async (dataOverride?: any) => {
    setLoading(true);
    try {
      const dataToSave = dataOverride || profileData;
      await updateProfile(dataToSave);
      toast({
        title: "System Updated",
        description: "Your identity matrix is synchronized.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setProfileData((prev) => ({ ...prev, avatar: base64 }));
        setLoading(true);
        try {
          await updateProfile({ avatar: base64 });
          toast({
            title: "System Updated",
            description: "Your identity matrix is synchronized.",
          });
        } catch (error: any) {
          toast({
            title: "Update Failed",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F6F6F6]">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          accept="image/*"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <div className="mb-10 animate-fade-in text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-heading font-light text-black tracking-tight mb-2">
              Account <span className="italic">Excellence</span>
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-label">
              Manage your elite horology profile
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Sidebar Card */}
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
              <div className="bg-white rounded-3xl border border-[#EFEFEF] p-8 flex flex-col items-center text-center gap-4 shadow-sm">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 p-1 group-hover:border-primary transition-all duration-500">
                    <img
                      src={
                        profileData.avatar ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                      }
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
                    <Camera size={18} className="text-white" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="font-heading text-xl text-black font-medium">
                    {user?.name}
                  </p>
                  <p className="text-xs font-label uppercase tracking-widest text-muted-foreground">{user?.email}</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    Identity Verified
                  </span>
                </div>
              </div>

              {/* Navigation Card */}
              <div className="bg-white rounded-3xl border border-[#EFEFEF] overflow-hidden shadow-sm">
                {[
                  {
                    id: "orders",
                    label: "Order History",
                    icon: Package,
                    link: "/order-history",
                  },
                  {
                    id: "wishlist",
                    label: "Wishlist Gallery",
                    icon: ImageIcon,
                    link: "/wishlist",
                  },
                  {
                    id: "addresses",
                    label: "Delivery Nodes",
                    icon: MapPin,
                    link: "/addresses",
                  },
                  {
                    id: "security",
                    label: "Vault Security",
                    icon: Lock,
                    link: "/security",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.link)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-sm font-label font-bold uppercase tracking-widest text-[#444] hover:bg-primary/5 hover:text-primary transition-all group border-b border-[#F5F5F5] last:border-0"
                  >
                    <item.icon
                      size={16}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                    {item.label}
                    <ChevronRight
                      size={14}
                      className="ml-auto text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 text-[10px] font-label font-bold uppercase tracking-widest text-red-500 hover:bg-red-100 transition-all border border-red-100"
              >
                <LogOut size={16} /> Secure Logout
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full bg-white rounded-3xl border border-[#EFEFEF] overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-[#F5F5F5] bg-secondary/5">
                <p className="text-sm font-label font-bold uppercase tracking-widest text-black">Master Identity</p>
                <p className="text-xs text-muted-foreground mt-1 font-light italic">
                  Update your global synchronization credentials
                </p>
              </div>

              <div className="p-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-6 py-4 text-sm font-medium border border-[#EBEBEB] rounded-2xl bg-secondary/10 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-black transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1">
                      Global Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-6 py-4 text-sm font-medium border border-[#EBEBEB] rounded-2xl bg-secondary/10 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-black transition-all"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1">
                    Verified Email Protocol
                  </label>
                  <div className="w-full px-6 py-5 text-sm font-medium border border-[#EBEBEB] rounded-2xl bg-[#F9F9F9] text-muted-foreground flex items-center justify-between">
                    <span>{user?.email}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        Immutable
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateProfile()}
                  disabled={loading}
                  className="mt-4 w-full py-5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 transition-all duration-500"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Synchronizing...</span>
                    </div>
                  ) : "Update Identity matrix"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
