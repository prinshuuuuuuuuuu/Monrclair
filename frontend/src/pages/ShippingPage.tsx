import { Truck, ShieldCheck, Globe, Clock } from "lucide-react";

export default function ShippingPage() {
  const policies = [
    {
      icon: Globe,
      title: "Global Distribution",
      desc: "We provide secure, insured shipping to over 120 countries worldwide via our premium logistics partners."
    },
    {
      icon: ShieldCheck,
      title: "Fully Insured",
      desc: "All shipments are 100% insured for their full appraisal value from the moment they leave our maison until they reach your hands."
    },
    {
      icon: Clock,
      title: "Express Logistics",
      desc: "Priority handling ensures domestic delivery within 2-3 business days and international delivery within 5-7 business days."
    },
    {
      icon: Truck,
      title: "Discreet Packaging",
      desc: "Our packaging is designed for both security and discretion, with no external brand markings to ensure safe transit."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafb]">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-20">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1e293b] mb-6">Global <span className="text-primary italic">Logistics</span></h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl">
                Our commitment to excellence extends to the final journey of your timepiece. We ensure every delivery is handled with the utmost precision and security.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {policies.map((p, i) => (
                <div key={i} className="bg-white p-10 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-6">
                        <p.icon size={24} />
                    </div>
                    <h3 className="text-xl font-black mb-3">{p.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{p.desc}</p>
                </div>
            ))}
        </div>

        <section className="bg-[#1e293b] text-white p-12 md:p-16 rounded-[3rem]">
            <h2 className="text-3xl font-black mb-8">White Glove Service</h2>
            <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                    For our most exclusive acquisitions, Monrclair offers an optional personal courier service. A member of our concierge team will hand-deliver your timepiece anywhere in the world, ensuring a personal exchange and on-site fitting.
                </p>
                <div className="h-px bg-white/10 w-full" />
                <p className="text-sm font-bold text-primary italic lowercase tracking-widest">
                    Contact your personal concierge to arrange white glove delivery.
                </p>
            </div>
        </section>
      </div>
    </div>
  );
}
