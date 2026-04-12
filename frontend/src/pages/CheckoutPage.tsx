import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { MapPin, CreditCard, Shield, ChevronRight, Plus, X, Truck, CheckCircle, Lock, Smartphone, QrCode, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { user, refreshUser } = useAuth();
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('upi');
  
  // UPI / Polling State
  const [upiData, setUpiData] = useState<{ link: string; paymentId: string } | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string>('idle');

  // New Address State
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

  const cartItems = cart.map((ci) => {
    const product = products.find((p) => p.id === ci.productId)!;
    return { ...ci, product };
  }).filter((ci) => ci.product);

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;

  const qrUrl = useMemo(() => {
    if (!upiData) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiData.link)}`;
  }, [upiData]);

  useEffect(() => {
    if (!user) navigate('/auth');
    if (cart.length === 0) navigate('/cart');
    
    if (user?.addresses) {
      const def = user.addresses.find((a: any) => a.is_default);
      if (def) setSelectedAddressId(def.id);
      else if (user.addresses.length > 0) setSelectedAddressId(user.addresses[0].id);
    }
  }, [user, cart, navigate]);

  // Polling Effect
  useEffect(() => {
    let interval: any;
    if (upiData && pollingStatus === 'polling') {
      interval = setInterval(async () => {
        try {
          const { data } = await api.get(`/orders/check-status/${upiData.paymentId}`);
          if (data.status === 'processing') {
            setPollingStatus('success');
            clearInterval(interval);
            toast({ title: 'Payment Success', description: 'Transaction verified and archived.' });
            await clearCart();
            setTimeout(() => navigate('/order-history'), 2000);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [upiData, pollingStatus, navigate, clearCart]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/addresses', newAddress);
      await refreshUser();
      setSelectedAddressId(data.id);
      setShowNewAddressForm(false);
      toast({ title: 'Location Registered', description: 'Logistics data synchronized.' });
    } catch (error: any) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      return toast({ title: 'Logistics Missing', description: 'Please choose a delivery transmission point.', variant: 'destructive' });
    }

    setLoading(true);
    try {
      const address = user?.addresses?.find((a: any) => a.id === selectedAddressId);
      const { data } = await api.post('/orders', {
        cartItems: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.product.price })),
        totalAmount: total,
        shippingAddress: address
      });
      
      setUpiData({ link: data.upiLink, paymentId: data.paymentId });
      setPollingStatus('polling');
      toast({ title: 'Protocol Initialized', description: 'Legacy sequence created. Awaiting settlement.' });
    } catch (error: any) {
      toast({ title: 'Transmission Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const simulateSuccess = async () => {
    if (!upiData) return;
    try {
      await api.post('/orders/verify-payment', { paymentId: upiData.paymentId });
    } catch (err) {
      toast({ title: 'Simulation Error', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-16 animate-fade-in font-medium">
           <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')}>Home</span> 
           <ChevronRight size={10} />
           <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/cart')}>Cart</span> 
           <ChevronRight size={10} />
           <span className="text-primary font-bold">Secure Settlement</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-24">
          <div className="flex-1 space-y-20 animate-fade-up">
            <div className="space-y-4">
               <h1 className="font-heading text-4xl md:text-5xl italic tracking-tight text-neutral-900">Finalization Sequence.</h1>
               <div className="h-px w-24 bg-primary/30" />
            </div>

            <section className="space-y-10">
              <div className="flex justify-between items-end border-b border-black/5 pb-6">
                <div className="flex items-center gap-5">
                   <div className="p-3 bg-white border border-neutral-100 shadow-sm text-primary">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <h2 className="text-[11px] tracking-[0.3em] uppercase font-black text-neutral-800">Distrubution Point</h2>
                      <p className="text-[10px] text-muted-foreground italic mt-1 tracking-widest uppercase">Select receiving terminal</p>
                   </div>
                </div>
                {!showNewAddressForm && (
                  <button 
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-primary font-bold hover:underline"
                  >
                    <Plus size={14} /> Add Terminal
                  </button>
                )}
              </div>

              {showNewAddressForm ? (
                <div className="p-8 border border-neutral-200 bg-white shadow-xl animate-fade-up relative overflow-hidden">
                   <button onClick={() => setShowNewAddressForm(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-black">
                      <X size={20} />
                   </button>
                   <h3 className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 mb-10">Terminal Registration</h3>
                   <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      <div className="space-y-2">
                         <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Receiver Designation</label>
                         <input required className="w-full border-b border-neutral-200 py-3 text-sm focus:border-primary outline-none transition-colors italic" placeholder="Name" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Communication ID</label>
                         <input required className="w-full border-b border-neutral-200 py-3 text-sm focus:border-primary outline-none transition-colors italic" placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Street Address</label>
                         <input required className="w-full border-b border-neutral-200 py-3 text-sm focus:border-primary outline-none transition-colors italic" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                      </div>
                      <div className="flex gap-10 md:col-span-2">
                        <input required className="flex-1 border-b border-neutral-200 py-3 text-sm focus:border-primary outline-none transition-colors italic" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                        <input required className="w-32 border-b border-neutral-200 py-3 text-sm focus:border-primary outline-none transition-colors italic" placeholder="ZIP" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                      </div>
                      <div className="md:col-span-2 pt-6">
                        <button disabled={loading} className="w-full md:w-fit bg-neutral-900 text-white px-12 py-5 text-[10px] tracking-widest uppercase font-black hover:bg-primary transition-all shadow-lg">
                           Archive Point
                        </button>
                      </div>
                   </form>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {user?.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr: any) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={cn(
                          "cursor-pointer p-8 bg-white border transition-all duration-700 relative group",
                          selectedAddressId === addr.id ? "border-primary shadow-2xl scale-[1.02]" : "border-neutral-200 hover:border-primary/50"
                        )}
                      >
                         <div className="flex justify-between items-start mb-6">
                            <h3 className="font-heading text-xl">{addr.full_name}</h3>
                            {selectedAddressId === addr.id && <CheckCircle className="text-primary" size={18} />}
                         </div>
                         <div className="space-y-1 text-xs text-neutral-500 italic uppercase tracking-widest">
                            <p>{addr.street}</p>
                            <p>{addr.city}, {addr.zip}</p>
                         </div>
                         {selectedAddressId === addr.id && <div className="absolute top-0 right-0 h-1 w-12 bg-primary" />}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full border border-dashed border-neutral-300 p-20 flex flex-col items-center justify-center bg-white/50 group hover:border-primary transition-colors">
                       <MapPin className="text-neutral-300 group-hover:text-primary transition-colors mb-4" size={32} />
                       <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-6">Logistics Matrix Empty</p>
                       <button onClick={() => setShowNewAddressForm(true)} className="bg-neutral-900 text-white px-8 py-4 text-[10px] tracking-widest uppercase font-bold hover:bg-primary">Initialize Terminal</button>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="space-y-10">
               <div className="flex items-center gap-5 border-b border-black/5 pb-6">
                  <div className="p-3 bg-white border border-neutral-100 shadow-sm text-neutral-400 group-hover:text-primary transition-colors">
                     <CreditCard size={20} />
                  </div>
                  <div>
                     <h2 className="text-[11px] tracking-[0.3em] uppercase font-black text-neutral-800">Settlement Matrix</h2>
                     <p className="text-[10px] text-muted-foreground italic mt-1 tracking-widest uppercase">Verified payment protocols</p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div 
                    onClick={() => setPaymentMethod('upi')}
                    className={cn(
                      "p-8 border bg-white transition-all cursor-pointer relative overflow-hidden group",
                      paymentMethod === 'upi' ? "border-primary shadow-xl" : "border-neutral-200 hover:border-primary/50"
                    )}
                  >
                     <div className="flex items-center gap-4 mb-6">
                        <div className={cn("p-2 rounded-full", paymentMethod === 'upi' ? "bg-primary text-white" : "bg-neutral-100")}>
                           <Smartphone size={16} />
                        </div>
                        <span className="font-heading text-lg">UPI Instant</span>
                     </div>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed italic">
                        Secured transmission via GPay, PhonePe, or Paytm. High-priority clearance.
                     </p>
                     {paymentMethod === 'upi' && <div className="absolute bottom-0 right-0 p-4 animate-bounce"><ArrowRight size={14} className="text-primary" /></div>}
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      "p-8 border bg-white transition-all cursor-pointer relative opacity-60",
                      paymentMethod === 'card' ? "border-primary shadow-xl opacity-100" : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                     <div className="flex items-center gap-4 mb-6">
                        <div className={cn("p-2 rounded-full", paymentMethod === 'card' ? "bg-primary text-white" : "bg-neutral-100")}>
                           <CreditCard size={16} />
                        </div>
                        <span className="font-heading text-lg italic">Offline Secure</span>
                     </div>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed italic">
                        Manual verification protocol. Temporary sandbox clearance initialized.
                     </p>
                  </div>
               </div>

               {paymentMethod === 'upi' && upiData && (
                 <div className="border border-primary/20 bg-primary/[0.02] p-10 animate-fade-up flex flex-col items-center text-center space-y-8">
                    <div className="space-y-2">
                       <h4 className="text-[11px] tracking-[0.4em] uppercase font-black text-primary">
                        {pollingStatus === 'polling' ? 'Biometric Handshake Required' : 'Handshake Verified'}
                       </h4>
                       <p className="text-[10px] text-neutral-400 italic uppercase">
                        {pollingStatus === 'polling' ? 'Complete settlement via UPI Application' : 'Success Protocol Registered'}
                       </p>
                    </div>

                    {pollingStatus === 'polling' ? (
                      <>
                        <div className="relative group">
                          <div className="p-4 bg-white border border-neutral-100 shadow-2xl relative z-10">
                              <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48" />
                          </div>
                          <div className="absolute inset-0 bg-primary blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                          <a href={upiData.link} className="flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white text-[10px] tracking-widest uppercase font-black hover:bg-neutral-800 transition-all rounded shadow-lg">
                              <Smartphone size={14} /> Launch Pay App
                          </a>
                          <button onClick={simulateSuccess} className="flex items-center gap-3 px-8 py-4 bg-white border border-neutral-200 text-primary text-[10px] tracking-widest uppercase font-black hover:bg-neutral-50 transition-all rounded shadow-md">
                              <CheckCircle size={14} /> Demo: Verify Success
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-10 flex flex-col items-center gap-4 text-primary bg-white border border-primary/10 shadow-lg animate-bounce">
                         <p className="text-[12px] tracking-[0.5em] uppercase font-black">Transmission Verified</p>
                      </div>
                    )}

                    <p className="text-[9px] text-neutral-400/60 max-w-sm uppercase tracking-widest leading-loose">
                      Scanning this protocol identifies payment ID {upiData.paymentId} with the distribution ledger.
                    </p>
                 </div>
               )}
            </section>
          </div>

          <aside className="w-full lg:w-[480px]">
             <div className="bg-white border border-neutral-200 p-12 sticky top-32 shadow-2xl shadow-neutral-200 ring-1 ring-black/[0.03]">
                <h2 className="font-heading text-3xl italic tracking-tight mb-12 text-neutral-900 underline underline-offset-8 decoration-primary/20">Archive Summary.</h2>
                
                <div className="space-y-8 mb-12">
                   {cartItems.map((item) => (
                     <div key={item.productId} className="flex gap-6 group">
                        <div className="w-20 h-20 bg-neutral-50 p-4 border border-neutral-100 relative overflow-hidden">
                           <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" alt={item.product.name} />
                        </div>
                        <div className="flex-1 py-1">
                           <p className="text-[11px] tracking-widest uppercase font-black mb-1">{item.product.name}</p>
                           <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-muted-foreground">
                              <span>Units: {item.quantity}</span>
                              <span className="text-neutral-900 font-bold italic">CHF {item.product.price.toLocaleString()}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-8 border-t border-neutral-100 space-y-4">
                   <div className="flex justify-between text-[11px] tracking-widest uppercase text-neutral-400">
                      <span>Subtotal Ledger</span>
                      <span className="text-neutral-800">CHF {subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-[11px] tracking-widest uppercase text-neutral-400">
                      <span>Distribution</span>
                      <span className="text-primary font-bold">Complimentary</span>
                   </div>
                   <div className="flex justify-between text-[11px] tracking-widest uppercase text-neutral-400">
                      <span>VAT (Precision 20%)</span>
                      <span className="text-neutral-800 font-medium">CHF {vat.toLocaleString()}</span>
                   </div>
                   
                   <div className="pt-10 space-y-4">
                      <div className="flex justify-between items-baseline">
                         <span className="text-[12px] tracking-[0.5em] uppercase font-black text-neutral-300">Total</span>
                         <span className="font-heading text-5xl text-neutral-800 italic">CHF {total.toLocaleString()}</span>
                      </div>
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                   </div>
                </div>

                <div className="mt-12 space-y-6">
                   <button 
                     disabled={loading || !selectedAddressId || pollingStatus === 'polling'}
                     onClick={handlePlaceOrder}
                     className={cn(
                       "w-full py-6 text-[11px] tracking-[0.4em] uppercase font-black flex items-center justify-center gap-4 transition-all duration-700 shadow-xl",
                       (selectedAddressId && pollingStatus !== 'polling') 
                         ? "bg-neutral-900 text-white hover:bg-primary shadow-primary/20" 
                         : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                     )}
                   >
                     {loading ? <Lock className="animate-spin" size={12} /> : <Shield size={14} />}
                     {loading ? 'Transmitting Data...' : (pollingStatus === 'polling' ? 'Polling Protocol...' : 'Verify & Initialize')}
                   </button>
                   
                   {!selectedAddressId && (
                     <p className="text-[9px] tracking-widest uppercase text-primary font-bold text-center animate-pulse italic">
                        Select a distribution point to authorize transmission
                     </p>
                   )}
                </div>

                <div className="mt-16 flex flex-col items-center gap-5 opacity-40 text-center grayscale">
                   <div className="flex items-center gap-6">
                      <Shield size={16} />
                      <Lock size={16} />
                      <CheckCircle size={16} />
                   </div>
                   <p className="text-[8px] tracking-[0.3em] uppercase max-w-[280px] leading-loose font-medium">
                    State-of-the-Art Transmission Security Provided by Montclair Horology Syndicate. 256-bit Encrypted Protocols.
                   </p>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
