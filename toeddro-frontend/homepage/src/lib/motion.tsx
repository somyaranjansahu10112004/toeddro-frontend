import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * Shared micro-interaction tokens. Hover/press states live in index.css as the
 * .card-pop / .pill-pop / .press utilities so they stay compositor-only; this
 * module covers the parts that need viewport or state awareness.
 */

/** Brand easing. Fast out, settled landing. Used everywhere. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll reveal: rise this far, over this long, staggered by this much. */
export const REVEAL_RISE = 10;
export const REVEAL_DURATION = 0.4;
export const REVEAL_STAGGER = 0.05;

/**
 * Stagger caps out after 6 items. Without the cap a 200 card grid would leave
 * the last card waiting ten seconds for its turn.
 */
export const REVEAL_STAGGER_CAP = REVEAL_STAGGER * 6;

export const revealDelay = (index = 0) =>
  Math.min(index * REVEAL_STAGGER, REVEAL_STAGGER_CAP);

/** Fire slightly before the element is fully on screen so it lands settled. */
export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -40px 0px",
} as const;

/**
 * Motion props for a scroll reveal. Spread onto an existing motion element when
 * you cannot wrap it, otherwise prefer <Reveal>.
 *
 * `reduce` must come from the caller's own useReducedMotion() so the values are
 * reactive to the media query rather than frozen at module load.
 */
export const revealProps = (index = 0, reduce = false): MotionProps =>
  reduce
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: REVEAL_RISE },
        whileInView: { opacity: 1, y: 0 },
        viewport: REVEAL_VIEWPORT,
        transition: {
          duration: REVEAL_DURATION,
          delay: revealDelay(index),
          ease: EASE,
        },
      };

type RevealProps<T extends ElementType> = {
  as?: T;
  index?: number;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "children">;

/**
 * Fades and rises its children into view once. Wrap grid items, sections, and
 * anything else that should arrive rather than appear.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  index = 0,
  children,
  ...rest
}: RevealProps<T>) {
  const reduce = useReducedMotion();
  const Component = motion[(as ?? "div") as "div"];

  return (
    <Component {...revealProps(index, !!reduce)} {...rest}>
      {children}
    </Component>
  );
}
