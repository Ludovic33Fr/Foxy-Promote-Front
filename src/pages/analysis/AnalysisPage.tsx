import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Clock, Music, BarChart, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import FeedbackSection from '../../components/analysis/FeedbackSection';
import ChatInterface from '../../components/analysis/ChatInterface';
import { Track, Analysis, ChatMessage } from '../../types';

const AnalysisPage = () => {
  const { t } = useTranslation();
  const { trackId } = useParams<{ trackId: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock API calls - would be replaced with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo track
        const mockTrack: Track = {
          id: trackId || '',
          userId: 'user123',
          title: 'Summer Vibes',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          audioUrl: 'https://example.com/audio1.mp3',
          thumbnailUrl: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          duration: 212,
          status: 'analyzed',
          genre: 'House',
          bpm: 128,
          key: 'A min'
        };
        
        // Demo analysis
        const mockAnalysis: Analysis = {
          id: 'analysis1',
          trackId: trackId || '',
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          overallScore: 72,
          strengths: [
            'Strong melodic hooks that are memorable and catchy',
            'Clean mix with good separation between elements',
            'Effective use of stereo field to create space',
            'Good energy progression throughout the track'
          ],
          improvements: [
            'Bass frequencies could be more controlled and defined',
            'Transition at 1:32 feels abrupt and could be smoother',
            'Vocal effects are inconsistent between sections',
            'Kick and bass relationship needs better definition'
          ],
          technicalFeedback: {
            mixing: 'The overall mix is clear but lacks low-end definition. Consider using sidechain compression between the kick and bass to create more space. High frequencies are well-balanced but could benefit from some subtle saturation for warmth.',
            mastering: 'The master is reasonably loud without excessive compression, but lacks the final polish of commercial releases. The stereo image could be wider, and the bass frequencies need more control to translate well across different systems.',
            composition: 'Strong melodic ideas with good variation. The chord progression is effective but could benefit from more variation in the second half to maintain interest. Consider adding a contrasting bridge section.',
            arrangement: 'Good overall structure, but the breakdown at 2:15 feels too long and loses momentum. The build-up elements could be introduced more gradually for a smoother transition into the drop.'
          },
          marketingTips: [
            'This track would appeal to summer festival playlists - focus promotion efforts there',
            'The catchy melody is perfect for short-form social media content like TikTok or Instagram Reels',
            'Consider reaching out to DJs who play similar melodic house tracks',
            'The track\'s energy makes it a good candidate for sync licensing in advertisements'
          ]
        };
        
        // Demo chat messages
        const mockMessages: ChatMessage[] = [
          {
            id: 'msg1',
            sender: 'ai',
            content: 'Hi there! I\'ve analyzed your track "Summer Vibes" and have some feedback for you. What specific aspects would you like to discuss?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'msg2',
            sender: 'user',
            content: 'Can you tell me more about the mixing issues you mentioned with the bass?',
            timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'msg3',
            sender: 'ai',
            content: 'Of course! The bass in your track has good tone, but it\'s competing with the kick drum in the 80-120Hz range, causing some muddiness. Here are some suggestions:\n\n1. Use sidechain compression on the bass triggered by the kick to create more space\n2. Apply a high-pass filter around 30Hz to remove sub frequencies that aren\'t audible but can cause phase issues\n3. Consider using multiband compression focused on the 80-120Hz range to control peaks\n4. Add some subtle saturation to help the bass cut through on smaller speakers\n\nWould you like me to elaborate on any of these techniques?',
            timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setTrack(mockTrack);
        setAnalysis(mockAnalysis);
        setMessages(mockMessages);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trackId]);

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    
    // Simulate AI thinking and responding
    setIsAiTyping(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        content: generateAIResponse(content),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsAiTyping(false);
    }
  };
  
  // Mock AI response generator
  const generateAIResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('mix') || lowercaseMessage.includes('mixing')) {
      return "Looking at your mix, I noticed a few things that could be improved:\n\n1. The vocal sits nicely in the midrange, but could use a bit more presence around 5kHz\n2. The reverb on the synths is slightly too wet, making the mix feel distant\n3. Try using parallel compression on your drums to maintain dynamics while increasing power\n\nWould you like me to explain any of these in more detail?";
    } else if (lowercaseMessage.includes('master') || lowercaseMessage.includes('mastering')) {
      return "For mastering this track, I'd recommend:\n\n1. A gentle multi-band compression to tighten the overall sound\n2. A subtle limiter targeting no more than 2-3dB of gain reduction\n3. A final EQ to boost around 10kHz for some air and sparkle\n\nThe current master is a bit quiet compared to commercial releases. Aim for an integrated LUFS of around -14 to -12 for streaming platforms.";
    } else if (lowercaseMessage.includes('arrangement') || lowercaseMessage.includes('structure')) {
      return "The arrangement has a good flow, but I have a few suggestions:\n\n1. The intro is a bit long at 32 bars - consider cutting it to 16 bars\n2. Add a short break around 2:15 to create more contrast before the final section\n3. The outro fades too quickly - extend it by 8 bars with a more gradual decay\n\nOverall, the energy curve works well, but these tweaks could make it more engaging for listeners.";
    } else {
      return "That's a great question! Based on my analysis of your track, I'd suggest focusing on enhancing the melodic elements while maintaining the strong groove you've established. The current sound has potential, but could benefit from more dynamic contrast between sections.\n\nIs there a specific area of production you'd like more detailed feedback on?";
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">{t('analysis.coach.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!track || !analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">{t('dashboard.empty.title')}</h2>
            <p className="text-muted-foreground mt-2">
              {t('dashboard.empty.desc')}
            </p>
            <Link to="/dashboard" className="mt-4 inline-block">
              <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
                {t('analysis.back_to_dashboard')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="text-primary hover:text-primary/80 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('analysis.back_to_dashboard')}
          </Link>
        </div>
        
        {/* Track header */}
        <div className="flex flex-col md:flex-row bg-card rounded-lg border border-border overflow-hidden mb-8">
          <div className="md:w-1/3 relative">
            <img 
              src={track.thumbnailUrl || 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
              alt={track.title} 
              className="w-full h-full object-cover min-h-[200px]"
            />
            <button 
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-16 w-16 text-white" />
              ) : (
                <Play className="h-16 w-16 text-white" />
              )}
            </button>
          </div>
          
          <div className="p-6 md:w-2/3">
            <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {formatDuration(track.duration)}
              </div>
              
              {track.genre && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Music className="h-4 w-4 mr-1" />
                  {track.genre}
                </div>
              )}
              
              {track.bpm && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <BarChart className="h-4 w-4 mr-1" />
                  {track.bpm} BPM
                </div>
              )}
              
              {track.key && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-1 text-xs font-mono bg-muted px-1.5 py-0.5 rounded">♯</span>
                  {track.key}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary"
                  style={{ width: '35%' }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0:00</span>
                <span>{formatDuration(track.duration)}</span>
              </div>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<Share2 className="h-4 w-4" />}
              >
                {t('footer.contact')}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback section - takes up 2/3 on large screens */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">{t('analysis.title')}</h2>
            <FeedbackSection analysis={analysis} />
          </div>
          
          {/* Chat interface - takes up 1/3 on large screens */}
          <div className="lg:col-span-1 h-[600px]">
            <ChatInterface 
              messages={messages}
              onSendMessage={handleSendMessage}
              isAiTyping={isAiTyping}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisPage;