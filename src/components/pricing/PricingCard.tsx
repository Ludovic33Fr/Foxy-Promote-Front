import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { SubscriptionPlan } from '../../types';
import { useSubscription } from '../../context/SubscriptionContext';

interface PricingCardProps {
  plan: SubscriptionPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  const { userSubscription } = useSubscription();
  const isCurrentPlan = userSubscription?.planId === plan.id;
  
  return (
    <div className={`
      bg-card rounded-lg overflow-hidden border border-border shadow-sm 
      transition-all duration-300 hover:shadow-md hover:border-primary/30
      ${plan.isPopular ? 'ring-2 ring-primary' : ''}
      relative`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-extrabold">${plan.price}</span>
          <span className="ml-1 text-muted-foreground text-sm">/{plan.interval}</span>
        </div>
        
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
          {isCurrentPlan ? (
            <Button
              variant="outline"
              fullWidth
              disabled
            >
              Current Plan
            </Button>
          ) : (
            <Link to={plan.price > 0 ? "/checkout" : "#"} state={{ plan }}>
              <Button
                variant={plan.price > 0 ? "primary" : "outline"}
                fullWidth
              >
                {plan.price > 0 ? "Upgrade" : "Free to Use"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;