import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ArticleFrontmatter, Article } from "@/lib/types";

const articlesDir = path.join(process.cwd(), "content/articles");

export type { ArticleFrontmatter, Article };

export function getAllArticles(): ArticleFrontmatter[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      title: (data.title as string) ?? "",
      slug: (data.slug as string) ?? filename.replace(/\.mdx$/, ""),
      date: (data.date as string) ?? "",
      author: (data.author as string) ?? "",
      category: (data.category as string) ?? "",
      excerpt: (data.excerpt as string) ?? "",
      coverImage: data.coverImage as string | undefined,
      tags: data.tags as string[] | undefined,
      published: (data.published as boolean) ?? true,
    };
  });

  return articles
    .filter((a) => a.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  if (!fs.existsSync(articlesDir)) return null;

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    if (data.slug === slug || filename.replace(/\.mdx$/, "") === slug) {
      return {
        title: (data.title as string) ?? "",
        slug: (data.slug as string) ?? filename.replace(/\.mdx$/, ""),
        date: (data.date as string) ?? "",
        author: (data.author as string) ?? "",
        category: (data.category as string) ?? "",
        excerpt: (data.excerpt as string) ?? "",
        coverImage: data.coverImage as string | undefined,
        tags: data.tags as string[] | undefined,
        published: (data.published as boolean) ?? true,
        content,
      };
    }
  }

  return null;
}
