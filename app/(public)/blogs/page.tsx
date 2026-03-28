"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { blogsAPI } from "@/lib/api";
import GoogleAds from "@/components/GoogleAds";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar } from "lucide-react";
import Image from "next/image";

type BlogListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorName?: string;
  publishedAt?: string;
};

function formatDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default function BlogsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["blogs-published"],
    queryFn: () => blogsAPI.getPublished({ page: 1, limit: 24 }),
  });

  const posts: BlogListItem[] = data?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-3">
              <BookOpen className="h-10 w-10 text-[#00FFFF]" />
              <span>
                <span className="text-[#00FFFF]">Sport</span>X
                <span className="text-[#39FF14]">360</span> Blog
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto md:mx-0">
              News, tips, and updates from the team. New posts are added by our admins.
            </p>
          </div>

          {isLoading && (
            <p className="text-white/60 text-center md:text-left">Loading articles…</p>
          )}

          {isError && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center md:text-left">
              <p className="text-white/80 mb-4">We couldn&apos;t load the blog right now.</p>
              <Button
                type="button"
                onClick={() => refetch()}
                className="bg-[#00FFFF] text-black hover:bg-[#00FFFF]/90"
              >
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <p className="text-white/60 text-center md:text-left">
              No posts yet. Check back soon.
            </p>
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2">
              {posts.map((post) => {
                const dateLabel = formatDate(post.publishedAt);
                return (
                  <li key={post._id}>
                    <Link href={`/blogs/${post.slug}`} className="group block h-full">
                      <Card className="glass-card border-white/10 h-full overflow-hidden transition-colors group-hover:border-[#00FFFF]/40">
                        {post.coverImageUrl ? (
                          <div className="relative aspect-[16/9] w-full bg-white/5">
                            <Image
                              src={post.coverImageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              unoptimized={
                                post.coverImageUrl.startsWith("http") &&
                                !post.coverImageUrl.includes("localhost")
                              }
                            />
                          </div>
                        ) : null}
                        <CardContent className="p-5">
                          <h2 className="text-xl font-bold text-white group-hover:text-[#00FFFF] transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
                            {post.authorName ? (
                              <span>{post.authorName}</span>
                            ) : null}
                            {dateLabel ? (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {dateLabel}
                              </span>
                            ) : null}
                          </div>
                          {post.excerpt ? (
                            <p className="mt-3 text-sm text-white/70 line-clamp-3">
                              {post.excerpt}
                            </p>
                          ) : null}
                          <span className="mt-4 inline-block text-sm font-medium text-[#00FFFF]">
                            Read more →
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

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
