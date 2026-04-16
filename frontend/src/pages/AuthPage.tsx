import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { GoogleLogin } from '@react-oauth/google';


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isForgot) {
        // Placeholder for OTP/Email reset
        toast({ title: "Reset Sequence Initialized", description: "Verification protocols sent to your email identifier." });
        setIsForgot(false);
        setIsLogin(true);
      } else if (isLogin) {
        await login(email, password);
        toast({ title: "Authenticated", description: "Access granted to the Private Collection." });
        navigate('/');
      } else {
        await register(name || email.split('@')[0], email, password);
        toast({ title: "Access Requested", description: "Your account has been created." });
        navigate('/');
      }
    } catch (error: any) {
      toast({ 
        title: "Authentication Failed", 
        description: error.response?.data?.message || "Check your credentials.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="w-full max-w-md px-6">
        <h1 className="font-heading text-3xl md:text-4xl mb-2">
          {isLogin ? 'Client Authentication' : 'Request Access'}
        </h1>
        <p className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground mb-10">
          <Lock size={12} /> Access the Private Collection
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isForgot && !isLogin && (
            <div className="animate-fade-in">
              <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full border border-border px-4 py-3 text-sm bg-transparent outline-none focus:border-primary placeholder:text-muted-foreground"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] tracking-luxury uppercase text-muted-foreground block mb-2">
              Email Identifier
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@montclair.ch"
              className="w-full border border-border px-4 py-3 text-sm bg-transparent outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          {!isForgot && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] tracking-luxury uppercase text-muted-foreground">
                  Encryption Key
                </label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgot(true)}
                    className="text-[10px] tracking-luxury uppercase text-primary underline"
                  >
                    Recovery Options
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-border px-4 py-3 text-sm bg-transparent outline-none focus:border-primary pr-10 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {isLogin && !isForgot && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="accent-primary" />
              <span className="text-[10px] tracking-luxury uppercase">Remember Session</span>
            </label>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-4 text-xs tracking-luxury uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {isForgot ? 'Initialize Reset' : isLogin ? 'Authenticate Account' : 'Request Access'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-[10px] tracking-luxury uppercase text-muted-foreground">
              External Authorization
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <div className="w-full max-w-[400px]">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    setLoading(true);
                    await googleLogin(credentialResponse.credential);
                    toast({ title: "Authenticated via Google", description: "Access granted via your secure identity provider." });
                    navigate('/');
                  } catch (error) {
                    toast({ title: "Social Authentication Failed", variant: "destructive" });
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              onError={() => {
                toast({ title: "Google Signaling Error", variant: "destructive" });
              }}
              theme="outline"
              size="large"
              shape="rectangular"
              width="400"
            />
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          {isForgot ? (
            <button onClick={() => { setIsForgot(false); setIsLogin(true); }} className="text-foreground underline underline-offset-2 text-[10px] tracking-luxury uppercase">
              Return to Authentication
            </button>
          ) : (
            <>
              {isLogin ? "Don't have an account?" : 'Already have access?'}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-foreground underline underline-offset-2">
                {isLogin ? 'Request Access' : 'Authenticate'}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
