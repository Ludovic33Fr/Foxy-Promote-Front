import { PlayCircle, PauseCircle, Clock, Music, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Track } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { getAudioStreamUrl } from '../../services/api';

interface TrackCardProps {
  track: Track;
}

const TrackCard = ({ track }: TrackCardProps) => {
  const { t } = useTranslation();
  const { playTrack, currentTrack, isPlaying: playerIsPlaying, togglePlay } = usePlayer();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && playerIsPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentTrack) {
      togglePlay();
      return;
    }

    if (!track.filePath && !track.urlSoundCloud) return;

    playTrack({
      id: track.id,
      name: track.title,
      coverUrl: track.thumbnailUrl,
      filePath: track.filePath ? getAudioStreamUrl(track.id) : undefined,
      urlSoundCloud: track.urlSoundCloud,
    });
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Track['status']) => {
    switch (status) {
      case 'analyzing':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'analyzed':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'error':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getStatusText = (status: Track['status']) => {
    switch (status) {
      case 'analyzing':
        return t('dashboard.track_status.analyzing');
      case 'analyzed':
        return t('dashboard.track_status.ready');
      case 'error':
        return t('dashboard.track_status.error');
      default:
        return t('dashboard.track_status.unknown');
    }
  };

  const thumbnailUrl = track.thumbnailUrl || 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    <div className="bg-card hover:bg-card/90 transition-all duration-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg border border-border hover:border-primary/20">
      <div className="relative group">
        <img 
          src={thumbnailUrl} 
          alt={track.title} 
          className="w-full h-40 object-cover"
        />
        <button 
          onClick={handlePlay}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        >
          {isPlaying ? (
            <PauseCircle className="h-12 w-12 text-white fill-white/20" />
          ) : (
            <PlayCircle className="h-12 w-12 text-white fill-white/20" />
          )}
        </button>
        
        <div className="absolute bottom-2 right-2">
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(track.status)}`}>
            {getStatusText(track.status)}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{track.title}</h3>
        
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
          {track.genre && (
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-2" />
              <span>{track.genre}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatDuration(track.duration)}</span>
          </div>
          
          {track.bpm && (
            <div className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              <span>{track.bpm} BPM</span>
            </div>
          )}
          
          {track.key && (
            <div className="flex items-center">
              <span className="mr-2 text-xs font-mono bg-muted px-1.5 py-0.5 rounded">♯</span>
              <span>{track.key}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          {track.status === 'analyzed' ? (
            <Link 
              to={`/analysis/${track.id}`}
              className="text-primary hover:text-primary/80 font-medium text-sm flex items-center"
            >
              {t('dashboard.track_actions.view_analysis')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : track.status === 'analyzing' ? (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center text-sm text-primary font-medium animate-pulse">
                <div className="mr-2 h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                {t('dashboard.track_status.analyzing_msg')}
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full animate-progress-indeterminate"></div>
              </div>
            </div>
          ) : (
            <button className="text-primary hover:text-primary/80 font-medium text-sm">
              {t('dashboard.track_actions.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;