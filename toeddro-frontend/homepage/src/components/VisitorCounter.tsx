import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seededRand(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function istDateSeed(now: Date) {
  const istMs = now.getTime() + (5.5 * 60 - now.getTimezoneOffset()) * 60_000;
  const ist = new Date(istMs);
  return ist.getUTCFullYear() * 10000 + (ist.getUTCMonth() + 1) * 100 + ist.getUTCDate();
}
function msUntilNextIstMidnight(now: Date) {
  const istMs = now.getTime() + (5.5 * 60 - now.getTimezoneOffset()) * 60_000;
  const ist = new Date(istMs);
  const next = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + 1);
  return next - istMs;
}
function baseFor(seed: number) {
  return 180 + Math.floor(seededRand(seed) * 61);
}

export function VisitorCounter() {
  const reduce = useReducedMotion();
  const finalBase = baseFor(istDateSeed(new Date()));
  const [count, setCount] = useState(reduce ? finalBase : Math.max(0, finalBase - 8));
  const [rolling, setRolling] = useState(!reduce);
  const [plusKey, setPlusKey] = useState(0);
  const [flashKey, setFlashKey] = useState(0);

  // Initial count-up over 1.2s
  useEffect(() => {
    if (reduce) return;
    const start = Math.max(0, finalBase - 8);
    const target = finalBase;
    const duration = 1200;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const v = Math.round(start + (target - start) * p);
      setCount(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setRolling(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Increment every 60s; reset at IST midnight
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCount((c) => c + 1);
      setPlusKey((k) => k + 1);
      setFlashKey((k) => k + 1);
    }, 60_000);
    const midnight = window.setTimeout(() => {
      setCount(baseFor(istDateSeed(new Date())));
    }, msUntilNextIstMidnight(new Date()) + 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(midnight);
    };
  }, []);

  return (
    <div className="relative inline-flex items-center gap-2 bg-card brutal-border brutal-shadow-sm rounded-full px-3 py-1">
      {/* +1 floater */}
      {!reduce && plusKey > 0 && (
        <span
          key={plusKey}
          className="plus-one absolute left-3 -top-1 text-xs font-black text-secondary pointer-events-none"
          aria-hidden
        >
          +1
        </span>
      )}
      <span className="relative flex h-2 w-2" aria-hidden>
        {!reduce && (
          <span
            className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping"
            style={{ animationDuration: "var(--visitor-pulse-dur, 2.4s)" }}
          />
        )}
        <span
          key={`dot-${flashKey}`}
          className={`relative inline-flex rounded-full h-2 w-2 bg-primary ${flashKey > 0 && !reduce ? "dot-flash" : ""}`}
        />
      </span>
      <span className="text-xs md:text-sm font-medium text-foreground inline-flex items-baseline gap-1 tabular-nums">
        <span className="relative inline-block min-w-[2ch] text-right font-bold">
          {rolling ? (
            <span className="inline-block">{count}</span>
          ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {count}
            </motion.span>
          </AnimatePresence>
          )}
        </span>
        <span>adventurers exploring today</span>
      </span>
    </div>
  );
}

export default VisitorCounter;
