import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Watch,
  Image as ImageIcon,
  Trash2,
  Plus,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
    price: product?.price || "",
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl relative rounded-[40px] overflow-hidden border-none animate-in zoom-in-95 duration-300">
        <div className="bg-[#b87333] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Watch size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
                Product Management
              </p>
              <h3 className="text-xl font-bold text-white leading-tight">
                {product ? "Update Timepiece" : "Create New Timepiece"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-4 text-rose-600 animate-in fade-in slide-in-from-top-4 duration-300">
                <AlertCircle size={18} className="shrink-0" />
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}


            <section className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <ImageIcon size={14} className="text-[#b87333]" /> Product Imagery
                </label>
                <Badge className="bg-white text-[#b87333] border-slate-200 text-[9px] font-bold tracking-widest uppercase">
                  {existingImages.length + files.length} Total
                </Badge>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                <label className="w-28 h-28 shrink-0 rounded-[28px] border-2 border-dashed border-slate-200 hover:border-[#b87333] hover:bg-[#b87333]/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-white group">
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
                    key={`img-${idx}`}
                    className="w-28 h-28 shrink-0 bg-white border border-slate-100 rounded-[28px] relative group overflow-hidden shadow-sm"
                  >
                    <img
                      src={src}
                      alt="Product"
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeExisting(idx)}
                      className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {previews.map((src, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="w-28 h-28 shrink-0 bg-white border border-slate-100 rounded-[28px] relative group overflow-hidden shadow-sm"
                  >
                    <img
                      src={src}
                      alt="Preview"
                      className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeNew(idx)}
                      className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>


            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <h4 className="text-[10px] tracking-luxury uppercase font-bold text-primary">
                  Core Information
                </h4>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Product Name</label>
                  <input
                    required
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rolex Submariner Date"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Brand</label>
                  <input
                    required
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Rolex"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Model Number</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.model_number}
                    onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                    placeholder="e.g. 126610LN"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Category</label>
                  <select
                    required
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all appearance-none"
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
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Collection</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    placeholder="e.g. Submariner"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">MRP (₹)</label>
                  <input
                    type="number"
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Status</label>
                  <select
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Stock Quantity</label>
                  <input
                    type="number"
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                  />
                </div>
              </div>
            </section>


            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b87333] whitespace-nowrap">
                  Technical Specifications
                </h4>
                <div className="h-px w-full bg-slate-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Case Diameter</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.case_diameter}
                    onChange={(e) => setFormData({ ...formData, case_diameter: e.target.value })}
                    placeholder="e.g. 41mm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Case Material</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.case_material}
                    onChange={(e) => setFormData({ ...formData, case_material: e.target.value })}
                    placeholder="e.g. Oystersteel"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Dial Colour</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.dial_colour}
                    onChange={(e) => setFormData({ ...formData, dial_colour: e.target.value })}
                    placeholder="e.g. Black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Movement Type</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.movement_type}
                    onChange={(e) => setFormData({ ...formData, movement_type: e.target.value })}
                    placeholder="e.g. Automatic"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Caliber</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.caliber}
                    onChange={(e) => setFormData({ ...formData, caliber: e.target.value })}
                    placeholder="e.g. Cal. 3235"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Water Resistance</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.water_resistance}
                    onChange={(e) => setFormData({ ...formData, water_resistance: e.target.value })}
                    placeholder="e.g. 300m / 1000ft"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Strap Material</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.strap_material}
                    onChange={(e) => setFormData({ ...formData, strap_material: e.target.value })}
                    placeholder="e.g. Oyster bracelet"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Crystal</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.crystal}
                    onChange={(e) => setFormData({ ...formData, crystal: e.target.value })}
                    placeholder="e.g. Sapphire"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Power Reserve</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.power_reserve}
                    onChange={(e) => setFormData({ ...formData, power_reserve: e.target.value })}
                    placeholder="e.g. 70 hours"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Case Thickness</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.case_thickness}
                    onChange={(e) => setFormData({ ...formData, case_thickness: e.target.value })}
                    placeholder="e.g. 12.5mm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Lug Width</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.lug_width}
                    onChange={(e) => setFormData({ ...formData, lug_width: e.target.value })}
                    placeholder="e.g. 21mm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Warranty</label>
                  <input
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    placeholder="e.g. 5 years"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Functions</label>
                <input
                  className="w-full h-11 bg-slate-50/50 border border-slate-200 px-4 rounded-2xl text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                  value={formData.functions}
                  onChange={(e) => setFormData({ ...formData, functions: e.target.value })}
                  placeholder="e.g. Date, Bezel, Lume"
                />
              </div>
            </section>


            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b87333] whitespace-nowrap flex items-center gap-2">
                  <Sparkles size={14} /> Marketing Content
                </h4>
                <div className="h-px w-full bg-slate-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Key Highlights</label>
                  <textarea
                    rows={5}
                    className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-[32px] text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.key_highlights}
                    onChange={(e) => setFormData({ ...formData, key_highlights: e.target.value })}
                    placeholder="• Feature 1: Benefit&#10;• Feature 2: Benefit..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">What's in the Box</label>
                  <textarea
                    rows={5}
                    className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-[32px] text-sm focus:outline-none focus:border-[#b87333] focus:ring-4 focus:ring-[#b87333]/5 transition-all"
                    value={formData.whats_in_the_box}
                    onChange={(e) => setFormData({ ...formData, whats_in_the_box: e.target.value })}
                    placeholder="Watch, Box, Papers, Warranty Card..."
                  />
                </div>
              </div>
            </section>

            <footer className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4 flex-shrink-0 sticky bottom-0 z-50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold shadow-xl shadow-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{product ? "Update Timepiece" : "Create Timepiece"}</span>
                  </>

                )}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}
