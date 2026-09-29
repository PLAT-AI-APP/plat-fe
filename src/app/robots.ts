import type { MetadataRoute } from "next";
import { ALLOW_INDEXING } from "@/constants/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ALLOW_INDEXING
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
  };
}
