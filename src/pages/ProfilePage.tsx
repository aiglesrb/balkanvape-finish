import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, LogOut, Mail, ShoppingBag, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

// Set to true once Google OAuth is configured in Supabase Auth providers.
// Required: Google Cloud OAuth Client ID + Secret added at
// https://supabase.com/dashboard/project/pztdyshncyaeoiazqmbs/auth/providers
const GOOGLE_OAUTH_ENABLED = false;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => loadProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, email')
      .eq('user_id', userId)
      .maybeSingle();
    setProfile(data);
  };

  const handleGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/profile',
      }
    });
    
    if (error) {
      toast.error('Greška: ' + error.message);
      setBusy(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Unesite email i lozinku');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error('Pogrešan email ili lozinka');
    toast.success('Dobrodošli nazad!');
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return toast.error('Popunite sva polja');
    if (password.length < 6) return toast.error('Lozinka mora imati minimum 6 karaktera');
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) {
      if (error.message.includes('already registered')) toast.error('Email je već registrovan');
      else toast.error('Greška: ' + error.message);
      return;
    }
    toast.success('Nalog kreiran! Proverite email za potvrdu.');
    setTab('login');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Odjavljeni ste.');
  };

  if (loading) {
    return (
      <main className="pt-[90px] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Učitavanje...</div>
      </main>
    );
  }

  return (
    <main className="pt-[90px] min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 55% at 28% 38%, hsl(264 100% 67% / 0.12) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 72% 62%, hsl(186 100% 50% / 0.09) 0%, transparent 65%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-[1] w-full max-w-[430px] bg-card/92 backdrop-blur-2xl border border-foreground/14 rounded-xl p-8 max-sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_hsl(var(--primary)/0.08)]"
      >
        <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {user ? (
          <div className="text-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/40" />
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary/15 border-2 border-primary/40 flex items-center justify-center">
                <UserIcon size={32} className="text-primary" />
              </div>
            )}
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">
              {profile?.display_name || 'Dobrodošli'}
            </h2>
            <p className="text-sm text-muted-foreground mb-7">{profile?.email || user.email}</p>

            <div className="space-y-3 text-left mb-7">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <ShoppingBag size={18} className="text-primary" />
                <div className="flex-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Porudžbine</div>
                  <div className="text-sm font-medium">Još nemate porudžbina</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-card border border-border text-foreground font-bold hover:border-foreground/20 hover:bg-foreground/[0.06] transition-colors"
            >
              <LogOut size={16} />
              Odjavi se
            </button>
          </div>
        ) : (
          <div>
            {/* Tab switcher */}
            <div className="flex gap-1 bg-card rounded-lg p-1 mb-7">
              {(['login', 'register'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 font-mono text-[0.62rem] font-bold tracking-widest uppercase py-2 rounded-md text-center transition-all ${
                    tab === t ? 'bg-primary/16 text-primary border border-primary/28' : 'text-muted-foreground border border-transparent'
                  }`}
                >
                  {t === 'login' ? 'Prijava' : 'Registracija'}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight mb-1">
              {tab === 'login' ? 'Dobrodošli nazad' : 'Kreiraj nalog'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {tab === 'login' ? 'Prijavite se i pratite vaše porudžbine' : 'Brz proces — pratite porudžbine i istoriju'}
            </p>

            {/* Google — hidden until OAuth is configured in Supabase */}
            {GOOGLE_OAUTH_ENABLED && (
              <>
                <button
                  onClick={handleGoogle}
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg bg-card border border-border text-foreground font-medium hover:border-foreground/30 hover:bg-foreground/[0.04] transition-colors disabled:opacity-60 mb-5"
                >
                  <GoogleIcon />
                  Nastavi sa Google
                </button>

                <div className="flex items-center gap-4 my-5 font-mono text-[0.58rem] tracking-widest uppercase text-muted-foreground">
                  <div className="flex-1 h-px bg-border" />
                  ili sa email
                  <div className="flex-1 h-px bg-border" />
                </div>
              </>
            )}



            <form onSubmit={tab === 'login' ? handleEmailLogin : handleEmailRegister}>
              {tab === 'register' && (
                <Field icon={<UserIcon size={15} />} label="Ime i prezime" value={name} onChange={setName} placeholder="Marko Petrović" />
              )}
              <Field icon={<Mail size={15} />} label="Email" type="email" value={email} onChange={setEmail} placeholder="vase@email.com" />
              <div className="mb-5">
                <label className="block font-mono text-[0.58rem] tracking-widest uppercase text-muted-foreground mb-2">Lozinka</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-[0.38] pointer-events-none"><Lock size={15} /></span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={tab === 'register' ? 'Min. 6 karaktera' : '••••••••'}
                    className="w-full bg-card border border-border text-foreground font-display text-sm py-3.5 pl-11 pr-12 rounded-lg outline-none transition-all focus:border-primary/55 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] placeholder:text-muted-foreground placeholder:text-xs"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 rounded-lg bg-gradient-to-br from-primary to-[#6a00ff] text-primary-foreground font-bold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {busy ? 'Sačekajte...' : tab === 'login' ? 'Prijavi se' : 'Kreiraj nalog'}
              </button>
            </form>

            <p className="mt-5 text-center font-mono text-[0.58rem] tracking-widest uppercase text-muted-foreground">
              Sigurna prijava
            </p>
          </div>
        )}
      </motion.div>
    </main>
  );
}

function Field({ icon, label, type = 'text', value, onChange, placeholder }: {
  icon: React.ReactNode; label: string; type?: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-[0.58rem] tracking-widest uppercase text-muted-foreground mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-[0.38] pointer-events-none">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-card border border-border text-foreground font-display text-sm py-3.5 pl-11 pr-4 rounded-lg outline-none transition-all focus:border-primary/55 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] placeholder:text-muted-foreground placeholder:text-xs"
        />
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

