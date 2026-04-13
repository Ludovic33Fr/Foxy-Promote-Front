import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import Button from '../ui/Button';
import { getConsent, setConsent } from '../../utils/consent';
import { enableAnalytics, disableAnalytics } from '../../utils/analytics';
import ConsentPanel from './ConsentPanel';

const applyConsentToAnalytics = (categories: ('essential' | 'analytics' | 'marketing')[]) => {
  if (categories.includes('analytics')) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
};

const ConsentBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => getConsent() === null);
  const [showPanel, setShowPanel] = useState(false);

  const handleAcceptAll = () => {
    const categories: ('essential' | 'analytics' | 'marketing')[] = ['essential', 'analytics', 'marketing'];
    setConsent(categories);
    applyConsentToAnalytics(categories);
    setVisible(false);
  };

  const handleRefuseAll = () => {
    const categories: ('essential' | 'analytics' | 'marketing')[] = ['essential'];
    setConsent(categories);
    applyConsentToAnalytics(categories);
    setVisible(false);
  };

  const handleCustomize = () => {
    setShowPanel(true);
  };

  const handlePanelConfirm = (categories: ('essential' | 'analytics' | 'marketing')[]) => {
    setConsent(categories);
    applyConsentToAnalytics(categories);
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
