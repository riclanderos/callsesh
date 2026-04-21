import { MetadataRoute } from "next";
import { getPagesByPrefix } from "@/lib/pseo";

const BASE = "https://callsesh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified },
    { url: `${BASE}/coaching-booking-software`, lastModified },
    { url: `${BASE}/coach-payment-processing`, lastModified },
    { url: `${BASE}/video-coaching-platform`, lastModified },
    { url: `${BASE}/all-in-one-coaching-platform`, lastModified },
    { url: `${BASE}/coaching-business-software`, lastModified },
    { url: `${BASE}/tools-for-coaching-business`, lastModified },
    { url: `${BASE}/simple-coaching-booking-system`, lastModified },
    { url: `${BASE}/tools`, lastModified },
    { url: `${BASE}/tools/coach-tool-cost-calculator`, lastModified },
    { url: `${BASE}/tools/no-show-cost-calculator`, lastModified },
    { url: `${BASE}/tools/session-notes-template-generator`, lastModified },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...getPagesByPrefix("/alternatives/"),
    ...getPagesByPrefix("/for/"),
  ].map(({ path }) => ({ url: `${BASE}${path}`, lastModified }));

  return [...staticRoutes, ...dynamicRoutes];
}
