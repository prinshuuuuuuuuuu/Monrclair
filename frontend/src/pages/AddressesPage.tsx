import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Home,
  ArrowLeft,
  CheckCircle2,
  Navigation,
  MapPin,
  X,
  Edit3,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function AddressesPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "Switzerland",
    phone: "",
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/auth/addresses");
      setAddresses(data);
    } catch (error) {
      console.error("Failed to fetch addresses");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/auth/addresses/${editingId}`, formData);
        toast({
          title: "Node Calibrated",
          description: "Logistics transmission point successfully updated.",
        });
      } else {
        await api.post("/auth/addresses", formData);
        toast({
          title: "Node Initialized",
          description: "Logistics transmission point successfully archived.",
        });
      }
      handleCloseForm();
      fetchAddresses();
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Protocol Failure",
        description: error.message,
        variant: "destructive",
      });
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
      state: addr.state || "",
      zip_code: addr.zip || addr.zip_code || "",
      country: addr.country,
      phone: addr.phone,
      is_default: addr.is_default,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      full_name: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "Switzerland",
      phone: "",
      is_default: false,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/auth/addresses/${id}`);
      toast({
        title: "Node Deactivated",
        description: "Transmission point removed from registry.",
      });
      fetchAddresses();
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Deactivation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.put(`/auth/addresses/${id}/default`);
      toast({
        title: "Primary Node Set",
        description: "Standard logistics target modulated.",
      });
      fetchAddresses();
      refreshUser();
    } catch (error: any) {
      console.error(error);
    }
  };

  if (loading && addresses.length === 0)
    return (
      <div className="min-h-screen bg-[#F9F6F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border border-[#B87333]/20 rounded-full" />
            <div className="absolute inset-0 border border-t-[#B87333] rounded-full animate-spin" />
          </div>
          <p className="text-[9px] font-label uppercase tracking-[0.45em] text-[#B87333]/50 font-bold">
            Loading Registry
          </p>
        </div>
      </div>
    );

  const inputClass =
    "w-full bg-white border border-[#E8E2D9] px-4 py-3.5 rounded-xl text-sm text-[#1A1714] placeholder-[#C5BFB7] focus:border-[#B87333] focus:ring-2 focus:ring-[#B87333]/10 outline-none transition-all duration-200 font-body";

  const labelClass =
    "block text-[9px] font-label uppercase tracking-[0.4em] text-[#A09890] font-bold mb-1.5 px-0.5";

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #8B6240 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <header className="relative border-b border-[#EAE4DA] bg-white/80 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B87333]/6 rounded-full blur-3xl translate-x-24 -translate-y-20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10">
          <button
            onClick={() => navigate("/profile")}
            className="group inline-flex items-center gap-2 mb-8 text-[9px] font-label uppercase tracking-[0.4em] text-[#B87333] hover:text-[#9A6228] transition-colors font-bold"
          >
            <ArrowLeft
              size={12}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-headline text-[2.6rem] sm:text-5xl lg:text-6xl text-[#1A1714] leading-[0.92] tracking-tight">
                Saved <em className="text-[#B87333] not-italic">Addresses</em>
              </h1>
            </div>

            <button
              onClick={() => (showForm ? handleCloseForm() : setShowForm(true))}
              className={cn(
                "self-start sm:self-auto inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-[10px] font-label uppercase tracking-[0.3em] font-bold transition-all duration-300",
                showForm
                  ? "bg-[#F0EBE3] text-[#9A6228] hover:bg-[#E8E0D4] border border-[#DDD5C8]"
                  : "bg-[#1A1714] text-white hover:bg-[#B87333] shadow-lg shadow-[#1A1714]/15 hover:shadow-[#B87333]/20",
              )}
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? "Cancel" : "Add Address"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-14">
        {showForm && (
          <div className="mb-8 sm:mb-12">
            <div className="relative bg-white border border-[#E5DDD2] rounded-3xl overflow-hidden shadow-xl shadow-black/[0.04]">
              <div className="h-px bg-gradient-to-r from-transparent via-[#B87333]/50 to-transparent" />

              <div className="p-6 sm:p-10 lg:p-12">
                <div className="flex items-center gap-3 mb-8 pb-7 border-b border-[#F0EAE1]">
                  <div className="w-9 h-9 bg-[#B87333]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    {editingId ? (
                      <Edit3 size={15} className="text-[#B87333]" />
                    ) : (
                      <Plus size={15} className="text-[#B87333]" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-headline text-xl sm:text-2xl text-[#1A1714] italic">
                      {editingId ? "Edit Address" : "New Address"}
                    </h2>
                    <p className="text-[9px] font-label uppercase tracking-[0.4em] text-[#B0A89E] mt-0.5">
                      {editingId
                        ? "Update delivery details"
                        : "Add delivery location"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-7">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input
                        required
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                        className={inputClass}
                        placeholder="Jonathan Reed"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Contact Number</label>
                      <input
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className={inputClass}
                        placeholder="+41 00 000 0000"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Street Address</label>
                      <input
                        required
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        className={inputClass}
                        placeholder="123 Watchmakers Alley"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>City / State</label>
                      <input
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className={inputClass}
                        placeholder="Geneva"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Pincode</label>
                      <input
                        required
                        value={formData.zip_code}
                        onChange={(e) =>
                          setFormData({ ...formData, zip_code: e.target.value })
                        }
                        className={inputClass}
                        placeholder="1201"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1A1714] text-white py-4 rounded-2xl font-label text-[10px] uppercase tracking-[0.35em] font-bold hover:bg-[#B87333] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-black/10 hover:shadow-[#B87333]/20"
                  >
                    {loading
                      ? "Processing..."
                      : editingId
                        ? "Update Address"
                        : "Save Address"}
                    {!loading &&
                      (editingId ? (
                        <Save size={13} />
                      ) : (
                        <Navigation size={13} />
                      ))}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="relative bg-white border border-[#E5DDD2] rounded-3xl overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#B87333]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col items-center text-center px-6 py-24 sm:py-32 gap-5">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#F5EFE8] to-[#FAF6F1] rounded-2xl flex items-center justify-center border border-[#E8E0D4] shadow-sm">
                  <MapPin size={30} className="text-[#C9A882]" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#B87333]/20 rounded-full" />
              </div>

              <div className="space-y-1.5 max-w-[220px]">
                <h3 className="font-headline text-2xl sm:text-3xl text-[#1A1714]">
                  No Addresses
                </h3>
                <p className="text-[11px] text-[#9A9390] font-body leading-relaxed">
                  Add a delivery address to get started.
                </p>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="mt-1 inline-flex items-center gap-2 bg-[#1A1714] text-white px-8 py-4 text-[10px] font-label tracking-[0.3em] uppercase hover:bg-[#B87333] transition-all duration-300 rounded-2xl shadow-md shadow-black/10 hover:shadow-[#B87333]/20"
              >
                <Plus size={13} />
                Add Address
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={cn(
                  "group relative bg-white border rounded-3xl overflow-hidden transition-all duration-300",
                  addr.is_default
                    ? "border-[#B87333]/30 shadow-md shadow-[#B87333]/8"
                    : "border-[#E5DDD2] shadow-sm hover:border-[#C9A882]/40 hover:shadow-md hover:shadow-black/[0.05]",
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 p-5 sm:p-7 lg:p-8">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                    <div
                      className={cn(
                        "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-300",
                        addr.is_default
                          ? "bg-[#B87333]/10 border-[#B87333]/20"
                          : "bg-[#F7F3EE] border-[#EAE3D9] group-hover:border-[#C9A882]/30",
                      )}
                    >
                      <Home
                        size={20}
                        className={cn(
                          "transition-colors",
                          addr.is_default ? "text-[#B87333]" : "text-[#B5ADA5]",
                        )}
                      />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="font-headline text-lg sm:text-xl lg:text-2xl text-[#1A1714] leading-snug truncate">
                        {addr.street}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-[11px] font-body text-[#9A9390]">
                          {addr.city}, {addr.zip_code || addr.zip}
                        </span>
                        <span className="hidden sm:block w-px h-3 bg-[#DDD8D0]" />
                        <span className="text-[11px] font-body text-[#6E6660] font-semibold">
                          {addr.phone}
                        </span>
                        <span className="hidden sm:block w-px h-3 bg-[#DDD8D0]" />
                        <span className="text-[11px] font-body text-[#9A9390]">
                          {addr.full_name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 border border-[#E5DDD2] text-[#6E6660] px-4 sm:px-5 py-3 text-[9px] font-label tracking-[0.3em] uppercase hover:bg-[#F7F3EE] hover:border-[#C9A882]/40 hover:text-[#9A6228] active:scale-[0.98] transition-all duration-200 rounded-xl font-bold"
                    >
                      <Edit3 size={12} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 border border-red-100/80 text-red-300 px-4 sm:px-5 py-3 text-[9px] font-label tracking-[0.3em] uppercase hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-[0.98] transition-all duration-200 rounded-xl font-bold"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
