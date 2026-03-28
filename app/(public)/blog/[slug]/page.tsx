import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogSlugAliasPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/blogs/${encodeURIComponent(slug)}`);
}
