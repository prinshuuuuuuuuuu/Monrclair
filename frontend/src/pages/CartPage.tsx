import { Link } from 'react-router-dom';
import { Minus, Plus, X, Shield, Award } from 'lucide-react';
import { products } from '@/data/products';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const [coupon, setCoupon] = useState('');

  const cartItems = cart.map((ci) => {
    const product = products.find((p) => p.id === ci.productId)!;
    return { ...ci, product };
  }).filter((ci) => ci.product);

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-3xl mb-4">Your Collection</h1>
        <p className="text-muted-foreground mb-6">Your bag is empty.</p>
        <Link to="/collection" className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-luxury uppercase">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl mb-10">Your Collection</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-8">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-6 pb-8 border-b border-border">
              <Link to={`/product/${product.id}`} className="w-32 h-32 bg-secondary shrink-0">
                <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-contain p-3" />
              </Link>
              <div className="flex-1">
                <p className="text-[10px] tracking-luxury uppercase text-muted-foreground">Reference: {product.reference}</p>
                <h3 className="font-heading text-lg mt-1">{product.name}</h3>
                <span className="text-primary font-body">${(product.price * quantity).toLocaleString()}.00</span>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-border">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-2 hover:bg-secondary">
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm">{String(quantity).padStart(2, '0')}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-2 hover:bg-secondary">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-secondary p-8">
          <h2 className="font-heading text-lg font-bold tracking-luxury uppercase mb-6">Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">Subtotal</span>
              <span>${subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">Insurance & Delivery</span>
              <span className="text-primary">Complimentary</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">VAT (Estimated)</span>
              <span>${vat.toLocaleString()}.00</span>
            </div>
          </div>
          <div className="border-t border-border mt-6 pt-6 flex justify-between items-center">
            <span className="font-heading text-lg">Total</span>
            <span className="font-heading text-2xl">${total.toLocaleString()}.00</span>
          </div>

          {/* Coupon */}
          <div className="mt-6">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code"
              className="w-full bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground border border-border mb-2"
            />
          </div>

          <button className="w-full bg-primary text-primary-foreground py-4 mt-4 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity">
            Proceed to Checkout
          </button>
          <p className="text-[9px] tracking-luxury uppercase text-muted-foreground text-center mt-3">
            Secured Payment & Insured Worldwide Courier Delivery
          </p>

          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield size={14} /> <span className="tracking-luxury uppercase">5-Year International Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award size={14} /> <span className="tracking-luxury uppercase">Certified Authenticity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
