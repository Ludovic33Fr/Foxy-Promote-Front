import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Music className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TrackTraxx
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                  ${isActive('/') 
                    ? 'border-b-2 border-primary text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t('nav.home')}
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    data-attr="nav-dashboard"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                      ${isActive('/dashboard')
                        ? 'border-b-2 border-primary text-foreground'
                        : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    to="/promotion"
                    data-attr="nav-promotion"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                      ${isActive('/promotion')
                        ? 'border-b-2 border-primary text-foreground'
                        : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t('nav.promotion')}
                  </Link>
                </>
              )}
              
              <Link
                to="/pricing"
                data-attr="nav-pricing"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                  ${isActive('/pricing')
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t('nav.pricing')}
              </Link>
            </div>
          </div>
          
          {/* Auth Buttons - Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center">
                  <div className="relative group">
                    <button 
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      id="user-menu-button"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary">
                          {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.artistName} className="w-full h-full object-cover" />
                          ) : (
                            user?.artistName?.charAt(0).toUpperCase() || "U"
                          )}
                        </div>
                        <span className="ml-2 text-sm font-medium text-foreground">
                          {user?.artistName}
                        </span>
                        <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/profile"
                        data-attr="nav-profile"
                        className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {t('nav.profile')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        data-attr="nav-logout"
                        className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="outline">{t('nav.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button>{t('nav.signup')}</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-muted-foreground hover:bg-muted"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              isActive('/')
                ? 'bg-primary/10 border-l-4 border-primary text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.home')}
          </Link>
          
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                data-attr="nav-dashboard"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-primary/10 border-l-4 border-primary text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/promotion"
                data-attr="nav-promotion"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive('/promotion')
                    ? 'bg-primary/10 border-l-4 border-primary text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.promotion')}
              </Link>
            </>
          )}
          
          <Link
            to="/pricing"
            data-attr="nav-pricing"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              isActive('/pricing')
                ? 'bg-primary/10 border-l-4 border-primary text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.pricing')}
          </Link>
        </div>
        
        {/* Mobile auth buttons */}
        <div className="pt-4 pb-3 border-t border-border">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-primary">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.artistName} className="w-full h-full object-cover" />
                    ) : (
                      user?.artistName?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">
                    {user?.artistName}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  data-attr="nav-profile"
                  className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  data-attr="nav-logout"
                  className="block w-full text-left px-4 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {t('nav.logout')}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1 px-4">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center text-base font-medium rounded-md border border-border text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/signup"
                className="mt-2 block w-full px-4 py-2 text-center text-base font-medium rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;