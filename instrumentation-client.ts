import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  // Automatic pageview capture doesn't track SPA navigations reliably in App
  // Router; custom events below cover the pages we care about.
  capture_pageview: false,
  capture_pageleave: false,
})
