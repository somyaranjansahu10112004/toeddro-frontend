// Programmatic activity + location combination pages.
// A combo page only exists when at least MIN_OPERATORS operators share the
// same activity tag and location, so we never publish an empty page.

export const MIN_COMBO_OPERATORS = 2;

export const COMBO_TAGS = [
  "Trekking", "Paragliding", "Rafting", "Scuba", "Skydiving",
  "Bungee", "Camping", "Biking", "Safari", "Climbing", "Wellness & Retreat",
] as const;

export const comboSlugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const BAD_LOCATIONS = new Set(["state", "india", "unknown", "n/a", "na", ""]);

export type ComboOp = {
  tag?: string | null;
  tags?: string[] | null;
  location: string | null;
  state?: string | null;
};

/**
 * Activity tags for an operator. Reads the multi-value `tags` array and falls
 * back to the legacy single `tag` column while it still exists.
 */
export const opTags = (o: { tag?: string | null; tags?: string[] | null }): string[] => {
  const list = (o.tags || []).map((t) => (t || "").trim()).filter(Boolean);
  if (list.length) return Array.from(new Set(list));
  const single = (o.tag || "").trim();
  return single ? [single] : [];
};

/** True when the operator carries the given activity tag. */
export const hasTag = (o: { tag?: string | null; tags?: string[] | null }, tag: string) =>
  opTags(o).some((t) => t.toLowerCase() === tag.toLowerCase());

export type Combo = {
  slug: string;
  activity: string;
  location: string;
  state: string | null;
  count: number;
};

export const comboSlug = (activity: string, location: string) =>
  `${comboSlugify(activity)}-in-${comboSlugify(location)}`;

/** "Rishikesh, Uttarakhand" for display; plain city when no state is stored. */
export const displayLocation = (location: string, state?: string | null) => {
  const l = (location || "").trim();
  const s = (state || "").trim();
  if (!s || s.toLowerCase() === l.toLowerCase()) return l;
  return `${l}, ${s}`;
};

/**
 * The slug these pages used before city and state were split apart
 * ("rishikesh-uttarakhand"). Kept so old URLs can redirect to the clean slug.
 */
export const legacyLocationSlug = (location: string, state?: string | null) => {
  const s = (state || "").trim();
  if (!s) return null;
  const legacy = comboSlugify(`${location} ${s}`);
  const clean = comboSlugify(location);
  return legacy === clean ? null : legacy;
};

/** old location slug -> clean location slug, built from live operator data. */
export function legacyLocationRedirects<T extends ComboOp>(ops: T[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const o of ops) {
    const loc = (o.location || "").trim();
    if (!loc) continue;
    const legacy = legacyLocationSlug(loc, o.state);
    if (legacy) map.set(legacy, comboSlugify(loc));
  }
  return map;
}

/**
 * Resolves any slug (location or combo) that still carries a concatenated
 * state to its clean equivalent. Returns null when the slug is already clean.
 */
export function resolveLegacySlug<T extends ComboOp>(ops: T[], slug: string): string | null {
  const redirects = legacyLocationRedirects(ops);
  const s = slug.toLowerCase();
  const direct = redirects.get(s);
  if (direct && direct !== s) return direct;
  const idx = s.indexOf("-in-");
  if (idx > 0) {
    const activity = s.slice(0, idx);
    const loc = s.slice(idx + 4);
    const clean = redirects.get(loc);
    if (clean && clean !== loc) return `${activity}-in-${clean}`;
  }
  return null;
}

/** Every activity + location pair with enough operators to justify a page. */
export function buildCombos<T extends ComboOp>(
  ops: T[],
  min = MIN_COMBO_OPERATORS,
): Combo[] {
  const tags = new Set<string>(COMBO_TAGS as readonly string[]);
  const map = new Map<string, Combo>();
  for (const o of ops) {
    const loc = (o.location || "").trim();
    if (!loc || BAD_LOCATIONS.has(loc.toLowerCase())) continue;
    for (const t of opTags(o)) {
      if (!tags.has(t)) continue;
      const slug = comboSlug(t, loc);
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
        if (!existing.state && o.state) existing.state = o.state.trim() || null;
      } else {
        map.set(slug, { slug, activity: t, location: loc, state: (o.state || "").trim() || null, count: 1 });
      }
    }
  }
  return [...map.values()]
    .filter((c) => c.count >= min)
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/** True for slugs shaped like "rafting-in-rishikesh". */
export const looksLikeCombo = (slug: string) => /-in-/.test(slug.toLowerCase());

