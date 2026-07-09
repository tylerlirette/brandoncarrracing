import Link from "next/link";
import { pressArticles, type PressArticle } from "@/lib/site";
import { surfaceStyles, textStyles } from "@/lib/theme";

type PressArticlesProps = {
  articles?: PressArticle[];
};

export function PressArticles({ articles = pressArticles }: PressArticlesProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
      {articles.map((article) => (
        <article
          key={article.href}
          className={`flex flex-col ${surfaceStyles.card} transition hover:border-brand/40 hover:shadow-md`}
        >
          <p className={textStyles.meta}>{article.source} · {article.date}</p>
          <h3 className={`mt-2 font-heading text-xl font-bold uppercase italic leading-snug text-foreground md:text-2xl`}>
            {article.title}
          </h3>
          <p className={`mt-3 flex-1 text-sm leading-relaxed text-muted`}>{article.excerpt}</p>
          <Link
            href={article.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-fit text-sm font-bold uppercase tracking-wide text-brand underline-offset-4 hover:underline"
          >
            Read article
          </Link>
        </article>
      ))}
    </div>
  );
}
