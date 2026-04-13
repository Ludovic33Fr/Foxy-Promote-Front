import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    trackEvent('language_switched', { fromLang: i18n.resolvedLanguage, toLang: lng });
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group inline-block">
      <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md p-1">
        <Globe className="h-5 w-5 mr-1" />
        <span className="uppercase">{i18n.resolvedLanguage || 'en'}</span>
      </button>
      
      {/* Dropdown menu */}
      <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => changeLanguage('en')}
          className={`block w-full text-left px-4 py-2 text-sm ${
            i18n.resolvedLanguage === 'en' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('fr')}
          className={`block w-full text-left px-4 py-2 text-sm ${
            i18n.resolvedLanguage === 'fr' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          Français
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
