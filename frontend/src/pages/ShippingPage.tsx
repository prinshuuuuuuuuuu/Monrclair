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
    <div className="min-h-screen pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-[#fafafb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

        <header className="mb-10 sm:mb-14 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#1e293b] mb-3 sm:mb-4 lg:mb-6">
            Global{" "}
            <span className="text-primary italic">Logistics</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            Our commitment to excellence extends to the final journey of your timepiece.
            We ensure every delivery is handled with the utmost precision and security.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-8 mb-10 sm:mb-14 lg:mb-20">
          {policies.map((p, i) => (
            <div
              key={i}
              className="bg-white p-6 sm:p-7 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-secondary flex items-center justify-center text-primary mb-4 sm:mb-5 lg:mb-6 group-hover:scale-105 transition-transform duration-300">
                <p.icon size={20} className="sm:hidden" />
                <p.icon size={22} className="hidden sm:block lg:hidden" />
                <p.icon size={24} className="hidden lg:block" />
              </div>
              <h3 className="text-base sm:text-lg font-black mb-2 sm:mb-3 text-[#1e293b]">
                {p.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <section className="bg-[#1e293b] text-white p-7 sm:p-10 lg:p-16 rounded-2xl sm:rounded-3xl lg:rounded-[3rem]">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-5 sm:mb-6 lg:mb-8">
            White Glove Service
          </h2>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-white/70 leading-relaxed">
            <p className="text-xs sm:text-sm lg:text-base">
              For our most exclusive acquisitions, Monrclair offers an optional personal
              courier service. A member of our concierge team will hand-deliver your
              timepiece anywhere in the world, ensuring a personal exchange and on-site fitting.
            </p>
            <div className="h-px bg-white/10 w-full" />
            <p className="text-xs sm:text-sm font-bold text-primary italic lowercase tracking-widest">
              Contact your personal concierge to arrange white glove delivery.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}