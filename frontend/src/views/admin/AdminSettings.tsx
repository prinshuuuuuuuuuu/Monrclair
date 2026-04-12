export default function AdminSettings() {
  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-12">
        <p className="text-[10px] tracking-widest uppercase text-primary font-bold mb-1">Configuration / Preferences</p>
        <h2 className="font-heading text-5xl">System Settings</h2>
      </div>

      <div className="bg-secondary/20 border border-border p-8 space-y-12">
        <section className="space-y-6">
          <h3 className="text-[10px] tracking-luxury uppercase font-bold border-b border-border pb-2">Atelier Interface</h3>
          <div className="grid grid-cols-2 gap-8 text-[10px] tracking-luxury uppercase">
            <span>Interface Mode</span>
            <span className="text-primary text-right italic font-bold">Luxury Onyx (Default)</span>
            <span>Laboratory Visuals</span>
            <span className="text-secondary-foreground text-right italic font-bold">Enabled</span>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[10px] tracking-luxury uppercase font-bold border-b border-border pb-2">System Protocols</h3>
          <div className="grid grid-cols-2 gap-8 text-[10px] tracking-luxury uppercase">
            <span>Transmission Security</span>
            <span className="text-green-600 text-right italic font-bold">SSL High Protocol</span>
            <span>Archive Redundancy</span>
            <span className="text-secondary-foreground text-right italic font-bold">Active</span>
          </div>
        </section>
      </div>
    </div>
  );
}
