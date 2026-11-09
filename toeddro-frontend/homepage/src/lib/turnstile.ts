// Lightweight Cloudflare Turnstile loader. Renders a widget into a container
// element and resolves with the token. The script is loaded lazily so it
// never runs on normal page loads (keeps SEO + UX clean).
import { TURNSTILE_SITE_KEY } from "@/config/turnstile";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

let loaderPromise: Promise<void> | null = null;

export function isTurnstileEnabled() {
  return Boolean(TURNSTILE_SITE_KEY);
}

export function loadTurnstile(): Promise<void> {
  if (!isTurnstileEnabled()) return Promise.resolve();
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

export async function renderTurnstile(
  el: HTMLElement,
  onToken: (token: string) => void,
): Promise<string | null> {
  if (!isTurnstileEnabled()) return null;
  await loadTurnstile();
  if (!window.turnstile) return null;
  return window.turnstile.render(el, {
    sitekey: TURNSTILE_SITE_KEY,
    callback: onToken,
    "error-callback": () => onToken(""),
    "expired-callback": () => onToken(""),
    theme: "light",
  });
}