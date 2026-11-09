import { useMemo, useState } from "react";
import { Star, PenSquare } from "lucide-react";
import { useOperatorReviews } from "@/hooks/useReviews";
import { ReviewDialog } from "./ReviewDialog";

const Stars = ({ value, size = "w-4 h-4" }: { value: number; size?: string }) => (
  <div className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`${size} ${n <= Math.round(value) ? "fill-secondary text-secondary" : "text-muted-foreground/40"}`}
        strokeWidth={2.5}
      />
    ))}
  </div>
);

export const OperatorReviews = ({ operatorId, operatorName }: { operatorId: string; operatorName: string }) => {
  const { reviews, avg, count, ratedCount, refresh } = useOperatorReviews(operatorId);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("recent");
  const [starFilter, setStarFilter] = useState("all");
  const visibleReviews = useMemo(() => reviews.filter((review) => starFilter === "all" || String(review.rating) === starFilter).slice().sort((a, b) => sort === "high" ? (b.rating || 0) - (a.rating || 0) : sort === "low" ? (a.rating || 0) - (b.rating || 0) : Date.parse(b.created_at) - Date.parse(a.created_at)), [reviews, sort, starFilter]);

  return (
    <section>
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Traveller reviews</h2>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 bg-card brutal-border brutal-shadow-sm rounded-full px-3 py-1.5 text-[11px] font-black uppercase hover:bg-secondary hover:text-secondary-foreground"
        >
          <PenSquare className="w-3.5 h-3.5" /> Write a review
        </button>
      </div>

      {ratedCount > 0 && avg !== null && (
        <div className="flex items-center gap-3 mb-4">
          <Stars value={avg} size="w-5 h-5" />
          <span className="text-sm font-bold">
            {avg.toFixed(1)} <span className="text-muted-foreground font-medium">({ratedCount} rating{ratedCount === 1 ? "" : "s"})</span>
          </span>
        </div>
      )}

      {count === 0 ? (
        <p className="text-sm text-muted-foreground italic">No reviews yet. Be the first to share your experience.</p>
      ) : (
        <>
        <div className="mb-3 flex flex-wrap gap-2">
          <label className="text-xs font-bold">Sort <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-1 rounded-lg border border-foreground/20 bg-background px-2 py-1"><option value="recent">Most recent</option><option value="high">Highest rated</option><option value="low">Lowest rated</option></select></label>
          <label className="text-xs font-bold">Rating <select value={starFilter} onChange={(e) => setStarFilter(e.target.value)} className="ml-1 rounded-lg border border-foreground/20 bg-background px-2 py-1"><option value="all">All ratings</option><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
        </div>
        <ul className="space-y-3">
          {visibleReviews.map((r) => (
            <li key={r.id} className="bg-background brutal-border rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-black text-sm truncate">{r.reviewer_name}</p>
                  {r.reviewer_location && (
                    <span className="text-xs text-muted-foreground truncate">· {r.reviewer_location}</span>
                  )}
                </div>
                {r.rating && <Stars value={r.rating} />}
              </div>
              <p className="text-sm leading-relaxed">{r.body}</p>{r.storage === "local" && <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Saved locally · visible only in this browser</p>}
            </li>
          ))}
        </ul>
        {visibleReviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews match this filter.</p>}
        </>
      )}

      <ReviewDialog
        open={open}
        onOpenChange={setOpen}
        reviewerType="traveller"
        operatorId={operatorId}
        operatorName={operatorName}
        onSaved={refresh}
      />
    </section>
  );
};

export default OperatorReviews;