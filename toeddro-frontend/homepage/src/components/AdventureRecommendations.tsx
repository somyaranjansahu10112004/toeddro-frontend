import { useEffect, useMemo, useState } from "react";
import { Compass, MapPin, RotateCcw, Sparkles } from "lucide-react";
import type { DbOperator } from "@/hooks/useOperators";
import { useOperatorReviews } from "@/hooks/useReviews";

type Preferences = { activity: string; location: string };
const KEY = "toeddro.adventure-preferences.v1";
const readPreferences = (): Preferences => {
  try { const value = JSON.parse(localStorage.getItem(KEY) || "{}"); return { activity: typeof value.activity === "string" ? value.activity : "All", location: typeof value.location === "string" ? value.location : "All" }; }
  catch { return { activity: "All", location: "All" }; }
};
const normalize = (value: string | null | undefined) => (value || "").trim().toLowerCase();

function RecommendedCard({ op, reasons, onSelect }: { op: DbOperator; reasons: string[]; onSelect: (op: DbOperator) => void }) {
  const { avg, ratedCount } = useOperatorReviews(op.id);
  return <article className="min-w-0 rounded-2xl border-2 border-foreground/15 bg-card p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider">{op.tag || "Adventure"}</span><Compass className="h-5 w-5 shrink-0 text-secondary" /></div>
    <h3 className="mt-3 text-lg font-black leading-tight">{op.clean_name || op.name}</h3>
    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0" />{[op.location, op.state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "Location not listed"}</p>
    <p className="mt-2 text-xs font-semibold text-muted-foreground">{avg !== null ? `${avg.toFixed(1)} / 5 · ${ratedCount} rating${ratedCount === 1 ? "" : "s"}` : "No reviews yet"}</p>
    <ul className="mt-3 space-y-1">{reasons.map((reason) => <li key={reason} className="text-xs font-semibold">✓ {reason}</li>)}</ul>
    <button type="button" onClick={() => onSelect(op)} className="mt-4 w-full rounded-full border-2 border-foreground bg-foreground px-4 py-2.5 text-xs font-black uppercase text-background hover:bg-secondary hover:text-secondary-foreground">Explore listing →</button>
  </article>;
}

export function AdventureRecommendations({ operators, onSelect }: { operators: DbOperator[]; onSelect: (op: DbOperator) => void }) {
  const [preferences, setPreferences] = useState<Preferences>(readPreferences);
  const [started, setStarted] = useState(false);
  const activities = useMemo(() => [...new Set(operators.flatMap((op) => (Array.isArray(op.tags) ? op.tags : []).concat(op.tag || []).filter(Boolean)))].sort((a,b) => a.localeCompare(b)), [operators]);
  const locations = useMemo(() => [...new Set(operators.flatMap((op) => [op.location, op.state].filter((v): v is string => !!v?.trim())))].sort((a,b) => a.localeCompare(b)), [operators]);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(preferences)); } catch { /* storage can be unavailable */ } }, [preferences]);
  const results = useMemo(() => {
    const ranked = operators.map((op) => {
      const tags = (Array.isArray(op.tags) ? op.tags : []).concat(op.tag || []).map(normalize);
      const activityMatch = preferences.activity === "All" || tags.includes(normalize(preferences.activity));
      const locationMatch = preferences.location === "All" || normalize(op.location) === normalize(preferences.location) || normalize(op.state) === normalize(preferences.location) || normalize(op.service_areas).includes(normalize(preferences.location));
      if (!activityMatch || !locationMatch) return null;
      const reasons: string[] = [];
      if (preferences.activity !== "All") reasons.push(`Offers ${preferences.activity}`);
      if (preferences.location !== "All") reasons.push(`Matches ${preferences.location}`);
      if (!reasons.length) reasons.push(`Explore ${op.tag || "adventure"} options`);
      // Deterministic preference-first score; do not use legacy rating fields as verified review data.
      const score = (preferences.activity !== "All" && activityMatch ? 2 : 0) + (preferences.location !== "All" && locationMatch ? 1 : 0);
      return { op, reasons, score };
    }).filter((item): item is { op: DbOperator; reasons: string[]; score: number } => item !== null);
    return ranked.sort((a,b) => b.score - a.score || (a.op.clean_name || a.op.name).localeCompare(b.op.clean_name || b.op.name)).slice(0, 3);
  }, [operators, preferences]);
  const reset = () => { setPreferences({ activity: "All", location: "All" }); setStarted(false); try { localStorage.removeItem(KEY); } catch { /* ignore */ } };

  return <section className="container pb-14" aria-labelledby="recommendations-title">
    <div className="rounded-3xl border-2 border-foreground/15 bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-secondary"><Sparkles className="h-4 w-4" /> Personalised discovery</p><h2 id="recommendations-title" className="text-3xl font-black sm:text-4xl">Find your kind of wild.</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Choose an activity and destination to get transparent, preference-based operator suggestions.</p></div><button type="button" onClick={reset} className="inline-flex items-center gap-2 self-start rounded-full border-2 border-foreground/20 px-4 py-2 text-xs font-black uppercase hover:bg-primary sm:self-auto"><RotateCcw className="h-3.5 w-3.5" /> Reset</button></div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-xs font-black uppercase tracking-wide">Activity<select value={preferences.activity} onChange={(e) => { setPreferences((p) => ({ ...p, activity: e.target.value })); setStarted(true); }} className="mt-2 block min-h-11 w-full rounded-xl border-2 border-foreground/20 bg-background px-3 text-sm font-semibold normal-case"><option value="All">Any activity</option>{activities.map((activity) => <option key={activity} value={activity}>{activity}</option>)}</select></label>
        <label className="text-xs font-black uppercase tracking-wide">Destination<select value={preferences.location} onChange={(e) => { setPreferences((p) => ({ ...p, location: e.target.value })); setStarted(true); }} className="mt-2 block min-h-11 w-full rounded-xl border-2 border-foreground/20 bg-background px-3 text-sm font-semibold normal-case"><option value="All">Anywhere</option>{locations.map((location) => <option key={location} value={location}>{location}</option>)}</select></label>
      </div>
      <div className="mt-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-black uppercase tracking-wide">{started ? "Your matching operators" : "A few places to start"}</h3><span className="text-xs text-muted-foreground">Based on available listing data · not AI-generated</span></div>
        {results.length ? <div className="grid grid-cols-1 gap-3 md:grid-cols-3">{results.map(({op, reasons}) => <RecommendedCard key={op.id} op={op} reasons={reasons} onSelect={onSelect} />)}</div> : <div className="rounded-2xl border-2 border-dashed border-foreground/20 p-6 text-center"><p className="font-black">No matching listings found.</p><p className="mt-1 text-sm text-muted-foreground">Try another activity or destination, or reset your preferences.</p><button type="button" onClick={reset} className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-black uppercase text-background">Reset preferences</button></div>}
      </div>
    </div>
  </section>;
}
