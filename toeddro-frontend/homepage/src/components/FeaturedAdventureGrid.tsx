import { ArrowUpRight, Compass, Footprints, Waves, Tent, Wind, Mountain } from "lucide-react";
import type { DbOperator } from "@/hooks/useOperators";

type Props = { operators: DbOperator[]; onSelect: (operator: DbOperator) => void };
const icons = [Mountain, Waves, Tent, Wind, Footprints, Compass];
const surfaces = ["featured-surface-lime", "featured-surface-coral", "featured-surface-lavender", "featured-surface-ink"];

export function FeaturedAdventureGrid({ operators, onSelect }: Props) {
  const picks = operators.filter(op => op.clean_name && (op.location || op.state || op.tag)).slice(0, 4);
  if (!picks.length) return null;
  return <section className="container pb-12" aria-labelledby="featured-adventures-title">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
      <div><p className="text-xs font-black uppercase tracking-[.18em] text-secondary mb-2">From the directory</p><h2 id="featured-adventures-title" className="text-3xl sm:text-4xl md:text-5xl font-black">A few ways out there.</h2><p className="text-muted-foreground mt-2">Explore real listings from the current Toeddro dataset.</p></div>
      <a href="#explore" className="font-black uppercase text-sm underline underline-offset-4 hover:text-secondary">Browse all operators ↗</a>
    </div>
    <div className="featured-bento-grid">
      {picks.map((op, index) => {
        const Icon = icons[index % icons.length];
        return <button key={op.id} type="button" onClick={() => onSelect(op)} className={`featured-bento-card ${surfaces[index % surfaces.length]} ${index === 0 ? "featured-bento-large" : ""}`} aria-label={`Search for ${op.clean_name}`}>
          <div className="flex items-start justify-between gap-4"><span className="featured-icon"><Icon /></span><ArrowUpRight className="w-5 h-5" /></div>
          <div className="mt-auto pt-7"><p className="text-xs font-black uppercase tracking-widest opacity-75">{op.tag || "Adventure operator"}</p><h3 className="text-xl sm:text-2xl font-black leading-tight mt-2">{op.clean_name}</h3><p className="mt-2 text-sm font-semibold opacity-80">{[op.location, op.state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "Location not listed"}</p></div>
        </button>;
      })}
    </div>
  </section>;
}
