import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { usePublishedReviews } from "@/hooks/useReviews";
import { revealProps } from "@/lib/motion";
import { ReviewDialog } from "./ReviewDialog";

export const HomeReviewsSection = () => {
  const { reviews, loading } = usePublishedReviews(12);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  if (loading || reviews.length === 0) return null;

  return (
    <section className="container pb-16 home-reviews-premium" aria-label="What people say">
      <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Real voices</p>
          <h2 className="text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter">
            What people say.
          </h2>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="press bg-card brutal-border brutal-shadow-sm rounded-full px-5 py-2.5 text-xs font-black uppercase hover:bg-secondary hover:text-secondary-foreground"
        >
          Are you an operator? Share yours →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {reviews.map((r, i) => {
          const isOp = r.reviewer_type === "operator";
          return (
            <motion.article
              key={r.id}
              {...revealProps(i, !!reduce)}
              className={`card-pop relative bg-card brutal-border brutal-shadow rounded-3xl p-5 md:p-6 flex flex-col ${isOp ? "bg-secondary/10" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full brutal-border ${
                    isOp ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isOp ? "Operator" : "Traveller"}
                </span>
                {!isOp && r.rating && (
                  <div className="inline-flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-3.5 h-3.5 ${n <= (r.rating ?? 0) ? "fill-secondary text-secondary" : "text-muted-foreground/40"}`}
                        strokeWidth={2.5}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Quote className="w-5 h-5 text-muted-foreground/50 mb-2" />
              <p className="text-base leading-relaxed font-medium flex-1">{r.body}</p>

              <div className="mt-4 pt-3 border-t-2 border-foreground/10">
                <p className="text-sm font-black">{r.reviewer_name}</p>
                <p className="text-xs text-muted-foreground font-bold">
                  {[isOp ? r.business_name : null, r.reviewer_location].filter(Boolean).join(" · ")}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      <ReviewDialog open={open} onOpenChange={setOpen} reviewerType="operator" />
    </section>
  );
};

export default HomeReviewsSection;