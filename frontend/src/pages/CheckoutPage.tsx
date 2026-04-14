import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { MapPin, CreditCard, Shield, ChevronRight, Truck, CheckCircle2, Navigation, Plus } from 'lucide-react';

export default function CheckoutPage() {
  const { user, refreshUser } = useAuth();
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const cartItems = cart.map((ci) => {
    const product = products.find((p) => p.id === ci.productId)!;
    return { ...ci, product };
  }).filter((ci) => ci.product);

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;

  useEffect(() => {
    if (!user) navigate('/auth');
    if (cart.length === 0 && !loading) navigate('/cart');

    refreshUser(); // Ensure fresh addresses
  }, []);

  useEffect(() => {
    if (user?.addresses) {
      const def = user.addresses.find((a: any) => a.is_default);
      if (def) setSelectedAddressId(def.id);
      else if (user.addresses.length > 0 && !selectedAddressId) setSelectedAddressId(user.addresses[0].id);
    }
  }, [user?.addresses]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      return toast({ title: 'Missing Information', description: 'Please select a logistics transmission point.', variant: 'destructive' });
    }

    setLoading(true);
    try {
      const address = user?.addresses?.find((a: any) => a.id === selectedAddressId);
      const res = await api.post('/orders', {
        cartItems: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.product.price })),
        totalAmount: total,
        shippingAddress: address
      });

      await clearCart();
      toast({ title: 'Transaction Successful', description: 'Order archived and transmission initialized.' });
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (error: any) {
      toast({ title: 'Transaction Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-32 pb-24 px-6 lg:px-20 animate-fade-in relative overflow-hidden">
      {/* Background Decorative */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] flex items-center justify-center">
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 text-[10px] font-label uppercase tracking-[0.4em] text-secondary opacity-40 mb-16">
          <span>Boutique</span> <ChevronRight size={10} />
          <span>Procurement</span> <ChevronRight size={10} />
          <span className="text-black font-bold opacity-100">Logistics Matrix</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-20">
          {/* Left: Addresses & Payment */}
          <div className="lg:col-span-7 space-y-16">
            <section className="space-y-10">
              <div className="flex justify-between items-end border-b border-[#F0F0F0] pb-8">
                <div className="space-y-2">
                  <p className="font-label text-[10px] uppercase tracking-widest text-[#B87333] font-bold">Protocol 01</p>
                  <h2 className="font-headline text-4xl italic">Logistics Node</h2>
                </div>
                <button
                  onClick={() => navigate('/addresses')}
                  className="flex items-center gap-2 text-[9px] font-label uppercase tracking-widest text-secondary hover:text-black transition-all font-bold border-b border-transparent hover:border-current"
                >
                  <Plus size={12} /> Manage Archive
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr: any) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative overflow-hidden group border rounded-[32px] p-8 cursor-pointer transition-all duration-700 ${
                        selectedAddressId === addr.id 
                          ? 'border-[#B87333] bg-white shadow-2xl shadow-[#B87333]/5' 
                          : 'border-[#F0F0F0] bg-white/50 hover:border-[#B87333]/30'
                      }`}
                    >
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              selectedAddressId === addr.id ? 'bg-[#B87333] text-white' : 'bg-[#F9F9F9] text-secondary/40'
                            }`}>
                              <Navigation size={14} />
                            </div>
                            <h3 className="font-headline text-2xl font-light">{addr.full_name}</h3>
                          </div>
                          <div className="space-y-1 ps-11">
                            <p className="text-secondary text-sm font-body opacity-60 leading-relaxed">{addr.street}, {addr.city}, {addr.zip_code}</p>
                            <p className="text-[10px] font-label uppercase tracking-[0.2em] text-[#B87333] font-bold">{addr.country}</p>
                          </div>
                        </div>
                        {selectedAddressId === addr.id && (
                          <div className="flex items-center gap-2 text-[9px] font-label uppercase tracking-widest text-[#B87333] font-bold bg-[#B87333]/5 px-4 py-2 rounded-full animate-fade-in">
                            <CheckCircle2 size={12} /> Target Active
                          </div>
                        )}
                      </div>
                      {/* Decorative Background Symbol */}
                      <MapPin className={`absolute -bottom-4 -right-4 size-24 transition-all duration-1000 ${
                        selectedAddressId === addr.id ? 'text-[#B87333] opacity-[0.05] rotate-12 scale-110' : 'text-black opacity-[0.02]'
                      }`} />
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-[#F0F0F0] rounded-[48px] p-20 text-center space-y-8 bg-white/30 backdrop-blur-sm">
                    <p className="font-headline text-3xl opacity-30 italic">No logistics points detected.</p>
                    <button 
                      onClick={() => navigate('/addresses')} 
                      className="bg-black text-white px-12 py-5 text-[10px] font-label tracking-widest uppercase hover:bg-[#B87333] transition-all rounded-3xl shadow-xl shadow-black/5"
                    >
                      Initialize Archive
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-10">
              <div className="flex justify-between items-end border-b border-[#F0F0F0] pb-8">
                <div className="space-y-2">
                  <p className="font-label text-[10px] uppercase tracking-widest text-[#B87333] font-bold">Protocol 02</p>
                  <h2 className="font-headline text-4xl italic">Payment Matrix</h2>
                </div>
              </div>
              <div className="border border-[#F0F0F0] bg-white/30 p-8 rounded-[32px] opacity-40 grayscale flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <CreditCard size={24} className="text-secondary" />
                  <span className="font-label text-[10px] tracking-[0.3em] uppercase font-bold">Secure Merchant Transmission</span>
                </div>
                <span className="font-label text-[9px] italic uppercase tracking-widest">Awaiting API Decryption</span>
              </div>
              <div className="p-6 bg-[#B87333]/5 border-l-2 border-[#B87333] rounded-r-3xl">
                <p className="font-label text-[10px] tracking-[0.2em] uppercase text-[#B87333] font-bold">Live Environment Testing</p>
                <p className="text-[11px] font-body text-secondary mt-1 opacity-70 leading-relaxed uppercase tracking-tighter">Automatic registry verification initialized. Proceed to finalization.</p>
              </div>
            </section>
          </div>

          {/* Right: Summary Container */}
          <div className="lg:col-span-5 h-fit sticky top-32">
            <div className="bg-white border border-[#F0F0F0] rounded-[56px] p-10 md:p-14 shadow-2xl shadow-black/[0.02] space-y-12">
              <h2 className="font-headline text-4xl border-b border-[#F9F9F9] pb-8">Aquisition <em className="text-[#B87333] not-italic">Brief</em></h2>
              
              <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center group">
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 bg-[#FBFBFB] border border-[#F5F5F5] rounded-2xl p-3 group-hover:border-[#B87333]/30 transition-all">
                        <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-headline text-lg group-hover:text-[#B87333] transition-colors">{item.product.name}</p>
                        <p className="font-label text-[9px] uppercase tracking-widest text-secondary opacity-40 font-bold">Node QTY: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-label text-[11px] font-bold">CHF {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-[#F9F9F9]">
                <div className="flex justify-between text-[10px] font-label uppercase tracking-widest text-secondary opacity-60 font-bold">
                  <span>Subtotal Matrix</span>
                  <span>CHF {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-[10px] font-label uppercase tracking-widest text-secondary opacity-60 font-bold">
                  <span>Logistics Protocol</span>
                  <span className="text-[#B87333]">Complimentary</span>
                </div>
                <div className="flex justify-between text-[10px] font-label uppercase tracking-widest text-secondary opacity-60 font-bold">
                  <span>Registry VAT (20%)</span>
                  <span>CHF {vat.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-black/5 mt-4">
                  <span className="font-headline text-3xl">Total</span>
                  <span className="font-headline text-5xl text-[#B87333]">CHF {total.toLocaleString()}.00</span>
                </div>
              </div>

              <button
                disabled={loading || !selectedAddressId}
                onClick={handlePlaceOrder}
                className="w-full bg-black text-white py-8 rounded-[32px] font-label text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-[#B87333] transition-all shadow-2xl shadow-black/10 disabled:opacity-50 flex items-center justify-center gap-4 group"
              >
                {loading ? 'ARCHIVING...' : 'Complete Finalization'}
                <Truck size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="flex flex-col items-center gap-4 opacity-30">
                <Shield size={20} />
                <p className="text-[10px] font-label tracking-[0.2em] uppercase max-w-[220px] text-center leading-relaxed font-bold">
                  Encrypted transmission protocols active. Your horological legacy is secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}