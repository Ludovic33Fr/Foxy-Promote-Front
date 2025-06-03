import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubscriptionPlan, UserSubscription } from '../types';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  userSubscription: UserSubscription | null;
  availablePlans: SubscriptionPlan[];
  isLoading: boolean;
  upgradeSubscription: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  getCurrentPlan: () => SubscriptionPlan | undefined;
  getUploadLimit: () => number;
  getPromotionLimit: () => number;
  getRemainingUploads: () => number;
  getRemainingPromotions: () => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Mock subscription plans
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic AI feedback',
      '3 track uploads per month',
      '1 label submission per month',
      'Limited chat with AI coach'
    ],
    trackUploadsLimit: 3,
    promotionSubmissionsLimit: 1
  },
  {
    id: 'artist',
    name: 'Artist',
    price: 9.99,
    interval: 'month',
    features: [
      'Detailed AI feedback',
      '15 track uploads per month',
      '5 label submissions per month',
      'Unlimited chat with AI coach',
      'Priority support'
    ],
    trackUploadsLimit: 15,
    promotionSubmissionsLimit: 5,
    isPopular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    interval: 'month',
    features: [
      'Advanced AI feedback',
      'Unlimited track uploads',
      '15 label submissions per month',
      'Unlimited chat with AI coach',
      'Priority support',
      'Exclusive industry insights',
      'Personal growth tracking'
    ],
    trackUploadsLimit: 999,
    promotionSubmissionsLimit: 15
  }
];

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [availablePlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setUserSubscription(null);
        setIsLoading(false);
        return;
      }
      
      try {
        // Mock API call to get user subscription
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Demo subscription - would be from API in real app
        const mockSubscription: UserSubscription = {
          id: 'sub_' + Date.now(),
          userId: user.id,
          planId: 'free', // Default to free plan
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          trackUploadsUsed: 0,
          promotionSubmissionsUsed: 0
        };
        
        setUserSubscription(mockSubscription);
      } catch (error) {
        console.error('Failed to load subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  const upgradeSubscription = async (planId: string) => {
    if (!user) throw new Error('User must be logged in');
    
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update subscription in state
      setUserSubscription(prev => {
        if (!prev) return null;
        return {
          ...prev,
          planId,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user || !userSubscription) throw new Error('No active subscription');
    
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update subscription in state
      setUserSubscription(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'canceled'
        };
      });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPlan = () => {
    if (!userSubscription) return availablePlans[0]; // Default to free plan
    return availablePlans.find(plan => plan.id === userSubscription.planId);
  };

  const getUploadLimit = () => {
    const plan = getCurrentPlan();
    return plan?.trackUploadsLimit || 0;
  };

  const getPromotionLimit = () => {
    const plan = getCurrentPlan();
    return plan?.promotionSubmissionsLimit || 0;
  };

  const getRemainingUploads = () => {
    if (!userSubscription) return 0;
    const limit = getUploadLimit();
    return Math.max(0, limit - userSubscription.trackUploadsUsed);
  };

  const getRemainingPromotions = () => {
    if (!userSubscription) return 0;
    const limit = getPromotionLimit();
    return Math.max(0, limit - userSubscription.promotionSubmissionsUsed);
  };

  const value = {
    userSubscription,
    availablePlans,
    isLoading,
    upgradeSubscription,
    cancelSubscription,
    getCurrentPlan,
    getUploadLimit,
    getPromotionLimit,
    getRemainingUploads,
    getRemainingPromotions
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};