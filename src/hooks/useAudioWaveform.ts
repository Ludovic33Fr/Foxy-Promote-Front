import { useState, useEffect } from 'react';

/**
 * Hook to extract waveform peaks from an audio URL.
 * It decodes the audio data and calculates maximum amplitudes for a set number of bars.
 */
export const useAudioWaveform = (url: string | undefined, barCount: number = 100) => {
  const [peaks, setPeaks] = useState<number[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setPeaks([]);
      return;
    }

    let isCancelled = false;
    const fetchWaveform = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Use standard Web Audio API to decode
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        if (!isCancelled) {
          setDuration(audioBuffer.duration);
        }
        
        const channelData = audioBuffer.getChannelData(0); // Use first channel (usually left or mono)
        const samplesPerBar = Math.floor(channelData.length / barCount);
        const newPeaks: number[] = [];

        // Peak extraction logic
        for (let i = 0; i < barCount; i++) {
          let max = 0;
          const start = i * samplesPerBar;
          const end = Math.min(start + samplesPerBar, channelData.length);
          
          for (let j = start; j < end; j++) {
            const val = Math.abs(channelData[j]);
            if (val > max) max = val;
          }
          newPeaks.push(max);
        }

        // Normalize results to 10-100 range for nice UI bars
        const maxVal = Math.max(...newPeaks);
        const normalizedPeaks = maxVal > 0 
          ? newPeaks.map(p => Math.max(10, Math.min(100, (p / maxVal) * 95 + 5)))
          : Array(barCount).fill(10);

        if (!isCancelled) {
          setPeaks(normalizedPeaks);
        }
        
        // Cleanup AudioContext
        await audioContext.close();
      } catch (err) {
        if (!isCancelled) {
          console.error('Waveform generation error:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchWaveform();

    return () => {
      isCancelled = true;
    };
  }, [url, barCount]);

  return { peaks, duration, isLoading, error };
};
