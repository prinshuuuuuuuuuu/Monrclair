import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User, MapPin, Shield, Plus, Trash2, Camera,
  Smartphone, Package, Heart, LogOut, Verified, Menu, ShoppingBag, Grid, Search,
  ChevronRight, Settings, Bell, Mail, Edit3, ArrowLeft, Lock, ShieldCheck, Eye, EyeOff, Key, X,
  Navigation, CheckCircle2, Globe, Building2, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'addresses' | 'security' | 'orders' | 'wishlist'>('overview');
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
      fetchAddresses();
      fetchWishlist();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/auth/addresses');
      setAddresses(data);
    } catch (error) { console.error(error); }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/store/wishlist');
      setWishlist(data);
    } catch (error) { console.error(error); }
  };

  const handleUpdateProfile = async (dataOverride?: any) => {
    setLoading(true);
    try {
      const dataToSave = dataOverride || profileData;
      await updateProfile(dataToSave);
      toast({ title: 'System Updated', description: 'Your identity matrix is synchronized.' });
    } catch (error: any) {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
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
        // Update local UI immediately
        setProfileData(prev => ({ ...prev, avatar: base64 }));

        // Sync with backend immediately - only send the avatar to avoid data overlap
        setLoading(true);
        try {
          await updateProfile({ avatar: base64 });
          toast({ title: 'System Updated', description: 'Your identity matrix is synchronized.' });
        } catch (error: any) {
          toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.08] grayscale blur-sm"
        style={{
          backgroundImage: 'url("/profile-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <Grid size={1200} strokeWidth={0.5} />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      {/* Floating Dashboard Container - 50% width style */}
      <div className="w-full max-w-5xl bg-white rounded-[64px] shadow-2xl shadow-black/[0.04] border border-[#F0F0F0] overflow-hidden relative z-10 animate-fade-up">

        {/* Top Control Bar - Reduced Space */}
        <div className="px-8 py-4 border-b border-[#F9F9F9] flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-3 bg-[#F9F9F9] rounded-xl hover:bg-black hover:text-white transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <button onClick={() => navigate('/')} className="p-3 bg-[#F9F9F9] rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-8 md:p-12 pt-6 md:pt-8 space-y-12">
          {activeTab === 'overview' ? (
            <div className="space-y-10">
              {/* Profile Header - Symmetrical Center */}
              <div className="flex flex-col items-center gap-10">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-48 h-48 rounded-[48px] overflow-hidden border border-[#F0F0F0] shadow-sm">
                    <img
                      src={profileData.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-[48px] backdrop-blur-xs">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>

                <div className="text-center space-y-4 pt-4">
                  <div className="space-y-1">
                    <h2 className="font-headline text-5xl text-black flex items-center justify-center gap-3">
                      {user?.name} <Verified className="text-[#B87333]" size={24} />
                    </h2>
                  </div>
                  <div className="bg-[#F9F9F9] px-6 py-3 rounded-2xl inline-flex items-center gap-3 border border-[#F0F0F0]">
                    <Mail size={14} className="text-[#B87333]" />
                    <p className="font-body text-sm text-black font-medium">{user?.email}</p>
                  </div>


                </div>
              </div>

              {/* Navigation Grid - 4 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'orders', title: 'Order History', icon: Package, link: '/order-history', sub: 'Procurements' },
                  { id: 'wishlist', title: 'Private Gallery', icon: ImageIcon, link: '/wishlist', sub: 'Exhibits' },
                  { id: 'security', title: 'Change Password', icon: Lock, link: '/security', sub: 'Access Keys' },
                  { id: 'addresses', title: 'Addresses', icon: MapPin, link: '/addresses', sub: 'Local Stations' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => item.link ? navigate(item.link) : setActiveTab(item.id as any)}
                    className="p-8 bg-[#FBFBFB] border border-[#F5F5F5] rounded-[48px] hover:border-[#B87333]/30 hover:bg-white transition-all flex flex-col items-center justify-center text-center gap-6 group hover:shadow-xl hover:shadow-black/[0.02]"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:bg-[#B87333] group-hover:text-white transition-all duration-500 shadow-sm">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h5 className="font-headline text-xl text-black group-hover:text-[#B87333] transition-colors">{item.title}</h5>
                      <p className="text-[9px] font-label uppercase tracking-[0.2em] text-secondary opacity-40 font-bold">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in space-y-12">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-3 text-[10px] font-label uppercase tracking-widest text-[#B87333] font-bold"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>


              {/* Add other tab contents here if needed, keeping them compact */}
              {activeTab === 'security' && <p className="text-center py-20 opacity-30 italic">Security Modulation Protocols Active...</p>}
              {activeTab === 'addresses' && <p className="text-center py-20 opacity-30 italic">Logistics Matrix synchronized...</p>}
            </div>
          )}
        </div>

        {/* Global Technical Footer */}

      </div>
    </div>
  );
}
