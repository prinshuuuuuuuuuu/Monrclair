import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Watch,
  Image as ImageIcon,
  Trash2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/RichTextEditor";

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
    brand: product?.brand || "Montclair",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "classic",
    collection: product?.collection || "chronograph",
    strapType: product?.strapType || "leather",
    dialColor: product?.dialColor || "",
    description: product?.description || "",
    featured: product?.featured ? 1 : 0,
    trending: product?.trending ? 1 : 0,
    inStock: product?.inStock !== undefined ? (product.inStock ? 1 : 0) : 1,
    status: product?.status || "active",
    stock_quantity: product?.stock_quantity || 0,
    caseSize: product?.specs?.caseSize || product?.caseSize || "",
    movement: product?.specs?.movement || product?.movement || "",
    waterResistance:
      product?.specs?.waterResistance || product?.waterResistance || "",
    powerReserve: product?.specs?.powerReserve || product?.powerReserve || "",
    caseMaterial: product?.specs?.caseMaterial || product?.caseMaterial || "",
  }));

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "Montclair",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "classic",
        collection: product.collection || "chronograph",
        strapType: product.strapType || "leather",
        dialColor: product.dialColor || "",
        description: product.description || "",
        featured: product.featured ? 1 : 0,
        trending: product.trending ? 1 : 0,
        inStock: product.inStock ? 1 : 0,
        status: product.status || "active",
        stock_quantity: product.stock_quantity || 0,
        caseSize: product.specs?.caseSize || product.caseSize || "",
        movement: product.specs?.movement || product.movement || "",
        waterResistance:
          product.specs?.waterResistance || product.waterResistance || "",
        powerReserve: product.specs?.powerReserve || product.powerReserve || "",
        caseMaterial: product.specs?.caseMaterial || product.caseMaterial || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core Pattern Matching / Validation
    if (!formData.name || !formData.price || !formData.category) {
       return toast({
         title: "Validation Deficit",
         description: "Core identity specs (Name, Price, Category) must be defined.",
         variant: "destructive",
       });
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    // Send existing images as JSON
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
      toast({ title: product ? "Registry Updated" : "New Asset Logged" });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "System Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-background border border-border w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
        <div className="flex items-center justify-between p-8 border-b border-border sticky top-0 bg-background z-20">
          <div>
            <p className="text-[10px] tracking-luxury uppercase text-primary font-bold mb-1">
              Laboratory / Asset Manager
            </p>
            <h3 className="font-heading text-3xl">
              {product
                ? "Refine Instrument Specs"
                : "Register New Horological Unit"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-16">
          {/* Image Upload Component */}
          <section>
            <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block mb-6">
              Visual Asset Acquisition
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="aspect-square border-2 border-dashed border-border hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center gap-4 bg-secondary/10 group">
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                    size={20}
                  />
                </div>
                <span className="text-[8px] tracking-luxury uppercase font-bold text-center px-4">
                  Staging Area // Upload Renders
                </span>
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
                  className="aspect-square bg-secondary/5 border border-border relative group overflow-hidden"
                >
                  <img
                    src={src}
                    alt="Existing"
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {previews.map((src, idx) => (
                <div
                  key={`new-${idx}`}
                  className="aspect-square bg-secondary/5 border border-border relative group overflow-hidden"
                >
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeNew(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            {previews.length === 0 && existingImages.length === 0 && (
              <div className="mt-4 flex items-center gap-2 text-red-500/60 uppercase text-[8px] tracking-widest font-bold">
                <Watch size={12} /> No visual data staged for this unit
              </div>
            )}
          </section>

          {/* Primary Data */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                  Instrument Serial / Name
                </label>
                <input
                  required
                  className="w-full bg-secondary/30 border-b border-border px-0 py-3 text-lg font-heading focus:outline-none focus:border-primary transition-colors"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Heritage Seamaster LX"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                  Brand Entity
                </label>
                <input
                  className="w-full bg-secondary/30 border-b border-border px-0 py-3 text-lg font-heading focus:outline-none focus:border-primary transition-colors"
                  value={formData.brand || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                  Market Value (€)
                </label>
                <input
                  type="number"
                  required
                  className="w-full bg-secondary/30 border-b border-border px-0 py-3 text-lg font-heading focus:outline-none focus:border-primary transition-colors"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                  List Price (€) <small>(Optional)</small>
                </label>
                <input
                  type="number"
                  className="w-full bg-secondary/30 border-b border-border px-0 py-3 text-lg font-heading focus:outline-none focus:border-primary transition-colors"
                  value={formData.originalPrice || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-secondary/20 p-8 border border-border space-y-8">
              <h4 className="text-[10px] tracking-luxury uppercase font-bold text-primary">
                Inventory Logistics
              </h4>
              <div className="space-y-4">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                  Vault Status
                </label>
                <select
                  className="w-full bg-background border border-border px-4 py-3 text-[10px] tracking-luxury uppercase outline-none focus:ring-1 ring-primary/30"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Operational (Active)</option>
                  <option value="inactive">Decommissioned (Inactive)</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                  Available Stock (Units)
                </label>
                <input
                  type="number"
                  className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 ring-primary/30"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock_quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                  Calibration Alert
                </label>
                <select
                  className="w-full bg-background border border-border px-4 py-3 text-[10px] tracking-luxury uppercase outline-none focus:ring-1 ring-primary/30"
                  value={formData.inStock ?? 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inStock: Number(e.target.value),
                    })
                  }
                >
                  <option value="1">Sufficient Reserves</option>
                  <option value="0">Depleted / Order Only</option>
                </select>
              </div>
            </div>
          </section>

          {/* Classification & Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                Curated Category
              </label>
              <select
                className="w-full bg-secondary/30 border-none px-4 py-4 text-[10px] tracking-luxury uppercase outline-none focus:ring-1 ring-primary/30"
                value={formData.category || "classic"}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="classic">Classic Registry</option>
                <option value="sport">Competitive / Sport</option>
                <option value="premium">Limited / Premium</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                Line / Collection
              </label>
              <select
                className="w-full bg-secondary/30 border-none px-4 py-4 text-[10px] tracking-luxury uppercase outline-none focus:ring-1 ring-primary/30"
                value={formData.collection || "chronograph"}
                onChange={(e) =>
                  setFormData({ ...formData, collection: e.target.value })
                }
              >
                <option value="chronograph">Chronograph</option>
                <option value="heritage">Heritage Series</option>
                <option value="diver">Deep Diver</option>
                <option value="aviator">Sky Aviator</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                Mounting / Strap
              </label>
              <select
                className="w-full bg-secondary/30 border-none px-4 py-4 text-[10px] tracking-luxury uppercase outline-none focus:ring-1 ring-primary/30"
                value={formData.strapType || "leather"}
                onChange={(e) =>
                  setFormData({ ...formData, strapType: e.target.value })
                }
              >
                <option value="leather">Italian Leather</option>
                <option value="steel">Oyster Steel</option>
                <option value="rubber">Vulcanized Rubber</option>
                <option value="titanium">Grade 5 Titanium</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
                Dial Aesthetic
              </label>
              <input
                className="w-full bg-secondary/30 border-none px-4 py-4 text-xs outline-none focus:ring-1 ring-primary/30"
                placeholder="e.g. Sunray Blue"
                value={formData.dialColor || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dialColor: e.target.value })
                }
              />
            </div>
          </section>

          <section className="space-y-8 p-10 bg-secondary/10 border border-border/50">
            <h4 className="text-[10px] tracking-luxury uppercase font-bold text-primary flex items-center gap-3">
              <Watch size={14} /> Technical Blueprint & Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="space-y-2">
                <label className="text-[8px] tracking-widest uppercase text-muted-foreground">
                  Case Dimension
                </label>
                <input
                  placeholder="e.g. 42mm x 12mm"
                  className="w-full bg-transparent border-b border-border/50 px-0 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.caseSize || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, caseSize: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] tracking-widest uppercase text-muted-foreground">
                  Caliber / Escape
                </label>
                <input
                  placeholder="e.g. Caliber 8900"
                  className="w-full bg-transparent border-b border-border/50 px-0 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.movement || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, movement: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] tracking-widest uppercase text-muted-foreground">
                  Depth Rating
                </label>
                <input
                  placeholder="e.g. 300m / 1000ft"
                  className="w-full bg-transparent border-b border-border/50 px-0 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.waterResistance || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      waterResistance: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] tracking-widest uppercase text-muted-foreground">
                  Autonomy Reserve
                </label>
                <input
                  placeholder="e.g. 60 Hours"
                  className="w-full bg-transparent border-b border-border/50 px-0 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.powerReserve || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, powerReserve: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] tracking-widest uppercase text-muted-foreground">
                  Case Metallurgy
                </label>
                <input
                  placeholder="e.g. Brushed Titanium"
                  className="w-full bg-transparent border-b border-border/50 px-0 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.caseMaterial || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, caseMaterial: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block">
              Narrative Description
            </label>
            <RichTextEditor
              value={formData.description || ""}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="Describe the soul of this timepiece..."
            />
          </section>

          <section className="flex flex-wrap gap-12">
            <label className="flex items-center gap-4 cursor-pointer group">
              <div
                className={cn(
                  "w-5 h-5 border-2 flex items-center justify-center transition-all",
                  formData.featured
                    ? "bg-primary border-primary"
                    : "bg-transparent border-border group-hover:border-primary",
                )}
              >
                {formData.featured && <Plus size={14} className="text-white" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={!!formData.featured}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured: e.target.checked ? 1 : 0,
                  })
                }
              />
              <span className="text-[10px] tracking-luxury uppercase font-bold group-hover:text-primary transition-colors">
                Featured Portfolio Piece
              </span>
            </label>
            <label className="flex items-center gap-4 cursor-pointer group">
              <div
                className={cn(
                  "w-5 h-5 border-2 flex items-center justify-center transition-all",
                  formData.trending
                    ? "bg-primary border-primary"
                    : "bg-transparent border-border group-hover:border-primary",
                )}
              >
                {formData.trending && <Plus size={14} className="text-white" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={!!formData.trending}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trending: e.target.checked ? 1 : 0,
                  })
                }
              />
              <span className="text-[10px] tracking-luxury uppercase font-bold group-hover:text-primary transition-colors">
                Trending Selection
              </span>
            </label>
          </section>

          <footer className="pt-12 flex flex-col md:flex-row gap-4 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border mt-12 pb-8 z-20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 text-[10px] tracking-luxury uppercase font-bold border border-border hover:bg-secondary transition-all"
            >
              Cancel Protocol
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 text-[10px] tracking-luxury uppercase font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <ImageIcon size={16} className="animate-pulse" />
                  Encrypting Assets...
                </>
              ) : (
                <>{product ? "Commit Revision" : "Authorize Asset Registry"}</>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
