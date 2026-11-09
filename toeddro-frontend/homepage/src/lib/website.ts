// One rule for turning a stored operator website into something an <a href>
// can safely open. Every render site should go through this rather than
// carry its own prefixing logic, which is how four Admin tables ended up
// rendering href={op.website} raw and turning "adventuresikkim.com/" into a
// relative link to /op/adventuresikkim.com/.
//
// The stored column is messy. Of 977 non-empty websites in production, 876
// carry a scheme, 86 are bare domains ("campmonk.com"), and 15 are email
// addresses ("info@indiahikes.com") that a scraper filed in the wrong column.
// A naive "https://" prefix handles the domains and turns the emails into
// https://info@indiahikes.com, which browsers parse as user "info" at host
// "indiahikes.com": it opens something, but it is a lie about the data.

/**
 * Returns an absolute http(s) URL, or null if the value cannot honestly be
 * one. Callers render nothing for null rather than a broken or misleading link.
 */
export function websiteHref(raw: string | null | undefined): string | null {
  const s = (raw ?? "").trim();
  if (!s) return null;

  // An email address is not a website. Refuse rather than "fix" it.
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(s)) return null;

  // Any explicit scheme other than http(s) is refused outright. This is the
  // same guard cleanUrl() applies to event source_url: a javascript: value
  // rendered into an href executes on our origin.
  const scheme = s.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") return null;

  const candidate = scheme ? s : `https://${s.replace(/^\/+/, "")}`;
  let u: URL;
  try { u = new URL(candidate); } catch { return null; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  // A host with no dot is not a public website ("localhost", "intranet").
  if (!u.hostname.includes(".")) return null;
  // Credentials in the authority are never legitimate here and are exactly
  // what the email-address case produces if it slips past the check above.
  if (u.username || u.password) return null;
  return u.toString();
}

/** Display form: the URL without its scheme, for the link's visible text. */
export function websiteLabel(href: string): string {
  return href.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
