import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';

export interface PlayerTrack {
  id: string;
  name: string;
  artist?: string;
  coverUrl?: string;
  filePath?: string;
  urlSoundCloud?: string;
}

interface PlayerContextType {
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: PlayerTrack) => void;
  togglePlay: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  closePlayer: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync time updates from the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]);

  const playTrack = useCallback((track: PlayerTrack) => {
    const audio = audioRef.current;

    // If it's a SoundCloud-only track (no filePath), we store the track info
    // but the SoundCloud widget handles playback
    if (!track.filePath && track.urlSoundCloud) {
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      // Pause any native audio
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      return;
    }

    // Direct audio file
    if (track.filePath && audio) {
      // If same track, just resume
      if (currentTrack?.id === track.id && currentTrack?.filePath === track.filePath) {
        audio.play();
        setIsPlaying(true);
        return;
      }

      setCurrentTrack(track);
      audio.src = track.filePath;
      audio.volume = isMuted ? 0 : volume;
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [currentTrack, volume, isMuted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;

    // SoundCloud tracks are handled by the widget — we just toggle state
    if (currentTrack && !currentTrack.filePath && currentTrack.urlSoundCloud) {
      setIsPlaying(prev => !prev);
      return;
    }

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [isPlaying, currentTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setIsPlaying(false);
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && currentTrack?.filePath) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, [currentTrack]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    setIsMuted(false);
    const audio = audioRef.current;
    if (audio) audio.volume = vol;
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    setIsMuted(prev => {
      const next = !prev;
      if (audio) audio.volume = next ? 0 : volume;
      return next;
    });
  }, [volume]);

  const closePlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playTrack,
      togglePlay,
      pause,
      seek,
      setVolume,
      toggleMute,
      closePlayer,
      audioRef,
    }}>
      {children}
      {/* Hidden global audio element — persists across route changes */}
      <audio ref={audioRef} preload="auto" />
    </PlayerContext.Provider>
  );
}
