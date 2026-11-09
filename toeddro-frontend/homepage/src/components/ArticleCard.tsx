import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { revealProps } from "@/lib/motion";
import type { Article } from "@/hooks/useArticles";

const categoryColor: Record<string, string> = {
  Guides: "bg-primary text-primary-foreground",
  Stories: "bg-secondary text-secondary-foreground",
  "Operator Spotlights": "bg-accent text-accent-foreground",
  "Adventure Tips": "bg-foreground text-background",
};

const categoryEmoji: Record<string, string> = {
  Guides: "🧭",
  Stories: "📖",
  "Operator Spotlights": "⭐",
  "Adventure Tips": "💡",
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export const ArticleCard = ({ a, index = 0 }: { a: Article; index?: number }) => {
  const reduce = useReducedMotion();
  const tint = categoryColor[a.category] ?? "bg-card text-foreground";
  const emoji = categoryEmoji[a.category] ?? "✨";
  return (
    <motion.div {...revealProps(index, !!reduce)}>
      <Link
        to={`/articles/${a.slug}`}
        className="group card-pop block bg-card brutal-border brutal-shadow rounded-3xl overflow-hidden h-full"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-foreground bg-muted">
          {a.cover_image_url ? (
            <>
              <img
                src={a.cover_image_url}
                alt={`${a.title}${a.location ? `, ${a.location}` : ""}`}
                loading="lazy"
                width={1024}
                height={576}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* brand tint overlay for cohesion */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply opacity-40 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary)/0.55), transparent 45%, hsl(var(--secondary)/0.45))",
                }}
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/55 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 gradient-hero flex items-center justify-center text-7xl">
              <span aria-hidden>{emoji}</span>
            </div>
          )}
          <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full brutal-border text-[10px] font-black uppercase tracking-widest ${tint}`}>
            <span aria-hidden>{emoji}</span>{a.category}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-xl md:text-2xl font-black leading-tight group-hover:text-secondary transition-colors">
            {a.title}
          </h3>
          <p className="mt-2 text-sm md:text-base text-muted-foreground line-clamp-3">{a.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>{fmtDate(a.published_at)}</span>
            <span aria-hidden>·</span>
            <span>{a.read_time_minutes} min read</span>
            {a.location && (<><span aria-hidden>·</span><span>{a.location}</span></>)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};