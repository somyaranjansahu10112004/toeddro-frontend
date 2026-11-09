import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { ArticleCard } from "@/components/ArticleCard";
import { ArrowRight, BookOpen } from "lucide-react";

export const HomeArticlesSection = () => {
  const { data: articles, isLoading } = useArticles(6);
  if (!isLoading && (!articles || articles.length === 0)) return null;

  return (
    <section id="articles" aria-label="Latest articles from Toeddro" className="container pt-4 pb-16 home-articles-premium">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Latest from Toeddro
          </div>
          <h2 className="text-3xl md:text-5xl font-black leading-tight">Reading list for the road.</h2>
          <p className="text-base md:text-lg text-muted-foreground mt-2 max-w-2xl">
            Guides, stories and operator spotlights — written by people who actually went.
          </p>
        </div>
        <Link
          to="/articles"
          className="press inline-flex items-center gap-2 bg-foreground text-background brutal-border brutal-shadow-sm rounded-full px-5 py-3 font-black uppercase text-xs md:text-sm hover:bg-secondary hover:text-secondary-foreground"
        >
          View all articles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(articles ?? []).map((a, i) => (
          <ArticleCard key={a.id} a={a} index={i} />
        ))}
      </div>
    </section>
  );
};