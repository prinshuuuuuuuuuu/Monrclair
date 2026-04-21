import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-background transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-12 md:mb-20 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Global Concierge</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter text-foreground leading-tight">
                How May We <span className="text-primary italic">Assist You?</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Connect with our horological experts for private viewings, technical support, or collection inquiries.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Info Column */}
            <div className="lg:col-span-5 space-y-10 md:space-y-12 order-2 lg:order-1">
                <div className="space-y-6">
                    <h3 className="text-2xl font-heading font-bold tracking-tight">Our Maison</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        Experience our collections firsthand at our global flagship locations. Our specialists are dedicated to providing a tailored acquisition experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:gap-8">
                    {[
                        { icon: MapPin, title: "Flagship Boutique", value: "123 Luxury Avenue, Fashion District, NY 10001", sub: "Open Daily: 10AM - 8PM" },
                        { icon: Phone, title: "Private Line", value: "+1 (555) 000-1234", sub: "Priority Support for Collectors" },
                        { icon: Mail, title: "Correspondence", value: "concierge@monrclair.com", sub: "Replies within 4 working hours" }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-6 rounded-2xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/20 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{item.title}</p>
                                <p className="text-foreground font-bold text-sm md:text-base mb-1">{item.value}</p>
                                <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Follow Our Journey</p>
                    <div className="flex gap-4">
                        {[FaInstagram, FaTwitter, FaFacebook].map((Social, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90">
                                <Social size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="relative overflow-hidden bg-foreground text-background p-8 md:p-12 lg:p-14 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-primary/5">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-heading font-black mb-8 tracking-tight">Dispatch an Inquiry</h3>
                        <form className="space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-background/40">Full Name</label>
                                    <Input 
                                        placeholder="ALEXANDER VANCE" 
                                        className="bg-background/5 border-background/10 rounded-xl h-14 md:h-16 text-sm placeholder:text-background/20 focus:ring-primary focus:border-primary transition-all uppercase tracking-widest" 
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-background/40">Email Address</label>
                                    <Input 
                                        type="email"
                                        placeholder="AV@MONRCLAIR.COM" 
                                        className="bg-background/5 border-background/10 rounded-xl h-14 md:h-16 text-sm placeholder:text-background/20 focus:ring-primary focus:border-primary transition-all uppercase tracking-widest" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-background/40">Inquiry Subject</label>
                                <select className="w-full bg-background/5 border border-background/10 rounded-xl h-14 md:h-16 px-4 md:px-6 text-sm focus:ring-primary outline-none appearance-none cursor-pointer hover:bg-background/10 transition-colors uppercase font-bold tracking-widest text-background/90">
                                    <option className="bg-foreground text-background">General Acquisition</option>
                                    <option className="bg-foreground text-background">Personalized Fitting</option>
                                    <option className="bg-foreground text-background">Boutique Appointment</option>
                                    <option className="bg-foreground text-background">Technical Service</option>
                                </select>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-background/40">Detailed Message</label>
                                <Textarea 
                                    placeholder="HOW CAN WE ASSIST WITH YOUR COLLECTION?" 
                                    className="bg-background/5 border-background/10 rounded-xl min-h-[140px] md:min-h-[180px] p-4 md:p-6 text-sm placeholder:text-background/20 focus:ring-primary focus:border-primary transition-all uppercase tracking-widest" 
                                />
                            </div>

                            <Button className="w-full h-14 md:h-16 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-[0.3em] text-[10px] md:text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 group">
                                <Send size={18} className="mr-3 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" /> 
                                DISPATCH REQUEST
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center py-10 border-t border-border/50">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground leading-loose">
                Monrclair Horology Group © 2024 • All correspondence is treated with strict confidentiality.
            </p>
        </div>
      </div>
    </div>
  );
}
