import { useCallback, useMemo, useState } from "react";
import reviewsJson from "@/data/reviews.json";

export type Review = {
  id: string; operator_id: string | null; reviewer_name: string; reviewer_location: string | null;
  business_name: string | null; reviewer_type: "traveller" | "operator"; rating: number | null;
  body: string; is_published: boolean; created_at: string; storage?: "local" | "server";
};

const ALL = reviewsJson as Review[];
const STORAGE_KEY = "toeddro.operator-reviews.v1";
const readLocalReviews = (): Review[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r): r is Review => !!r && typeof r === "object" &&
      typeof r.id === "string" && typeof r.operator_id === "string" &&
      typeof r.reviewer_name === "string" && typeof r.body === "string" &&
      Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 &&
      typeof r.created_at === "string");
  } catch { return []; }
};

export const saveLocalReview = (review: Review): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const existing = readLocalReviews();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, { ...review, storage: "local" }]));
    return true;
  } catch { return false; }
};

export const useOperatorReviews = (operatorId: string | null | undefined) => {
  const [localReviews, setLocalReviews] = useState<Review[]>(readLocalReviews);
  const refresh = useCallback(() => setLocalReviews(readLocalReviews()), []);
  const reviews = useMemo(() => [...ALL.filter((r) => r.operator_id === operatorId), ...localReviews.filter((r) => r.operator_id === operatorId)]
    .filter((r) => r.is_published && (r.rating == null || (Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5)))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)), [operatorId, localReviews]);
  const rated = reviews.filter((r) => r.rating != null);
  const avg = rated.length ? rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length : null;
  return { reviews, loading: false, avg, count: reviews.length, ratedCount: rated.length, refresh };
};

export const usePublishedReviews = (limit = 12) => ({ reviews: ALL.filter((r) => r.is_published).slice(0, limit), loading: false });
