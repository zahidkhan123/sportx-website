"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { blogsAPI } from "@/lib/api";
import GoogleAds from "@/components/GoogleAds";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";

function formatDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

const blogBodyClass =
  "blog-content max-w-none text-white/80 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_a]:text-[#00FFFF] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#00FFFF]/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/70";

export function BlogPostClient({ slug }: { slug: string }) {

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogsAPI.getBySlug(slug),
    enabled: !!slug,
  });

  const post = data?.data;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
          <Link
            href="/blogs"
            className="inline-flex items-center text-sm text-white/70 hover:text-[#00FFFF] mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to blog
          </Link>

          {isLoading && <p className="text-white/60">Loading…</p>}

          {isError && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 mb-4">This post could not be loaded.</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => refetch()}
                  className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
                >
                  Try again
                </Button>
                <Link href="/blogs">
                  <Button type="button" variant="outline" className="border-white/10 text-white">
                    All posts
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!isLoading && !isError && post && (
            <>
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                  {post.authorName ? <span>{post.authorName}</span> : null}
                  {formatDate(post.publishedAt) ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt)}
                    </span>
                  ) : null}
                </div>
              </header>

              {post.coverImageUrl ? (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-white/5 mb-10">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 42rem"
                    priority
                    unoptimized={
                      post.coverImageUrl.startsWith("http") &&
                      !post.coverImageUrl.includes("localhost")
                    }
                  />
                </div>
              ) : null}

              <div
                className={blogBodyClass}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </>
          )}

          {!isLoading && !isError && !post && (
            <p className="text-white/60">Post not found.</p>
          )}
        </article>

        <aside className="w-full lg:w-80 shrink-0">
          <GoogleAds
            adSlot="3814764721"
            adFormat="vertical"
            className="w-full"
            minHeight="250px"
          />
        </aside>
      </div>
    </div>
  );
}
