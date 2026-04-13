import { useState, useEffect } from 'react';

const FIRST_ANALYSIS_KEY = 'tt_first_analysis_date';
const NPS_SUBMITTED_KEY = 'tt_nps_submitted';
const NPS_DELAY_DAYS = 7;

export function recordFirstAnalysis(): void {
  if (!localStorage.getItem(FIRST_ANALYSIS_KEY)) {
    localStorage.setItem(FIRST_ANALYSIS_KEY, new Date().toISOString());
  }
}

export function useNpsTrigger(): boolean {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const firstAnalysis = localStorage.getItem(FIRST_ANALYSIS_KEY);
    const alreadySubmitted = localStorage.getItem(NPS_SUBMITTED_KEY);

    if (!firstAnalysis || alreadySubmitted) return;

    const daysSince = (Date.now() - new Date(firstAnalysis).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince >= NPS_DELAY_DAYS) {
      setShouldShow(true);
    }
  }, []);

  return shouldShow;
}

export function markNpsSubmitted(): void {
  localStorage.setItem(NPS_SUBMITTED_KEY, new Date().toISOString());
}
