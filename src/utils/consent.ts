import type { ConsentState } from '../types';

const COOKIE_NAME = 'tt_consent';
const CONSENT_VERSION = '1.0';
const MAX_AGE_DAYS = 180;

export function getConsent(): ConsentState | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
  } catch {
    return null;
  }
}

export function setConsent(categories: ConsentState['categories']): void {
  const state: ConsentState = {
    categories,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(state))}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function hasConsentForCategory(
  category: 'essential' | 'analytics' | 'marketing'
): boolean {
  const consent = getConsent();
  if (!consent) return false;
  if (category === 'essential') return true;
  return consent.categories.includes(category);
}

export function clearConsent(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function sanitizeText(text: string, maxLength = 500): string {
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]')
    .replace(/(\+?\d{1,4}[\s.-]?)?(\(?\d{1,4}\)?[\s.-]?)?(\d[\s.-]?){5,12}\d/g, '[phone]')
    .slice(0, maxLength);
}
