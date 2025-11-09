"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import s from "@/styles/components/pages/login/Login.module.css";
import { db } from "@/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

type Mode = "login" | "register";

function mapFirebaseError(msg: string, mode: Mode) {
  const m = (msg || "").toLowerCase();
  if (mode === "login") {
    if (m.includes("invalid-credential") || m.includes("wrong") || m.includes("invalid"))
      return "Invalid email or password.";
    if (m.includes("too-many-requests")) return "Too many attempts. Please try again later.";
    return "Could not sign in. Please try again.";
  } else {
    if (m.includes("email-already-in-use")) return "This email is already in use.";
    if (m.includes("weak-password")) return "Password is too weak (min 6 characters).";
    if (m.includes("invalid-email")) return "Invalid email address.";
    return "Could not create account. Please try again.";
  }
}

function strength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 5);
}

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [mounted, setMounted] = useState(false);

  // Login form
  const [lemail, setLEmail] = useState("");
  const [lpass, setLPass] = useState("");
  const [showLPass, setShowLPass] = useState(false);

  // Register form
  const [name, setName] = useState("");
  const [remail, setREmail] = useState("");
  const [rpass, setRPass] = useState("");
  const [rconfirm, setRConfirm] = useState("");
  const [showRPass, setShowRPass] = useState(false);
  const [showRConfirm, setShowRConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const passStrength = useMemo(() => strength(rpass), [rpass]);

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (user) router.replace("/"); }, [user, router]);
  useEffect(() => { setErr(null); }, [mode]);

  const onSubmitLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(lemail.trim(), lpass);
    } catch (e) {
      setErr(mapFirebaseError((e as Error)?.message ?? "", "login"));
    } finally {
      setLoading(false);
    }
  };

  const onSubmitRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!name.trim()) return setErr("Please enter your name.");
    if (rpass.length < 6) return setErr("Password must be at least 6 characters.");
    if (rpass !== rconfirm) return setErr("Passwords do not match.");

    setLoading(true);
    try {
      await register(remail.trim(), rpass);
      // save basic profile to /users/{uid}
      setTimeout(async () => {
        try {
          const { getAuth } = await import("firebase/auth");
          const authUser = getAuth().currentUser;
          if (authUser) {
            await setDoc(
              doc(db, "users", authUser.uid),
              {
                email: authUser.email ?? remail.trim(),
                name: name.trim(),
                role: "user",
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch {
          /* ignore */
        }
      }, 0);
    } catch (e) {
      setErr(mapFirebaseError((e as Error)?.message ?? "", "register"));
    } finally {
      setLoading(false);
    }
  };

  const loginDisabled = loading || !lemail || !lpass;
  const registerDisabled =
    loading || !name.trim() || !remail || !rpass || !rconfirm || rpass !== rconfirm || rpass.length < 6;

  if (user) return null;

  return (
    <div className={s.root}>
      <div
        className={s.cardWrap}
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(8px) scale(0.98)" }}
      >
        <div className={s.glow} aria-hidden />

        <div className={s.card}>
          {/* Header */}
          <div className={s.header}>
            <Logo size={28} />
            <div>
              <div className={s.h1}>{mode === "login" ? "Welcome back" : "Create your account"}</div>
              <p className={s.h1sub}>
                {mode === "login" ? "Sign in to your Cards dashboard" : "Join and start managing your cards"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className={s.tabs} role="tablist" aria-label="Authentication">
            <button
              role="tab"
              aria-selected={mode === "login"}
              className={`${s.tab} ${mode === "login" ? s.tabActive : ""}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={mode === "register"}
              className={`${s.tab} ${mode === "register" ? s.tabActive : ""}`}
              onClick={() => setMode("register")}
              type="button"
            >
              Create account
            </button>
            <span className={`${s.tabUnderline} ${mode === "register" ? s.right : s.left}`} aria-hidden />
          </div>

          {/* Error */}
          {err && (
            <div role="alert" className={s.alert}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M11 7h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              {err}
            </div>
          )}

          {/* Forms */}
          {mode === "login" ? (
            <form onSubmit={onSubmitLogin} autoComplete="off" className={s.form}>
              <div>
                <label htmlFor="login-email" className={s.label}>Email</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={lemail}
                  onChange={(e) => setLEmail(e.target.value)}
                  className={s.input}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="login-password" className={s.label}>Password</label>
                <div className={s.passWrap}>
                  <input
                    id="login-password"
                    type={showLPass ? "text" : "password"}
                    required
                    value={lpass}
                    onChange={(e) => setLPass(e.target.value)}
                    className={s.input}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showLPass ? "Hide password" : "Show password"}
                    aria-pressed={showLPass}
                    onClick={() => setShowLPass((v) => !v)}
                    className={s.eye}
                  >
                    {showLPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className={s.row}>
                <label style={{display:"inline-flex", alignItems:"center", gap: 8}}>
                  <input type="checkbox" className={s.checkbox} defaultChecked />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Want a real password reset page? I can wire it up.")}
                  className={s.linkButton}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loginDisabled} className={s.btnPrimary}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={onSubmitRegister} autoComplete="off" className={s.form}>
              <div>
                <label htmlFor="reg-name" className={s.label}>Full name</label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={s.input}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className={s.label}>Email</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={remail}
                  onChange={(e) => setREmail(e.target.value)}
                  className={s.input}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className={s.label}>Password</label>
                <div className={s.passWrap}>
                  <input
                    id="reg-password"
                    type={showRPass ? "text" : "password"}
                    required
                    value={rpass}
                    onChange={(e) => setRPass(e.target.value)}
                    className={s.input}
                    placeholder="At least 6 characters"
                    minLength={6}
                    autoComplete="new-password"
                    aria-describedby="pw-help"
                  />
                  <button
                    type="button"
                    aria-label={showRPass ? "Hide password" : "Show password"}
                    aria-pressed={showRPass}
                    onClick={() => setShowRPass((v) => !v)}
                    className={s.eye}
                  >
                    {showRPass ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password strength */}
                <div className={s.meterWrap} aria-hidden>
                  <div
                    className={`${s.meter} ${passStrength >= 1 ? s.m1 : ""} ${passStrength >= 2 ? s.m2 : ""} ${passStrength >= 3 ? s.m3 : ""} ${passStrength >= 4 ? s.m4 : ""} ${passStrength >= 5 ? s.m5 : ""}`}
                  />
                </div>
                <small id="pw-help" className={s.hint}>
                  Use upper/lowercase letters, numbers and a symbol to strengthen your password.
                </small>
              </div>

              <div>
                <label htmlFor="reg-confirm" className={s.label}>Confirm password</label>
                <div className={s.passWrap}>
                  <input
                    id="reg-confirm"
                    type={showRConfirm ? "text" : "password"}
                    required
                    value={rconfirm}
                    onChange={(e) => setRConfirm(e.target.value)}
                    className={`${s.input} ${rconfirm ? (rconfirm === rpass ? s.valid : s.invalid) : ""}`}
                    placeholder="Repeat your password"
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    aria-label={showRConfirm ? "Hide password" : "Show password"}
                    aria-pressed={showRConfirm}
                    onClick={() => setShowRConfirm((v) => !v)}
                    className={s.eye}
                  >
                    {showRConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={registerDisabled} className={s.btnPrimary}>
                {loading ? "Creating…" : "Create account"}
              </button>
            </form>
          )}

          <div className={s.footer}>
            <span style={{width:8, height:8, borderRadius:"50%", background:"#67e8f9"}} />
            Secured by Firebase Authentication
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={{ color: "#a5f3fc", filter: "drop-shadow(0 1px 0 rgba(0,0,0,.2))" }}
    >
      <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7zm3-1a1 1 0 0 0-1 1v3h4V6H7zm6 0v4h4V7a1 1 0 0 0-1-1h-3zm4 6h-4v4h3a1 1 0 0 0 1-1v-3zm-6 4v-4H6v3a1 1 0 0 0 1 1h3z" />
    </svg>
  );
}
