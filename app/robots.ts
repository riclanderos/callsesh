import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/auth/",
        "/login/",
        "/signup/",
        "/forgot-password/",
        "/reset-password/",
        "/upgrade/",
        "/book/",
        "/session/",
        "/cancel/",
        "/demo/",
      ],
    },
    sitemap: "https://callsesh.com/sitemap.xml",
  };
}
