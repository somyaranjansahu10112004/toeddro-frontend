import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Tribute strip config. Auto-removes after this date (ISO).
// 7 days from the message date (2026-08-04).
const TRIBUTE_EXPIRES_AT = "2026-08-11T06:08:00Z";
const DISMISS_KEY = "toeddro:tribute-dismissed-v2";

// One continuous line, repeated to fill the marquee.
const SEGMENT =
  "Nirmal \u201cNimsdai\u201d Purja, 1983 to 2026  \u2022  \u201cNothing is impossible.\u201d  \u2022  Remembering all ten climbers lost on Broad Peak, July 2026  \u2022";

export const TributeStrip = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Hide if past the auto-remove date.
    if (new Date().getTime() >= new Date(TRIBUTE_EXPIRES_AT).getTime()) {
      setShow(false);
      return;
    }
    // Hide if the user dismissed it this session/before.
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") {
        setShow(false);
        return;
      }
    } catch {
      /* localStorage unavailable */
    }
    setShow(true);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  // Detect reduced motion: render static text instead of a scrolling marquee.
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Each of the three identical groups is wider than a 2560px viewport. Moving
  // the full track by exactly one third lands on the next identical group.
  const COPIES_PER_GROUP = 4;
  const GROUP_COUNT = 3;

  return (
    <div
      role="note"
      className="bg-foreground text-background border-b-2 border-foreground overflow-hidden"
    >
      <div className="relative w-full overflow-hidden">
        <div className="w-full overflow-hidden">
          {reduceMotion ? (
            <p className="whitespace-nowrap py-2 px-4 text-center text-[11px] sm:text-xs font-medium tracking-wide leading-snug">
              {SEGMENT}
            </p>
          ) : (
            <div className="relative whitespace-nowrap py-2 text-[11px] sm:text-xs font-medium tracking-wide leading-snug">
              <div className="flex w-max animate-[tribute-marquee_48s_linear_infinite] will-change-transform">
                {Array.from({ length: GROUP_COUNT }).map((_, group) => (
                  <div key={group} className="flex shrink-0" aria-hidden={group > 0}>
                    {Array.from({ length: COPIES_PER_GROUP }).map((_, i) => (
                      <span key={i} className="px-8">
                        {SEGMENT}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss tribute"
          className="absolute right-2 top-1/2 z-10 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-foreground hover:bg-foreground/90 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <style>{`
        @keyframes tribute-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[tribute-marquee_48s_linear_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TributeStrip;
