import { sanityFetch } from "./live";
import { STATIC_PAGE_SEO_QUERY } from "./queries";

export async function getStaticPageSeo() {
  const { data } = await sanityFetch({
    perspective: "published",
    query: STATIC_PAGE_SEO_QUERY,
    stega: false,
  });

  return data;
}
