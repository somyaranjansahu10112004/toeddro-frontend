// SANDBOX: static data instead of Supabase. Same shape as the live hook.
import { useEffect, useState } from "react";
import operatorsJson from "@/data/operators.json";

export type DbOperator = {
  id: string;
  name: string;
  clean_name: string;
  location: string | null;
  state?: string | null;
  tag: string;
  tags: string[];
  status: "discovered" | "verified";
  email: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;
  rating: number;
  reviews: number;
  claimed_by: string | null;
  description?: string | null;
  service_areas?: string | null;
  services_offered?: string | null;
  data_complete?: boolean | null;
  source?: string | null;
  website_status?: string | null;
};

const STATIC = (operatorsJson as DbOperator[]).slice().sort((a, b) =>
  (a.clean_name || a.name).localeCompare(b.clean_name || b.name)
);

export const useOperators = () => {
  const [operators, setOperators] = useState<DbOperator[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Small delay so loading states still render like production.
    const t = setTimeout(() => { setOperators(STATIC); setLoading(false); }, 150);
    return () => clearTimeout(t);
  }, []);
  return { operators, loading };
};
