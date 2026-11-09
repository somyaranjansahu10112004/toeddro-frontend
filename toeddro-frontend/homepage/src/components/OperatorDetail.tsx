import { MapPin, BadgeCheck, Compass, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { DbOperator } from "@/hooks/useOperators";
import { OperatorReviews } from "./OperatorReviews";
import { RevealContact } from "./RevealContact";
import { opTags } from "@/lib/combos";

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

export const OperatorDetail = ({ op }: { op: DbOperator }) => {
  const isVerified = op.status === "verified";
  const areas = op.service_areas?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const services = op.services_offered?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  const claimMailto = `mailto:info@toeddro.com?subject=${encodeURIComponent(`Claim Request - ${op.clean_name}`)}&body=${encodeURIComponent(`I want to claim ${op.clean_name} listed on Toeddro.\n\nMy contact: [your name, phone, email here]`)}`;

  const shareText = `Check out ${op.clean_name} on Toeddro: ${window.location.origin}/op/${op.id}`;
  const waShareHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 md:py-8 space-y-8">
        {isVerified && (
          <div className="flex items-center gap-4 bg-foreground text-background brutal-border brutal-shadow rounded-2xl px-5 py-4">
            <div className="shrink-0 w-11 h-11 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center brutal-border">
              <BadgeCheck className="w-6 h-6" strokeWidth={3} />
            </div>
            <div>
              <p className="text-base md:text-lg font-black uppercase tracking-wider leading-tight">
                ✓ Verified Operator
              </p>
              <p className="text-xs md:text-sm opacity-80 mt-0.5">
                Contact details verified by Toeddro team
              </p>
            </div>
          </div>
        )}
        {/* TOP */}
        <div>
          <p className="mb-3 text-xs md:text-sm italic text-secondary font-bold">
            💸 Pay the operator. Not a platform.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {opTags(op).map((t) => (
              <span key={t} className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full brutal-border ${tagColors[t] || "bg-muted"}`}>
                {t}
              </span>
            ))}
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-foreground text-background">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-muted text-muted-foreground border border-foreground/20">
                <Compass className="w-3 h-3" /> Discovered
              </span>
            )}
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black leading-[0.95] tracking-tighter break-words">
            {op.clean_name}
          </h1>
          <div className="flex items-center gap-1.5 mt-3 text-sm md:text-base font-bold text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{op.location || "India"}</span>
          </div>
          {op.description && op.description.trim() && (
            <p className="mt-2 text-sm md:text-base italic text-muted-foreground">
              {op.description}
            </p>
          )}
        </div>

        {/* CONTACT */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Get in touch</h2>
          <RevealContact
            operatorId={op.id}
            operatorName={op.clean_name}
            redirectPath={`/op/${op.id}`}
          />
        </section>

        {/* SHARE */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Share</h2>
          <a
            href={waShareHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-card brutal-border brutal-shadow-sm rounded-full px-5 py-3 font-black uppercase text-sm hover:bg-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Share on WhatsApp
          </a>
        </section>

        {areas.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Where they operate</h2>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <span key={a} className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-background brutal-border">
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {services.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">What they offer</h2>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s} className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-primary/10 brutal-border">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        <OperatorReviews operatorId={op.id} operatorName={op.clean_name} />
      </div>

      {/* BOTTOM CLAIM STRIP */}
      <div className="shrink-0 bg-foreground text-background border-t-2 border-foreground px-5 md:px-8 py-3 flex items-center justify-between gap-3">
        <p className="text-xs md:text-sm font-bold uppercase tracking-wider truncate">
          <ShieldCheck className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Is this your business?
        </p>
        <a
          href={claimMailto}
          className="shrink-0 bg-background text-foreground brutal-border rounded-full px-4 py-1.5 text-xs font-black uppercase hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          Claim it →
        </a>
      </div>
    </div>
  );
};

export default OperatorDetail;
