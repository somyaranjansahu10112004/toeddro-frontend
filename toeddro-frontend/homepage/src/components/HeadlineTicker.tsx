import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINES = [
  "Booking platforms take 20-30%. We take 0.",
  "Every middleman, gone.",
  "Direct to the source. Always.",
  "Real operators. Real prices.",
  "Skip the markup. Find the real ones.",
];

export const HeadlineTicker = () => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % LINES.length), 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mt-4 h-6 sm:h-7 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          initial={reduce ? { opacity: 1 } : { y: 20, opacity: 0, rotateX: -60 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={reduce ? { opacity: 0 } : { y: -20, opacity: 0, rotateX: 60 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs sm:text-sm uppercase tracking-[0.18em] font-black text-secondary"
          style={{ fontVariantCaps: "small-caps" }}
        >
          {LINES[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default HeadlineTicker;