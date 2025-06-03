import { useState } from 'react';
import { Send, Info, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { Track } from '../../types';

interface SubmissionCardProps {
  track: Track;
  onSubmit: (trackId: string) => Promise<void>;
  remaining: number;
}

const SubmissionCard = ({ track, onSubmit, remaining }: SubmissionCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const handleSubmit = async () => {
    if (remaining <= 0) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(track.id);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const thumbnailUrl = track.thumbnailUrl || 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm relative">
      <div className="relative">
        <img 
          src={thumbnailUrl} 
          alt={track.title} 
          className="w-full h-32 object-cover"
        />
        {isSubmitted && (
          <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-black/80 rounded-full p-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-base mb-1 truncate">{track.title}</h3>
        <div className="text-xs text-muted-foreground mb-3">
          Uploaded: {new Date(track.uploadedAt).toLocaleDateString()}
        </div>
        
        {isSubmitted ? (
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Submitted for promotion
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <Button
              size="sm"
              leftIcon={<Send className="h-3.5 w-3.5" />}
              onClick={handleSubmit}
              disabled={isSubmitting || remaining <= 0}
              isLoading={isSubmitting}
            >
              Submit to Labels
            </Button>
            
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground p-1 rounded-full"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {showInfo && (
          <div className="mt-3 p-2 bg-muted rounded text-xs text-muted-foreground">
            <p>
              Submitting this track will share it with our network of labels and curators 
              who are looking for new talent. You have {remaining} submission{remaining !== 1 ? 's' : ''} remaining this month.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;