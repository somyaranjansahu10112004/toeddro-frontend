import { useMemo } from "react";

type Props = {
  className?: string;
  size?: number;
};

/** Brutalist "ZERO COMMISSION" sticker with a randomized rotation. */
export const ZeroCommissionStamp = ({ className = "", size = 96 }: Props) => {
  const rotate = useMemo(() => Math.floor(Math.random() * 11) + 5, []); // 5-15
  const dir = useMemo(() => (Math.random() < 0.5 ? -1 : 1), []);
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, transform: `rotate(${dir * rotate}deg)` }}
    >
      <div className="w-full h-full rounded-full bg-secondary text-secondary-foreground brutal-border brutal-shadow-sm flex flex-col items-center justify-center font-black uppercase leading-none text-center">
        <span className="text-[10px] tracking-[0.18em]">Zero</span>
        <span className="text-[15px] tracking-[0.04em] mt-0.5">0%</span>
        <span className="text-[8px] tracking-[0.22em] mt-0.5">Commission</span>
      </div>
    </div>
  );
};

export default ZeroCommissionStamp;