import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

const BRAND = "#9E8465";
const BG = "#FFF9F1";
const ERROR = "#A4452C";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function r(opacity: number) {
  return `rgba(158,132,101,${opacity})`;
}

// the part of the Google Identity Services script that is used here
interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
      renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

let googleScript: Promise<void> | null = null;

function loadGoogle(): Promise<void> {
  if (window.google) return Promise.resolve();

  if (!googleScript) {
    googleScript = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        googleScript = null;
        reject(new Error("Could not load Google sign-in."));
      };
      document.head.appendChild(script);
    });
  }

  return googleScript;
}

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  // runs after a successful login or sign-up, for example to continue the checkout
  onSuccess?: () => void;
  message?: string;
}

const inputClass =
  "w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none transition-colors";

export default function AuthDialog({ open, onClose, onSuccess, message }: AuthDialogProps) {
  const { login, register, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const onCloseRef = useRef(onClose);
  onSuccessRef.current = onSuccess;
  onCloseRef.current = onClose;

  const finish = () => {
    onCloseRef.current();
    onSuccessRef.current?.();
  };

  // the Google button is drawn by Google, it gives back an ID token that the backend verifies
  useEffect(() => {
    if (!open || !GOOGLE_CLIENT_ID) return;

    let cancelled = false;

    loadGoogle()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setBusy(true);
            setError("");

            try {
              await loginWithGoogle(response.credential);
              finish();
            } catch (e) {
              setError(e instanceof ApiError ? e.message : "Google sign-in failed. Please try again.");
            } finally {
              setBusy(false);
            }
          },
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: 300,
        });
      })
      .catch(() => {
        // without Google the email form still works
      });

    return () => {
      cancelled = true;
    };
  }, [open, loginWithGoogle]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password, phone.trim() || undefined);
      }

      setPassword("");
      finish();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const focusStyle = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = BRAND),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = r(0.2)),
  };

  const fieldStyle = { borderColor: r(0.2), backgroundColor: BG, color: BRAND };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(60,48,35,0.45)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border p-6 md:p-8"
        style={{ backgroundColor: BG, borderColor: r(0.14), color: BRAND }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 hover:opacity-60 transition-opacity"
        >
          <X size={20} style={{ color: BRAND }} />
        </button>

        <h2 className="font-display text-3xl mb-2" style={{ color: BRAND }}>
          {mode === "login" ? "Log in" : "Create account"}
        </h2>
        <p className="text-sm font-sans font-light leading-relaxed mb-6" style={{ color: r(0.75) }}>
          {message ?? "Log in to place your pre-order and follow its status."}
        </p>

        {GOOGLE_CLIENT_ID && (
          <>
            <div ref={googleButtonRef} className="flex justify-center min-h-[44px]" />
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t" style={{ borderColor: r(0.15) }} />
              <span className="text-xs tracking-[0.12em] uppercase font-sans" style={{ color: r(0.55) }}>
                or
              </span>
              <div className="flex-1 border-t" style={{ borderColor: r(0.15) }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-sans font-medium mb-2">
                Your Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                autoComplete="name"
                className={inputClass}
                style={fieldStyle}
                {...focusStyle}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-sm font-sans font-medium mb-2">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
              style={fieldStyle}
              {...focusStyle}
            />
          </div>

          {mode === "register" && (
            <div>
              <label htmlFor="auth-phone" className="block text-sm font-sans font-medium mb-2">
                Phone (optional)
              </label>
              <input
                id="auth-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                autoComplete="tel"
                className={inputClass}
                style={fieldStyle}
                {...focusStyle}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-password" className="block text-sm font-sans font-medium mb-2">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "register" ? 8 : undefined}
              maxLength={72}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className={inputClass}
              style={fieldStyle}
              {...focusStyle}
            />
            {mode === "register" && (
              <p className="text-xs font-sans mt-2" style={{ color: r(0.6) }}>
                At least 8 characters.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm font-sans" style={{ color: ERROR }} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.15em] uppercase transition-all duration-300 font-sans"
            style={{ backgroundColor: BRAND, color: BG, opacity: busy ? 0.6 : 1 }}
          >
            {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="text-sm font-sans text-center mt-5" style={{ color: r(0.7) }}>
          {mode === "login" ? "New to BLOND?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="underline"
            style={{ color: BRAND }}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
