import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import Button from '../ui/Button';
import { getConsent, setConsent } from '../../utils/consent';
import { enableAnalytics, disableAnalytics, track, ConsentCategory } from '../../utils/analytics';
import ConsentPanel from './ConsentPanel';

const applyConsentToAnalytics = (categories: ConsentCategory[]) => {
  if (categories.includes('analytics')) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
};

const ConsentBanner = () => {
  const { t } = useTranslation();
  const initialConsentRef = useRef(getConsent());
  const [visible, setVisible] = useState(() => initialConsentRef.current === null);
  const [showPanel, setShowPanel] = useState(false);
  const bannerShownTrackedRef = useRef(false);

  useEffect(() => {
    if (!visible || bannerShownTrackedRef.current) return;
    bannerShownTrackedRef.current = true;
    // Only sent if analytics was previously granted (e.g. banner reopened from settings).
    track('consent_banner_shown', {});
  }, [visible]);

  const handleAcceptAll = () => {
    const categories: ConsentCategory[] = ['essential', 'analytics', 'marketing'];
    const prev = getConsent();
    setConsent(categories);
    applyConsentToAnalytics(categories);
    if (prev) {
      track('consent_updated', {
        old_categories: prev.categories,
        new_categories: categories,
        source: 'banner',
      });
    } else {
      track('consent_given', { categories });
    }
    setVisible(false);
  };

  const handleRefuseAll = () => {
    const categories: ConsentCategory[] = ['essential'];
    const prev = getConsent();
    if (prev) {
      // Sent only if analytics was enabled before the update downgrade.
      track('consent_updated', {
        old_categories: prev.categories,
        new_categories: categories,
        source: 'banner',
      });
    } else {
      track('consent_refused', {});
    }
    setConsent(categories);
    applyConsentToAnalytics(categories);
    setVisible(false);
  };

  const handleCustomize = () => {
    setShowPanel(true);
  };

  const handlePanelConfirm = (categories: ConsentCategory[]) => {
    const prev = getConsent();
    setConsent(categories);
    applyConsentToAnalytics(categories);
    if (prev) {
      track('consent_updated', {
        old_categories: prev.categories,
        new_categories: categories,
        source: 'banner',
      });
    } else {
      track('consent_customized', { categories, source: 'banner' });
    }
    setShowPanel(false);
    setVisible(false);
  };

  if (!visible && !showPanel) return null;

  if (showPanel) {
    return (
      <ConsentPanel
        onConfirm={handlePanelConfirm}
        onAcceptAll={handleAcceptAll}
        onClose={() => setShowPanel(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
      <div className="relative w-full max-w-2xl mx-4 mb-6 bg-card border border-border rounded-xl shadow-2xl p-6 pointer-events-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t('consent.banner.title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('consent.banner.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="sm" onClick={handleAcceptAll} data-attr="consent-accept-all">
                {t('consent.banner.acceptAll')}
              </Button>
              <Button size="sm" variant="outline" onClick={handleRefuseAll} data-attr="consent-refuse-all">
                {t('consent.banner.refuseAll')}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCustomize} data-attr="consent-customize">
                {t('consent.banner.customize')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
