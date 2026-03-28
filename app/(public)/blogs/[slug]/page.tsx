import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/blogs/BlogPostClient";
import { fetchBlogBySlug } from "@/lib/server-api";
import { buildBlogArticleJsonLd, buildBlogPostMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  return buildBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  if (!post?.slug) notFound();
  return (
    <>
      <JsonLd data={buildBlogArticleJsonLd(post)} />
      <BlogPostClient slug={slug} />
    </>
  );
}
