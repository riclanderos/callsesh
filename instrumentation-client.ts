import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',

  // Restrict autocapture to meaningful product interactions only.
  // - Omitting 'change' from dom_event_allowlist stops input-typing events.
  // - element_allowlist limits click/submit capture to links, buttons, and forms;
  //   generic div/span clicks are ignored.
  autocapture: {
    dom_event_allowlist: ['click', 'submit'],
    element_allowlist: ['a', 'button', 'form'],
  },
})

// Track SPA navigations that PostHog's initial pageview capture misses.
export function onRouterTransitionStart(url: string) {
  posthog.capture('$pageview', { $current_url: url })
}
