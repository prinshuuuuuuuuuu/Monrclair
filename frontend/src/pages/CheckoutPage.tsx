import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { MapPin, CreditCard, Shield, ChevronRight } from 'lucide-react';

export default function CheckoutPage() {
  const { user } = useAuth();
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
    if (cart.length === 0) navigate('/cart');
    
    // Auto-select default address
    if (user?.addresses) {
      const def = user.addresses.find((a: any) => a.is_default);
      if (def) setSelectedAddressId(def.id);
      else if (user.addresses.length > 0) setSelectedAddressId(user.addresses[0].id);
    }
  }, [user, cart, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      return toast({ title: 'Missing Information', description: 'Please select a logistics transmission point.', variant: 'destructive' });
    }

    setLoading(true);
    try {
      const address = user?.addresses.find((a: any) => a.id === selectedAddressId);
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
    <div className="container py-10 md:py-20 animate-fade-in">
      <div className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground mb-10">
         <span>Boutique</span> <ChevronRight size={10} />
         <span>Collection</span> <ChevronRight size={10} />
         <span className="text-foreground">Logistics Finalization</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left: Addresses & Payment */}
        <div className="space-y-12">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-2xl">Logistics Point</h2>
              <button 
                onClick={() => navigate('/profile')}
                className="text-[10px] tracking-luxury uppercase text-primary border-b border-primary/20"
              >
                Manage Archive
              </button>
            </div>
            
            <div className="space-y-4">
              {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr: any) => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`border p-6 cursor-pointer transition-all duration-500 relative ${
                      selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-heading text-lg">{addr.full_name}</p>
                        <p className="text-xs text-muted-foreground">{addr.street}, {addr.city}</p>
                        <p className="text-[10px] tracking-luxury uppercase italic">{addr.country}</p>
                      </div>
                      {selectedAddressId === addr.id && <MapPin size={16} className="text-primary" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="border border-dashed border-border p-10 text-center space-y-4">
                  <p className="text-xs text-muted-foreground italic">No logistics points registered.</p>
                  <button onClick={() => navigate('/profile')} className="bg-secondary px-6 py-3 text-[10px] tracking-luxury uppercase">Add Address</button>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl mb-6">Payment Protocol</h2>
            <div className="border border-border p-6 opacity-50 cursor-not-allowed flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CreditCard size={20} className="text-muted-foreground" />
                <span className="text-[10px] tracking-luxury uppercase">Secure Card Transmission</span>
              </div>
              <span className="text-[9px] italic">Coming Soon</span>
            </div>
            <div className="mt-4 p-4 bg-secondary/30 border-l-2 border-primary">
              <p className="text-[10px] tracking-luxury uppercase text-primary font-bold">Protocol Offline</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest italic">Mock transaction initialized for laboratory testing.</p>
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div className="bg-secondary/5 border border-border p-10 h-fit sticky top-32">
          <h2 className="font-heading text-2xl mb-8">Summary</h2>
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-sm">
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-secondary/50 p-2">
                      <img src={item.product.image} className="w-full h-full object-contain" />
                   </div>
                   <div>
                      <p className="font-medium text-[12px]">{item.product.name}</p>
                      <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                   </div>
                </div>
                <span className="font-body text-[12px]">CHF {(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 space-y-3">
             <div className="flex justify-between text-[10px] tracking-luxury uppercase text-muted-foreground">
                <span>Subtotal</span>
                <span>CHF {subtotal.toLocaleString()}.00</span>
             </div>
             <div className="flex justify-between text-[10px] tracking-luxury uppercase text-muted-foreground">
                <span>Insurance & Logistics</span>
                <span className="text-primary font-bold">Complimentary</span>
             </div>
             <div className="flex justify-between text-[10px] tracking-luxury uppercase text-muted-foreground">
                <span>VAT (20%)</span>
                <span>CHF {vat.toLocaleString()}.00</span>
             </div>
             <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                <span className="font-heading text-xl uppercase">Total</span>
                <span className="font-heading text-3xl">CHF {total.toLocaleString()}.00</span>
             </div>
          </div>

          <button 
            disabled={loading || !selectedAddressId}
            onClick={handlePlaceOrder}
            className="w-full bg-primary text-primary-foreground py-6 mt-10 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Archiving Transmission...' : 'Complete Finalization'}
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
             <Shield size={20} />
             <p className="text-[9px] tracking-luxury uppercase max-w-[200px] text-center">
              Encrypted transmission protocols active. Your horological legacy is secure.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
