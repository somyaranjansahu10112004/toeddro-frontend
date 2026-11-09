type SeoOptions = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "profile" | "article";
  noindex?: boolean;
};

const DEFAULT_IMAGE = "https://toeddro.com/og-image.jpg";
const SITE_ORIGIN = "https://toeddro.com";

// Clean canonical: absolute, no query string, no hash, no trailing slash
// (except the root). Always on the production origin so preview and
// published URLs don't split indexing signals.
export const canonicalUrl = (url?: string) => {
  let pathname = "/";
  try {
    const base = typeof window !== "undefined" ? window.location.href : SITE_ORIGIN;
    pathname = new URL(url || base, SITE_ORIGIN).pathname;
  } catch {
    pathname = "/";
  }
  if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.replace(/\/+$/, "");
  return `${SITE_ORIGIN}${pathname}`;
};

const setMeta = (selector: string, attr: string, key: string, value: string) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const setLink = (rel: string, href: string) => {
  // Remove any extras so exactly one tag of this rel survives.
  const existing = Array.from(document.head.querySelectorAll(`link[rel="${rel}"]`)) as HTMLLinkElement[];
  existing.slice(1).forEach((e) => e.remove());
  let el = existing[0] || null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export function applySeo({ title, description, url, image, type = "website", noindex = false }: SeoOptions) {
  const finalUrl = canonicalUrl(url);
  const finalImage = image || DEFAULT_IMAGE;

  document.title = title;
  setMeta('meta[name="description"]', "name", "description", description);
  setLink("canonical", finalUrl);
  setMeta(
    'meta[name="robots"]',
    "name",
    "robots",
    noindex ? "noindex, follow" : "index, follow",
  );

  setMeta('meta[property="og:title"]', "property", "og:title", title);
  setMeta('meta[property="og:description"]', "property", "og:description", description);
  setMeta('meta[property="og:type"]', "property", "og:type", type);
  setMeta('meta[property="og:url"]', "property", "og:url", finalUrl);
  setMeta('meta[property="og:image"]', "property", "og:image", finalImage);

  setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
  setMeta('meta[name="twitter:image"]', "name", "twitter:image", finalImage);
}

export function applyJsonLd(id: string, data: Record<string, any>) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function removeJsonLd(id: string) {
  const s = document.getElementById(id);
  if (s) s.remove();
}