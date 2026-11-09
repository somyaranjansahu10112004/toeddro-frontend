import { motion, useReducedMotion, type MotionProps, type TargetAndTransition } from "framer-motion";
import { Check, X } from "lucide-react";
import { revealProps } from "@/lib/motion";

export const WhyWeExist = () => {
  const reduce = useReducedMotion();

  /**
   * Card 2 sits at a permanent angle, so the tilt has to be carried through both
   * ends of the shared reveal or the card would straighten itself out on entry.
   */
  const tiltedReveal = (index: number): MotionProps => {
    const base = revealProps(index, !!reduce);
    return {
      ...base,
      initial: { ...(base.initial as TargetAndTransition), rotate: -2 },
      whileInView: { ...(base.whileInView as TargetAndTransition), rotate: -2 },
    };
  };

  return (
    <section className="container pb-16">
      <motion.h2
        {...revealProps(0, !!reduce)}
        className="text-4xl md:text-6xl font-black mb-2"
      >
        Why we exist.
      </motion.h2>
      <p className="text-lg text-muted-foreground mb-8">The math is simple. The middlemen, not so much.</p>

      <div className="grid md:grid-cols-3 gap-5 items-stretch">
        {/* CARD 1 */}
        <motion.div
          {...revealProps(0, !!reduce)}
          className="bg-card brutal-border brutal-shadow rounded-3xl p-7 flex flex-col gap-3"
        >
          <span className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">On other platforms</span>
          <p className="text-2xl md:text-3xl font-black leading-tight">You pay</p>
          <p className="text-5xl md:text-6xl font-black tracking-tighter">₹12,500</p>
          <p className="text-sm text-muted-foreground font-medium">For a ₹10,000 trip.</p>
        </motion.div>

        {/* CARD 2, slightly rotated, with animated strike-through */}
        <motion.div
          {...tiltedReveal(1)}
          className="relative bg-card brutal-border brutal-shadow rounded-3xl p-7 flex flex-col gap-3 overflow-hidden"
        >
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-destructive text-destructive-foreground brutal-border flex items-center justify-center">
            <X className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-destructive">The leak</span>
          <p className="text-2xl md:text-3xl font-black leading-tight">Platform pockets</p>
          <p className="text-5xl md:text-6xl font-black tracking-tighter">₹2,500</p>
          <p className="text-sm text-muted-foreground font-medium">For doing… nothing.</p>
          {/* animated strike-through */}
          <motion.span
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: 0.25, ease: [0.7, 0, 0.3, 1] }}
            style={{ transformOrigin: "left center" }}
            className="pointer-events-none absolute left-4 right-4 top-1/2 h-1.5 bg-destructive -rotate-3 rounded-full"
            aria-hidden
          />
        </motion.div>

        {/* CARD 3 */}
        <motion.div
          {...revealProps(2, !!reduce)}
          className="relative bg-primary text-primary-foreground brutal-border brutal-shadow rounded-3xl p-7 flex flex-col gap-3"
        >
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-foreground text-primary brutal-border flex items-center justify-center">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.18em]">On Toeddro</span>
          <p className="text-2xl md:text-3xl font-black leading-tight">You pay</p>
          <p className="text-5xl md:text-6xl font-black tracking-tighter">₹10,000</p>
          <p className="text-sm font-bold">The actual price. Direct to the operator.</p>
        </motion.div>
      </div>

      <p className="mt-8 text-center text-lg md:text-xl font-black uppercase tracking-wider">
        Same trip. <span className="text-secondary">Better price.</span> Always.
      </p>
    </section>
  );
};

export default WhyWeExist;