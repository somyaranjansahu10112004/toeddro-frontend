import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Mountain, Waves, Bike, Tent, Sparkles, ArrowDown, User as UserIcon, Grid3x3, Footprints, Wind, Anchor, Plane, ArrowDownToLine, Binoculars, MountainSnow, Leaf, Menu, X, BadgeCheck, Phone } from "lucide-react";
import { OperatorCard } from "@/components/OperatorCard";
import { useOperators } from "@/hooks/useOperators";
import { useAuth } from "@/hooks/useAuth";
import { AccountMenu } from "@/components/AccountMenu";
import { LocationPills, TagPills } from "@/components/LocationPills";
import { PopularSearches } from "@/components/PopularSearches";
import { buildCombos, hasTag, opTags } from "@/lib/combos";
import { applySeo, applyJsonLd, removeJsonLd } from "@/lib/seo";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, Reveal, revealProps } from "@/lib/motion";
import { AnimatedCount } from "@/components/AnimatedCount";
import { HeadlineTicker } from "@/components/HeadlineTicker";
import { WhyWeExist } from "@/components/WhyWeExist";
import { HomepageEasterEggs } from "@/components/HomepageEasterEggs";
import { ZeroCommissionStamp } from "@/components/ZeroCommissionStamp";
import { ListYourGigLink } from "@/components/ListYourGigLink";
import { PageLoader } from "@/components/PageLoader";
import { HomeArticlesSection } from "@/components/HomeArticlesSection";
import { ExperiencesFlipBanner } from "@/components/ExperiencesFlipBanner";
import { HomeReviewsSection } from "@/components/HomeReviewsSection";
import { BrutalSelect } from "@/components/BrutalSelect";
import { BrutalCombobox } from "@/components/BrutalCombobox";
import { TributeStrip } from "@/components/TributeStrip";
import logo from "@/assets/logo.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdventureChatbot } from "@/components/AdventureChatbot";
import { FeaturedAdventureGrid } from "@/components/FeaturedAdventureGrid";
import { AdventureRecommendations } from "@/components/AdventureRecommendations";
import { PremiumDiscovery } from "@/components/PremiumDiscovery";

const ADVENTURE_TAGS = [
  "Trekking", "Paragliding", "Rafting", "Scuba", "Skydiving",
  "Bungee", "Camping", "Biking", "Safari", "Climbing", "Wellness & Retreat",
] as const;

const heroIcons = [Mountain, Waves, Wind, Bike, Tent, Footprints];

const tagIcons: Record<string, any> = {
  All: Grid3x3,
  Trekking: Footprints,
  Paragliding: Wind,
  Rafting: Waves,
  Scuba: Anchor,
  Skydiving: Plane,
  Bungee: ArrowDownToLine,
  Camping: Tent,
  Biking: Bike,
  Safari: Binoculars,
  Climbing: MountainSnow,
  "Wellness & Retreat": Leaf,
};

const tagEmoji: Record<string, string> = {
  All: "✨",
  Trekking: "🏔️",
  Paragliding: "🪂",
  Rafting: "🌊",
  Scuba: "🤿",
  Skydiving: "🛩️",
  Bungee: "🪢",
  Camping: "⛺",
  Biking: "🚵",
  Safari: "🦁",
  Climbing: "🧗",
  "Wellness & Retreat": "🧘",
};

const SEARCH_PLACEHOLDERS = [
  "What's the move? trek, raft, paragliding…",
  "Where to next?",
  "Skip the boring trips…",
  "Find your wild…",
  "Adventure starts here…",
];

const revealCharacters = (text: string) => Array.from(text).map((character, index) => (
  <span key={`${text}-${index}`} aria-hidden="true" className="hero-character" style={{ animationDelay: `calc(${index} * var(--hero-character-stagger, 58ms))` }}>
    {character === " " ? "\u00a0" : character}
  </span>
));

