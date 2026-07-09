import { getAllArticles } from "@/lib/mdx";
import Link from "next/link";

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Desa Tulungrejo</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Kecamatan Wates, Kabupaten Blitar, Jawa Timur
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
          <Link
            href="/articles"
            className="text-sm text-primary hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        {articles.length === 0 ? (
          <p className="text-muted-foreground">Belum ada artikel.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="rounded-lg border bg-card p-6 hover:shadow-sm transition-shadow"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  {article.category}
                </p>
                <h3 className="font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
