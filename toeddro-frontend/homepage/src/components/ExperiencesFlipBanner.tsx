import { Link } from "react-router-dom";
import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

const MESSAGES = [
  "WHAT'S ON IN CHENNAI\u00a0→",
  "STOP DOOMSCROLLING. GO OUTSIDE\u00a0→",
  "YOUR WEEKEND IS BORING. FIX IT\u00a0→",
  "RUNS, RIDES, GIGS, CHAOS\u00a0→",
  "CHENNAI NOW. EVERYWHERE SOON\u00a0→",
];

const INTERVAL = 2900;
const FLIP_MS = 680;
// Accelerate as it falls, then settle — like a paper page flopping forward.
const EASE = "cubic-bezier(0.55, 0.02, 0.30, 1.05)";

export const ExperiencesFlipBanner = () => {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % MESSAGES.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [reduce]);

  const longest = MESSAGES.reduce((a, b) => (a.length >= b.length ? a : b));
  const curMsg = MESSAGES[current];
  const nextMsg = MESSAGES[(current + 1) % MESSAGES.length];

  return (
    <Link
      to="/experiences"
      aria-label="Local experiences"
      className="group mt-5 inline-flex items-stretch gap-0 max-w-full"
    >
      <span className="hidden sm:inline-flex items-center bg-foreground text-background px-3 brutal-border border-r-0 rounded-l-xl text-xs font-black uppercase tracking-widest">
        New
      </span>
      <span
        className="relative brutal-border rounded-xl sm:rounded-l-none brutal-shadow font-black uppercase tracking-tight text-xs sm:text-2xl md:text-3xl leading-none transition-transform group-hover:-translate-y-0.5 bg-banner-purple text-white overflow-hidden"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
      >
        <span className="sm:hidden absolute top-1.5 left-1.5 z-30 bg-foreground text-background brutal-border rounded-full px-2 py-0.5 text-[9px] leading-none tracking-widest">
          New
        </span>

        {/* Sizer: locks card width to the longest line. Height comes from padded sizer. */}
        <span
          aria-hidden
          className="invisible block whitespace-nowrap pl-12 pr-4 sm:px-6 py-3 sm:py-4 min-h-[64px] sm:min-h-[88px] md:min-h-[100px]"
        >
          {longest}
        </span>

        {/* Subtle "pad of pages" stack edge along the bottom */}
        <span
          aria-hidden
          className="absolute left-1 right-1 bottom-[-3px] h-[3px] rounded-b-xl bg-black/25 z-0 pointer-events-none"
        />
        <span
          aria-hidden
          className="absolute left-2 right-2 bottom-[-6px] h-[3px] rounded-b-xl bg-black/15 z-0 pointer-events-none"
        />

        {/* Calendar page area. Page falls FORWARD over the top hinge. */}
        <span
          className="absolute inset-0 z-10"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}
        >
          {reduce ? (
            <PageFace text={"WHAT'S ON IN CHENNAI\u00a0→"} />
          ) : (
            <FlipPage key={current} current={curMsg} next={nextMsg} />
          )}
        </span>
      </span>
    </Link>
  );
};

type PageFaceProps = { text: string; style?: CSSProperties; className?: string };

const PageFace = ({ text, style, className = "" }: PageFaceProps) => (
  <span
    className={
      "absolute inset-0 flex items-center justify-center pl-12 pr-4 sm:px-6 text-center bg-banner-purple rounded-xl sm:rounded-l-none " +
      className
    }
    style={style}
  >
    {text}
  </span>
);

type FlipPageProps = { current: string; next: string };

const FlipPage = ({ current, next }: FlipPageProps) => {
  // Remounted each cycle. The next message sits underneath, fully visible.
  // The current page falls forward over the top hinge, revealing it.
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const startAt = Math.max(0, INTERVAL - FLIP_MS);
    const id = window.setTimeout(() => setFlipped(true), startAt);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <span className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {/* NEXT page sits underneath, static, fully laid out */}
      <PageFace text={next} />

      {/* CURRENT page — the one that falls forward */}
      <span
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
          transform: flipped ? "rotateX(105deg)" : "rotateX(0deg)",
          transition: `transform ${FLIP_MS}ms ${EASE}`,
          willChange: "transform",
        }}
      >
        <PageFace
          text={current}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            // Subtle paper curl/bend
            transform: flipped ? "translateZ(0) skewX(0deg)" : "none",
            boxShadow: flipped
              ? "0 14px 22px -10px rgba(0,0,0,0.45), inset 0 -22px 28px -22px rgba(0,0,0,0.35)"
              : "none",
            transition: `box-shadow ${FLIP_MS}ms ${EASE}`,
          }}
        />
        {/* Sheen / highlight catching the light mid-fold */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl sm:rounded-l-none pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.18) 100%)",
            mixBlendMode: "overlay",
            opacity: flipped ? 1 : 0,
            transition: `opacity ${FLIP_MS}ms ${EASE}`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      </span>

      {/* Shadow cast by the falling page onto the page underneath */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-l-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)",
          opacity: flipped ? 0 : 0,
          animation: flipped ? `flip-shadow ${FLIP_MS}ms ${EASE} forwards` : "none",
        }}
      />
      <style>{`
        @keyframes flip-shadow {
          0% { opacity: 0; }
          40% { opacity: 0.55; }
          100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default ExperiencesFlipBanner;