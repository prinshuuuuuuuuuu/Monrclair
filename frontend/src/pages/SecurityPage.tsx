import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, ShieldCheck, Eye, EyeOff, Key, X,
  ArrowLeft, CheckCircle2, Shield, AlertTriangle, Fingerprint
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function SecurityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast({ title: 'Parity Failure', description: 'New authentication keys do not match.', variant: 'destructive' });
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast({ title: 'Registry Calibrated', description: 'Authentication matrix successfully updated.' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: 'Modulation Failed',
        description: error.response?.data?.message || 'Current access key invalid.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-32 pb-24 px-6 lg:px-20 animate-fade-in relative overflow-hidden">
      {/* Decorative Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-20 space-y-8">
          <button
            onClick={() => navigate('/profile')}
            className="group flex items-center gap-3 text-[10px] font-label uppercase tracking-widest text-[#B87333] hover:opacity-70 transition-all font-bold"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>

          <div className="space-y-4">
            <p className="font-label text-xs uppercase tracking-[0.4em] text-secondary opacity-40 font-bold">Authentication Vault</p>
            <h1 className="font-headline text-6xl lg:text-7xl text-black leading-tight">Security <em className="text-[#B87333] not-italic">Matrix</em></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-white border border-[#F0F0F0] rounded-[64px] p-10 md:p-14 shadow-2xl shadow-black/[0.02]">
              <form onSubmit={handleUpdate} className="space-y-10">
                {/* Current Password Field */}
                <div className="space-y-4">
                  <label className="text-[10px] font-label uppercase tracking-widest text-secondary opacity-50 font-bold px-1">Active Access Key</label>
                  <div className="relative group">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-5 rounded-[24px] text-sm focus:border-[#B87333] outline-none transition-all font-body tracking-wider"
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary hover:text-black transition-colors"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-6 opacity-10">
                  <div className="h-[1px] flex-1 bg-black"></div>
                  <Lock size={14} />
                  <div className="h-[1px] flex-1 bg-black"></div>
                </div>

                {/* New Passwords */}
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-label uppercase tracking-widest text-[#B87333] font-bold px-1">New Protocol Key</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-5 rounded-[24px] text-sm focus:border-[#B87333] outline-none transition-all font-body tracking-wider"
                        placeholder="••••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary hover:text-black transition-colors"
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-label uppercase tracking-widest text-secondary opacity-50 font-bold px-1">Confirm New Encryption</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-[#FBFBFB] border border-[#F0F0F0] px-8 py-5 rounded-[24px] text-sm focus:border-[#B87333] outline-none transition-all font-body tracking-wider"
                      placeholder="••••••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-6 rounded-[32px] font-label text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-[#B87333] transition-all shadow-xl shadow-black/5 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? "Modulating..." : "Calibrate Matrix"}
                  {!loading && <Key size={16} />}
                </button>
              </form>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F9F9F9] border border-[#F0F0F0] rounded-[48px] p-10 space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldCheck size={28} className="text-[#B87333]" />
              </div>
              <div className="space-y-3">
                <h4 className="font-headline text-2xl text-black italic">Encryption Integrity</h4>
                <p className="text-secondary text-sm leading-relaxed opacity-60 font-body">Your access keys are managed through AES-256 modulation protocols. Regular calibration is recommended to maintain registry safety.</p>
              </div>
              <div className="pt-4 flex items-center gap-3 text-[9px] font-label tracking-widest uppercase text-green-600 font-bold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Matrix Status: STABLE
              </div>
            </div>

            <div className="border border-[#F0F0F0] rounded-[48px] p-10 space-y-8">
              <div className="flex items-center gap-4">
                <AlertTriangle size={18} className="text-[#B87333] opacity-40" />
                <p className="text-[10px] font-label uppercase tracking-widest text-secondary font-bold">Security Guidelines</p>
              </div>
              <ul className="space-y-6">
                {[
                  { label: 'Minimum 8 Alpha-Numerical keys', icon: Fingerprint },
                  { label: 'Avoid repetitive patterns', icon: Key },
                  { label: 'Session expires upon recalibration', icon: Shield }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs text-secondary opacity-60 font-body">
                    <item.icon size={12} className="text-[#B87333]" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Footer Metadata */}
        <div className="mt-40 border-t border-[#F0F0F0] pt-20 flex flex-col md:flex-row justify-between items-center gap-8 text-secondary opacity-30 text-[9px] font-label tracking-widest uppercase font-bold">
          <div className="flex gap-12">
            <p>ID_SEC_HASH: SHA-512</p>
            <p>LAST_SYNC: {new Date().toLocaleTimeString()}</p>
          </div>
          <p>© Registry Atlas // Authentication Wing</p>
        </div>
      </div>
    </div>
  );
}
