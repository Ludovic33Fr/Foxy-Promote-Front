import { useState } from 'react';
import { Check } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import PricingCard from '../../components/pricing/PricingCard';
import { useSubscription } from '../../context/SubscriptionContext';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const { availablePlans } = useSubscription();
  
  const getDiscountPercentage = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12;
    const yearlyTotal = yearlyPrice;
    const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
    return Math.round(discount);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground">
            Unlock the full potential of your music with our premium features.
            Start free and upgrade as you grow.
          </p>
        </div>
        
        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-card rounded-lg p-1 border border-border inline-flex">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'month'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setBillingPeriod('month')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'year'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setBillingPeriod('year')}
            >
              Yearly <span className="text-xs opacity-80">Save 20%</span>
            </button>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {availablePlans
            .filter(plan => plan.interval === billingPeriod)
            .map(plan => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
        </div>
        
        {/* Feature comparison */}
        <div className="mt-16 bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Compare Plan Features</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="py-4 px-6 text-left font-medium">Feature</th>
                  <th className="py-4 px-6 text-center font-medium">Free</th>
                  <th className="py-4 px-6 text-center font-medium">Artist</th>
                  <th className="py-4 px-6 text-center font-medium">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-6 font-medium">Track Uploads</td>
                  <td className="py-4 px-6 text-center">3/month</td>
                  <td className="py-4 px-6 text-center">15/month</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Label Submissions</td>
                  <td className="py-4 px-6 text-center">1/month</td>
                  <td className="py-4 px-6 text-center">5/month</td>
                  <td className="py-4 px-6 text-center">15/month</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">AI Feedback Detail Level</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Detailed</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">AI Coach Chat</td>
                  <td className="py-4 px-6 text-center">Limited</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Priority Support</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Industry Insights</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Growth Tracking</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access to your plan features until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">How do label submissions work?</h3>
              <p className="text-muted-foreground">
                When you submit a track, we match it with labels and curators in our network based on genre, quality, and commercial potential. If there's interest, we'll connect you directly.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">What kind of feedback will I get?</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your track and provides feedback on mixing, mastering, composition, arrangement, and more. Higher tier plans offer more detailed feedback and personalized recommendations.
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">Is there a free trial for premium plans?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 7-day free trial for both Artist and Pro plans. You won't be charged until the trial period ends, and you can cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;