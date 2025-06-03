import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [genre, setGenre] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [goals, setGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoalToggle = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would send this data to the server
      // For now, we'll just mock it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in auth context (in a real app)
      // This would be done via an API call
      localStorage.setItem('tracktraxx_user', JSON.stringify({
        ...user,
        onboardingCompleted: true,
        genre,
        experience,
        goals
      }));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const genres = [
    'Electronic', 'Hip-Hop', 'Pop', 'Rock', 'R&B', 'Jazz',
    'Classical', 'Country', 'Folk', 'Metal', 'Indie', 'Other'
  ];
  
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting out in music production' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience, looking to improve' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced producer seeking professional insights' }
  ];
  
  const artistGoals = [
    'Improve mixing skills',
    'Get signed to a label',
    'Build a fanbase',
    'Release better quality music',
    'Get on playlists',
    'Connect with other artists',
    'Make music my full-time career',
    'Learn music theory',
    'Improve my workflow'
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">What genre of music do you create?</h3>
            <p className="text-muted-foreground">
              This helps us tailor our AI feedback to your specific style.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genres.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`py-3 px-4 rounded-md border text-left transition-all
                    ${genre === g 
                      ? 'border-primary bg-primary/10 text-foreground' 
                      : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">What's your experience level?</h3>
            <p className="text-muted-foreground">
              We'll adjust our feedback based on your experience.
            </p>
            
            <div className="space-y-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  className={`w-full py-4 px-4 rounded-md border text-left transition-all
                    ${experience === level.value 
                      ? 'border-primary bg-primary/10 text-foreground' 
                      : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setExperience(level.value)}
                >
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{level.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">What are your goals?</h3>
            <p className="text-muted-foreground">
              Select all that apply. This helps us prioritize our recommendations.
            </p>
            
            <div className="space-y-3">
              {artistGoals.map((goal) => (
                <label
                  key={goal}
                  className={`flex items-center p-3 rounded-md border cursor-pointer transition-all
                    ${goals.includes(goal) 
                      ? 'border-primary bg-primary/10 text-foreground' 
                      : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={goals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                  />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3
                    ${goals.includes(goal) 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-muted-foreground'
                    }`}
                  >
                    {goals.includes(goal) && (
                      <svg xmlns="http://www.w3.org/2000/svg\" className="h-3.5 w-3.5\" viewBox="0 0 20 20\" fill="currentColor">
                        <path fillRule="evenodd\" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center">
            <Music className="h-10 w-10 text-primary" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TrackTraxx
            </span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Welcome, {user?.artistName}!
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Let's set up your profile to get personalized feedback
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Genre</span>
                <span>Experience</span>
                <span>Goals</span>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                <div
                  style={{ width: `${(step / 3) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500 ease-in-out"
                ></div>
              </div>
            </div>
            
            {renderStepContent()}
            
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
              ) : (
                <div></div> // Empty div to maintain spacing
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                  disabled={
                    (step === 1 && !genre) ||
                    (step === 2 && !experience)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleComplete}
                  isLoading={isLoading}
                  disabled={goals.length === 0}
                >
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;