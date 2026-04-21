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

// Typed event map — keep aligned with 07-analytics/instrumentation-spec.md
export type AnalysisSection =
  | 'mixing'
  | 'mastering'
  | 'composition'
  | 'arrangement'
  | 'global'
  | 'musical'
  | 'strategic'
  | 'tiktok';

export type ConsentCategory = 'essential' | 'analytics' | 'marketing';

export type EventMap = {
  // Already-instrumented events kept in the map so `track()` still covers them
  $pageview: Record<string, never>;
  analysis_viewed: { trackId: string | undefined; score?: number };
  pricing_page_viewed: { source: string };
  promotion_page_viewed: Record<string, never>;
  language_switched: { fromLang: string; toLang: string };
  login_started: { method: 'email' | 'google' };
  track_upload_failed: { errorType: string };

  // P0
  signup_completed: { method: 'email' | 'google'; userId: string; referrer?: string };
  onboarding_completed: {
    duration_seconds: number;
    genre: string;
    experienceLevel: string;
    goals: string[];
  };
  track_upload_completed: {
    trackId: string;
    fileSize: number;
    fileFormat: 'mp3' | 'wav';
    durationSec?: number;
    is_first_upload: boolean;
    upload_duration_ms: number;
  };
  chat_message_sent: { trackId: string | undefined; message_length: number; message_index: number };
  checkout_completed: {
    plan: 'artist' | 'pro';
    billing: 'monthly' | 'yearly';
    amount_eur: number;
    payment_method: 'card' | 'paypal';
    is_first_paid_conversion: boolean;
  };
  analysis_feedback_given: {
    trackId: string;
    rating: 'positive' | 'negative';
    section: AnalysisSection;
  };

  // P1
  signup_started: { method: 'email' | 'google' };
  onboarding_step_completed: { step: number; value: unknown };
  track_upload_started: { attempt_number: number; fileSize: number; fileFormat: 'mp3' | 'wav' };
  chat_opened: { trackId: string | undefined };
  chat_response_received: {
    trackId: string | undefined;
    response_time_ms: number;
    response_length: number;
  };
  plan_selected: { plan: 'artist' | 'pro' | 'free'; billing: 'monthly' | 'yearly' };
  checkout_started: { plan: 'artist' | 'pro'; billing: 'monthly' | 'yearly'; amount_eur: number };
  checkout_abandoned: {
    plan: 'artist' | 'pro';
    billing: 'monthly' | 'yearly';
    step_reached: 'plan_select' | 'payment_info' | 'confirmation';
  };
  analysis_feedback_comment: { trackId: string; section: AnalysisSection; comment_length: number };

  // P2
  analysis_section_expanded: { trackId: string | undefined; section: AnalysisSection };
  upgrade_banner_clicked: { current_plan: string; placement: string };
  track_submitted_to_label: { trackId: string; labelId?: string };
  profile_updated: { fields_changed: string[] };
  profile_completeness: { completeness_percent: number; missing_fields: string[] };
  onboarding_open_question: { response_text: string; response_length: number };
  consent_banner_shown: Record<string, never>;
  consent_given: { categories: ConsentCategory[] };
  consent_refused: Record<string, never>;
  consent_customized: { categories: ConsentCategory[]; source: 'banner' | 'settings' };
  consent_updated: {
    old_categories: ConsentCategory[];
    new_categories: ConsentCategory[];
    source: 'banner' | 'settings';
  };
  ai_consent_given: { userId: string };
};

export function track<E extends keyof EventMap>(event: E, properties: EventMap[E]): void {
  if (!initialized || !hasConsentForCategory('analytics')) return;
  posthog.capture(event, properties as Record<string, unknown>);
}

// Back-compat shim — prefer `track()` for new code
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
