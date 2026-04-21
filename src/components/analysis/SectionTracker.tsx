import { useEffect, useRef, ReactNode } from 'react';
import { track, AnalysisSection } from '../../utils/analytics';

interface SectionTrackerProps {
  trackId: string | undefined;
  section: AnalysisSection;
  children: ReactNode;
  threshold?: number;
}

const SectionTracker = ({ trackId, section, children, threshold = 0.4 }: SectionTrackerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || firedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            track('analysis_section_expanded', { trackId, section });
            observer.disconnect();
            break;
          }
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [trackId, section, threshold]);

  return <div ref={ref}>{children}</div>;
};

export default SectionTracker;
