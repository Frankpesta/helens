import { getPosts } from "@/lib/storefront-data";
import JournalIndexClient from "./journal-index-client";
export default async function JournalIndexPage() {
  return <JournalIndexClient initialPosts={await getPosts()} />;
}
