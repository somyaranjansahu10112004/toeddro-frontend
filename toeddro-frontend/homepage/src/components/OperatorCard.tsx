import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, ArrowRight, BadgeCheck, Compass, Flag, ShieldCheck, Info, Navigation, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { DbOperator } from "@/hooks/useOperators";
import { ClaimDialog } from "./ClaimDialog";
import { ReportDialog } from "./ReportDialog";
import { OperatorDrawer } from "./OperatorDrawer";
import { displayLocation, opTags } from "@/lib/combos";

type Op = DbOperator;

const tagColors: Record<string, string> = {
  Trekking: "bg-primary text-primary-foreground",
  Paragliding: "bg-accent text-accent-foreground",
  Rafting: "bg-[hsl(190_90%_65%)] text-foreground",
  Scuba: "bg-[hsl(200_95%_55%)] text-foreground",
  Skydiving: "bg-secondary text-secondary-foreground",
  Bungee: "bg-[hsl(340_90%_60%)] text-foreground",
  Camping: "bg-[hsl(45_100%_60%)] text-foreground",
  Biking: "bg-foreground text-background",
  Safari: "bg-[hsl(30_90%_55%)] text-foreground",
  Climbing: "bg-[hsl(160_80%_55%)] text-foreground",
  "Wellness & Retreat": "bg-[hsl(140_30%_70%)] text-foreground",
};

export const OperatorCard = ({ op, index = 0 }: { op: Op; index?: number }) => {
  const { user } = useAuth();
  const nav = useNavigate();
  const reduce = useReducedMotion();
  const [claimOpen, setClaimOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isVerified = op.status === "verified";
  const showContacts = true;
  const isLimited = op.data_complete === false;
  const areas = op.service_areas
    ? op.service_areas.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : [];

  // Stable per-operator sticker pick (some cards show one on hover)
  const sticker = useMemo(() => {
    let h = 0;
    for (let i = 0; i < op.id.length; i++) h = (h * 31 + op.id.charCodeAt(i)) >>> 0;
    const bucket = h % 7;
    if (bucket === 0) return { label: "🔥 Popular", cls: "bg-secondary text-secondary-foreground" };
    if (bucket === 1) return { label: "🆕 New", cls: "bg-primary text-primary-foreground" };
    return null;
  }, [op.id]);

  const shouldBob = !reduce && index > 0 && (index + 1) % 10 === 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`operator-premium-card group relative bg-card brutal-border brutal-shadow card-coral-glow card-pop rounded-3xl p-4 ${
        isVerified ? "verified-glow" : ""
      } ${shouldBob ? "card-bob" : ""}`}
    >
      {/* Surprise hover sticker */}
      {sticker && hovered && !reduce && (
        <span
          className={`sticker-pop pointer-events-none absolute -top-3 -right-2 z-10 px-2.5 py-1 rounded-full brutal-border text-[10px] font-black uppercase tracking-wider ${sticker.cls}`}
          aria-hidden
        >
          {sticker.label}
        </span>
      )}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {opTags(op).map((t) => (
              <span key={t} className={`group-hover:tag-pulse inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full brutal-border transition-transform group-hover:rotate-1 ${tagColors[t] || "bg-muted"}`}>
                {t}
              </span>
            ))}
            {isVerified ? (
              <span
                title="✓ Verified operator — contact verified by Toeddro"
                className="verified-badge inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-foreground text-background brutal-border cursor-help"
              >
                <BadgeCheck className="w-3 h-3 text-primary" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-muted text-muted-foreground border border-foreground/20">
                <Compass className="w-3 h-3" /> Discovered
              </span>
            )}
            {isLimited && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-muted/60 text-muted-foreground border border-foreground/20">
                <Info className="w-3 h-3" /> Limited Info
              </span>
            )}
          </div>
          <h3 className="mt-2.5 text-xl md:text-2xl font-black leading-tight truncate text-foreground opacity-100 [text-shadow:none] [-webkit-font-smoothing:antialiased]">{op.clean_name}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{op.location ? displayLocation(op.location, op.state) : "India"}</span>
          </div>
          {areas.length > 0 && (
            <div className="flex items-start gap-1 mt-1 text-xs text-muted-foreground">
              <Navigation className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="truncate">
                Operates in: {areas.join(", ")}
                {op.service_areas!.split(",").length > 3 ? "…" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Anti-scrape: phone / email / website never render here. The whole
          contact block lives behind the reveal-contact edge function. */}
      <div className="space-y-1.5 text-sm border-t-2 border-foreground/10 pt-3 min-h-[56px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {user ? "Tap Explore to reveal contact" : "Sign in to reveal contact"}
          </span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => setDetailOpen(true)}
        whileTap={{ scale: 0.97 }}
        whileHover={reduce ? undefined : { rotate: [0, -2, 2, -1.5, 1.5, 0], transition: { duration: 0.45 } }}
        className="press mt-4 w-full min-h-11 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground brutal-border brutal-shadow-sm rounded-full px-4 py-2.5 font-black uppercase text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors"
      >
        Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </motion.button>

      <div className="mt-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {!isVerified && (
          <button onClick={() => user ? setClaimOpen(true) : nav("/auth")} className="inline-flex items-center gap-1 hover:text-foreground">
            <ShieldCheck className="w-3 h-3" /> Claim
          </button>
        )}
        <button onClick={() => setReportOpen(true)} className="inline-flex items-center gap-1 hover:text-foreground">
          <Flag className="w-3 h-3" /> Report
        </button>
      </div>

      <ClaimDialog operatorId={op.id} operatorName={op.clean_name} open={claimOpen} onOpenChange={setClaimOpen} />
      <ReportDialog operatorId={op.id} operatorName={op.clean_name} open={reportOpen} onOpenChange={setReportOpen} />
      <OperatorDrawer op={op} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
};