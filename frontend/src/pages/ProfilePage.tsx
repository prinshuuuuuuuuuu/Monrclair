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
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group p-2.5 rounded-xl bg-white border border-[#EFEFEF] shadow-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                aria-label="Go back"
              >
                <ArrowLeft
                  size={18}
                  className="text-[#666] group-hover:text-primary group-hover:-translate-x-0.5 transition-transform"
                />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight">
                  Account Settings
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Link
                    to="/"
                    className="text-[10px] uppercase tracking-widest text-[#999] hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <span className="text-[#DDD] text-[10px]">/</span>
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                    Profile
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-[#EFEFEF] p-5 flex flex-col items-center text-center gap-3">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={
                      profileData.avatar ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                    }
                    alt="avatar"
                    className="w-20 h-20 rounded-2xl object-cover border border-[#EFEFEF]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                    <Camera size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-black text-base">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#999] mt-0.5">{user?.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B87333] bg-[#FDF3EC] px-3 py-1 rounded-full">
                  Verified
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#EFEFEF] overflow-hidden divide-y divide-[#F5F5F5]">
                {[
                  {
                    id: "orders",
                    label: "Orders",
                    icon: Package,
                    link: "/order-history",
                  },
                  {
                    id: "wishlist",
                    label: "Wishlist",
                    icon: ImageIcon,
                    link: "/wishlist",
                  },
                  {
                    id: "addresses",
                    label: "Addresses",
                    icon: MapPin,
                    link: "/addresses",
                  },
                  {
                    id: "security",
                    label: "Security",
                    icon: Lock,
                    link: "/security",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.link)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#444] hover:bg-[#FAFAFA] hover:text-black transition-all group"
                  >
                    <item.icon
                      size={15}
                      className="text-[#BBB] group-hover:text-[#B87333] transition-colors"
                    />
                    {item.label}
                    <ChevronRight
                      size={13}
                      className="ml-auto text-[#DDD] group-hover:text-[#B87333] transition-colors"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-[#EFEFEF] bg-white text-sm text-[#999] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-[#EFEFEF] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F5F5F5]">
                <p className="text-sm font-semibold text-black">Edit Profile</p>
                <p className="text-xs text-[#AAA] mt-0.5">
                  Update your personal information
                </p>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA] uppercase tracking-wider mb-1.5">
                    Full Name
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
                    className="w-full px-4 py-2.5 text-sm border border-[#EBEBEB] rounded-xl bg-[#FAFAFA] focus:outline-none focus:border-[#B87333] focus:ring-2 focus:ring-[#B87333]/10 text-black transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AAA] uppercase tracking-wider mb-1.5">
                    Phone
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
                    className="w-full px-4 py-2.5 text-sm border border-[#EBEBEB] rounded-xl bg-[#FAFAFA] focus:outline-none focus:border-[#B87333] focus:ring-2 focus:ring-[#B87333]/10 text-black transition-all"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AAA] uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="w-full px-4 py-2.5 text-sm border border-[#EBEBEB] rounded-xl bg-[#F5F5F5] text-[#999] flex items-center justify-between">
                    <span>{user?.email}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B87333]">
                      Verified
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateProfile()}
                  disabled={loading}
                  className="mt-2 w-full py-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 transition-all duration-300"
                >
                  {loading ? "Synchronizing…" : "Save Identity Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
