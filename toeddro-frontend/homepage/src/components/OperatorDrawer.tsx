import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { OperatorDetail } from "./OperatorDetail";
import type { DbOperator } from "@/hooks/useOperators";

type Props = {
  op: DbOperator | null;
  open: boolean;
  onClose: () => void;
};

export const OperatorDrawer = ({ op, open, onClose }: Props) => {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const slideFrom = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  const panelClasses = isMobile
    ? "fixed inset-x-0 bottom-0 h-[85dvh] rounded-t-3xl"
    : "fixed top-0 right-0 h-screen w-[420px] rounded-l-3xl";

  return createPortal(
    <AnimatePresence>
      {open && op && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-foreground/40"
          />
          <motion.div
            key="panel"
            initial={reduce ? { opacity: 0 } : slideFrom.initial}
            animate={reduce ? { opacity: 1 } : slideFrom.animate}
            exit={reduce ? { opacity: 0 } : slideFrom.exit}
            transition={{ type: "spring", stiffness: 380, damping: 36, duration: 0.25 }}
            className={`z-[61] bg-card brutal-border brutal-shadow flex flex-col ${panelClasses}`}
            role="dialog"
            aria-modal="true"
            aria-label={op.clean_name}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-foreground text-background brutal-border brutal-shadow-sm hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <OperatorDetail op={op} />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default OperatorDrawer;
