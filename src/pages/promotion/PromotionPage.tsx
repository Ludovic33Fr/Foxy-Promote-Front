import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, BadgeInfo, Sparkles } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import SubmissionCard from '../../components/promotion/SubmissionCard';
import { Track } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { trackEvent } from '../../utils/analytics';

const PromotionPage = () => {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { 
    getPromotionLimit, 
    getRemainingPromotions, 
    getCurrentPlan 
  } = useSubscription();
  
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Mock API call to get analyzed tracks
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo tracks - would be from API in real app
        const mockTracks: Track[] = [
          {
            id: 'track1',
            userId: user?.id || '',
            title: 'Summer Vibes',
            uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            audioUrl: 'https://example.com/audio1.mp3',
            thumbnailUrl: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            duration: 212,
            status: 'analyzed',
            genre: 'House',
            bpm: 128,
            key: 'A min'
          },
          {
            id: 'track2',
            userId: user?.id || '',
            title: 'Late Night',
            uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            audioUrl: 'https://example.com/audio2.mp3',
            thumbnailUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            duration: 187,
            status: 'analyzed',
            genre: 'R&B',
            bpm: 95,
            key: 'F maj'
          }
        ];
        
        // Only return analyzed tracks
        setTracks(mockTracks.filter(track => track.status === 'analyzed'));
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [user]);

  useEffect(() => {
    trackEvent('promotion_page_viewed');
  }, []);

  const handleSubmitTrack = async (trackId: string) => {
    try {
      // Mock API call - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Track submitted: ${trackId}`);
      trackEvent('track_submitted_to_label', { trackId });

      // In a real app, we would update the submission count in the user's subscription
      return true;
    } catch (error) {
      console.error('Submission failed:', error);
      throw error;
    }
  };

  const currentPlan = getCurrentPlan();
  const promotionLimit = getPromotionLimit();
  const remainingPromotions = getRemainingPromotions();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('promotion.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('promotion.subtitle')}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-sm text-muted-foreground">
              {t('promotion.remaining', { count: remainingPromotions })}
            </div>
          </div>
        </div>
        
        <div className="mb-8 p-4 rounded-lg bg-card border border-border">
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 mr-4 mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <BadgeInfo className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{t('promotion.howItWorks.title')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('promotion.howItWorks.desc')}
              </p>
            </div>
          </div>
        </div>
        
        {currentPlan?.id === 'free' && (
          <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start md:items-center flex-col md:flex-row">
            <div className="flex-shrink-0 mr-4 mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{t('promotion.upgrade.title')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('promotion.upgrade.desc')}
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 self-stretch md:self-center">
              <Link to="/pricing">
                <Button variant="outline" size="sm">{t('promotion.upgrade.view')}</Button>
              </Link>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">{t('promotion.loading')}</p>
          </div>
        ) : tracks.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('promotion.ready')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track) => (
                <SubmissionCard 
                  key={track.id} 
                  track={track} 
                  onSubmit={handleSubmitTrack}
                  remaining={remainingPromotions}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-foreground">{t('promotion.empty.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {t('promotion.empty.desc')}
            </p>
            <div className="mt-6">
              <Link to="/dashboard">
                <Button>
                  {t('promotion.empty.dashboard')}
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {tracks.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <h2 className="text-xl font-semibold mb-4">{t('promotion.history.title')}</h2>
            <div className="bg-card rounded-lg border border-border p-6 text-center">
              <p className="text-muted-foreground">
                {t('promotion.history.none')}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PromotionPage;