import { CheckCircle, XCircle, BarChart4, Music, Volume2 } from 'lucide-react';
import { Analysis } from '../../types';

interface FeedbackSectionProps {
  analysis: Analysis;
}

const FeedbackSection = ({ analysis }: FeedbackSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="flex flex-col sm:flex-row sm:items-center bg-card rounded-lg border border-border p-4 mb-6">
        <div className="flex-1 mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold mb-1">Overall Track Score</h3>
          <p className="text-sm text-muted-foreground">
            Based on composition, arrangement, mixing, and marketability
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-24 w-24 flex items-center justify-center">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`${analysis.overallScore >= 70 ? '#10b981' : analysis.overallScore >= 40 ? '#f59e0b' : '#ef4444'}`}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * analysis.overallScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{analysis.overallScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5 mr-2" />
              Strengths
            </h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex">
                  <div className="text-green-500 mr-2">•</div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center text-amber-700 dark:text-amber-400">
              <XCircle className="h-5 w-5 mr-2" />
              Areas for Improvement
            </h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="flex">
                  <div className="text-amber-500 mr-2">•</div>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Feedback */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center">
            <BarChart4 className="h-5 w-5 mr-2" />
            Technical Feedback
          </h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <h4 className="font-medium mb-2 flex items-center">
              <Music className="h-4 w-4 mr-2 text-primary" />
              Composition
            </h4>
            <p className="text-sm text-muted-foreground">{analysis.technicalFeedback.composition}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <h4 className="font-medium mb-2 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2 text-primary"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Arrangement
            </h4>
            <p className="text-sm text-muted-foreground">{analysis.technicalFeedback.arrangement}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <h4 className="font-medium mb-2 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2 text-primary" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 2H2v20" />
                <path d="M6 16v-4" />
                <path d="M10 12v-2" />
                <path d="M14 16v-6" />
                <path d="M18 12v-2" />
              </svg>
              Mixing
            </h4>
            <p className="text-sm text-muted-foreground">{analysis.technicalFeedback.mixing}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <h4 className="font-medium mb-2 flex items-center">
              <Volume2 className="h-4 w-4 mr-2 text-primary" />
              Mastering
            </h4>
            <p className="text-sm text-muted-foreground">{analysis.technicalFeedback.mastering}</p>
          </div>
        </div>
      </div>

      {/* Marketing Tips */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center text-blue-700 dark:text-blue-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 16V6m-8 6h16" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Marketing Tips
          </h3>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {analysis.marketingTips.map((tip, index) => (
              <li key={index} className="flex">
                <div className="text-blue-500 mr-2">•</div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;