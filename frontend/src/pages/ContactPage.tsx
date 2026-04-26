import { useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  ExternalLink,
  Plus,
  Minus,
  Locate,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const fieldCls = [
  "w-full",
  "bg-slate-600/50",
  "border border-slate-500",
  "rounded-xl",
  "px-4",
  "text-sm",
  "font-medium",
  "text-white",
  "placeholder:text-slate-400",
  "focus:outline-none",
  "focus:border-primary",
  "focus:ring-1 focus:ring-primary",
  "transition-all duration-200",
  "hover:border-slate-400",
].join(" ");

function LeafletMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const COORDS: [number, number] = [40.7488, -74.0039];

    const map = L.map(containerRef.current, {
      center: COORDS,
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 },
    ).addTo(map);

    const pin = L.divIcon({
      className: "",
      html: `<div style="
               width:30px;height:30px;
               background:#6366f1;
               border:3px solid #fff;
               border-radius:50% 50% 50% 0;
               transform:rotate(-45deg);
               box-shadow:0 4px 14px rgba(0,0,0,.3);
             "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -34],
    });

    L.marker(COORDS, { icon: pin })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:sans-serif;font-size:12px;font-weight:700;
                     color:#111;line-height:1.6">
           Montclair Flagship Boutique
           <br/><span style="font-weight:400;color:#666;font-size:11px">
             123 Luxury Avenue, NY 10001
           </span>
         </div>`,
        { maxWidth: 210, closeButton: false },
      )
      .openPopup();

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const resetView = () => mapRef.current?.setView([40.7488, -74.0039], 15);

  const ctrlBtn =
    "w-8 h-8 rounded-lg bg-background border border-border/60 flex items-center justify-center " +
    "text-foreground shadow-sm hover:bg-primary hover:text-white hover:border-primary " +
    "transition-all duration-200 active:scale-90 cursor-pointer select-none";

  return (
    <div className="relative w-full h-56 sm:h-64 lg:h-56 bg-muted/30">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute top-3 right-3 z-[999] flex flex-col gap-1.5">
        <button onClick={zoomIn} className={ctrlBtn} aria-label="Zoom in">
          <Plus size={14} strokeWidth={2.5} />
        </button>
        <button onClick={zoomOut} className={ctrlBtn} aria-label="Zoom out">
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <button
          onClick={resetView}
          className={`${ctrlBtn} mt-1`}
          aria-label="Reset view"
        >
          <Locate size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-background transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <header className="mb-10 md:mb-14 text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black tracking-tighter text-foreground leading-tight">
            How May We <span className="text-primary italic">Assist You?</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Connect with our horological experts for private viewings, technical
            support, or collection inquiries.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-heading font-bold tracking-tight text-foreground">
                Our Maison
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Experience our collections firsthand at our global flagship
                locations. Our specialists are dedicated to providing a tailored
                acquisition experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {[
                {
                  icon: MapPin,
                  title: "Flagship Boutique",
                  value: "123 Luxury Avenue, Fashion District, NY 10001",
                  sub: "Open Daily: 10AM - 8PM",
                },
                {
                  icon: Phone,
                  title: "Private Line",
                  value: "+1 (555) 000-1234",
                  sub: "Priority Support for Collectors",
                },
                {
                  icon: Mail,
                  title: "Correspondence",
                  value: "concierge@montclair.com",
                  sub: "Replies within 4 working hours",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-2xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/20 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-foreground font-bold text-sm mb-0.5">
                      {item.value}
                    </p>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2.5 bg-background border-b border-border/40">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                    Our Location
                  </span>
                </div>
                <a
                  href="https://www.google.com/maps/search/Fashion+District,+New+York"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                >
                  Open Directions <ExternalLink size={9} />
                </a>
              </div>

              <LeafletMap />

              <div className="bg-background px-4 py-2 flex items-center gap-2 border-t border-border/40">
                <Clock size={11} className="text-muted-foreground shrink-0" />
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Mon – Sun · 10:00 AM – 8:00 PM
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center gap-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Follow Our Journey
              </p>
              <div className="flex gap-3">
                {[FaInstagram, FaTwitter, FaFacebook].map((Social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
                  >
                    <Social size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-7 md:p-10 rounded-3xl shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-7">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">
                    Send a Message
                  </p>
                  <h3 className="text-xl md:text-2xl font-heading font-black tracking-tight text-white">
                    Dispatch an Inquiry
                  </h3>
                </div>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Alexander Vance"
                        className={`${fieldCls} h-12`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="av@montclair.com"
                        className={`${fieldCls} h-12`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className={`${fieldCls} h-12`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        Inquiry Subject
                      </label>
                      <select
                        className={`${fieldCls} h-12 appearance-none cursor-pointer`}
                        defaultValue=""
                      >
                        <option
                          value=""
                          disabled
                          className="bg-slate-800 text-slate-400"
                        >
                          Select a subject…
                        </option>
                        <option
                          value="acquisition"
                          className="bg-slate-800 text-white"
                        >
                          General Acquisition
                        </option>
                        <option
                          value="fitting"
                          className="bg-slate-800 text-white"
                        >
                          Personalized Fitting
                        </option>
                        <option
                          value="appointment"
                          className="bg-slate-800 text-white"
                        >
                          Boutique Appointment
                        </option>
                        <option
                          value="service"
                          className="bg-slate-800 text-white"
                        >
                          Technical Service
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                      Detailed Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="How can we assist with your collection?"
                      className={`${fieldCls} py-3 resize-none min-h-[130px] md:min-h-[150px]`}
                    />
                  </div>

                  <Button className="w-full h-12 md:h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-[0.25em] text-xs shadow-xl shadow-primary/25 transition-all active:scale-95 group">
                    <Send
                      size={15}
                      className="mr-2.5 group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                    DISPATCH REQUEST
                  </Button>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Your information is handled with the utmost discretion per
                    our privacy charter.
                  </p>
                </form>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Response Time", value: "< 4 Hrs" },
                { label: "Global Boutiques", value: "12" },
                { label: "Collector Support", value: "24 / 7" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-3 rounded-2xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 transition-colors"
                >
                  <p className="text-base md:text-lg font-black text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
