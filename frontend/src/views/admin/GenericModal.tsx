import { useState, useEffect } from "react";
import { X, Upload, Check, Loader2 } from "lucide-react";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative rounded-[2rem]">
        <div className="flex items-center justify-between p-8 border-b border-border sticky top-0 bg-background z-20">
          <div>
            <p className="text-[10px] tracking-luxury uppercase text-primary font-bold mb-1">
              Data Entry / {moduleName}
            </p>
            <h3 className="font-heading text-3xl">
              {item ? "Modify Entry" : "Add New Record"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block font-bold">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </label>

                {field.type === "richtext" ? (
                  <RichTextEditor
                    value={formData[field.name]}
                    onChange={(val) => setFormData({ ...formData, [field.name]: val })}
                    placeholder={field.placeholder}
                  />
                ) : field.type === "textarea" ? (
                  <Textarea
                     value={formData[field.name]}
                     onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                     placeholder={field.placeholder}
                     className="rounded-xl bg-secondary/20 border-border/50 min-h-[100px]"
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={String(formData[field.name])}
                    onValueChange={(val) => setFormData({ ...formData, [field.name]: val })}
                  >
                    <SelectTrigger className="rounded-xl h-12 bg-secondary/20 border-border/50">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
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
                    className="h-12 rounded-xl bg-secondary/20 border-border/50"
                  />
                )}
              </div>
            ))}
          </div>

          <footer className="pt-8 flex gap-4 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border mt-8 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" />}
              {item ? "Commit Changes" : "Save Record"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
