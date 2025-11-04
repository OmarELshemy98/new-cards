"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import s from "@/styles/components/pages/login/Login.module.css";

const pulseBoxShadow = s.glow; // just alias

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingBtn(true);
    try {
      await login(email, password);
    } catch (e) {
      const msg = (e as Error)?.message ?? "Login failed";
      setError(
        msg.includes("invalid") || msg.includes("wrong")
          ? "Invalid email or password."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoadingBtn(false);
    }
  };

  const onRegister = async () => {
    setError(null);
    setLoadingBtn(true);
    try { await register(email, password); }
    catch (e) {
      const msg = (e as Error)?.message ?? "Registration failed";
      setError(
        msg.includes("email") && msg.includes("already")
          ? "Email already in use."
          : "Could not register. Please try again."
      );
    } finally { setLoadingBtn(false); }
  };

  if (user) return null;

  return (
    <div className={s.root}>
      <div className={s.cardWrap} style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(8px) scale(0.98)" }}>
        <div className={pulseBoxShadow} aria-hidden />
        <div className={s.card}>
          <div className={s.header}>
            <Logo size={28} />
            <div>
              <div className={s.h1}>Welcome back</div>
              <p className={s.h1sub}>Sign in to your Cards dashboard</p>
            </div>
          </div>

          {error && (
            <div role="alert" className={s.alert}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} autoComplete="off" className={s.form}>
            <div>
              <label htmlFor="email" className={s.label}>Email</label>
              <input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} className={s.input} placeholder="name@example.com" />
            </div>

            <div>
              <label htmlFor="password" className={s.label}>Password</label>
              <div className={s.passWrap}>
                <input id="password" type={showPass ? "text" : "password"} required value={password} onChange={e=>setPassword(e.target.value)} className={s.input} placeholder="••••••••" />
                <button type="button" aria-label={showPass ? "Hide password" : "Show password"} aria-pressed={showPass} onClick={()=>setShowPass(v=>!v)} className={s.eye}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className={s.row}>
              <label style={{display: "inline-flex", alignItems: "center", gap: 8}}>
                <input type="checkbox" className={s.checkbox} defaultChecked />
                <span>Remember me</span>
              </label>
              <button type="button" onClick={() => alert("Need real password reset? I can wire it up for you.")} style={{ color: "#0e738f", textDecoration: "underline" }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loadingBtn} className={s.btnPrimary}>
              {loadingBtn ? "Signing in…" : "Sign in"}
            </button>
            <button type="button" disabled={loadingBtn} onClick={onRegister} className={s.btnSecondary}>
              {loadingBtn ? "Please wait…" : "Create new account"}
            </button>
          </form>

          <div className={s.footer}>
            <span style={{display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#67e8f9"}} />
            Secured by Firebase Authentication
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ color: "#a5f3fc", filter: "drop-shadow(0 1px 0 rgba(0,0,0,.2))" }}>
      <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7zm3-1a1 1 0 0 0-1 1v3h4V6H7zm6 0v4h4V7a1 1 0 0 0-1-1h-3zm4 6h-4v4h3a1 1 0 0 0 1-1v-3zm-6 4v-4H6v3a1 1 0 0 0 1 1h3z" />
    </svg>
  );
}
