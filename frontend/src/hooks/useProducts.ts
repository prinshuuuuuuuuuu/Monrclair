import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const normalizeProduct = (p: any) => ({
  ...p,
  specs: {
    caseSize: p.caseSize || '40mm',
    movement: p.movement || 'Automatic',
    waterResistance: p.waterResistance || '5 ATM',
    powerReserve: p.powerReserve || '48 Hours',
    caseMaterial: p.caseMaterial || 'Steel',
  }
});

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data.map(normalizeProduct);
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return normalizeProduct(data);
    },
    enabled: !!id,
  });
};
