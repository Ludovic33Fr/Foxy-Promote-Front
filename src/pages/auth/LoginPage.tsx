import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Music, Mail, Lock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1000000000000-dummyicid.apps.googleusercontent.com';

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    if (credentialResponse.credential) {
      const success = await loginWithGoogle(credentialResponse.credential);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(t('auth.login.errors.invalid'));
      }
    }
  };

  const handleGoogleError = () => {
    setError(t('auth.login.errors.invalid'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('auth.login.errors.required'));
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(t('auth.login.errors.invalid'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('auth.login.errors.invalid'));
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
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t('auth.login.no_account')}{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
              {t('auth.login.signup')}
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  {t('auth.login.email')}
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
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  {t('auth.login.password')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary/50 border-border rounded bg-background"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    {t('auth.login.remember')}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    {t('auth.login.forgot')}
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {t('auth.login.button')}
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
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;