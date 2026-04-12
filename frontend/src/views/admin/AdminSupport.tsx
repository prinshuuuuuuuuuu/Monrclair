import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

export default function AdminSupport() {
  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-12">
        <p className="text-[10px] tracking-widest uppercase text-primary font-bold mb-1">Assistance / Protocols</p>
        <h2 className="font-heading text-5xl">Protocol Support</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-border p-8 hover:border-primary transition-colors cursor-pointer bg-secondary/10">
          <Mail className="mb-4 text-primary" size={24} />
          <h3 className="text-[10px] tracking-luxury uppercase font-bold mb-2">Technical Transmission</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Direct communication line to our technical artisans for system-level anomalies.</p>
        </div>
        <div className="border border-border p-8 hover:border-primary transition-colors cursor-pointer bg-secondary/10">
          <MessageSquare className="mb-4 text-primary" size={24} />
          <h3 className="text-[10px] tracking-luxury uppercase font-bold mb-2">Live Archive Assistance</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Active monitoring assistance for high-frequency inventory management.</p>
        </div>
      </div>
    </div>
  );
}
