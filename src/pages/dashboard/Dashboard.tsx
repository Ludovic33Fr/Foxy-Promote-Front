import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Music, Upload, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import TrackCard from '../../components/dashboard/TrackCard';
import UploadTrackModal from '../../components/dashboard/UploadTrackModal';
import { Track } from '../../types';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const { getCurrentPlan, getRemainingUploads } = useSubscription();
  
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Mock API call to get tracks
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo tracks - would be from API in real app
        const mockTracks: Track[] = [
          {
            id: 'track1',
            userId: user?.id || '',
            title: 'Summer Vibes',
            uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            audioUrl: 'https://example.com/audio1.mp3',
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
            duration: 187,
            status: 'analyzed',
            genre: 'R&B',
            bpm: 95,
            key: 'F maj'
          },
          {
            id: 'track3',
            userId: user?.id || '',
            title: 'First Draft',
            uploadedAt: new Date().toISOString(),
            audioUrl: 'https://example.com/audio3.mp3',
            duration: 165,
            status: 'analyzing'
          }
        ];
        
        setTracks(mockTracks);
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [user]);

  const handleUploadTrack = async (title: string, file: File) => {
    try {
      // Mock upload - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new track
      const newTrack: Track = {
        id: 'track' + Date.now(),
        userId: user?.id || '',
        title,
        uploadedAt: new Date().toISOString(),
        audioUrl: URL.createObjectURL(file),
        duration: 180, // Placeholder duration
        status: 'analyzing'
      };
      
      setTracks([newTrack, ...tracks]);
      
      // Simulate track analysis completion after 5 seconds
      setTimeout(() => {
        setTracks(currentTracks => 
          currentTracks.map(track => 
            track.id === newTrack.id 
              ? {
                  ...track,
                  status: 'analyzed',
                  genre: 'Electronic',
                  bpm: 120,
                  key: 'C maj'
                }
              : track
          )
        );
      }, 5000);
      
      return newTrack;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
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
              <Link to="/pricing">
                <Button variant="outline" size="sm">{t('dashboard.free_plan.view')}</Button>
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
    </div>
  );
};

export default Dashboard;