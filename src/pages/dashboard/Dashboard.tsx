import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Music, Upload, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import TrackCard from '../../components/dashboard/TrackCard';
import UploadTrackModal, { UploadMeta } from '../../components/dashboard/UploadTrackModal';
import { Track } from '../../types';
import { useSubscription } from '../../context/SubscriptionContext';
import { track, trackEvent } from '../../utils/analytics';
import { useNpsTrigger } from '../../hooks/useNpsTrigger';
import NpsSurvey from '../../components/feedback/NpsSurvey';
import { useAuth } from '../../context/AuthContext';
import { generateAdvice, fetchArtistSongs } from '../../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const { getCurrentPlan, getRemainingUploads } = useSubscription();
  const showNps = useNpsTrigger();
  const [npsVisible, setNpsVisible] = useState(true);
  
  useEffect(() => {
    const fetchTracks = async () => {
      if (!user?.artistId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchArtistSongs(user.artistId);
        
        // Map API data to Track type
        const mappedTracks: Track[] = data.map((item: any) => ({
          id: item.id,
          userId: user?.id || '',
          title: item.name,
          uploadedAt: item.insertDate || new Date().toISOString(),
          audioUrl: item.audioUrl || '',
          thumbnailUrl: item.urlPicture,
          duration: item.duration || 0,
          status: 'analyzed', // If it's in this list, it should be ready for viewing
          genre: item.style,
          bpm: item.bpm,
          key: item.key,
          filePath: item.filePath,
          urlSoundCloud: item.urlSoundCloud
        }));
        
        setTracks(mappedTracks);
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [user]);

  const handleUploadTrack = async (title: string, file: File, meta: UploadMeta) => {
    // 1. Generate a temporary ID for tracking
    const tempId = 'temp-' + Date.now();

    // 2. Wait 5 seconds as requested by the user
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 3. Add the track in "analyzing" mode immediately after the 5s wait
    const placeholderTrack: Track = {
      id: tempId,
      userId: user?.id || '',
      title: title,
      uploadedAt: new Date().toISOString(),
      audioUrl: URL.createObjectURL(file),
      duration: 0,
      status: 'analyzing'
    };

    setTracks(prev => [placeholderTrack, ...prev]);

    try {
      const result = await generateAdvice(user!.artistId!, title, file);

      track('track_upload_completed', {
        trackId: result.id,
        fileSize: file.size,
        fileFormat: meta.fileFormat,
        durationSec: meta.durationSec,
        is_first_upload: tracks.length === 0,
        upload_duration_ms: Date.now() - meta.startedAt,
      });

      setTracks(currentTracks =>
        currentTracks.map(t =>
          t.id === tempId
            ? {
                ...t,
                id: result.id,
                title: result.name || title,
                uploadedAt: result.insertDate || t.uploadedAt,
                thumbnailUrl: result.urlPicture,
                genre: result.style,
                status: 'analyzed'
              }
            : t
        )
      );
    } catch (error) {
      console.error('Background upload/analysis failed:', error);
      trackEvent('track_upload_failed', {
        errorType: error instanceof Error ? error.message : 'unknown',
      });
      setTracks(currentTracks =>
        currentTracks.map(t => t.id === tempId ? { ...t, status: 'error' } : t)
      );
    }
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('dashboard.subtitle')}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="mr-4 text-sm text-muted-foreground hidden md:block">
              {t('dashboard.remaining_uploads', { count: getRemainingUploads() })}
            </div>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
              data-attr="cta-upload"
            >
              {t('dashboard.upload_button')}
            </Button>
          </div>
        </div>
        
        {currentPlan?.id === 'free' && (
          <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start md:items-center flex-col md:flex-row">
            <div className="flex-shrink-0 mr-4 mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Info className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{t('dashboard.free_plan.title')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('dashboard.free_plan.desc')}
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 self-stretch md:self-center">
              <Link to="/pricing" onClick={() => track('upgrade_banner_clicked', { current_plan: 'free', placement: 'dashboard_banner' })}>
                <Button variant="outline" size="sm" data-attr="banner-upgrade">{t('dashboard.free_plan.view')}</Button>
              </Link>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">{t('dashboard.loading')}</p>
          </div>
        ) : tracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-foreground">{t('dashboard.empty.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {t('dashboard.empty.desc')}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                leftIcon={<Upload className="h-4 w-4" />}
              >
                {t('dashboard.empty.button')}
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <UploadTrackModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadTrack}
      />

      {showNps && npsVisible && <NpsSurvey onClose={() => setNpsVisible(false)} />}
    </div>
  );
};

export default Dashboard;