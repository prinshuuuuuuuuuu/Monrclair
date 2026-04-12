import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, MapPin, Shield, Plus, Trash2, CheckCircle, Smartphone, Package, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateProfile, refreshUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security' | 'orders' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Switzerland',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone || ''
      });
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/auth/addresses');
      setAddresses(data);
    } catch (error) {
      console.error('Failed to fetch addresses');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profileData);
      toast({ title: 'Profile Updated', description: 'Your laboratory identity has been recalibrated.' });
    } catch (error: any) {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast({ title: 'Validation Error', description: 'New passwords do not match.', variant: 'destructive' });
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      toast({ title: 'Security Updated', description: 'Access protocols updated successfully.' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({ title: 'Update Failed', description: error.response?.data?.message || error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/addresses', newAddress);
      toast({ title: 'Address Registered', description: 'New shipping transmission point added.' });
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Switzerland',
        phone: '',
        isDefault: false
      });
      fetchAddresses();
    } catch (error: any) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await api.delete(`/auth/addresses/${id}`);
      fetchAddresses();
      toast({ title: 'Address Purged', description: 'Location transmission data removed.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.put(`/auth/addresses/${id}/default`);
      fetchAddresses();
      toast({ title: 'Protocol Updated', description: 'Default logistics point recalibrated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <div className="mb-10">
            <h1 className="font-heading text-4xl mb-2">My Account</h1>
            <p className="text-[10px] tracking-luxury uppercase text-muted-foreground italic">Laboratory Entity Management</p>
          </div>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-luxury uppercase transition-all duration-500 border",
              activeTab === 'profile' ? "bg-primary text-primary-foreground border-primary" : "border-transparent hover:bg-secondary/30"
            )}
          >
            <User size={14} /> Profile Identity
          </button>
          <button 
            onClick={() => setActiveTab('addresses')}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-luxury uppercase transition-all duration-500 border",
              activeTab === 'addresses' ? "bg-primary text-primary-foreground border-primary" : "border-transparent hover:bg-secondary/30"
            )}
          >
            <MapPin size={14} /> Logistics Archive
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-luxury uppercase transition-all duration-500 border",
              activeTab === 'security' ? "bg-primary text-primary-foreground border-primary" : "border-transparent hover:bg-secondary/30"
            )}
          >
            <Shield size={14} /> Security Protocols
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-luxury uppercase transition-all duration-500 border",
              activeTab === 'orders' ? "bg-primary text-primary-foreground border-primary" : "border-transparent hover:bg-secondary/30"
            )}
          >
            <Package size={14} /> Acquisition Archive
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-luxury uppercase transition-all duration-500 border",
              activeTab === 'notifications' ? "bg-primary text-primary-foreground border-primary" : "border-transparent hover:bg-secondary/30"
            )}
          >
            <Bell size={14} /> Communication Protocol
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[600px] border border-border p-8 md:p-12 animate-fade-in relative bg-secondary/5">
          <div className="absolute top-0 right-0 p-8">
             <div className="w-16 h-[1px] bg-primary/30" />
          </div>

          {activeTab === 'profile' && (
            <div className="max-w-xl animate-fade-up">
              <h2 className="font-heading text-2xl mb-8">Identification Details</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Registered Designation</label>
                  <input 
                    className="w-full bg-background border-b border-border py-3 text-sm focus:border-primary outline-none transition-colors"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Archived Email Transmission</label>
                  <input 
                    disabled
                    className="w-full bg-background/50 border-b border-border py-3 text-sm italic text-muted-foreground cursor-not-allowed outline-none"
                    value={user?.email}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Communication Protocol (Mobile)</label>
                  <input 
                    className="w-full bg-background border-b border-border py-3 text-sm focus:border-primary outline-none transition-colors"
                    placeholder="+x xxx xxxx xxx"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <button 
                  disabled={loading}
                  className="bg-[#B87333] text-white px-10 py-4 text-[10px] tracking-luxury uppercase hover:opacity-90 disabled:opacity-50 transition-all duration-500"
                >
                  {loading ? 'Recalibrating...' : 'Commit Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="animate-fade-up">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-heading text-2xl">Logistics Registry</h2>
                {!showAddressForm && (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="text-[10px] tracking-luxury uppercase text-primary font-bold flex items-center gap-2 border border-primary/20 px-4 py-2 hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus size={14} /> Add Transmission Point
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <div className="max-w-2xl border border-primary/20 p-8 bg-background">
                  <h3 className="text-[10px] tracking-luxury uppercase font-bold mb-8">Register New Location</h3>
                  <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input 
                      required
                      placeholder="Receiver Designation" 
                      className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none w-full"
                      value={newAddress.fullName}
                      onChange={e => setNewAddress({...newAddress, fullName: e.target.value})}
                    />
                    <input 
                      required
                      placeholder="Transmission Phone" 
                      className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none w-full"
                      value={newAddress.phone}
                      onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                    />
                    <div className="md:col-span-2">
                      <input 
                        required
                        placeholder="Logistics Street" 
                        className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none w-full"
                        value={newAddress.street}
                        onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                      />
                    </div>
                    <input 
                      required
                      placeholder="City Registry" 
                      className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none w-full"
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    <input 
                      placeholder="State / Canton" 
                      className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none w-full"
                      value={newAddress.state}
                      onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                    />
                    <input 
                      required
                      placeholder="Security Code (Zip)" 
                      className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none w-full"
                      value={newAddress.zip}
                      onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                    />
                    <select 
                      className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none w-full"
                      value={newAddress.country}
                      onChange={e => setNewAddress({...newAddress, country: e.target.value})}
                    >
                      <option value="Switzerland">Switzerland</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                    
                    <div className="md:col-span-2 flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                      />
                      <label htmlFor="isDefault" className="text-[10px] tracking-luxury uppercase cursor-pointer">Set as Primary Logistics Point</label>
                    </div>

                    <div className="md:col-span-2 flex gap-4 pt-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary text-primary-foreground py-4 text-[10px] tracking-luxury uppercase disabled:opacity-50"
                      >
                        {loading ? 'Transmitting Data...' : 'Initialize Point'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 border border-border py-4 text-[10px] tracking-luxury uppercase hover:bg-secondary"
                      >
                        Abort Registration
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {addresses.length === 0 ? (
                    <div className="col-span-full py-20 border border-dashed border-border flex flex-col items-center justify-center gap-4 opacity-50">
                      <MapPin size={40} className="text-muted-foreground" />
                      <p className="text-[10px] tracking-luxury uppercase">No Active Logistics Points Found</p>
                    </div>
                  ) : addresses.map((addr) => (
                    <div key={addr.id} className={cn(
                      "border p-8 relative group transition-all duration-500",
                      addr.is_default ? "border-primary bg-primary/5 shadow-xl" : "border-border hover:border-primary/50"
                    )}>
                      {addr.is_default && (
                        <div className="absolute -top-3 left-8 bg-primary text-white px-3 py-1 text-[8px] tracking-widest uppercase flex items-center gap-1">
                          <CheckCircle size={10} /> Primary Point
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <h3 className="font-heading text-xl">{addr.full_name}</h3>
                        <div className="space-y-1 text-xs text-muted-foreground leading-relaxed">
                          <p>{addr.street}</p>
                          <p>{addr.city}, {addr.state} {addr.zip}</p>
                          <p className="uppercase tracking-widest text-[10px] pt-1">{addr.country}</p>
                          <p className="flex items-center gap-2 pt-4">
                            <Smartphone size={12} className="text-primary" /> {addr.phone}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                         {!addr.is_default && (
                           <button 
                             onClick={() => handleSetDefault(addr.id)}
                             className="text-[8px] tracking-luxury uppercase font-bold text-primary hover:underline"
                           >
                             Set Primary
                           </button>
                         )}
                         <button 
                           onClick={() => handleDeleteAddress(addr.id)}
                           className="text-red-500 hover:text-red-700 transition-colors"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-xl animate-fade-up">
               <h2 className="font-heading text-2xl mb-10">Access Protocols</h2>
               <form onSubmit={handleChangePassword} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Current Authorization Secret</label>
                    <input 
                      type="password"
                      required
                      className="w-full bg-background border-b border-border py-3 text-sm focus:border-primary outline-none transition-colors"
                      value={securityData.currentPassword}
                      onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">New Access Sequence</label>
                    <input 
                      type="password"
                      required
                      className="w-full bg-background border-b border-border py-3 text-sm focus:border-primary outline-none transition-colors"
                      value={securityData.newPassword}
                      onChange={e => setSecurityData({...securityData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Confirm Sequence</label>
                    <input 
                      type="password"
                      required
                      className="w-full bg-background border-b border-border py-3 text-sm focus:border-primary outline-none transition-colors"
                      value={securityData.confirmPassword}
                      onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={loading}
                    className="bg-primary text-white px-10 py-4 text-[10px] tracking-luxury uppercase hover:opacity-90 disabled:opacity-50 transition-all duration-500"
                  >
                    {loading ? 'Encrypting...' : 'Update Security Sequence'}
                  </button>
               </form>
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="animate-fade-up">
               <h2 className="font-heading text-2xl mb-8">Acquisition Archive</h2>
               <div className="bg-background border border-border p-10 text-center space-y-6">
                  <Package size={40} className="mx-auto text-primary opacity-20" />
                  <p className="text-sm text-muted-foreground italic">Your complete acquisition sequences and transmission history are stored in a dedicated vault.</p>
                  <Link 
                    to="/order-history"
                    className="inline-flex bg-primary text-primary-foreground px-8 py-4 text-[10px] tracking-luxury uppercase hover:opacity-90 transition-opacity"
                  >
                    Access Archive Vault
                  </Link>
               </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="animate-fade-up">
               <h2 className="font-heading text-2xl mb-8">Communication Protocol</h2>
               <div className="space-y-4">
                  {[
                    { title: 'Security Recalibration', text: 'Auth session initialized from new device.', time: '2 hours ago', icon: Shield },
                    { title: 'Logistics Confirmation', text: 'Primary transmission point updated.', time: '5 hours ago', icon: MapPin },
                    { title: 'Order Confirmation', text: 'Archival sequence #1240 has been initialized.', time: '1 day ago', icon: CheckCircle }
                  ].map((notif, i) => (
                    <div key={i} className="border border-border p-6 flex gap-6 items-center hover:bg-white transition-colors">
                       <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-full shrink-0">
                          <notif.icon size={18} className="text-primary" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] tracking-luxury uppercase font-bold text-primary mb-1">{notif.title}</p>
                          <p className="text-sm text-foreground">{notif.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-2 italic">{notif.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-12 p-6 bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <p className="text-[10px] tracking-luxury uppercase font-medium">Automatic SMS/Email Transmission</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
