import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Share2,
  Printer,
} from "lucide-react";

export default function OrderConfirmationPage() {
  const { id } = useParams();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 animate-fade-in">
      <div className="max-w-xl w-full px-6 text-center">
        <div className="inline-flex items-center justify-center p-6 bg-primary/5 rounded-full mb-8">
          <CheckCircle size={48} className="text-primary" />
        </div>

        <p className="text-[10px] tracking-luxury uppercase text-primary font-bold mb-2">
          Protocol Successful
        </p>
        <h1 className="font-heading text-4xl md:text-5xl mb-6">
          Order <em>Archived</em>
        </h1>

        <div className="bg-secondary/50 p-8 border border-border mb-10 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
            <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">
              Reference Sequence
            </span>
            <span className="font-heading text-lg">#{id}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your horological acquisition has been securely archived. Our master
            craftsmen have initialized the verification sequence, and your
            transmission point has been notified.
          </p>
          <div className="flex gap-4 mt-8">
            <button className="flex-1 border border-border py-3 text-[10px] tracking-luxury uppercase flex items-center justify-center gap-2 hover:bg-secondary transition-colors text-muted-foreground">
              <Printer size={12} /> Documentation
            </button>
            <button className="flex-1 border border-border py-3 text-[10px] tracking-luxury uppercase flex items-center justify-center gap-2 hover:bg-secondary transition-colors text-muted-foreground">
              <Share2 size={12} /> Share Legacy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/order-history"
            className="bg-primary text-primary-foreground py-4 text-[10px] tracking-luxury uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Track Status <Package size={14} />
          </Link>
          <Link
            to="/collection"
            className="border border-foreground py-4 text-[10px] tracking-luxury uppercase flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
          >
            Explore More <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-12 text-[10px] tracking-luxury uppercase text-muted-foreground italic flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-border"></span>
          Precision is our standard
          <span className="w-8 h-px bg-border"></span>
        </div>
      </div>
    </div>
  );
}
