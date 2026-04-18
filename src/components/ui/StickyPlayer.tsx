import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  Play, Pause, Volume2, VolumeX, X, Music,
  SkipBack, SkipForward, ExternalLink
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Extract SoundCloud embed URL from a share/track URL
function getSoundCloudEmbedUrl(url: string): string {
  // If already an embed URL, return as-is
  if (url.includes('w.soundcloud.com')) return url;
  // Build embed URL
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%237c3aed&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;
}

const StickyPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animate in when a track is set
  useEffect(() => {
    if (currentTrack) {
      // Small delay for smooth mount animation
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [currentTrack]);

  const isSoundCloud = currentTrack && !currentTrack.filePath && !!currentTrack.urlSoundCloud;

  // Progress bar click/drag
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || isSoundCloud) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    if (isSoundCloud) return;
    setIsDragging(true);
    handleProgressClick(e);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(ratio * duration);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, duration, seek]);

  // Volume slider click
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(ratio);
  };

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Top progress bar — thin line across the full width */}
      {!isSoundCloud && (
        <div
          ref={progressRef}
          className="h-1 bg-white/10 cursor-pointer group relative"
          onMouseDown={handleProgressMouseDown}
        >
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-100 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}

      {/* Main player bar */}
      <div className="bg-zinc-900/95 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[72px] gap-4">

            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 w-[280px] shrink-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 shrink-0">
                {currentTrack.coverUrl ? (
                  <img src={currentTrack.coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <Music className="h-5 w-5 text-white/60" />
                  </div>
                )}
                {/* Subtle pulse when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-xl" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentTrack.name}</p>
                {currentTrack.artist && (
                  <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {isSoundCloud ? (
                /* SoundCloud embed */
                <div className="flex items-center gap-3 w-full max-w-md">
                  <a
                    href={currentTrack.urlSoundCloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Ouvrir dans SoundCloud</span>
                  </a>
                  <iframe
                    title="SoundCloud Player"
                    width="100%"
                    height="20"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={getSoundCloudEmbedUrl(currentTrack.urlSoundCloud!)}
                    className="rounded opacity-80"
                  />
                </div>
              ) : (
                /* Native audio controls */
                <div className="flex items-center gap-6">
                  <button className="text-zinc-500 hover:text-white transition-colors" onClick={() => seek(Math.max(0, currentTime - 10))}>
                    <SkipBack className="h-4 w-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="bg-white text-zinc-900 rounded-full p-2.5 hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-white/10"
                  >
                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                  </button>

                  <button className="text-zinc-500 hover:text-white transition-colors" onClick={() => seek(Math.min(duration, currentTime + 10))}>
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Timestamps */}
              {!isSoundCloud && (
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              )}
            </div>

            {/* Volume & Close */}
            <div className="flex items-center gap-3 w-[160px] justify-end shrink-0">
              {!isSoundCloud && (
                <div
                  className="relative flex items-center gap-2"
                  onMouseEnter={() => setShowVolume(true)}
                  onMouseLeave={() => setShowVolume(false)}
                >
                  <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <div
                    ref={volumeRef}
                    className={`h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden transition-all duration-300 ${
                      showVolume ? 'w-20 opacity-100' : 'w-0 opacity-0'
                    }`}
                    onClick={handleVolumeClick}
                  >
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={closePlayer}
                className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyPlayer;
