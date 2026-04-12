import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('prince123@gmail.com');
  const [password, setPassword] = useState('prince@123');
  const [loading, setLoading] = useState(false);


  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // After login, AuthContext will have the user. We check if they are admin.
      // But for now we just navigate to /admin
      toast({ title: "Authorized", description: "System Controller access granted." });
      navigate('/admin');
    } catch (error: any) {
      toast({ 
        title: "Access Denied", 
        description: "Invalid encryption key or ID.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      <header className="p-10">
        <h1 className="text-2xl font-heading tracking-[0.2em] uppercase">Montclair</h1>
      </header>

      <main className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Left Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="font-heading text-6xl mb-4">Client Authentication</h2>
            <p className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground mb-12">
              <Lock size={12} /> Access the Private Collection
            </p>

            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block mb-3 font-bold">
                  Email Identifier
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border px-6 py-4 text-sm bg-secondary/10 outline-none focus:border-primary disabled:opacity-50 font-heading italic"
                />

              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] tracking-luxury uppercase text-muted-foreground font-bold">
                    Encryption Key
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border px-6 py-4 text-sm bg-transparent outline-none focus:border-primary pr-14 placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="accent-primary" defaultChecked />
                  <span>Remember Session</span>
                </label>
                <button type="button" className="text-[10px] tracking-luxury uppercase text-foreground border-b border-foreground">
                  Recovery Options
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B87333] text-white py-6 text-xs tracking-luxury uppercase flex items-center justify-center gap-3 hover:opacity-95 transition-opacity disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : 'Authenticate Account'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center">
                <span className="bg-white px-6 text-[10px] tracking-luxury uppercase text-muted-foreground">
                  External Authorization
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="border border-border py-4 text-[10px] tracking-luxury uppercase hover:border-primary transition-colors flex items-center justify-center gap-2 text-muted-foreground">
                Google
              </button>
              <button className="border border-border py-4 text-[10px] tracking-luxury uppercase hover:border-primary transition-colors flex items-center justify-center gap-2 text-muted-foreground">
                Apple
              </button>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-3 bg-secondary/30 px-6 py-2 rounded-full">
                <CheckCircle2 size={14} className="text-[#B87333]" />
                <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">Secure Login Protocol Active</span>
              </div>
            </div>

            <p className="text-center mt-10 text-[10px] tracking-luxury uppercase text-muted-foreground">
              Don't have an account? <button className="text-foreground border-b border-foreground">Request Access</button>
            </p>
          </div>
        </div>

        {/* Right Preview */}
        <div className="hidden lg:block w-1/2 bg-secondary/10 relative overflow-hidden p-20 flex flex-col justify-end">
          <div className="absolute inset-0 opacity-10">
            {/* Compass/Watch outline would go here */}
            <Lock size={800} className="absolute -top-40 -right-40 text-black" />
          </div>
          <div className="relative z-10">
            <p className="font-heading italic text-xl text-muted-foreground leading-relaxed max-w-sm">
              "Time is the longest distance between two places, yet precision brings them together."
            </p>
            <p className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-4">— The Atelier Journal</p>
          </div>
        </div>
      </main>
    </div>
  );
}
