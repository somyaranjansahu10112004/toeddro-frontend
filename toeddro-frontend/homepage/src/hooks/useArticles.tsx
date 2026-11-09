// SANDBOX: static articles.
import { useQuery } from "@tanstack/react-query";
import articles from "@/data/articles.json";

export type Article = {
  id: string; slug: string; title: string; excerpt: string; body: string;
  cover_image_url: string | null; author: string; category: string; location: string | null;
  read_time_minutes: number; published_at: string; updated_at: string; is_published: boolean;
};

export function useArticles(limit?: number) {
  return useQuery({
    queryKey: ["articles", { limit: limit ?? null }],
    queryFn: async () => (limit ? (articles as Article[]).slice(0, limit) : (articles as Article[])),
  });
}
export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => (articles as Article[]).find((a) => a.slug === slug) ?? null,
    enabled: !!slug,
  });
}
