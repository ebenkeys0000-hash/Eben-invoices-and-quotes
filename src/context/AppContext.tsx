import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Organization, Subscription, Language } from '../types';
import { storage } from '../services/storage';
import { translations } from '../i18n/translations';

export type NavTab = 
  | 'dashboard'
  | 'invoices'
  | 'quotes'
  | 'customers'
  | 'products'
  | 'payments'
  | 'team'
  | 'settings'
  | 'superAdmin'
  | 'storePublication';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  organization: Organization;
  updateOrganization: (org: Partial<Organization>) => void;
  subscription: Subscription;
  refreshSubscription: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['fr'];
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  viewMode: 'mobile' | 'web';
  setViewMode: (mode: 'mobile' | 'web') => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOnline: boolean;
  setIsOnlineManual: (online: boolean) => void;
  syncStatus: 'synced' | 'syncing' | 'offline';
  triggerManualSync: () => Promise<void>;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  allUsers: User[];
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(storage.getCurrentUser());
  const [organization, setOrganizationState] = useState<Organization>(storage.getOrganization());
  const [subscription, setSubscriptionState] = useState<Subscription>(storage.getSubscription());
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('eben_language') as Language) || 'fr';
  });
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('eben_theme') as 'dark' | 'light') || 'dark';
  });
  const [viewMode, setViewModeState] = useState<'mobile' | 'web'>('mobile');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOnline, setIsOnlineState] = useState<boolean>(storage.isEffectivelyOnline());
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>(() => {
    return storage.isEffectivelyOnline() ? 'synced' : 'offline';
  });
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>(storage.getUsers());

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setCurrentUserState(storage.getCurrentUser());
      setOrganizationState(storage.getOrganization());
      setSubscriptionState(storage.getSubscription());
      setAllUsers(storage.getUsers());
    });
    return unsubscribe;
  }, []);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      if (!storage.isOfflineForced()) {
        setIsOnlineState(true);
        triggerManualSync();
      }
    };
    const handleOffline = () => {
      setIsOnlineState(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('eben_language', lang);
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('eben_theme', newTheme);
  };

  const setViewMode = (mode: 'mobile' | 'web') => {
    setViewModeState(mode);
  };

  const setCurrentUser = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUserState(user);
    if (user.role === 'SUPER_ADMIN') {
      setActiveTab('superAdmin');
    }
  };

  const updateOrganization = (orgData: Partial<Organization>) => {
    const updated = storage.updateOrganization(orgData);
    setOrganizationState(updated);
  };

  const refreshSubscription = () => {
    setSubscriptionState(storage.getSubscription());
  };

  const setIsOnlineManual = (online: boolean) => {
    storage.setForceOffline(!online);
    const effective = storage.isEffectivelyOnline();
    setIsOnlineState(effective);
    if (effective) {
      triggerManualSync();
    } else {
      setSyncStatus('offline');
    }
  };

  const triggerManualSync = async () => {
    if (!storage.isEffectivelyOnline()) {
      setSyncStatus('offline');
      return;
    }
    setSyncStatus('syncing');
    await storage.processSyncQueue();
    setSyncStatus('synced');
  };

  const refreshData = () => {
    setCurrentUserState(storage.getCurrentUser());
    setOrganizationState(storage.getOrganization());
    setSubscriptionState(storage.getSubscription());
    setAllUsers(storage.getUsers());
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        organization,
        updateOrganization,
        subscription,
        refreshSubscription,
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        isOnline,
        setIsOnlineManual,
        syncStatus,
        triggerManualSync,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        allUsers,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
