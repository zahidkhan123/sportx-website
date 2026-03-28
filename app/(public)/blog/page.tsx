import { permanentRedirect } from "next/navigation";

export default function BlogAliasPage() {
  permanentRedirect("/blogs");
}
