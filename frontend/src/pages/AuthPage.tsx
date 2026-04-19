import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Lock, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">

      {/* ── LEFT — Watch Hero Panel ── */}
      <div className="relative lg:w-[52%] h-64 sm:h-80 lg:h-auto overflow-hidden flex-shrink-0">

        {/* Full-bleed watch photo */}
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=90&auto=format&fit=crop"
          alt="Luxury timepiece"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.82) contrast(1.08) saturate(1.1)' }}
        />

        {/* Deep gradient overlay — bottom-up dark for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        {/* Left-side dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        {/* Gold shimmer line top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, #F0D080, #C9A84C, transparent)' }}
        />

        {/* Brand badge — top left */}
        <div className="absolute top-7 left-8 z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-6 h-[1px]" style={{ background: '#C9A84C' }} />
            <span className="text-[9px] tracking-[0.38em] uppercase font-medium" style={{ color: '#C9A84C' }}>
              Montclair
            </span>
          </div>
          <p className="text-white/30 text-[8px] tracking-[0.25em] uppercase">Private Collection</p>
        </div>

        {/* Corner decorative bracket — top right */}
        <div className="absolute top-6 right-6 z-10 hidden lg:block">
          <div className="w-6 h-6 border-t border-r" style={{ borderColor: 'rgba(201,168,76,0.4)' }} />
        </div>
        <div className="absolute bottom-6 left-6 z-10 hidden lg:block">
          <div className="w-6 h-6 border-b border-l" style={{ borderColor: 'rgba(201,168,76,0.4)' }} />
        </div>

        {/* Bottom content — tagline + collection label */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8 lg:p-10">

          {/* Gold accent line */}
          <div className="w-10 h-[1px] mb-5" style={{ background: '#C9A84C' }} />

          {/* Tagline */}
          <blockquote
            className="text-white text-xl sm:text-2xl lg:text-3xl font-light leading-snug mb-4 tracking-wide max-w-xs"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            "Time, mastered to perfection."
          </blockquote>

          {/* Watch details row */}
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { label: 'Movement', value: 'Swiss Automatic' },
              { label: 'Reserve', value: '72 Hours' },
              { label: 'Edition', value: 'Limited' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[8px] tracking-[0.3em] uppercase mb-0.5" style={{ color: '#C9A84C' }}>{label}</p>
                <p className="text-white/70 text-[10px] tracking-[0.15em] uppercase">{value}</p>
              </div>
            ))}
          </div>

          {/* Gold shimmer bottom line */}
          <div
            className="mt-6 h-[1px] w-full"
            style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.6), rgba(201,168,76,0.1), transparent)' }}
          />
          <p className="mt-3 text-[8px] tracking-[0.35em] uppercase text-white/25">Est. MMXXIII · Geneva, Switzerland</p>
        </div>
      </div>

      {/* ── RIGHT — Auth Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 md:px-14 py-14 lg:py-20 bg-background">
        <div className="w-full max-w-[400px]">

          {/* Mobile-only brand header */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-5 h-[1px]" style={{ background: '#C9A84C' }} />
            <span className="text-[9px] tracking-[0.35em] uppercase font-medium" style={{ color: '#C9A84C' }}>
              Montclair · Private Collection
            </span>
          </div>

          {/* Heading block */}
          <div className="mb-9">
            <p className="text-[9px] tracking-[0.32em] uppercase text-muted-foreground mb-3">
              {isForgot
                ? '— Recovery Protocol'
                : isLogin
                  ? '— Secure Portal'
                  : '— New Client'}
            </p>
            <h1 className="text-3xl sm:text-4xl tracking-tight leading-tight font-heading mb-3">
              {isForgot
                ? 'Recovery\nOptions'
                : isLogin
                  ? 'Client\nAuthentication'
                  : 'Request\nAccess'}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <Lock size={11} strokeWidth={1.5} />
              <span className="text-[9px] tracking-[0.26em] uppercase">
                {isForgot
                  ? 'Reset your encryption key'
                  : isLogin
                    ? 'Access the Private Collection'
                    : 'Create your client profile'}
              </span>
            </div>
          </div>

          {/* Gold hairline rule */}
          <div
            className="w-10 h-[1px] mb-8"
            style={{ background: 'linear-gradient(90deg, #C9A84C, transparent)' }}
          />

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name (register only) */}
            {!isForgot && !isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[9px] tracking-[0.28em] uppercase text-muted-foreground mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-foreground placeholder:text-muted-foreground/40 rounded-none"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[9px] tracking-[0.28em] uppercase text-muted-foreground mb-2">
                Email Identifier
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@montclair.ch"
                className="w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-foreground placeholder:text-muted-foreground/40 rounded-none"
              />
            </div>

            {/* Password */}
            {!isForgot && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[9px] tracking-[0.28em] uppercase text-muted-foreground">
                    Encryption Key
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgot(true)}
                      className="text-[9px] tracking-[0.22em] uppercase underline underline-offset-4 hover:opacity-70 transition-opacity"
                      style={{ color: '#C9A84C' }}
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
                    className="w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-foreground pr-12 placeholder:text-muted-foreground/40 rounded-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember session */}
            {isLogin && !isForgot && (
              <label className="flex items-center gap-3 cursor-pointer group mt-1">
                <div className="relative flex-shrink-0">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4 h-4 border border-border peer-checked:bg-foreground peer-checked:border-foreground transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-1.5 h-1.5 bg-background" />
                  </div>
                </div>
                <span className="text-[9px] tracking-[0.28em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                  Remember Session
                </span>
              </label>
            )}

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-[10px] tracking-[0.32em] uppercase flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
                  color: '#fff',
                  border: '1px solid rgba(201,168,76,0.35)',
                }}
              >
                {/* Gold shimmer on hover */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)' }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing
                    </>
                  ) : (
                    <>
                      {isForgot ? 'Initialize Reset' : isLogin ? 'Authenticate Account' : 'Request Access'}
                      <ArrowRight size={13} strokeWidth={1.5} />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-7 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground/50 shrink-0 px-1">
              or continue with
            </span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center overflow-hidden">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    setLoading(true);
                    await googleLogin(credentialResponse.credential);
                    toast({ title: "Authenticated via Google", description: "Access granted via your secure identity provider." });
                    navigate('/');
                  } catch {
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
              width={400}
            />
          </div>

          {/* Toggle / back link */}
          <p className="text-center mt-8 text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
            {isForgot ? (
              <button
                onClick={() => { setIsForgot(false); setIsLogin(true); }}
                className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Return to Authentication
              </button>
            ) : (
              <span>
                {isLogin ? 'No account? ' : 'Already have access? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  {isLogin ? 'Request Access' : 'Authenticate'}
                </button>
              </span>
            )}
          </p>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 mt-10 opacity-30">
            <Sparkles size={10} strokeWidth={1.5} />
            <span className="text-[8px] tracking-[0.3em] uppercase">256-bit encrypted · SSL secured</span>
            <Sparkles size={10} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}