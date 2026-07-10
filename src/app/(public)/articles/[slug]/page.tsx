import { getArticleBySlug, getAllArticles } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articleUrl = `${siteUrl}/articles/${article.slug}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-muted-foreground mb-4"
      >
        <Link href="/" className="hover:underline">
          Beranda
        </Link>
        <span className="mx-1.5">→</span>
        <Link href="/articles" className="hover:underline">
          Artikel
        </Link>
        <span className="mx-1.5">→</span>
        <span>{article.title}</span>
      </nav>

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
        <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
      </div>

      <div className="flex flex-wrap gap-2 mt-8">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-muted hover:bg-muted/80 px-3 py-1.5 rounded text-xs"
        >
          Facebook
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-muted hover:bg-muted/80 px-3 py-1.5 rounded text-xs"
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-muted hover:bg-muted/80 px-3 py-1.5 rounded text-xs"
        >
          Twitter / X
        </a>
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
