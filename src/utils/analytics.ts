import posthog from 'posthog-js';
import { hasConsentForCategory } from './consent';

let initialized = false;

export function initPostHog(): void {
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

  if (!apiKey || initialized) return;

  posthog.init(apiKey, {
    api_host: host,
    opt_out_capturing_by_default: true,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '[data-ph-no-capture]',
      recordCrossOriginIframes: false,
    },
  });

  initialized = true;
}

export function enableAnalytics(): void {
  if (initialized) posthog.opt_in_capturing();
}

export function disableAnalytics(): void {
  if (initialized) posthog.opt_out_capturing();
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (!initialized || !hasConsentForCategory('analytics')) return;
  posthog.capture(name, properties);
}

export function trackPageView(): void {
  trackEvent('$pageview');
}

export function identifyUser(
  userId: string,
  setProps: Record<string, unknown>,
  setOnceProps?: Record<string, unknown>
): void {
  if (!initialized || !hasConsentForCategory('analytics')) return;
  posthog.identify(userId, setProps, setOnceProps);
}

export function resetUser(): void {
  if (initialized) posthog.reset();
}
