/**
 * Brutalist confetti — black + coral + lime squares.
 * No deps, respects prefers-reduced-motion.
 */
export function brutalConfetti(durationMs = 1200, count = 80) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
  document.body.appendChild(root);

  const colors = [
    "hsl(var(--foreground))",
    "hsl(var(--secondary))",
    "hsl(var(--primary))",
  ];

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    const size = 6 + Math.random() * 10;
    const x = 50 + (Math.random() - 0.5) * 20; // start near center
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 360;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + Math.random() * 200; // bias downward
    const rot = (Math.random() - 0.5) * 720;
    const delay = Math.random() * 80;
    s.style.cssText = `
      position:absolute;left:${x}vw;top:40vh;width:${size}px;height:${size}px;
      background:${colors[i % colors.length]};
      border:2px solid hsl(var(--foreground));
      transform:translate(-50%,-50%) rotate(0deg);
      opacity:1;
      transition: transform ${durationMs}ms cubic-bezier(.18,.7,.3,1), opacity ${durationMs}ms ease-out;
    `;
    root.appendChild(s);
    requestAnimationFrame(() => {
      setTimeout(() => {
        s.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot}deg)`;
        s.style.opacity = "0";
      }, delay);
    });
  }

  setTimeout(() => root.remove(), durationMs + 300);
}