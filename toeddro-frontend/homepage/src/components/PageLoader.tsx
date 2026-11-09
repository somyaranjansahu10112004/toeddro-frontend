import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Brutalist intro flash. Plays only once per session. */
export const PageLoader = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem("toeddro:loaderShown") === "1") return false;
    return true;
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("toeddro:loaderShown", "1");
    const t = setTimeout(() => setShow(false), reduce ? 200 : 1200);
    return () => clearTimeout(t);
  }, [show, reduce]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-foreground text-background flex items-center justify-center ${
        reduce ? "" : "loader-slide"
      }`}
      aria-hidden
    >
      <span className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter">
        TOEDDRO
      </span>
    </div>
  );
};

export default PageLoader;