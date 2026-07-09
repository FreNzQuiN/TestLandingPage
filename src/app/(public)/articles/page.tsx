import { getAllArticles } from "@/lib/mdx";
import Link from "next/link";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Artikel</h1>
      {articles.length === 0 ? (
        <p className="text-muted-foreground">Belum ada artikel.</p>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block rounded-lg border bg-card p-6 hover:shadow-sm transition-shadow"
            >
              <p className="text-xs text-muted-foreground mb-1">
                {article.category} &middot;{" "}
                {new Date(article.date).toLocaleDateString("id-ID")}
              </p>
              <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
