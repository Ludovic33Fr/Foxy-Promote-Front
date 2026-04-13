import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { sanitizeText } from '../../utils/consent';

interface AnalysisMicroFeedbackProps {
  section: string;
  trackId: string;
}

const AnalysisMicroFeedback = ({ section, trackId }: AnalysisMicroFeedbackProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (value: 'positive' | 'negative') => {
    setRating(value);
    trackEvent('analysis_feedback_given', { rating: value, section, trackId });
    if (value === 'positive') {
      setSubmitted(true);
    }
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      trackEvent('analysis_feedback_comment', {
        commentText: sanitizeText(comment),
        section,
        trackId,
      });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-muted/30 text-sm text-muted-foreground">
        <ThumbsUp className="h-4 w-4" />
        {t('feedback.micro.thanks')}
      </div>
    );
  }

  return (
    <div className="py-3 px-4 rounded-xl bg-muted/30 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{t('feedback.micro.question')}</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleRating('positive')}
            data-attr="feedback-thumbs-up"
            className={`p-2 rounded-lg transition-colors ${
              rating === 'positive'
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleRating('negative')}
            data-attr="feedback-thumbs-down"
            className={`p-2 rounded-lg transition-colors ${
              rating === 'negative'
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {rating === 'negative' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            placeholder={t('feedback.micro.placeholder')}
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={500}
          />
          <button
            onClick={handleSubmitComment}
            data-attr="feedback-submit-comment"
            className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisMicroFeedback;
