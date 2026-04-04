import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://callsesh.com",
      lastModified: new Date(),
    },
    {
      url: "https://callsesh.com/coaching-booking-software",
      lastModified: new Date(),
    },
    {
      url: "https://callsesh.com/coach-payment-processing",
      lastModified: new Date(),
    },
    {
      url: "https://callsesh.com/video-coaching-platform",
      lastModified: new Date(),
    },
    {
      url: "https://callsesh.com/alternatives/calendly-for-coaches",
      lastModified: new Date(),
    },
    {
      url: "https://callsesh.com/for/business-coaches",
      lastModified: new Date(),
    },
  ];
}
