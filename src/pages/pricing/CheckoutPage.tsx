import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CreditCard, Check, Shield } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';
import { SubscriptionPlan } from '../../types';
import { useSubscription } from '../../context/SubscriptionContext';
import { trackEvent } from '../../utils/analytics';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const plan = location.state?.plan as SubscriptionPlan;
  const { upgradeSubscription } = useSubscription();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!plan) {
    // Redirect to pricing page if no plan was selected
    navigate('/pricing');
    return null;
  }

  // Track checkout started on mount (will fire once due to early return above)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useState(() => {
    trackEvent('checkout_started', { plan: plan.id, amount: plan.price });
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvc) {
      alert(t('checkout.validation_error'));
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Process payment (mock)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Upgrade subscription
      await upgradeSubscription(plan.id);

      trackEvent('checkout_completed', { plan: plan.id, amount: plan.price, paymentMethod });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment failed:', error);
      alert(t('checkout.payment_failed'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/pricing')}
            className="text-primary hover:text-primary/80 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('checkout.back_to_pricing')}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>
            
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">{t('checkout.payment_method')}</h2>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-3 rounded-md border ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  } flex-1`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className={`h-5 w-5 mr-2 ${
                    paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <span className={paymentMethod === 'card' ? 'text-foreground' : 'text-muted-foreground'}>
                    {t('checkout.credit_card')}
                  </span>
                </button>
                
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-3 rounded-md border ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/10'
                      : 'border-border'
                  } flex-1`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <svg
                    className={`h-5 w-5 mr-2 ${
                      paymentMethod === 'paypal' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                  </svg>
                  <span className={paymentMethod === 'paypal' ? 'text-foreground' : 'text-muted-foreground'}>
                    {t('checkout.paypal')}
                  </span>
                </button>
              </div>
              
              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                        {t('checkout.card_number')}
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        data-ph-no-capture
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                        {t('checkout.card_name')}
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        data-ph-no-capture
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                          {t('checkout.expiry_date')}
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium mb-1">
                          {t('checkout.cvc')}
                        </label>
                        <input
                          id="cvc"
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={3}
                          data-ph-no-capture
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      type="submit"
                      fullWidth
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      {isProcessing ? t('checkout.processing') : t('checkout.pay', { amount: plan.price })}
                    </Button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 mr-1" />
                    {t('checkout.secure_payment_msg')}
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <Button
                    type="button"
                    fullWidth
                    onClick={() => {
                      alert('PayPal integration would go here');
                    }}
                  >
                    {t('checkout.continue_paypal')}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Order summary */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg border border-border sticky top-8">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">{t('checkout.order_summary')}</h2>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">{t(`pricing.plans.${plan.id}.name`)} Plan</span>
                  <span>${plan.price}/{t(`pricing.${plan.interval}`)}</span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-6">
                  <ul className="space-y-2">
                    {(t(`pricing.plans.${plan.id}.features`, { returnObjects: true }) as string[]).map((feature, index) => (
                      <li key={index} className="flex">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t('checkout.total')}</span>
                    <span>${plan.price}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('checkout.billed_msg', { interval: t(`pricing.${plan.interval}`) })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;