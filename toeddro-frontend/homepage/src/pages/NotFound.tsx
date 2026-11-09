import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { applySeo } from "@/lib/seo";

const POPULAR_ACTIVITIES = ["Trekking", "Rafting", "Paragliding", "Scuba", "Camping", "Safari"];
const POPULAR_LOCATIONS = ["Rishikesh", "Manali", "Goa", "Bir Billing", "Ladakh", "Coorg"];

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Props = {
  /** Headline shown above the message, e.g. "Operator not found". */
  heading?: string;
  message?: string;
};

const NotFound = ({ heading, message }: Props) => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: no content for route:", location.pathname);
  }, [location.pathname]);

  // Never let an empty page get indexed.
  useEffect(() => {
    applySeo({
      title: `${heading || "Page not found"} | Toeddro`,
      description:
        "This page is not available on Toeddro. Browse verified adventure operators by activity or location instead.",
      noindex: true,
    });
  }, [heading]);

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">Toeddro</p>
        <h1 className="mb-4 text-5xl md:text-6xl font-black">{heading || "404"}</h1>
        <p className="mb-8 text-lg md:text-xl font-medium text-muted-foreground">
          {message || "This trail doesn't exist. Try heading back to base camp."}
        </p>
        <Link
          to="/"
          className="brutal-border brutal-shadow inline-block bg-primary px-6 py-3 font-black uppercase text-primary-foreground"
        >
          Return home
        </Link>

        <div className="mt-12 text-left">
          <h2 className="mb-3 text-sm font-black uppercase tracking-wider">Browse by activity</h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {POPULAR_ACTIVITIES.map((a) => (
              <Link
                key={a}
                to={`/explore/${slug(a)}`}
                className="brutal-border rounded-full bg-card px-4 py-2 text-xs font-black uppercase hover:bg-secondary hover:text-secondary-foreground"
              >
                {a}
              </Link>
            ))}
          </div>
          <h2 className="mb-3 text-sm font-black uppercase tracking-wider">Browse by location</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LOCATIONS.map((l) => (
              <Link
                key={l}
                to={`/explore/${slug(l)}`}
                className="brutal-border rounded-full bg-card px-4 py-2 text-xs font-black uppercase hover:bg-secondary hover:text-secondary-foreground"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
