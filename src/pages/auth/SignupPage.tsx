import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { trackEvent } from '../../utils/analytics';

const SignupPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [artistName, setArtistName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1000000000000-dummyicid.apps.googleusercontent.com';

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrors({});
    trackEvent('signup_started', { method: 'google' });
    if (credentialResponse.credential) {
      const success = await loginWithGoogle(credentialResponse.credential);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: t('auth.signup.errors.invalid') });
      }
    }
  };

  const handleGoogleError = () => {
    setErrors({ form: t('auth.signup.errors.invalid') });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!artistName) {
      newErrors.artistName = 'Artist name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      trackEvent('signup_started', { method: 'email' });
      await signup(email, password, artistName);
      trackEvent('signup_completed', { method: 'email' });
      navigate('/onboarding');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        form: t('auth.signup.errors.invalid'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center justify-center">
            <Music className="h-10 w-10 text-primary" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TrackTraxx
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            {t('auth.signup.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t('auth.signup.has_account')}{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              {t('auth.signup.login')}
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
            {errors.form && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
                {errors.form}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="artistName" className="block text-sm font-medium text-foreground">
                  {t('auth.signup.artist_name')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="artistName"
                    name="artistName"
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.artistName ? 'border-red-500' : 'border-border'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background`}
                    placeholder="Your artist name"
                  />
                </div>
                {errors.artistName && (
                  <p className="mt-1 text-sm text-red-600">{errors.artistName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  {t('auth.signup.email')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-border'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  {t('auth.signup.password')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-border'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {t('auth.signup.button')}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    {t('auth.login.or_continue')}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex justify-center">
                  <GoogleLogin 
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_blue"
                    shape="pill"
                    width="100%"
                  />
                </div>

                {import.meta.env.DEV && (
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                    <p className="text-xs text-orange-700 dark:text-orange-400 text-center font-bold">
                      DEV MODE: Use admin@foxypromote.com / admin123XXX! to bypass
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-center text-muted-foreground">
                {t('auth.signup.terms')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignupPage;