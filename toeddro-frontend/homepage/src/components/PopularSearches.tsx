import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { comboHref, type Combo } from "@/lib/combos";
import { Reveal } from "@/lib/motion";

/**
 * Link block to the highest volume activity + location combo pages.
 * Used on the homepage and location pages so crawlers reach combo pages fast.
 */
export const PopularSearches = ({
  combos,
  title = "Popular searches",
  subtitle,
  limit = 12,
}: {
  combos: Combo[];
  title?: string;
  subtitle?: string;
  limit?: number;
}) => {
  const items = combos.slice(0, limit);
  if (!items.length) return null;
  return (
    <Reveal as="section" className="container py-12">
      <h2 className="text-3xl md:text-5xl font-black mb-2">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground mb-6">{subtitle}</p>}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {items.map((c) => (
          <Link
            key={c.slug}
            to={comboHref(c.slug)}
            className="pill-pop inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 min-h-11 rounded-full brutal-border font-black uppercase text-xs sm:text-sm bg-card hover:bg-primary transition-colors"
          >
            <Search className="w-4 h-4" /> {c.activity} in {c.location}
            <span className="text-muted-foreground">{c.count}</span>
          </Link>
        ))}
      </div>
    </Reveal>
  );
};