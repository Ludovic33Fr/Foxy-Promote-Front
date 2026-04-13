import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send } from 'lucide-react';
import Button from '../ui/Button';
import { trackEvent } from '../../utils/analytics';
import { sanitizeText } from '../../utils/consent';
import { markNpsSubmitted } from '../../hooks/useNpsTrigger';

interface NpsSurveyProps {
  onClose: () => void;
}

const NpsSurvey = ({ onClose }: NpsSurveyProps) => {
  const { t } = useTranslation();
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (score === null) return;

    trackEvent('nps_score_given', { score });

    if (comment.trim()) {
      trackEvent('nps_comment_given', { score, comment: sanitizeText(comment) });
    }

    markNpsSubmitted();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  const handleDismiss = () => {
    markNpsSubmitted();
    onClose();
  };

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl p-6 text-center">
        <p className="text-sm text-muted-foreground">{t('nps.thanks')}</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-card border border-border rounded-xl shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h4 className="text-sm font-semibold">{t('nps.title')}</h4>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground p-1">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">{t('nps.question')}</p>

        <div className="flex justify-between gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setScore(i)}
              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                score === i
                  ? i <= 6
                    ? 'bg-red-500 text-white'
                    : i <= 8
                    ? 'bg-yellow-500 text-white'
                    : 'bg-green-500 text-white'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{t('nps.unlikely')}</span>
          <span>{t('nps.likely')}</span>
        </div>

        {score !== null && score < 7 && (
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder={t('nps.commentPlaceholder')}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        )}

        {score !== null && (
          <Button size="sm" fullWidth onClick={handleSubmit} rightIcon={<Send className="h-3 w-3" />}>
            {t('nps.submit')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NpsSurvey;