const Index = () => {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | "All">("All");
  const [location, setLocation] = useState<string | "All">("All");
  const [goLocal, setGoLocal] = useState(false);
  const { operators, loading } = useOperators();
  const { user } = useAuth();
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const reduce = useReducedMotion();
  const [shakeTick, setShakeTick] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const submitRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [ctaHighlighted, setCtaHighlighted] = useState(false);
  const shouldHighlightRef = useRef(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [searchWiggleKey, setSearchWiggleKey] = useState(0);
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);

  // Rotate search placeholder
  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const origin = window.location.origin;
    applySeo({
      title: "Toeddro | Find Adventure Operators Across India. Zero Commission",
      description:
        "India's adventure operator directory for trekking, rafting, paragliding, scuba and more. Discover listings and contact operators directly, with no commission or middleman.",
      url: `${origin}/`,
      type: "website",
    });
    applyJsonLd("jsonld-organization", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Toeddro",
      url: origin,
      logo: `${origin}/og-image.jpg`,
      description:
        "An independent, zero-commission adventure operator directory across India, covering trekking, rafting, paragliding, scuba, skydiving, bungee, camping, biking, safari, climbing and wellness.",
      areaServed: { "@type": "Country", "name": "India" },
      sameAs: ["https://toeddro.com"],
    });
    applyJsonLd("jsonld-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Toeddro",
      url: origin,
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
    applyJsonLd("jsonld-home-faq", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Where can I find verified adventure operators in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Toeddro is an adventure operator directory covering trekking, rafting, paragliding, scuba, skydiving, bungee, camping, biking, safari, climbing and wellness. Listing details vary; travellers can explore available information and follow the contact flow where supported.",
          },
        },
        {
          "@type": "Question",
          name: "Is Toeddro free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Toeddro is a free public directory. Toeddro takes zero commission and zero markup on any booking. Travellers pay the operator directly.",
          },
        },
        {
          "@type": "Question",
          name: "How does Toeddro verify operators?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Operators claim their listing through an identity flow and update their own contact details. Contact fields are gated behind login and anti-bot verification so numbers cannot be scraped. Duplicate and fake listings are merged or removed by moderators.",
          },
        },
        {
          "@type": "Question",
          name: "What activities does Toeddro cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Trekking, paragliding, rafting, scuba diving, skydiving, bungee jumping, camping, motorcycle and cycle touring, wildlife safaris, rock climbing and wellness retreats across India.",
          },
        },
      ],
    });
    return () => {
      removeJsonLd("jsonld-organization");
      removeJsonLd("jsonld-website");
      removeJsonLd("jsonld-home-faq");
    };
  }, []);

  const BAD_LOC = useMemo(() => new Set(["state", "india", "unknown", "n/a", "na", ""]), []);

  // Normalize location names: lowercase + collapse known variants
  const normalizeLoc = (s: string) => {
    const v = s.toLowerCase().trim();
    const variants: Record<string, string> = {
      bangalore: "bengaluru",
      bengaluru: "bengaluru",
      bombay: "mumbai",
      mumbai: "mumbai",
      calcutta: "kolkata",
      kolkata: "kolkata",
      madras: "chennai",
      chennai: "chennai",
      pondicherry: "puducherry",
      puducherry: "puducherry",
    };
    return variants[v] || v;
  };

  const splitAreas = (s: string | null | undefined): string[] =>
    (s || "")
      .split(/[,/|;]+/)
      .map((x) => x.replace(/\(.*?\)/g, "").trim())
      .filter(Boolean);

  // Top activity + location combo pages, for crawl discovery.
  const popularCombos = useMemo(() => buildCombos(operators), [operators]);

  // Build location list from service_areas (operates-in)
  const allLocations = useMemo(() => {
    const seen = new Map<string, string>(); // normalized -> display label
    for (const o of operators) {
      for (const a of splitAreas(o.service_areas)) {
        if (BAD_LOC.has(a.toLowerCase())) continue;
        const key = normalizeLoc(a);
        if (!seen.has(key)) seen.set(key, a);
      }
      // also include HQ location so the dropdown isn't empty for ops missing service_areas
      const hq = (o.location || "").trim();
      if (hq && !BAD_LOC.has(hq.toLowerCase())) {
        const key = normalizeLoc(hq);
        if (!seen.has(key)) seen.set(key, hq);
      }
      const state = (o.state || "").trim();
      if (state && !BAD_LOC.has(state.toLowerCase())) {
        const key = normalizeLoc(state);
        if (!seen.has(key)) seen.set(key, state);
      }
    }
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }, [operators, BAD_LOC]);

  // Force-disable Go Local when no specific location selected
  useEffect(() => {
    if (location === "All" && goLocal) setGoLocal(false);
  }, [location, goLocal]);

  const operatesIn = (o: typeof operators[number], locKey: string) => {
    const areas = splitAreas(o.service_areas).map(normalizeLoc);
    if (areas.includes(locKey) || normalizeLoc((o.state || "").trim()) === locKey) return true;
    // fallback: HQ counts as operating-in when no service_areas data
    const hq = normalizeLoc((o.location || "").trim());
    return hq === locKey;
  };

  const isHqIn = (o: typeof operators[number], locKey: string) =>
    normalizeLoc((o.location || "").trim()) === locKey;

  // Two pass: filtered (with go local), and the wider "operates-in" set used for empty-state fallback
  const baseFiltered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const locKey = location !== "All" ? normalizeLoc(location) : null;
    return operators.filter((o) => {
      if (tag !== "All" && !hasTag(o, tag)) return false;
      if (locKey && !operatesIn(o, locKey)) return false;
      if (!q) return true;
      return (
        o.clean_name.toLowerCase().includes(q) ||
        (o.location || "").toLowerCase().includes(q) ||
        (o.state || "").toLowerCase().includes(q) ||
        (o.service_areas || "").toLowerCase().includes(q) ||
        (o.email || "").toLowerCase().includes(q) ||
        opTags(o).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, tag, location, operators]);

  const localFiltered = useMemo(() => {
    if (!goLocal || location === "All") return baseFiltered;
    const locKey = normalizeLoc(location);
    return baseFiltered.filter((o) => isHqIn(o, locKey));
  }, [baseFiltered, goLocal, location]);

  const goLocalEmpty = goLocal && location !== "All" && localFiltered.length === 0 && baseFiltered.length > 0;
  const filtered = goLocalEmpty ? baseFiltered : localFiltered;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, tag, location, goLocal]);

  useEffect(() => {
    setShakeTick((n) => n + 1);
  }, [tag, location, goLocal]);

  useEffect(() => {
    const el = submitRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && shouldHighlightRef.current) {
          shouldHighlightRef.current = false;
          setCtaHighlighted(true);
          const t = setTimeout(() => setCtaHighlighted(false), 1200);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("toeddro:scrollToListYourGig") === "true") {
      sessionStorage.removeItem("toeddro:scrollToListYourGig");
      shouldHighlightRef.current = true;
      const el = document.getElementById("submit");
      if (el) {
        const t = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400);
        return () => clearTimeout(t);
      }
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      shouldHighlightRef.current = true;
      const el = document.getElementById("submit");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("toeddro:scrollToCta", handler);
    return () => window.removeEventListener("toeddro:scrollToCta", handler);
  }, []);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageLoader />
      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b-2 border-foreground">
        <div className="container flex items-center justify-between py-3">
          <a href="#" className="flex items-center gap-2">
            <img src={logo} alt="Toeddro Adventure Directory" className="h-9 md:h-10 w-auto logo-tilt" />
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase">
            <a href="#explore" className="hover:text-secondary">Explore</a>
            <a href="#vibes" className="hover:text-secondary">Vibes</a>
            <Link to="/articles" className="hover:text-secondary">Articles</Link>
            <Link to="/about" className="hover:text-secondary">About</Link>
            <Link to="/experiences" className="hover:text-secondary">Do Something Locally</Link>
            <ListYourGigLink />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/articles"
              aria-label="Articles"
              className="hidden sm:inline-flex bg-accent text-accent-foreground px-4 min-h-11 rounded-full text-xs sm:text-sm font-black uppercase brutal-shadow-sm hover:bg-secondary hover:text-secondary-foreground items-center gap-2"
            >
              Articles
            </Link>
            {user ? (
              <AccountMenu />
            ) : (
              <Link
                to="/auth"
                aria-label="Sign in"
                className="bg-foreground text-background px-3 sm:px-4 min-h-11 rounded-full text-xs sm:text-sm font-black uppercase brutal-shadow-sm hover:bg-secondary inline-flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" /> <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-card brutal-border hover:bg-primary"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <div className="md:hidden border-t-2 border-foreground bg-background">
            <div className="container py-4 flex flex-col gap-1 text-sm font-bold uppercase">
              <a href="#explore" onClick={() => setMobileNavOpen(false)} className="py-3 hover:text-secondary">Explore</a>
              <a href="#vibes" onClick={() => setMobileNavOpen(false)} className="py-3 hover:text-secondary">Vibes</a>
              <Link to="/articles" onClick={() => setMobileNavOpen(false)} className="py-3 hover:text-secondary">Articles</Link>
              <Link to="/about" onClick={() => setMobileNavOpen(false)} className="py-3 hover:text-secondary">About</Link>
              <Link to="/experiences" onClick={() => setMobileNavOpen(false)} className="py-3 hover:text-secondary">Do Something Locally</Link>
              <ListYourGigLink onClick={() => setMobileNavOpen(false)} className="py-3" />
            </div>
          </div>
        )}
      </nav>

      <TributeStrip />

      {/* HERO */}
      <header ref={heroRef} className="relative overflow-hidden border-b-0 cursor-adventure premium-hero">
        {import.meta.env.VITE_HERO_VIDEO_URL && !reduce && (
          <video
            className="premium-hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=90"
            aria-hidden="true"
          >
            <source src={import.meta.env.VITE_HERO_VIDEO_URL} type="video/mp4" />
          </video>
        )}
        <div className="premium-hero-image" aria-hidden="true" />
        <div className="premium-hero-overlay" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 12% 82%, rgba(255,111,0,.22), transparent 34%), linear-gradient(90deg, rgba(8,15,20,.28), transparent 78%)" }} />

        <div className="relative container py-14 sm:py-20 md:py-32">
          <div className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Toeddro · India's adventure directory
          </div>
          <h1 aria-label="Get out. Go far. Toeddro it." className="text-[2.25rem] sm:text-6xl md:text-8xl lg:text-9xl font-black leading-[0.95] sm:leading-[0.85] tracking-tighter break-words">
            <span className="sr-only">Toeddro - India's adventure operator directory. </span>
            <motion.span
              initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 18, delay: 0 }}
              whileHover={reduce ? undefined : { rotate: -4, x: -4, transition: { type: "spring", stiffness: 400, damping: 12 } }}
              className="inline-block mr-3"
            >
              {revealCharacters("Get out.")}
            </motion.span>
            <motion.span
              initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 18, delay: 0.05 }}
              whileHover={reduce ? undefined : { scale: 1.08, rotate: 3, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              className="inline-block text-stroke"
            >
              {revealCharacters("Go far.")}
            </motion.span>
            <br />
            <motion.span
              initial={reduce ? { opacity: 1, y: 0, rotate: -2 } : { opacity: 0, y: -100, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ type: "spring", stiffness: 480, damping: 16, delay: 0.1 }}
              whileHover={reduce ? undefined : { rotate: [-2, 2, -3, 1, -2], y: [0, -4, 2, 0], transition: { duration: 0.5 } }}
              className="bg-secondary text-secondary-foreground px-3 brutal-border inline-block breathe"
            >
              {revealCharacters("Toeddro")}
            </motion.span>
            <motion.span
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 18, delay: 0.15 }}
              whileHover={reduce ? undefined : { scale: 1.25, rotate: -6, transition: { type: "spring", stiffness: 500, damping: 8 } }}
              className="inline-block"
            >
              {revealCharacters(" it.")}
            </motion.span>
          </h1>
          <HeadlineTicker />
          <ExperiencesFlipBanner />
          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4, ease: EASE }}
            className="mt-6 text-base sm:text-lg md:text-2xl font-medium max-w-2xl text-foreground/80"
          >
            Discover adventure operators across India. Trek, raft, fly, dive. Explore listings and connect directly where contact details are available.
          </motion.p>

          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6, ease: EASE }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-foreground/80"
          >
            <BadgeCheck className="w-4 h-4 text-secondary" strokeWidth={3} />
            Explore the directory and contact operators directly
          </motion.p>

          {/* SEARCH */}
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7, ease: EASE }}
            className="search-focus mt-10 bg-card brutal-border brutal-shadow rounded-3xl p-3 md:p-4 max-w-3xl transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0 px-3 bg-muted rounded-2xl">
                <Search key={searchWiggleKey} className={`w-5 h-5 text-muted-foreground ${searchWiggleKey > 0 ? "search-wiggle" : ""}`} />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchWiggleKey((k) => k + 1);
                  }}
                  placeholder={SEARCH_PLACEHOLDERS[placeholderIdx]}
                  aria-label="Search adventure operators"
                  className="bg-transparent border-none outline-none py-3 w-full min-w-0 font-medium text-base placeholder:transition-opacity focus:placeholder:opacity-30"
                />
              </div>
              <div className="flex items-center gap-2 px-3 bg-muted rounded-2xl">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <BrutalCombobox
                  value={location}
                  onValueChange={setLocation}
                  ariaLabel="Filter by location"
                  inline
                  triggerClassName="w-full"
                  placeholder="Anywhere in India"
                  searchPlaceholder="Search a city or region…"
                  emptyText="No spots match. Try another."
                  options={[
                    { value: "All", label: "Anywhere in India" },
                    ...allLocations.map((l) => ({ value: l, label: l })),
                  ]}
                />
              </div>
              <a href="#explore" className="bg-foreground text-background rounded-2xl px-6 py-3 min-h-11 inline-flex items-center justify-center font-black uppercase text-sm hover:bg-secondary text-center">
                Search
              </a>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={() => {
              document
                .getElementById("vibes")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="group mt-8 inline-flex items-center gap-3 text-sm font-bold uppercase cursor-pointer hover:text-secondary transition-colors"
            aria-label="Scroll to the full operator list"
          >
            <motion.span
              animate={reduce ? {} : { y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex group-hover:translate-y-0.5 transition-transform"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.span>
            Scroll for the full list
          </button>
        </div>

      </header>

      {/* MARQUEE */}
      <div className="marquee-wrap bg-foreground text-background py-3 sm:py-4 overflow-hidden border-b-2 border-foreground">
        <div className="flex marquee whitespace-nowrap gap-8 sm:gap-12 text-lg sm:text-2xl font-black uppercase">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-8 sm:gap-12 shrink-0">
              {["Himalayas calling 🏔️", "weekends > weekdays", "adventure operators across India", "adventure sundays", "rishikesh ↔ ladakh", "out of office, into the wild", "real destinations, new adventures ✨"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <PremiumDiscovery
        locations={allLocations}
        onActivitySelect={(activity) => {
          const supported = ADVENTURE_TAGS.find((item) => item.toLowerCase() === activity.toLowerCase());
          if (supported) setTag(supported);
          document.getElementById("explore")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }}
        onLocationSelect={(place) => {
          setLocation(place);
          document.getElementById("explore")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }}
      />

      {/* VIBES / CATEGORIES */}
      <Reveal as="section" id="vibes" className="container py-16">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-2">Pick your vibe.</h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-8">Filter by adventure type, from weekend escapes to bucket-list expeditions.</p>
        <div className="relative -mx-4 sm:mx-0">
          <div className="flex sm:flex-wrap gap-3 overflow-x-auto sm:overflow-visible no-scrollbar px-4 sm:px-0 pb-2 scroll-fade-right sm:[-webkit-mask-image:none] sm:[mask-image:none] snap-x snap-mandatory sm:snap-none">
          {(["All", ...ADVENTURE_TAGS] as const).map((t) => {
            const Icon = tagIcons[t] || Sparkles;
            const active = tag === t;
            const isHover = hoveredPill === t;
            return (
              // Hover and press are the shared pill-pop / press classes. The old
              // JS hover tilt and tap scale wrote an inline transform that would
              // have blocked them, so they are gone.
              <motion.button
                key={t}
                onClick={() => setTag(t as any)}
                onHoverStart={() => setHoveredPill(t)}
                onHoverEnd={() => setHoveredPill((cur) => (cur === t ? null : cur))}
                className={`pill-pop press relative shrink-0 snap-start min-h-11 inline-flex items-center gap-2 px-5 py-2.5 rounded-full brutal-border font-black uppercase text-sm ${
                  active
                    ? "bg-secondary text-secondary-foreground pill-aura pill-raised"
                    : "bg-card hover:bg-primary"
                }`}
              >
                {/* Floating emoji on hover */}
                {isHover && !reduce && tagEmoji[t] && (
                  <span
                    aria-hidden
                    className="sticker-pop pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 text-xl"
                  >
                    {tagEmoji[t]}
                  </span>
                )}
                <motion.span
                  key={shakeTick}
                  animate={!active && !reduce ? { x: [0, -2, 2, -1, 1, 0] } : { x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2"
                >
                  <motion.span
                    animate={isHover && !reduce ? { y: [0, -4, 0, -2, 0] } : { y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.span>
                  {t}
                </motion.span>
              </motion.button>
            );
          })}
          </div>
        </div>

      </Reveal>

      <FeaturedAdventureGrid operators={operators} onSelect={(operator) => {
        setQuery(operator.clean_name || operator.name);
        document.getElementById("explore")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }} />

      <AdventureRecommendations operators={operators} onSelect={(operator) => {
        setQuery(operator.clean_name || operator.name);
        document.getElementById("explore")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }} />

      {/* RESULTS */}
      <section id="explore" className="container pb-20">
        <TooltipProvider delayDuration={200}>
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="hidden md:block absolute -top-4 -right-2 z-10 pointer-events-none">
              <ZeroCommissionStamp size={104} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
              <AnimatedCount value={filtered.length} duration={1.5} /> <span className="text-muted-foreground font-medium text-2xl">operators ready to roll</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto md:mr-28">
              <div className="flex flex-col gap-1">
                {/* Same pill treatment as the vibes row. The disabled state
                    stays flat, it should not invite a hover. */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        if (location === "All") return;
                        setGoLocal((v) => !v);
                      }}
                      aria-pressed={goLocal}
                      aria-disabled={location === "All"}
                      className={`min-h-11 min-w-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full brutal-border font-black uppercase text-sm ${
                        location === "All"
                          ? "bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
                          : goLocal
                            ? "pill-pop press bg-secondary text-secondary-foreground brutal-shadow-sm pill-raised"
                            : "pill-pop press bg-card hover:bg-primary"
                      }`}
                    >
                      <MapPin className="w-4 h-4" strokeWidth={3} />
                      Go Local
                      <span
                        aria-hidden
                        className={`ml-1 inline-flex items-center justify-center w-8 h-5 rounded-full border-2 border-foreground ${
                          goLocal ? "bg-foreground" : "bg-card"
                        }`}
                      >
                        <span
                          className={`block w-3 h-3 rounded-full transition-transform ${
                            goLocal ? "bg-secondary translate-x-1.5" : "bg-foreground -translate-x-1.5"
                          }`}
                        />
                      </span>
                    </button>
                  </TooltipTrigger>
                  {location === "All" && (
                    <TooltipContent className="brutal-border bg-foreground text-background font-black uppercase text-xs">
                      Filter by a location to go local.
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {location === "All"
                  ? "Filter by a location to go local"
                  : goLocal
                    ? `Showing operators based in ${location}`
                    : `Showing everyone who runs trips in ${location}`}
              </p>
              {(query || tag !== "All" || location !== "All" || goLocal) && (
                <button
                  onClick={() => { setQuery(""); setTag("All"); setLocation("All"); setGoLocal(false); }}
                  className="text-sm font-bold uppercase underline hover:text-secondary"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </TooltipProvider>

        {goLocalEmpty && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mb-6 bg-accent text-accent-foreground brutal-border brutal-shadow-sm rounded-3xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <p className="font-black text-sm md:text-base">
              No operators based in {location} yet. Showing everyone who runs trips there instead.
            </p>
            <button
              onClick={() => setGoLocal(false)}
              className="shrink-0 bg-foreground text-background rounded-full px-4 py-2 font-black uppercase text-xs brutal-border hover:bg-secondary hover:text-secondary-foreground"
            >
              Turn off Go Local
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="bg-card brutal-border rounded-3xl p-12 text-center">
            <p className="text-2xl font-black mb-2">Loading the goods…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card brutal-border rounded-3xl p-12 text-center">
            <p className="text-2xl font-black mb-2">No matches. 😬</p>
            <p className="text-muted-foreground">Try a different vibe or location.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Stagger by position within the page, not absolute index, so a
                  load-more batch starts its own run instead of landing at the cap. */}
              {visible.map((op, i) => (
                <Reveal key={op.id} index={i % PAGE_SIZE} className="min-w-0">
                  <OperatorCard op={op} index={i} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Showing <AnimatedCount value={visible.length} /> of <AnimatedCount value={filtered.length} /> operators
              </p>
              {hasMore && (
                <LoadMoreButton onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} />
              )}
            </div>
          </>
        )}
      </section>

      {/* WHY WE EXIST */}
      {/* ARTICLES */}
      <HomeArticlesSection />

      {/* TRUST STRIP */}
      <Reveal as="section" aria-label="Trust signals" className="container pt-2 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {[
            {
              icon: <BadgeCheck className="w-4 h-4" strokeWidth={3} />,
              text: (
                <>
                  Operator Listings
                </>
              ),
            },
            { icon: <span className="text-base leading-none">💸</span>, text: "Zero Commission" },
            { icon: <Phone className="w-4 h-4" strokeWidth={3} />, text: "Direct Contact" },
          ].map((pill, i) => (
            // No pill-pop here. These are static trust badges, not controls, so
            // a hover lift would promise a click that does not exist.
            <div
              key={i}
              className="inline-flex items-center gap-2 bg-card brutal-border brutal-shadow-sm rounded-full px-5 py-3 font-black uppercase text-xs md:text-sm cursor-default"
            >
              <span className="text-secondary inline-flex">{pill.icon}</span>
              <span>{pill.text}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <WhyWeExist />

      <HomeReviewsSection />

      {/* CLAIM STRIP */}
      <Reveal as="section" className="container pb-10">
        <div className="bg-card brutal-border brutal-shadow rounded-3xl px-5 py-4 md:px-8 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-base md:text-lg font-black">
            Already listed on Toeddro? <span className="text-muted-foreground font-bold">Claim your listing and take control.</span>
          </p>
          <Link
            to="/claim-listing"
            className="shrink-0 bg-foreground text-background brutal-border brutal-shadow-sm rounded-full px-6 py-3 font-black uppercase text-sm hover:bg-secondary hover:text-secondary-foreground text-center"
          >
            Claim it →
          </Link>
        </div>
      </Reveal>

      {/* SUBMIT CTA */}
      {/* Reveal props are spread here rather than using <Reveal> because this
          section needs its own ref for the scroll-to-CTA highlight. */}
      <motion.section
        id="submit"
        ref={submitRef}
        className="container pb-24 scroll-mt-20"
        {...revealProps(0, !!reduce)}
      >
        <div className={`group/cta relative overflow-hidden bg-foreground text-background brutal-border rounded-3xl p-10 md:p-16 ${ctaHighlighted ? "cta-highlight" : ""}`}>
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full gradient-sun opacity-30 blur-2xl" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              Run <span className="text-primary">adventure</span> trips?
            </h2>
            <p className="mt-4 text-lg md:text-xl opacity-80 max-w-2xl">
              Skip the middlemen. List your operation on Toeddro. Free, fast, no commission. Your number. Your price. Direct.
            </p>
            <Link
              to="/get-listed"
              className={`inline-flex mt-8 bg-primary text-primary-foreground brutal-border brutal-shadow rounded-full px-8 py-4 font-black uppercase hover:bg-secondary hover:text-secondary-foreground transition-transform group-hover/cta:-translate-y-1 ${ctaHighlighted ? "wiggle-once" : ""}`}
            >
              Get listed →
            </Link>
          </div>
        </div>
      </motion.section>

      <LocationPills
        locations={allLocations}
        title="Explore by location"
        subtitle="Jump straight to operators in your favourite spots."
      />

      <TagPills
        tags={[...ADVENTURE_TAGS]}
        title="Explore by activity"
        subtitle="Browse operators by adventure type."
      />

      <PopularSearches
        combos={popularCombos}
        title="Popular searches"
        subtitle="The activity and destination combinations travellers look for most."
        limit={14}
      />

      <footer className="premium-footer border-t-2 border-foreground py-8">
        <div className="container flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
          <div className="flex flex-wrap items-center gap-3">
            <p>
              © {new Date().getFullYear()} Toeddro —{" "}
              <span className="nudge-x inline-block">go outside.</span>
            </p>
            <span className="inline-flex items-center gap-1.5 bg-foreground text-background brutal-border rounded-full px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-wider">
              <BadgeCheck className="w-3.5 h-3.5 text-secondary" strokeWidth={3} />
              Direct Operator Discovery • Zero Commission
            </span>
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-wider">
              <a href="/terms" className="hover:text-secondary">Terms</a>
              <span className="text-foreground/30">·</span>
              <a href="/privacy" className="hover:text-secondary">Privacy</a>
            </div>
          </div>
          <p className="text-muted-foreground">Made with ❤️ in India</p>
        </div>
      </footer>

      <HomepageEasterEggs />
      <AdventureChatbot />
    </div>
  );
};

export default Index;

const LoadMoreButton = ({ onClick }: { onClick: () => void }) => {
  const [pulsing, setPulsing] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={() => {
        setPulsing(true);
        onClick();
        setTimeout(() => setPulsing(false), 600);
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      animate={pulsing ? { scale: [1, 1.12, 0.96, 1] } : { scale: 1 }}
      transition={pulsing ? { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] } : { duration: 0.2 }}
      className="w-full sm:w-auto min-h-12 bg-foreground text-background brutal-border brutal-shadow rounded-full px-8 py-4 font-black uppercase text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors"
    >
      {hovered ? "More please 🙏" : "Load more"}
    </motion.button>
  );
};
