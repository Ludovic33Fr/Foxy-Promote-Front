import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, X } from 'lucide-react';
import Button from '../ui/Button';
import { track } from '../../utils/analytics';
import { useAuth } from '../../context/AuthContext';

interface AiConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const AI_CONSENT_KEY = 'tt_ai_consent';

export function hasAiConsent(): boolean {
  return localStorage.getItem(AI_CONSENT_KEY) !== null;
}

export function grantAiConsent(): void {
  localStorage.setItem(AI_CONSENT_KEY, JSON.stringify({
    accepted: true,
    timestamp: new Date().toISOString(),
  }));
}

const AiConsentModal = ({ isOpen, onAccept, onClose }: AiConsentModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    grantAiConsent();
    if (user?.id) {
      track('ai_consent_given', { userId: user.id });
    }
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{t('consent.ai.title')}</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">{t('consent.ai.description')}</p>

          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('consent.ai.point1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('consent.ai.point2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('consent.ai.point3')}</span>
            </li>
          </ul>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded accent-primary"
            />
            <span className="text-sm">{t('consent.ai.checkbox')}</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <Button size="sm" variant="outline" onClick={onClose}>
            {t('consent.ai.cancel')}
          </Button>
          <Button size="sm" onClick={handleAccept} disabled={!checked} data-attr="consent-ai-accept">
            {t('consent.ai.accept')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiConsentModal;
