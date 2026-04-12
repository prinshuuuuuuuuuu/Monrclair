import { useState, useEffect } from 'react';
import { X, Upload, Watch } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Props {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductModal({ product, onClose, onSuccess }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState(() => ({
    name: product?.name || '',
    brand: product?.brand || 'Montclair',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    category: product?.category || 'classic',
    collection: product?.collection || 'chronograph',
    strapType: product?.strapType || 'leather',
    dialColor: product?.dialColor || '',
    description: product?.description || '',
    featured: product?.featured ? 1 : 0,
    trending: product?.trending ? 1 : 0,
    inStock: product?.inStock !== undefined ? (product.inStock ? 1 : 0) : 1,
    caseSize: product?.specs?.caseSize || '',
    movement: product?.specs?.movement || '',
    waterResistance: product?.specs?.waterResistance || '',
    powerReserve: product?.specs?.powerReserve || '',
    caseMaterial: product?.specs?.caseMaterial || ''
  }));

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || 'Montclair',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || 'classic',
        collection: product.collection || 'chronograph',
        strapType: product.strapType || 'leather',
        dialColor: product.dialColor || '',
        description: product.description || '',
        featured: product.featured ? 1 : 0,
        trending: product.trending ? 1 : 0,
        inStock: product.inStock ? 1 : 0,
        caseSize: product.specs?.caseSize || '',
        movement: product.specs?.movement || '',
        waterResistance: product.specs?.waterResistance || '',
        powerReserve: product.specs?.powerReserve || '',
        caseMaterial: product.specs?.caseMaterial || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });
    files.forEach(file => {
      data.append('images', file);
    });

    try {
      if (product) {
        await api.put(`/admin/products/${product.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      toast({ title: product ? 'Unit Re-calibrated' : 'New Unit Registered' });
      onSuccess();
    } catch (error: any) {
      toast({ title: 'System Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-background border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-8 border-b border-border sticky top-0 bg-background z-10">
          <div>
            <p className="text-[10px] tracking-luxury uppercase text-primary font-bold mb-1">Laboratory / Registry</p>
            <h3 className="font-heading text-3xl">{product ? 'Update Instrument' : 'Register New Instrument'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          {/* Basic Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-full">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block mb-3">Image Acquisition</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 border-2 border-dashed border-border hover:border-primary transition-colors p-10 cursor-pointer flex flex-col items-center gap-4 bg-secondary/20">
                  <Upload className="text-muted-foreground" />
                  <span className="text-[10px] tracking-luxury uppercase font-medium">Upload Technical Renders</span>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  />
                </label>
                {files.length > 0 && (
                  <div className="text-[10px] tracking-luxury uppercase text-primary font-bold">
                    {files.length} Units Staged
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Instrument Name</label>
              <input 
                required
                className="w-full bg-secondary/50 border-none px-4 py-3 text-sm outline-none focus:ring-1 ring-primary/30"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Brand Entity</label>
              <input 
                className="w-full bg-secondary/50 border-none px-4 py-3 text-sm outline-none focus:ring-1 ring-primary/30"
                value={formData.brand || ''}
                onChange={e => setFormData({...formData, brand: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Base Value (€)</label>
              <input 
                type="number"
                required
                className="w-full bg-secondary/50 border-none px-4 py-3 text-sm outline-none focus:ring-1 ring-primary/30"
                value={formData.price || ''}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Historical Value (€)</label>
              <input 
                type="number"
                className="w-full bg-secondary/50 border-none px-4 py-3 text-sm outline-none focus:ring-1 ring-primary/30"
                value={formData.originalPrice || ''}
                onChange={e => setFormData({...formData, originalPrice: e.target.value})}
              />
            </div>
          </section>

          {/* Classification */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-border">
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Category</label>
              <select 
                className="w-full bg-secondary/50 border-none px-4 py-3 text-xs tracking-luxury uppercase outline-none"
                value={formData.category || 'classic'}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="classic">Classic</option>
                <option value="sport">Sport</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Collection</label>
              <select 
                className="w-full bg-secondary/50 border-none px-4 py-3 text-xs tracking-luxury uppercase outline-none"
                value={formData.collection || 'chronograph'}
                onChange={e => setFormData({...formData, collection: e.target.value})}
              >
                <option value="chronograph">Chronograph</option>
                <option value="heritage">Heritage</option>
                <option value="diver">Diver</option>
                <option value="aviator">Aviator</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Strap Type</label>
              <select 
                className="w-full bg-secondary/50 border-none px-4 py-3 text-xs tracking-luxury uppercase outline-none"
                value={formData.strapType || 'leather'}
                onChange={e => setFormData({...formData, strapType: e.target.value})}
              >
                <option value="leather">Leather</option>
                <option value="steel">Steel</option>
                <option value="rubber">Rubber</option>
                <option value="titanium">Titanium</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Protocol Status</label>
              <select 
                className="w-full bg-secondary/50 border-none px-4 py-3 text-xs tracking-luxury uppercase outline-none"
                value={formData.inStock ?? 1}
                onChange={e => setFormData({...formData, inStock: Number(e.target.value)})}
              >
                <option value="1">In Calibration</option>
                <option value="0">Depleted</option>
              </select>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">Dial Color / Finish</label>
              <input 
                className="w-full bg-secondary/50 border-none px-4 py-3 text-sm outline-none focus:ring-1 ring-primary/30"
                value={formData.dialColor || ''}
                onChange={e => setFormData({...formData, dialColor: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground block text-[10px]">Registry Description</label>
              <textarea 
                className="w-full bg-secondary/50 border-none px-4 py-3 text-sm outline-none focus:ring-1 ring-primary/30 min-h-[100px] resize-none"
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </section>

          {/* Technical Specs */}
          <section className="space-y-8">
            <h4 className="text-[10px] tracking-widest uppercase font-bold text-primary">Technical Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input 
                placeholder="Case Geometry (e.g. 40mm / 11.2mm)"
                className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none focus:border-primary"
                value={formData.caseSize || ''}
                onChange={e => setFormData({...formData, caseSize: e.target.value})}
              />
              <input 
                placeholder="Escapement / Movement"
                className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none focus:border-primary"
                value={formData.movement || ''}
                onChange={e => setFormData({...formData, movement: e.target.value})}
              />
              <input 
                placeholder="Pressure Threshold (Water Resistance)"
                className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none focus:border-primary"
                value={formData.waterResistance || ''}
                onChange={e => setFormData({...formData, waterResistance: e.target.value})}
              />
              <input 
                placeholder="Energy Reserve"
                className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none focus:border-primary"
                value={formData.powerReserve || ''}
                onChange={e => setFormData({...formData, powerReserve: e.target.value})}
              />
              <input 
                placeholder="Case Material (e.g. 18K Rose Gold)"
                className="bg-secondary/20 border-b border-border px-4 py-3 text-sm outline-none focus:border-primary"
                value={formData.caseMaterial || ''}
                onChange={e => setFormData({...formData, caseMaterial: e.target.value})}
              />
            </div>
          </section>

          <section className="flex gap-12 pb-12 border-b border-border">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                className="w-4 h-4 accent-primary"
                checked={!!formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked ? 1 : 0})}
              />
              <span className="text-[10px] tracking-luxury uppercase font-bold group-hover:text-primary transition-colors">Featured Unit</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                className="w-4 h-4 accent-primary"
                checked={!!formData.trending}
                onChange={e => setFormData({...formData, trending: e.target.checked ? 1 : 0})}
              />
              <span className="text-[10px] tracking-luxury uppercase font-bold group-hover:text-primary transition-colors">Trending Unit</span>
            </label>
          </section>

          <footer className="pt-8 flex gap-4 sticky bottom-0 bg-background border-t border-border mt-12 pb-8">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-[10px] tracking-luxury uppercase border border-border hover:bg-secondary transition-colors"
            >
              Abort Protocol
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-4 text-[10px] tracking-luxury uppercase bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Processing...' : product ? 'Commit Changes' : 'Initialize Registration'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
