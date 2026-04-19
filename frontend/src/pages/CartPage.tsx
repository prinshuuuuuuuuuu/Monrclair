import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  Tag,
  ArrowRight,
  Package,
  Truck,
  IndianRupee,
} from "lucide-react";
import { products } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const cartItems = cart
    .map((ci) => {
      const product = products.find((p) => p.id === ci.productId)!;
      return { ...ci, product };
    })
    .filter((ci) => ci.product);

  const subtotal = cartItems.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag size={32} className="text-muted-foreground" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl mb-3">
            Your bag is empty
          </h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Discover our curated collection of timepieces crafted for the
            discerning.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-xs tracking-[0.2em] uppercase rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Browse Collection
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="mb-8 md:mb-12">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl">
            Your <span className="text-[#b87333]">Collection</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="xl:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="group bg-card border border-border rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-secondary rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      Ref. {product.reference}
                    </p>
                    <h3 className="font-heading text-base sm:text-lg mt-0.5 truncate">
                      {product.name}
                    </h3>
                    <p className="text-primary font-semibold text-lg sm:text-xl mt-1 flex items-center gap-0.5">
                      <IndianRupee size={16} strokeWidth={2.5} />
                      <span>
                        {(product.price * quantity).toLocaleString()}.00
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <div className="flex items-center bg-secondary rounded-xl overflow-hidden border border-border">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-primary/10 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 sm:w-10 text-center text-sm font-medium">
                        {String(quantity).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-primary/10 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="flex items-center gap-1.5 text-[10px] sm:text-xs tracking-wide text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/5"
                    >
                      <X size={11} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {[
                { icon: Package, label: "Gift Wrapped", sub: "Complimentary" },
                {
                  icon: Truck,
                  label: "White Glove Delivery",
                  sub: "Insured & Tracked",
                },
                {
                  icon: Tag,
                  label: "Authenticity",
                  sub: "Certificate Included",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="bg-secondary/60 border border-border rounded-xl p-3 sm:p-4 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold leading-tight">
                      {label}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm sticky top-6">
              <div className="bg-primary/5 border-b border-border px-6 py-5">
                <h2 className="font-heading text-lg tracking-wide">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="text-sm font-semibold flex items-center gap-0.5">
                      <IndianRupee size={12} strokeWidth={2.5} />
                      {subtotal.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                      Insurance & Delivery
                    </span>
                    <span className="text-xs font-medium text-primary">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                      VAT (Estimated)
                    </span>
                    <span className="text-sm font-semibold flex items-center gap-0.5">
                      <IndianRupee size={12} strokeWidth={2.5} />
                      {vat.toLocaleString()}.00
                    </span>
                  </div>
                </div>

                <div className="border-t border-border" />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-heading text-base">Total</span>
                  <span className="font-heading text-2xl flex items-center gap-1 text-primary">
                    <IndianRupee size={20} strokeWidth={2.5} />
                    {total.toLocaleString()}.00
                  </span>
                </div>

                <div className="bg-secondary/60 rounded-xl p-4 space-y-2.5 border border-border">
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-muted-foreground" />
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                      Promo Code
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 transition-colors"
                    />
                    <button
                      onClick={() => coupon && setCouponApplied(true)}
                      className="px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] tracking-[0.1em] uppercase rounded-lg transition-colors font-medium whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[10px] text-primary">
                      ✓ Coupon applied successfully
                    </p>
                  )}
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-[0.2em] uppercase hover:opacity-90 active:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
