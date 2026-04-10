import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ArticleFrontmatter {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  publishedAt: string;
  initialCost: number;
  monthlyCost: number;
  defaultYears: number;
  emoji: string;
  gradient: string;
  keywords?: string[];
  comparisonType?: "vehicle" | "subscription" | "lifestyle" | null;
}

export interface Article extends ArticleFrontmatter {
  content: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export function getAllArticles(): ArticleFrontmatter[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
    const { data } = matter(raw);
    return data as ArticleFrontmatter;
  });

  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticle(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return { ...(data as ArticleFrontmatter), content };
}

export function getArticleSlugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
