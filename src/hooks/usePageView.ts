import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

export function usePageView(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname]);
}
