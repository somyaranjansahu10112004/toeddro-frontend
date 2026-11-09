import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Sparkles, Grid3x3, Footprints, Wind, Anchor, Plane, ArrowDownToLine, Binoculars, MountainSnow, Waves, Bike, Tent, Leaf } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { revealProps } from "@/lib/motion";

export const slugifyLocation = (loc: string) =>
  loc.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const LocationPills = ({
  locations,
  title = "Explore by location",
  subtitle,
}: {
  locations: string[];
  title?: string;
  subtitle?: string;
}) => {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const filteredLocations = useMemo(() => locations.filter((loc) => loc.toLowerCase().includes(search.trim().toLowerCase())), [locations, search]);
  const visibleLocations = filteredLocations.slice(0, visibleCount);
  if (!locations.length) return null;
  return (
    <section className="container py-10" id="location-discovery">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div><h2 className="text-3xl md:text-5xl font-black mb-2">{title}</h2>
        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}</div>
        <label className="location-search-label">
          <span className="sr-only">Filter locations</span>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setVisibleCount(12); }} placeholder="Find a location…" aria-label="Filter locations" className="location-search-input" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {visibleLocations.map((l, i) => (
          <motion.div key={l} {...revealProps(i, !!reduce)}>
            <Link
              to={`/explore/${slugifyLocation(l)}`}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 min-h-11 rounded-full brutal-border font-black uppercase text-xs sm:text-sm bg-card hover:bg-primary transition-colors pill-pop"
            >
              <MapPin className="w-4 h-4" /> {l}
            </Link>
          </motion.div>
        ))}
      </div>
      {filteredLocations.length === 0 ? (
        <p className="mt-5 text-sm font-semibold text-muted-foreground">No locations match “{search}”. Try another name.</p>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Showing {visibleLocations.length} of {filteredLocations.length} locations</p>
          {visibleCount < filteredLocations.length && <button type="button" onClick={() => setVisibleCount(count => count + 12)} className="rounded-full px-5 py-2.5 min-h-11 bg-foreground text-background font-black uppercase text-xs hover:bg-secondary hover:text-secondary-foreground">Load more</button>}
        </div>
      )}
    </section>
  );
};

const tagIcons: Record<string, any> = {
  Trekking: Footprints, Paragliding: Wind, Rafting: Waves,
  Scuba: Anchor, Skydiving: Plane, Bungee: ArrowDownToLine, Camping: Tent,
  Biking: Bike, Safari: Binoculars, Climbing: MountainSnow, "Wellness & Retreat": Leaf, All: Grid3x3,
};

export const TagPills = ({
  tags,
  title = "Explore by activity",
  subtitle,
}: {
  tags: string[];
  title?: string;
  subtitle?: string;
}) => {
  const reduce = useReducedMotion();
  if (!tags.length) return null;
  return (
    <section className="container py-12">
      <h2 className="text-3xl md:text-5xl font-black mb-2">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground mb-6">{subtitle}</p>}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {tags.map((t, i) => {
          const Icon = tagIcons[t] || Sparkles;
          return (
            <motion.div key={t} {...revealProps(i, !!reduce)}>
              <Link
                to={`/explore/${slugifyLocation(t)}`}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 min-h-11 rounded-full brutal-border font-black uppercase text-xs sm:text-sm bg-card hover:bg-primary transition-colors pill-pop"
              >
                <Icon className="w-4 h-4" /> {t}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};