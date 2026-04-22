import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Watch,
  Image as ImageIcon,
  Trash2,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductModal({ product, onClose, onSuccess }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [formData, setFormData] = useState(() => ({
    name: product?.name || "",
    brand: product?.brand || "",
    model_number: product?.model_number || "",
    category: product?.category || "",
    collection: product?.collection || "",
    mrp: product?.mrp || "",
    price: product?.price || "", // Selling Price
    case_diameter: product?.case_diameter || "",
    case_material: product?.case_material || "",
    dial_colour: product?.dial_colour || "",
    movement_type: product?.movement_type || "",
    caliber: product?.caliber || "",
    water_resistance: product?.water_resistance || "",
    strap_material: product?.strap_material || "",
    crystal: product?.crystal || "",
    functions: product?.functions || "",
    power_reserve: product?.power_reserve || "",
    case_thickness: product?.case_thickness || "",
    lug_width: product?.lug_width || "",
    warranty: product?.warranty || "",
    key_highlights: product?.key_highlights || "",
    whats_in_the_box: product?.whats_in_the_box || "",
    status: product?.status || "active",
    stock_quantity: product?.stock_quantity || 0,
  }));

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: response } = await api.get("/categories");
        if (response?.success && Array.isArray(response.data)) {
          setCategories(response.data.filter((c: any) => c.status === "active"));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        model_number: product.model_number || "",
        category: product.category || "",
        collection: product.collection || "",
        mrp: product.mrp || "",
        price: product.price || "",
        case_diameter: product.case_diameter || "",
        case_material: product.case_material || "",
        dial_colour: product.dial_colour || "",
        movement_type: product.movement_type || "",
        caliber: product.caliber || "",
        water_resistance: product.water_resistance || "",
        strap_material: product.strap_material || "",
        crystal: product.crystal || "",
        functions: product.functions || "",
        power_reserve: product.power_reserve || "",
        case_thickness: product.case_thickness || "",
        lug_width: product.lug_width || "",
        warranty: product.warranty || "",
        key_highlights: product.key_highlights || "",
        whats_in_the_box: product.whats_in_the_box || "",
        status: product.status || "active",
        stock_quantity: product.stock_quantity || 0,
      });

      if (product.images) {
        try {
          const imgs =
            typeof product.images === "string"
              ? JSON.parse(product.images)
              : product.images;
          setExistingImages(imgs);
        } catch (e) {
          if (product.image) setExistingImages([product.image]);
        }
      } else if (product.image) {
        setExistingImages([product.image]);
      }
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExisting = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name || !formData.price || !formData.brand) {
       return toast({
         title: "Incomplete Data",
         description: "Brand, Product Name, and Selling Price are mandatory.",
         variant: "destructive",
       });
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    data.append("existingImages", JSON.stringify(existingImages));

    files.forEach((file) => {
      data.append("images", file);
    });

    try {
      if (product) {
        await api.put(`/admin/products/${product.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      toast({ title: product ? "Product Updated" : "Product Created" });
      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "An unexpected system error occurred.";
      setError(msg);
      toast({
        title: "Submission Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-background border border-border w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
        <div className="flex items-center justify-between p-8 border-b border-border sticky top-0 bg-background z-20">
          <div>
            <p className="text-[10px] tracking-luxury uppercase text-primary font-bold mb-1">
              Admin / Product Management
            </p>
            <h3 className="font-heading text-3xl">
              {product ? "Update Timepiece" : "Add New Timepiece"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-4 text-red-500 animate-in fade-in slide-in-from-top-4 duration-300">
              <X size={18} className="shrink-0" />
              <p className="text-xs font-bold tracking-luxury uppercase">{error}</p>
            </div>
          )}

          {/* Compact Image Upload Component */}
          <section className="bg-secondary/5 border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] tracking-luxury uppercase text-primary font-bold flex items-center gap-2">
                <ImageIcon size={12} /> Product Imagery
              </label>
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest">
                {existingImages.length + files.length} Images Total
              </span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              <label className="w-24 h-24 shrink-0 border-2 border-dashed border-border hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-background group">
                <Upload
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                  size={16}
                />
                <span className="text-[8px] tracking-luxury uppercase font-bold">Add</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {existingImages.map((src, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="w-24 h-24 shrink-0 bg-background border border-border relative group overflow-hidden"
                >
                  <img
                    src={src}
                    alt="Existing"
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(idx)}
                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {previews.map((src, idx) => (
                <div
                  key={`new-${idx}`}
                  className="w-24 h-24 shrink-0 bg-background border border-border relative group overflow-hidden"
                >
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeNew(idx)}
                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Core Product Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <h4 className="text-[10px] tracking-luxury uppercase font-bold text-primary">
                Core Information
              </h4>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Product Name</label>
                <input
                  required
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rolex Submariner Date"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Brand</label>
                <input
                  required
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Rolex"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Model Number</label>
                <input
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.model_number}
                  onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                  placeholder="e.g. 126610LN"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Category</label>
                <select
                  required
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Collection</label>
                <input
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  placeholder="e.g. Submariner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">MRP (₹)</label>
                <input
                  type="number"
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Status</label>
                <select
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-xs tracking-luxury uppercase focus:outline-none focus:border-primary"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Stock Quantity</label>
                <input
                  type="number"
                  className="w-full bg-secondary/20 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                />
              </div>
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <h4 className="text-[10px] tracking-luxury uppercase font-bold text-primary">
                Technical Specifications
              </h4>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Case Diameter</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.case_diameter}
                  onChange={(e) => setFormData({ ...formData, case_diameter: e.target.value })}
                  placeholder="e.g. 41mm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Case Material</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.case_material}
                  onChange={(e) => setFormData({ ...formData, case_material: e.target.value })}
                  placeholder="e.g. Oystersteel"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Dial Colour</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.dial_colour}
                  onChange={(e) => setFormData({ ...formData, dial_colour: e.target.value })}
                  placeholder="e.g. Black"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Movement Type</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.movement_type}
                  onChange={(e) => setFormData({ ...formData, movement_type: e.target.value })}
                  placeholder="e.g. Automatic"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Caliber</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.caliber}
                  onChange={(e) => setFormData({ ...formData, caliber: e.target.value })}
                  placeholder="e.g. Cal. 3235"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Water Resistance</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.water_resistance}
                  onChange={(e) => setFormData({ ...formData, water_resistance: e.target.value })}
                  placeholder="e.g. 300m / 1000ft"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Strap Material</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.strap_material}
                  onChange={(e) => setFormData({ ...formData, strap_material: e.target.value })}
                  placeholder="e.g. Oyster bracelet"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Crystal</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.crystal}
                  onChange={(e) => setFormData({ ...formData, crystal: e.target.value })}
                  placeholder="e.g. Sapphire"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Power Reserve</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.power_reserve}
                  onChange={(e) => setFormData({ ...formData, power_reserve: e.target.value })}
                  placeholder="e.g. 70 hours"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Case Thickness</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.case_thickness}
                  onChange={(e) => setFormData({ ...formData, case_thickness: e.target.value })}
                  placeholder="e.g. 12.5mm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Lug Width</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.lug_width}
                  onChange={(e) => setFormData({ ...formData, lug_width: e.target.value })}
                  placeholder="e.g. 21mm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Warranty</label>
                <input
                  className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  placeholder="e.g. 5 years"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Functions</label>
              <input
                className="w-full bg-secondary/10 border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                value={formData.functions}
                onChange={(e) => setFormData({ ...formData, functions: e.target.value })}
                placeholder="e.g. Date, Bezel, Lume"
              />
            </div>
          </section>

          {/* Marketing Content */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <h4 className="text-[10px] tracking-luxury uppercase font-bold text-primary flex items-center gap-2">
                <Sparkles size={12} /> Marketing Content
              </h4>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">Key Highlights (Bullet Points)</label>
                <textarea
                  rows={5}
                  className="w-full bg-secondary/10 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.key_highlights}
                  onChange={(e) => setFormData({ ...formData, key_highlights: e.target.value })}
                  placeholder="• Feature 1: Benefit&#10;• Feature 2: Benefit..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">What's in the Box</label>
                <textarea
                  rows={5}
                  className="w-full bg-secondary/10 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.whats_in_the_box}
                  onChange={(e) => setFormData({ ...formData, whats_in_the_box: e.target.value })}
                  placeholder="Watch, Box, Papers, Warranty Card..."
                />
              </div>
            </div>
          </section>

          <footer className="pt-12 flex flex-col md:flex-row gap-4 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border mt-12 pb-8 z-20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 text-[10px] tracking-luxury uppercase font-bold border border-border hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 text-[10px] tracking-luxury uppercase font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <ImageIcon size={16} className="animate-pulse" />
                  Processing...
                </>
              ) : (
                <>{product ? "Update Product" : "Create Product"}</>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
