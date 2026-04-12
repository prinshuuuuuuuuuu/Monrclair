import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Edit2, Trash2, Watch } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ProductModal from './ProductModal';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product Removed', description: 'Instrument has been archived successfully.' });
    }
  });

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-primary font-bold mb-1">Archive / Product Registry</p>
          <h2 className="font-heading text-5xl">Inventory Control</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#B87333] text-white px-8 py-3 text-[10px] tracking-luxury uppercase flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Register New Unit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <p className="text-[10px] tracking-luxury uppercase">Accessing Vault...</p>
        ) : products.map((product: any) => (
          <div key={product.id} className="border border-border p-6 hover:border-primary transition-colors group">
            <div className="aspect-square bg-secondary/30 mb-6 relative overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `http://localhost:5005${product.image}`} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Watch className="text-muted-foreground/20" size={64} />
              )}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="bg-white border border-border p-2 hover:bg-secondary"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to archive this unit?')) {
                      deleteMutation.mutate(product.id);
                    }
                  }}
                  className="bg-white border border-border p-2 hover:bg-red-50 text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-1">{product.brand}</p>
            <h3 className="font-heading text-xl mb-4">{product.name}</h3>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="font-heading text-lg">€{Number(product.price).toLocaleString()}</span>
              <span className={cn(
                "text-[10px] tracking-luxury uppercase font-bold",
                product.inStock ? "text-green-600" : "text-red-600"
              )}>
                {product.inStock ? 'In Calibration' : 'Depleted'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {(isAdding || editingProduct) && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => {
            setIsAdding(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setIsAdding(false);
            setEditingProduct(null);
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          }}
        />
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
