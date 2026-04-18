import { useMemo, useRef, useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Music, Layout, MapPin, Loader2 } from 'lucide-react';
import { useAudioWaveform } from '../../hooks/useAudioWaveform';
import { getAudioStreamUrl } from '../../services/api';

interface StructurePoint {
  timecode: string;
  name: string;
  emotionalFunction: string;
}

interface WaveformVisualizerProps {
  structure: StructurePoint[];
  totalDuration: string; // "3:45" format
  trackId?: string;
}

function timeToSeconds(time: string): number {
  if (!time) return 0;
  const digits = time.match(/\d+/g);
  if (!digits || digits.length === 0) return 0;
  if (digits.length >= 2) {
    return parseInt(digits[0], 10) * 60 + parseInt(digits[1], 10);
  }
  return parseInt(digits[0], 10);
}

const WaveformVisualizer = ({ structure, totalDuration, trackId }: WaveformVisualizerProps) => {
  const { currentTime, duration, isPlaying, seek, currentTrack } = usePlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const audioUrl = useMemo(() => trackId ? getAudioStreamUrl(trackId) : undefined, [trackId]);
  const { peaks, duration: audioDuration, isLoading: peaksLoading } = useAudioWaveform(audioUrl);

  const isPlayingCurrent = currentTrack?.id === trackId;
  const realDuration = audioDuration || (isPlayingCurrent ? duration : 0);
  const totalSecs = realDuration || timeToSeconds(totalDuration) || 1;
  const currentProgress = isPlayingCurrent ? (currentTime / totalSecs) * 100 : 0;
  const displayTime = isPlayingCurrent ? currentTime : 0;

  // Fallback bars generation if real peaks are not available
  const fallbackBars = useMemo(() => {
    const seed = structure.length > 0 ? structure[0].name.length : 10;
    const barCount = 100;
    const result = [];
    for (let i = 0; i < barCount; i++) {
      const baseHeight = Math.sin(i * 0.2) * 20 + 40;
      const noise = Math.abs(Math.sin(i * seed * 0.5)) * 30;
      result.push(Math.max(10, Math.min(100, baseHeight + noise)));
    }
    return result;
  }, [structure]);

  const bars = peaks.length > 0 ? peaks : fallbackBars;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    setHoverTime(ratio * totalSecs);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    seek(ratio * totalSecs);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 mb-12">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Layout className="h-4 w-4" /> Spectrogramme & Structure
        </h3>
        <div className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border">
          {formatTime(displayTime)} / {formatTime(totalSecs)}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-32 bg-card rounded-3xl border border-border/50 shadow-inner overflow-hidden cursor-pointer group p-6 backdrop-blur-sm"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
        onClick={handleClick}
      >
        {/* The Waveform - Animated and Interactive */}
        <div className="absolute inset-x-6 bottom-6 top-6 flex items-end gap-[2px]">
          {peaksLoading ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : null}
          {bars.map((height, i) => {
            const barProgress = (i / bars.length) * 100;
            const isActive = barProgress <= currentProgress;
            const isHovered = hoverTime !== null && barProgress <= (hoverTime / totalSecs) * 100;

            return (
              <div 
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-300 ${peaksLoading ? 'opacity-20 animate-pulse' : ''}`}
                style={{ 
                  height: `${height}%`,
                  backgroundColor: isActive 
                    ? 'var(--primary-color, #7c3aed)' 
                    : isHovered 
                      ? 'rgba(124, 58, 237, 0.4)'
                      : 'rgba(124, 58, 237, 0.1)'
                }}
              />
            );
          })}
        </div>

        {/* Narrative Structure Markers */}
        <div className="absolute inset-x-6 top-1 pointer-events-none h-full">
          {structure.map((point, idx) => {
            const pointSecs = timeToSeconds(point.timecode);
            const position = (pointSecs / totalSecs) * 100;
            if (position > 100) return null;

            const isPassed = isPlayingCurrent && pointSecs <= currentTime;

            return (
              <div 
                key={idx}
                className="absolute h-full flex flex-col items-center"
                style={{ left: `${position}%` }}
              >
                {/* Marker Line */}
                <div className={`w-[1px] h-full ${isPassed ? 'bg-primary' : 'bg-border'} z-20`}></div>
                
                {/* Marker Info - Hidden by default, visible on hover container */}
                <div className="absolute top-0 -translate-y-[8px] flex flex-col items-center">
                   <div className={`w-3 h-3 rounded-full border-2 border-background shadow-sm ${isPassed ? 'bg-primary scale-110 shadow-primary/30' : 'bg-muted'}`}></div>
                   <div className="mt-2 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-border/50 opacity-40 group-hover:opacity-100 transition-opacity">
                     {point.name}
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Playback Indicator (Vertical line) */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-white to-primary shadow-[0_0_10px_rgba(124,58,237,0.5)] z-30 transition-all duration-100 pointer-events-none"
          style={{ left: `calc(${currentProgress}% + 24px - ((${currentProgress}/100) * 48px))` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full blur-[4px] opacity-50"></div>
        </div>

        {/* Hover Tip */}
        {hoverTime !== null && (
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-white/20 border-r border-dashed border-white/40 pointer-events-none"
            style={{ left: `calc(${(hoverTime / totalSecs) * 100}% + 24px - ((${ (hoverTime / totalSecs) * 100}/100) * 48px))` }}
          >
            <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-zinc-900/90 text-[10px] font-mono p-1 rounded border border-white/10 text-white z-40">
              {formatTime(hoverTime)}
            </div>
          </div>
        )}
      </div>
      
      {/* Legend / Quick Labels */}
      <div className="flex gap-4 flex-wrap px-1">
        {structure.filter((_, i) => i % 2 === 0 || structure.length < 8).map((point, idx) => (
          <div key={idx} className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-help">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest">{point.name}</span>
            <span className="text-[10px] font-mono font-medium">{point.timecode}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaveformVisualizer;
