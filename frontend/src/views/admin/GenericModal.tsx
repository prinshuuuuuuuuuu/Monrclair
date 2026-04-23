import { useState, useEffect } from "react";
import { X, Upload, Check, Loader2, Database, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox" | "richtext" | "textarea" | "image";
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  required?: boolean;
}

interface GenericModalProps {
  moduleName: string;
  item?: any;
  fields: FormField[];
  onClose: () => void;
  onSuccess: () => void;
}

export function GenericModal({
  moduleName,
  item,
  fields,
  onClose,
  onSuccess,
}: GenericModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(() => {
    const initial: any = {};
    fields.forEach((f) => {
      initial[f.name] = item?.[f.name] ?? (f.type === "number" ? 0 : "");
    });
    return initial;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = fields.filter((f) => f.required && !formData[f.name]);
    if (missing.length > 0) {
      return toast({
        title: "Incomplete Payload",
        description: `Following fields are required: ${missing
          .map((m) => m.label)
          .join(", ")}`,
        variant: "destructive",
      });
    }

    setLoading(true);

    try {
      if (item) {
        await api.put(`/${moduleName}/${item.id}`, formData);
      } else {
        await api.post(`/${moduleName}`, formData);
      }
      toast({ title: "Success", description: `${moduleName} record ${item ? "updated" : "created"}.` });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save record.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative rounded-[40px] overflow-hidden border-none animate-in zoom-in-95 duration-300">


        <div className="bg-[#b87333] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
                {moduleName} Management
              </p>
              <h3 className="text-xl font-bold text-white leading-tight">
                {item ? "Update Record" : "Add New Entry"}
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

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <form id="generic-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={cn(
                    "space-y-1.5",
                    (field.type === "richtext" || field.type === "textarea") && "md:col-span-2"
                  )}
                >
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>

                  {field.type === "richtext" ? (
                    <div className="rounded-2xl overflow-hidden border border-slate-200">
                      <RichTextEditor
                        value={formData[field.name]}
                        onChange={(val) => setFormData({ ...formData, [field.name]: val })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={formData[field.name]}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="rounded-2xl bg-slate-50/50 border-slate-200  min-h-[120px] resize-none p-4"
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={String(formData[field.name])}
                      onValueChange={(val) => setFormData({ ...formData, [field.name]: val })}
                    >
                      <SelectTrigger className="h-11 rounded-2xl bg-slate-50/50 border-slate-200 transition-all">
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-200 z-[110] shadow-2xl p-1.5 animate-in fade-in-0 zoom-in-95">
                        {field.options?.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={String(opt.value)}
                            className="rounded-xl my-0.5 py-2.5 px-3 focus:bg-[#b87333] focus:text-white cursor-pointer transition-colors"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      value={formData[field.name]}
                      onChange={(e) => setFormData({ ...formData, [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="h-11 rounded-2xl bg-slate-50/50 border-slate-200 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>


        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white transition-all active:scale-95"
          >
            Cancel
          </Button>
          <Button
            form="generic-form"
            type="submit"
            disabled={loading}
            className="flex-[1.5] h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold shadow-xl shadow-zinc-200 transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <div className="flex items-center gap-2">
                <Check size={18} />
                <span>{item ? "Commit Changes" : "Save Record"}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
