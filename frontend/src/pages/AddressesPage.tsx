import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Home, Globe, ArrowLeft, CheckCircle2,
  Navigation, Mail, Building, Search, ExternalLink, MapPin, X, Edit3, Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function AddressesPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'Switzerland',
    phone: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/auth/addresses');
      setAddresses(data);
    } catch (error) {
      console.error('Failed to fetch addresses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/auth/addresses/${editingId}`, formData);
        toast({ title: 'Node Calibrated', description: 'Logistics transmission point successfully updated.' });
      } else {
        await api.post('/auth/addresses', formData);
        toast({ title: 'Node Initialized', description: 'Logistics transmission point successfully archived.' });
      }

      handleCloseForm();
      fetchAddresses();
      refreshUser();
    } catch (error: any) {
      toast({ title: 'Protocol Failure', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr: any) => {
    setEditingId(addr.id);
    setFormData({
      full_name: addr.full_name,
      street: addr.street,
      city: addr.city,
      state: addr.state || '',
      zip_code: addr.zip || addr.zip_code || '',
      country: addr.country,
      phone: addr.phone,
      is_default: addr.is_default
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ full_name: '', street: '', city: '', state: '', zip_code: '', country: 'Switzerland', phone: '', is_default: false });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/auth/addresses/${id}`);
      toast({ title: 'Node Deactivated', description: 'Transmission point removed from registry.' });
      fetchAddresses();
      refreshUser();
    } catch (error: any) {
      toast({ title: 'Deactivation Failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.put(`/auth/addresses/${id}/default`);
      toast({ title: 'Primary Node Set', description: 'Standard logistics target modulated.' });
      fetchAddresses();
      refreshUser();
    } catch (error: any) {
      console.error(error);
    }
  };

  if (loading && addresses.length === 0) return (
    <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center p-6">
      <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-32 pb-24 px-6 lg:px-20 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <button
              onClick={() => navigate('/profile')}
              className="group flex items-center gap-2 text-[9px] font-label uppercase tracking-widest text-[#B87333] hover:opacity-70 transition-all font-bold"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <div className="space-y-2">
              <p className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary/60 font-bold">Logistics Registry</p>
              <h1 className="font-headline text-5xl lg:text-6xl text-black">Saved <em className="text-[#B87333] not-italic">Addresses</em></h1>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => showForm ? handleCloseForm() : setShowForm(true)}
              className="bg-black text-white px-10 py-5 rounded-2xl text-[10px] font-label uppercase tracking-widest font-bold flex items-center gap-3 hover:bg-[#B87333] transition-all shadow-xl shadow-black/5"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel Protocol" : "Add New Node"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-20 bg-white border border-[#F0F0F0] rounded-[40px] p-10 md:p-14 shadow-2xl shadow-black/[0.02] animate-fade-up">
            <div className="mb-10 flex items-center gap-4 text-[#B87333]">
              {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
              <h2 className="font-headline text-3xl italic">{editingId ? "Modulate Node Protocol" : "Initialize New Node"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-label uppercase tracking-widest text-secondary opacity-50 font-bold px-1">Receiver Name</label>
                  <input
                    required
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-4 rounded-xl text-sm focus:border-[#B87333] outline-none transition-all font-body"
                    placeholder="JONATHAN REED"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-label uppercase tracking-widest text-secondary opacity-50 font-bold px-1">Contact Link</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-4 rounded-xl text-sm focus:border-[#B87333] outline-none transition-all font-body"
                    placeholder="+41 00 000 0000"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[9px] font-label uppercase tracking-widest text-secondary opacity-50 font-bold px-1">Street / Block Architecture</label>
                  <input
                    required
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-4 rounded-xl text-sm focus:border-[#B87333] outline-none transition-all font-body"
                    placeholder="123 WATCHMAKERS ALLEY"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-label uppercase tracking-widest text-secondary opacity-50 font-bold px-1">City Hub</label>
                  <input
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-4 rounded-xl text-sm focus:border-[#B87333] outline-none transition-all font-body"
                    placeholder="GENEVA"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-label uppercase tracking-widest text-secondary opacity-50 font-bold px-1">Postcode</label>
                  <input
                    required
                    value={formData.zip_code}
                    onChange={e => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-4 rounded-xl text-sm focus:border-[#B87333] outline-none transition-all font-body"
                    placeholder="1201"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 rounded-2xl font-label text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#B87333] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "PROCESSING..." : (editingId ? "Calibrate Archive" : "Initialize Transmission Point")}
                {editingId ? <Save size={14} /> : <Navigation size={14} />}
              </button>
            </form>
          </div>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="text-center py-32 bg-white border border-[#F0F0F0] rounded-[40px] shadow-sm flex flex-col items-center gap-8">
            <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center">
              <MapPin size={40} className="text-secondary/20" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-2xl">No Archives Found</h3>
              <p className="text-secondary text-xs uppercase tracking-widest opacity-60">Your logistics registry is currently void.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-12 py-5 text-[10px] font-label tracking-widest uppercase hover:bg-[#B87333] transition-colors rounded-3xl"
            >
              Add First Address
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {addresses.map((addr) => (
              <div key={addr.id} className={cn(
                "bg-white border border-[#F0F0F0] rounded-[40px] overflow-hidden hover:border-[#B87333]/20 transition-all shadow-sm hover:shadow-2xl hover:shadow-[#B87333]/5 group",
                addr.is_default && "border-[#B87333]/30 shadow-xl shadow-black/[0.01]"
              )}>
                {/* Address Top Strip */}
                <div className="bg-[#FAFAFA] px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#F5F5F5]">
                  <div className="flex flex-wrap gap-10">
                    <div className="space-y-1">
                      <p className="font-label text-[8px] uppercase tracking-widest text-secondary/50 font-bold">Node ID</p>
                      <p className="font-headline text-base text-black">#ADR-{addr.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-label text-[8px] uppercase tracking-widest text-secondary/50 font-bold">Receiver</p>
                      <p className="font-body text-xs text-black font-medium">{addr.full_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-label text-[8px] uppercase tracking-widest text-secondary/50 font-bold">Region</p>
                      <p className="font-headline text-base text-black">{addr.country}</p>
                    </div>
                  </div>

                  {addr.is_default ? (
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full text-[9px] font-label uppercase tracking-widest font-bold border border-green-600/10 bg-green-50 text-green-600">
                      <CheckCircle2 size={14} /> Primary Site
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[9px] font-label uppercase tracking-widest text-secondary opacity-40 hover:opacity-100 transition-all font-bold"
                    >
                      Initialize as Primary
                    </button>
                  )}
                </div>

                {/* Address Content */}
                <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="flex gap-8 items-center flex-1">
                    <div className="w-20 h-20 bg-[#F9F9F9] rounded-3xl flex items-center justify-center border border-[#F0F0F0] group-hover:border-[#B87333]/20 transition-all">
                      <Home size={32} className="text-secondary opacity-20" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-headline text-2xl text-black leading-tight">{addr.street}</h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-label uppercase tracking-widest text-secondary/60">{addr.city}, {addr.zip_code || addr.zip}</p>
                        <div className="w-1 h-1 bg-[#EAEAEA] rounded-full"></div>
                        <p className="text-[10px] font-label uppercase tracking-widest text-black font-bold">Contact: {addr.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="flex-1 md:flex-none border border-red-50 text-red-300 px-8 py-4 text-[9px] font-label tracking-widest uppercase hover:bg-red-50 hover:text-red-500 transition-all rounded-2xl flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} /> Purge Node
                    </button>
                    <button
                      onClick={() => handleEdit(addr)}
                      className="flex-1 md:flex-none border border-[#F0F0F0] text-secondary px-8 py-4 text-[9px] font-label tracking-widest uppercase hover:bg-[#F9F9F9] transition-all rounded-2xl flex items-center justify-center gap-2 font-bold"
                    >
                      Edit Protocol <Edit3 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Technical Registry Footnote */}
        <div className="mt-40 border-t border-[#F0F0F0] pt-20 pb-20 flex flex-col md:flex-row justify-between items-center gap-8 text-secondary opacity-20 text-[9px] font-label tracking-widest uppercase font-bold">
          <div className="flex gap-12">
            <p>Registry_Hash: ADR_MOD_v4</p>
            <p>Sync_Status: Stable</p>
          </div>
          <p>Atelier Clinical Registry // Logistics Module</p>
        </div>
      </div>
    </div>
  );
}
