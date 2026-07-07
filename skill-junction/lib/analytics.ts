/**
 * Analytics telemetry wrapper for Skill Junction.
 * Currently logs to console in development.
 * Replace the `send` function body with your analytics provider
 * (e.g., PostHog, Segment, GA4) without changing call sites.
 */

type EventProperties = Record<string, string | number | boolean | null | undefined>

function send(eventName: string, properties: EventProperties = {}): void {
  if (typeof window === 'undefined') return

  if (process.env.NODE_ENV === 'development') {
    console.info('[Analytics]', eventName, properties)
  }

  // TODO: Replace with real analytics provider
  // Example (PostHog):
  // if (window.posthog) window.posthog.capture(eventName, properties)
  // Example (GA4):
  // if (window.gtag) window.gtag('event', eventName, properties)
}

export function trackEvent(eventName: string, properties?: EventProperties): void {
  send(eventName, properties)
}

// ── Named event helpers ───────────────────────────────────────

export function trackPageView(page: string): void {
  send('page_view', { page })
}

export function trackCourseView(courseId: string, courseTitle: string): void {
  send('course_view', { course_id: courseId, course_title: courseTitle })
}

export function trackRegistrationStart(role: string): void {
  send('registration_start', { role })
}

export function trackRegistrationComplete(role: string): void {
  send('registration_complete', { role })
}

export function trackCourseEnquiry(courseTitle: string): void {
  send('course_enquiry', { course_title: courseTitle })
}

export function trackContactFormSubmit(): void {
  send('contact_form_submit', {})
}
