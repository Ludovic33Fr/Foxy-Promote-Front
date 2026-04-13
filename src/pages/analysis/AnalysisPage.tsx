import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, Clock, Music, BarChart, 
  Share2, Zap, TrendingUp, Target, ListMusic, 
  CheckCircle2, AlertCircle, Lightbulb, Youtube,
  Compass, Layout, ExternalLink, MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import ChatInterface from '../../components/analysis/ChatInterface';
import AnalysisMicroFeedback from '../../components/analysis/AnalysisMicroFeedback';
import { fetchSong } from '../../services/api';
import { ChatMessage } from '../../types';
import { trackEvent } from '../../utils/analytics';
import { recordFirstAnalysis } from '../../hooks/useNpsTrigger';

const AnalysisPage = () => {
  const { t } = useTranslation();
  const { trackId } = useParams<{ trackId: string }>();
  const [song, setSong] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!trackId) return;
      try {
        setIsLoading(true);
        const data = await fetchSong(trackId);
        setSong(data);
        trackEvent('analysis_viewed', {
          trackId,
          score: data.advice?.strategicEvaluation?.globalScore,
        });
        recordFirstAnalysis();

        // Initial AI message
        const initialMsg: ChatMessage = {
          id: 'initial',
          sender: 'ai',
          content: `Bonjour ! J'ai terminé l'analyse de votre morceau "${data.name}". Que souhaitez-vous approfondir ? Je peux vous aider sur l'aspect technique, stratégique ou même vos idées de contenu TikTok.`,
          timestamp: new Date().toISOString()
        };
        setMessages([initialMsg]);
      } catch (error) {
        console.error('Failed to fetch song analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trackId]);

  const handleSendMessage = async (content: string) => {
    trackEvent('chat_message_sent', { trackId, messageLength: content.length });
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);
    
    try {
      // simulate API/AI delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        content: `C'est une excellente question sur "${song?.name}". Sur la base de mon analyse, je vous conseille de porter une attention particulière à la transition à ${song?.advice?.musicalAnalysis?.structure?.[1]?.timecode || '1:30'}. N'oubliez pas que votre potentiel viral est de ${song?.advice?.tiktokPotential?.viralScore || 90}%, ce qui est exceptionnel !`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsAiTyping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-muted-foreground animate-pulse text-lg font-medium">Chargement de votre analyse premium...</p>
        </div>
      </div>
    );
  }

  if (!song || !song.advice) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-card p-10 rounded-2xl border border-border inline-block max-w-lg">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Analyse non trouvée</h2>
            <p className="text-muted-foreground mb-6">Désolé, nous n'avons pas pu récupérer les détails de cette analyse.</p>
            <Link to="/dashboard">
              <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>Retour au tableau de bord</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const advice = song.advice;
  const analysis = advice.musicalAnalysis;
  const strategic = advice.strategicEvaluation;
  const tiktok = advice.tiktokPotential;
  const positioning = advice.artistPositioning;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <Link to="/dashboard" className="text-primary hover:text-primary/80 inline-flex items-center font-medium transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Retour à mes titres
          </Link>
        </div>

        {/* Header de la Musique */}
        <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-2xl mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50"></div>
          <div className="relative flex flex-col lg:flex-row">
            <div className="lg:w-1/3 relative h-[300px] lg:h-auto overflow-hidden">
              <img 
                src={song.urlPicture || 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                alt={song.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/20 backdrop-blur-md rounded-full p-6 text-white hover:scale-110 transition-transform shadow-2xl"
                >
                  {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
                </button>
              </div>
            </div>
            
            <div className="p-8 lg:w-2/3 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {song.name}
                  </h1>
                  <p className="text-primary font-semibold text-lg">{analysis.technicalCharacteristics.primaryStyle}</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-4xl font-black text-primary drop-shadow-sm">{strategic.globalScore}</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global Score</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-background/50 backdrop-blur-sm p-3 rounded-2xl border border-border/50">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Key</div>
                  <div className="font-bold flex items-center">
                    <Music className="h-4 w-4 mr-2 text-primary" />
                    {analysis.technicalCharacteristics.musicalKey}
                  </div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm p-3 rounded-2xl border border-border/50">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tempo</div>
                  <div className="font-bold flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {analysis.technicalCharacteristics.bpm} BPM
                  </div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm p-3 rounded-2xl border border-border/50">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Durée</div>
                  <div className="font-bold">{analysis.technicalCharacteristics.totalDuration}</div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm p-3 rounded-2xl border border-border/50">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Energie</div>
                  <div className="font-bold truncate text-[13px]">{analysis.technicalCharacteristics.energyCurve.split(' – ')[0]}</div>
                </div>
              </div>

              <div className="flex gap-4">
                 <Button leftIcon={<Share2 className="h-4 w-4" />} data-attr="btn-share">Partager</Button>
                 <Button variant="outline" leftIcon={<Youtube className="h-4 w-4" />} data-attr="btn-video-preview">Video Preview</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Section 1: Analyse Musicale & Structure */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-bold">Analyse Musicale & Structure</h2>
              </div>
              <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                   <div>
                     <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Caractéristiques</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">Style Primaire</p>
                          <p className="text-muted-foreground text-sm">{analysis.technicalCharacteristics.primaryStyle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Soutien BPM</p>
                          <p className="text-muted-foreground text-[13px] italic">"{analysis.technicalCharacteristics.bpmJustification}"</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Références Artistiques</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {analysis.technicalCharacteristics.artisticReferences.map((ref: string) => (
                              <span key={ref} className="bg-primary/5 text-primary text-[11px] px-2 py-1 rounded-lg border border-primary/10 font-bold">{ref}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                   </div>
                   <div>
                     <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Structure Narrative</h3>
                     <div className="relative pl-6 border-l-2 border-muted space-y-6">
                       {analysis.structure.map((item: any, idx: number) => (
                         <div key={idx} className="relative">
                            <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-4 border-background shadow-sm"></div>
                            <div className="text-xs font-bold text-primary mb-1">{item.timecode}</div>
                            <p className="text-sm font-bold leading-none mb-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground italic">{item.emotionalFunction}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
              </div>
              <AnalysisMicroFeedback section="musical" trackId={trackId || ''} />
            </section>

            {/* Section 2: Évaluation Stratégique */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-secondary rounded-full"></div>
                    <h2 className="text-2xl font-bold">Évaluation Stratégique</h2>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Justifications */}
                 <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-white shadow-lg space-y-6">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                      <div className="text-xs font-black uppercase tracking-widest opacity-70 mb-2 flex items-center">
                        <Zap className="h-3 w-3 mr-1" /> Justification Artistique
                      </div>
                      <p className="text-sm font-medium">{strategic.artisticJustification}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                    <div className="text-xs font-black uppercase tracking-widest opacity-70 mb-2 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" /> Justification Commerciale
                      </div>
                      <p className="text-sm font-medium">{strategic.commercialJustification}</p>
                    </div>
                 </div>

                 {/* Focus Zones */}
                 <div className="space-y-4">
                    {/* Melody */}
                    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                       <div className="flex items-center gap-2 mb-3">
                         <div className="bg-primary/10 p-2 rounded-lg"><Music className="h-4 w-4 text-primary" /></div>
                         <h4 className="font-bold">Mélodie</h4>
                       </div>
                       <div className="space-y-2">
                          {strategic.melody.strengths.map((s: string) => (
                            <div key={s} className="flex gap-2 text-[13px] text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> {s}
                            </div>
                          ))}
                          {strategic.melody.actionableAdvice.map((a: string) => (
                            <div key={a} className="flex gap-2 text-[13px] text-primary font-medium italic">
                              <Lightbulb className="h-4 w-4 shrink-0" /> {a}
                            </div>
                          ))}
                       </div>
                    </div>
                    {/* Mixing */}
                    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                         <div className="bg-secondary/10 p-2 rounded-lg"><BarChart className="h-4 w-4 text-secondary" /></div>
                         <h4 className="font-bold">Mixage</h4>
                       </div>
                       <p className="text-[12px] text-muted-foreground mb-2"><strong>Spatialisation :</strong> {strategic.mixing.spatialization}</p>
                       <div className="space-y-1">
                          {strategic.mixing.optimizations.map((o: string) => (
                            <div key={o} className="flex gap-2 text-[12px] text-secondary font-semibold">
                              <Zap className="h-3.5 w-3.5 shrink-0" /> {o}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
              <AnalysisMicroFeedback section="strategic" trackId={trackId || ''} />
            </section>

            {/* Section 3: TikTok Potential */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-accent rounded-full"></div>
                <h2 className="text-2xl font-bold">Potentiel Viral TikTok</h2>
              </div>
              <div className="bg-black text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] -mr-32 -mt-32"></div>
                 
                 <div className="flex flex-col md:flex-row gap-10 relative z-10">
                   <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/10 shrink-0">
                      <div className="text-5xl font-black text-accent mb-1">{tiktok.viralScore}%</div>
                      <div className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Viral Probability</div>
                   </div>
                   
                   <div className="flex-1 space-y-6">
                      <div>
                        <h4 className="text-sm font-black uppercase text-accent mb-2">Pourquoi ça marche ?</h4>
                        <p className="text-zinc-300 leading-relaxed font-medium">{tiktok.whyItWorks}</p>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-accent px-2 py-0.5 border border-accent/30 rounded-full">Segment Viral</span>
                          <span className="text-xs font-mono font-bold">{tiktok.viralSegment.timecode}</span>
                        </div>
                        <p className="text-sm text-zinc-400 italic">"{tiktok.viralSegment.explanation}"</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex gap-3">
                           <Layout className="h-5 w-5 text-accent shrink-0" />
                           <div>
                             <p className="text-[11px] font-bold text-zinc-500 uppercase">Format Idéal</p>
                             <p className="text-[13px] font-bold">{tiktok.videoFormatIdea}</p>
                           </div>
                         </div>
                         <div className="flex gap-3">
                           <TrendingUp className="h-5 w-5 text-accent shrink-0" />
                           <div>
                             <p className="text-[11px] font-bold text-zinc-500 uppercase">Action TikTok</p>
                             <p className="text-[13px] font-bold italic">"{tiktok.optimizations[0]}"</p>
                           </div>
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
              <AnalysisMicroFeedback section="tiktok" trackId={trackId || ''} />
            </section>

          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Colonne Droite: Strategie & Chat */}
            <div className="sticky top-24 space-y-8">
               
               {/* Artist Positioning */}
               <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-border p-6 shadow-xl">
                 <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <Compass className="h-5 w-5 text-primary" /> Strategie de Sortie
                 </h2>
                 
                 <div className="space-y-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" /> Audience Cible
                      </p>
                      <p className="text-[13px] font-medium p-3 bg-muted rounded-xl">{positioning.targetAudience}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <ListMusic className="h-4 w-4" /> Playlists Focus
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {positioning.targetPlaylists.map((p: string) => (
                          <div key={p} className="text-[12px] font-bold bg-muted px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-default border border-transparent hover:border-primary/20">
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" /> Labels Recommandés
                      </p>
                      <div className="space-y-2">
                        {positioning.suitableLabels.map((l: string) => (
                          <div key={l} className="flex items-center justify-between text-[13px] font-bold p-2 bg-muted/30 rounded-lg">
                            {l} <ArrowLeft className="h-3 w-3 rotate-180 opacity-30" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-muted">
                      <p className="text-[13px] font-bold text-primary mb-2 italic">Marketing Storytelling</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{positioning.releaseStrategy.storytelling}</p>
                    </div>
                 </div>
               </div>

               {/* Chat Interface Section */}
               <div className="h-[500px] flex flex-col bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
                 <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                       <h3 className="font-bold text-sm">IA A&R Coach</h3>
                    </div>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                 </div>
                 <ChatInterface 
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isAiTyping={isAiTyping}
                 />
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisPage;