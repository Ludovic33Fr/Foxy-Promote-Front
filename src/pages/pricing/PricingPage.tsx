import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import PricingCard from '../../components/pricing/PricingCard';
import { useSubscription } from '../../context/SubscriptionContext';

const PricingPage = () => {
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const { availablePlans } = useSubscription();
  
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('pricing.subtitle')}
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
              {t('pricing.monthly')}
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'year'
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setBillingPeriod('year')}
            >
              {t('pricing.yearly')} <span className="text-xs opacity-80">{t('pricing.save', { percent: 20 })}</span>
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
            <h2 className="text-xl font-semibold">{t('pricing.compare')}</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="py-4 px-6 text-left font-medium">{t('pricing.feature')}</th>
                  <th className="py-4 px-6 text-center font-medium">{t('pricing.plan_free')}</th>
                  <th className="py-4 px-6 text-center font-medium">{t('pricing.plan_artist')}</th>
                  <th className="py-4 px-6 text-center font-medium">{t('pricing.plan_pro')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-6 font-medium">{t('pricing.features.uploads')}</td>
                  <td className="py-4 px-6 text-center">3/month</td>
                  <td className="py-4 px-6 text-center">15/month</td>
                  <td className="py-4 px-6 text-center">{t('pricing.features.values.unlimited')}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">{t('pricing.features.submissions')}</td>
                  <td className="py-4 px-6 text-center">1/month</td>
                  <td className="py-4 px-6 text-center">5/month</td>
                  <td className="py-4 px-6 text-center">15/month</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">{t('pricing.features.feedback')}</td>
                  <td className="py-4 px-6 text-center">{t('pricing.features.values.basic')}</td>
                  <td className="py-4 px-6 text-center">{t('pricing.features.values.detailed')}</td>
                  <td className="py-4 px-6 text-center">{t('pricing.features.values.advanced')}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">{t('pricing.features.chat')}</td>
                  <td className="py-4 px-6 text-center">{t('pricing.features.values.limited')}</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">{t('pricing.features.support')}</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">{t('pricing.features.insights')}</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">{t('pricing.features.growth')}</td>
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
          <h2 className="text-2xl font-bold text-center mb-8">{t('pricing.faq.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">{t('pricing.faq.q1')}</h3>
              <p className="text-muted-foreground">
                {t('pricing.faq.a1')}
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">{t('pricing.faq.q2')}</h3>
              <p className="text-muted-foreground">
                {t('pricing.faq.a2')}
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">{t('pricing.faq.q3')}</h3>
              <p className="text-muted-foreground">
                {t('pricing.faq.a3')}
              </p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-3">{t('pricing.faq.q4')}</h3>
              <p className="text-muted-foreground">
                {t('pricing.faq.a4')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;