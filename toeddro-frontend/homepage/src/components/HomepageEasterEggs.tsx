import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mountain, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
];

export const HomepageEasterEggs = () => {
  const reduce = useReducedMotion();
  const [hikerKey, setHikerKey] = useState(0);
  const [hikerOn, setHikerOn] = useState(false);
  const [konamiOn, setKonamiOn] = useState(false);
  const [stickerOn, setStickerOn] = useState(false);
  const [stickerDismissed, setStickerDismissed] = useState(false);

  // "adventure" typed anywhere
  useEffect(() => {
    if (reduce) return;
    let buf = "";
    const target = "adventure";
    const konami: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      // Skip when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      const editable = (e.target as HTMLElement)?.isContentEditable;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || editable;

      // konami
      konami.push(e.key);
      if (konami.length > KONAMI.length) konami.shift();
      if (konami.join(",") === KONAMI.join(",")) {
        setKonamiOn(true);
        window.setTimeout(() => setKonamiOn(false), 2000);
      }

      // adventure
      if (inField) return;
      if (e.key.length === 1) {
        buf = (buf + e.key.toLowerCase()).slice(-target.length);
        if (buf === target) {
          setHikerKey((n) => n + 1);
          setHikerOn(true);
          toast({ title: "🏔️ You found us.", description: "Welcome to the wild side." });
          window.setTimeout(() => setHikerOn(false), 5500);
          buf = "";
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduce]);

  // scroll past 50%
  useEffect(() => {
    if (stickerDismissed) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (scrolled > 0.5) setStickerOn(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickerDismissed]);

  return (
    <>
      {/* Walking hiker */}
      <AnimatePresence>
        {hikerOn && (
          <motion.div
            key={hikerKey}
            initial={{ x: "-10vw", opacity: 1 }}
            animate={{ x: "110vw" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className="fixed bottom-3 left-0 z-[80] pointer-events-none"
            aria-hidden
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
              className="text-3xl"
            >
              🥾
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll sticker */}
      <AnimatePresence>
        {stickerOn && !stickerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 right-4 z-[70] max-w-[260px]"
          >
            <div className="relative bg-secondary text-secondary-foreground brutal-border brutal-shadow rounded-2xl px-4 py-3 pr-9 font-black uppercase text-xs tracking-wider">
              👀 still scrolling? contact one already.
              <button
                type="button"
                onClick={() => setStickerDismissed(true)}
                aria-label="Dismiss"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-foreground text-background inline-flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami takeover */}
      <AnimatePresence>
        {konamiOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-foreground text-background flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -3 }}
              animate={{ scale: 1, rotate: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 14 }}
              className="text-center"
            >
              <Mountain className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-[16vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter">
                <span className="bg-primary text-primary-foreground px-3 brutal-border inline-block">
                  THE WILD
                </span>
                <br />
                <span className="text-stroke" style={{ WebkitTextStroke: "3px hsl(var(--background))" }}>
                  IS CALLING
                </span>
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomepageEasterEggs;