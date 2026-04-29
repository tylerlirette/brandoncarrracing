import Link from "next/link";
import { pressArticles, type PressArticle } from "@/lib/site";

type PressArticlesProps = {
  articles?: PressArticle[];
};

export function PressArticles({ articles = pressArticles }: PressArticlesProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
      {articles.map((article) => (
        <article
          key={article.href}
          className="flex flex-col rounded-sm border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-brand/40 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {article.source} · {article.date}
          </p>
          <h3 className="mt-2 font-heading text-xl font-bold uppercase italic leading-snug text-zinc-900 md:text-2xl">
            {article.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">{article.excerpt}</p>
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
