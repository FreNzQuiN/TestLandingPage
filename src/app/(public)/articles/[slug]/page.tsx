import { getArticleBySlug, getAllArticles } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/articles"
        className="text-sm text-primary hover:underline mb-6 inline-block"
      >
        &larr; Kembali ke Artikel
      </Link>

      <header className="mb-8">
        <p className="text-xs text-muted-foreground mb-2">
          {article.category} &middot;{" "}
          {new Date(article.date).toLocaleDateString("id-ID")} &middot;{" "}
          {article.author}
        </p>
        <h1 className="text-3xl font-bold">{article.title}</h1>
      </header>

      <div className="prose max-w-none">
        {article.content.split("\n").map((line, i) => {
          if (line.startsWith("# "))
            return (
              <h1 key={i} className="text-2xl font-bold mt-8 mb-4">
                {line.slice(2)}
              </h1>
            );
          if (line.startsWith("## "))
            return (
              <h2 key={i} className="text-xl font-semibold mt-6 mb-3">
                {line.slice(3)}
              </h2>
            );
          if (line.trim() === "") return <br key={i} />;
          return (
            <p key={i} className="mb-2">
              {line}
            </p>
          );
        })}
      </div>

      {article.tags && article.tags.length > 0 && (
        <footer className="mt-8 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
