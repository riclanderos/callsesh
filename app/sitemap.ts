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
    { url: `${BASE}/coaching-scheduling-software`, lastModified },
    { url: `${BASE}/coaching-client-management-software`, lastModified },
    { url: `${BASE}/coaching-billing-software`, lastModified },
    { url: `${BASE}/online-coaching-platform`, lastModified },
    { url: `${BASE}/coaching-session-software`, lastModified },
    { url: `${BASE}/alternatives`, lastModified },
    { url: `${BASE}/for`, lastModified },
    { url: `${BASE}/tools`, lastModified },
    { url: `${BASE}/tools/coach-tool-cost-calculator`, lastModified },
    { url: `${BASE}/tools/no-show-cost-calculator`, lastModified },
    { url: `${BASE}/tools/session-notes-template-generator`, lastModified },
    { url: `${BASE}/tools/coaching-booking-software`, lastModified },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...getPagesByPrefix("/alternatives/"),
    ...getPagesByPrefix("/for/"),
  ].map(({ path }) => ({ url: `${BASE}${path}`, lastModified }));

  return [...staticRoutes, ...dynamicRoutes];
}
