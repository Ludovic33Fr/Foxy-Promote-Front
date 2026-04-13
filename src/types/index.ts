export interface User {
  id: string;
  email: string;
  artistName: string;
  createdAt: string;
  profilePicture?: string;
  onboardingCompleted: boolean;
  artistId?: string;
}

export interface UserProfile extends User {
  genre?: string;
  experience?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  socialLinks?: {
    instagram?: string;
    soundcloud?: string;
    youtube?: string;
    spotify?: string;
  };
}

export interface Track {
  id: string;
  userId: string;
  title: string;
  uploadedAt: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration: number;
  status: 'analyzing' | 'analyzed' | 'error';
  genre?: string;
  bpm?: number;
  key?: string;
}

export interface Analysis {
  id: string;
  trackId: string;
  createdAt: string;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  technicalFeedback: {
    mixing: string;
    mastering: string;
    composition: string;
    arrangement: string;
  };
  marketingTips: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  trackId: string;
  messages: ChatMessage[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  trackUploadsLimit: number;
  promotionSubmissionsLimit: number;
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  currentPeriodEnd: string;
  trackUploadsUsed: number;
  promotionSubmissionsUsed: number;
}

export interface ConsentState {
  categories: ('essential' | 'analytics' | 'marketing')[];
  timestamp: string;
  version: string;
}