export const findCombo = (combos: Combo[], slug: string) =>
  combos.find((c) => c.slug === slug.toLowerCase()) || null;

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
};

/**
 * Four intro variations so combo pages don't read identically.
 * Selected deterministically from the slug: same page, same copy every render.
 */
export function comboIntro(activity: string, location: string, count: number): string {
  const a = activity.toLowerCase();
  const A = activity;
  const L = location;
  const n = count;
  const variants = [
    `${A} in ${L} is one of the most searched adventure plans in India, and Toeddro currently lists ${n} ${a} operators working here. Every listing on this page is a real business with its own phone number, website or Instagram, so you talk to the people running the activity instead of a reseller. There is no booking engine in the middle, no commission added to your price and no lead being sold on. Compare the operators below, read what each one covers, then call or message the ones that fit your dates. Prices, group sizes and slot timings change through the season, so confirm the details directly with the operator before you travel to ${L}.`,
    `Planning ${a} in ${L}? Start with the operators who actually run it. This page collects ${n} ${a} operators based in and around ${L}, listed free on Toeddro with direct contact details attached to each one. You will not find a padded package price here, because Toeddro never sits between you and the operator. Scan the grid below, shortlist two or three, and message them for current rates, safety briefings and available slots. Local operators in ${L} know the terrain, the weather windows and the paperwork better than any aggregator, and speaking to them directly is usually the fastest way to lock in a date that works for your group.`,
    `There are ${n} ${a} operators listed in ${L} on Toeddro right now, from long running outfits to smaller local crews. This page exists so you can find them without wading through booking sites that add a cut to every trip. Each card links to the operator's own contact details, so the price you agree is the price the operator sets. ${A} in ${L} runs across different seasons and difficulty levels, so ask about group size, gear, experience needed and cancellation terms before you pay anything. Toeddro lists operators for free and takes nothing from your booking, which keeps this directory honest and keeps your money with the people doing the work.`,
    `Looking for ${a} in ${L} without a middleman? Toeddro lists ${n} ${a} operators here, each with direct phone, WhatsApp or Instagram contact. The idea is simple: you find the operator, you speak to the operator, you pay the operator. No commission, no markup, no lead resale. Below you can browse everyone we have listed for ${a} in ${L}, along with the activities they offer and the areas they cover. Because rates and timings shift with the season and with demand, treat what you read here as a starting point and confirm the current price and slot availability with the operator before you commit to a date.`,
  ];
  return variants[hash(`${activity}|${location}`) % variants.length];
}

export function comboFaq(activity: string, location: string, count: number) {
  const a = activity.toLowerCase();
  return [
    {
      q: `How much does ${a} cost in ${location}?`,
      a: `Prices for ${a} in ${location} vary by operator, duration, group size and season, and operators set their own rates. Toeddro does not add commission or markup, so the price you get is the operator's own price. Contact the ${count} ${a} operators listed on this page directly for current rates and what is included.`,
    },
    {
      q: `What is the best season for ${a} in ${location}?`,
      a: `The best window for ${a} in ${location} depends on local weather, water levels and permit rules, which shift year to year. Operators here run the activity through the season and know exactly when conditions are good. Ask the operators listed on this page for their current operating dates before you book travel.`,
    },
    {
      q: `How do I contact ${a} operators in ${location} directly?`,
      a: `Every listing on this page carries the operator's own contact details. Open an operator card and reveal their phone, WhatsApp, website or Instagram, then reach out yourself. Toeddro never takes a booking fee and never sits between you and the operator.`,
    },
  ];
}

export const comboHref = (slug: string) => `/explore/${slug}`;

/** Related combos: same location first, then same activity elsewhere. */
export function relatedCombos(combos: Combo[], current: Combo, limit = 6): Combo[] {
  const sameLocation = combos.filter(
    (c) => c.slug !== current.slug && c.location === current.location,
  );
  const sameActivity = combos.filter(
    (c) => c.slug !== current.slug && c.activity === current.activity && c.location !== current.location,
  );
  const out: Combo[] = [];
  const seen = new Set<string>();
  for (const c of [...sameLocation, ...sameActivity]) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}