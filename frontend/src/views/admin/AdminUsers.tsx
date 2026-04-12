import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    }
  });

  const blockMutation = useMutation({
    mutationFn: async ({ id, is_blocked }: { id: number, is_blocked: boolean }) => {
      await api.put(`/admin/users/${id}/block`, { is_blocked });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ 
        title: variables.is_blocked ? 'Entity Neutralized' : 'Entity Re-authorized',
        description: `Access levels updated for the user registry.` 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Entity Purged', description: 'User data has been permanently removed from archives.' });
    }
  });

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-primary font-bold mb-1">Archive / Laboratory / Clients</p>
          <h2 className="font-heading text-5xl">User Registry</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="bg-secondary/20 border border-border p-8">
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-4 font-medium">Total Active Entities</p>
          <span className="font-heading text-4xl">{users.filter((u:any) => !u.is_blocked).length.toLocaleString()}</span>
        </div>
        <div className="bg-secondary/20 border border-border p-8">
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-4 font-medium">Neutralized Entities</p>
          <span className="font-heading text-4xl text-red-600">{users.filter((u:any) => u.is_blocked).length.toLocaleString()}</span>
        </div>
        <div className="bg-secondary/20 border border-border p-8">
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-4 font-medium">Privileged Access</p>
          <span className="font-heading text-4xl text-[#B87333]">{users.filter((u:any) => u.role === 'admin').length} Officials</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium">User Profile</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium text-center">Network ID</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium text-center">Protocol Role</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium text-center">System Status</th>
              <th className="pb-4 text-[10px] tracking-luxury uppercase text-muted-foreground font-medium text-right">Laboratory Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              <tr><td colSpan={5} className="py-10 text-center text-xs tracking-luxury uppercase">Fetching Entity Data...</td></tr>
            ) : users.map((user: any) => (
              <tr key={user.id} className={cn("group transition-opacity", user.is_blocked && "opacity-50")}>
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                        alt={user.name} 
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div>
                      <p className="font-heading text-sm">{user.name}</p>
                      <p className="text-[10px] tracking-luxury uppercase text-muted-foreground">Entity #{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 text-center text-xs text-muted-foreground">{user.email}</td>
                <td className="py-6 text-center">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 text-[9px] tracking-luxury uppercase font-bold border",
                    user.role === 'admin' ? "text-[#B87333] border-[#B87333]/20" : "text-slate-600 border-slate-200"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="py-6 text-center">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 text-[9px] tracking-luxury uppercase font-bold",
                    user.is_blocked ? "text-red-600" : "text-green-600"
                  )}>
                    {user.is_blocked ? 'Access Suspended' : 'Clearance Active'}
                  </span>
                </td>
                <td className="py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => blockMutation.mutate({ id: user.id, is_blocked: !user.is_blocked })}
                      className={cn(
                        "p-2 border border-border transition-colors",
                        user.is_blocked ? "text-green-600 hover:bg-green-50" : "text-orange-600 hover:bg-orange-50"
                      )}
                      title={user.is_blocked ? "Authorize" : "Suspend Access"}
                    >
                      {user.is_blocked ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    </button>
                    <button 
                      disabled={user.role === 'admin'}
                      onClick={() => {
                        if(confirm('Purge this entity from Archives?')) {
                          deleteMutation.mutate(user.id);
                        }
                      }}
                      className="p-2 border border-border text-red-600 hover:bg-red-50 disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
