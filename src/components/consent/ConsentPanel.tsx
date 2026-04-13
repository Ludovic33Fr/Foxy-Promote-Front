import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, X } from 'lucide-react';
import Button from '../ui/Button';
import { getConsent } from '../../utils/consent';

interface ConsentPanelProps {
  onConfirm: (categories: ('essential' | 'analytics' | 'marketing')[]) => void;
  onAcceptAll: () => void;
  onClose: () => void;
}

const ConsentPanel = ({ onConfirm, onAcceptAll, onClose }: ConsentPanelProps) => {
  const { t } = useTranslation();
  const existing = getConsent();

  const [analytics, setAnalytics] = useState(
    existing?.categories.includes('analytics') ?? false
  );
  const [marketing, setMarketing] = useState(
    existing?.categories.includes('marketing') ?? false
  );

  const handleConfirm = () => {
    const categories: ('essential' | 'analytics' | 'marketing')[] = ['essential'];
    if (analytics) categories.push('analytics');
    if (marketing) categories.push('marketing');
    onConfirm(categories);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{t('consent.panel.title')}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">{t('consent.panel.essential')}</p>
              <p className="text-xs text-muted-foreground">{t('consent.panel.essentialDesc')}</p>
            </div>
            <input type="checkbox" checked disabled className="h-4 w-4 rounded accent-primary" />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">{t('consent.panel.analytics')}</p>
              <p className="text-xs text-muted-foreground">{t('consent.panel.analyticsDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-4 w-4 rounded accent-primary"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">{t('consent.panel.marketing')}</p>
              <p className="text-xs text-muted-foreground">{t('consent.panel.marketingDesc')}</p>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="h-4 w-4 rounded accent-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <Button size="sm" variant="outline" onClick={handleConfirm}>
            {t('consent.panel.confirm')}
          </Button>
          <Button size="sm" onClick={onAcceptAll}>
            {t('consent.panel.acceptAll')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentPanel;
