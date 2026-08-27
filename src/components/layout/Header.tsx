import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Globe, 
  Smartphone, 
  Monitor, 
  Crown, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronDown, 
  UserCheck,
  Home,
  LogOut
} from 'lucide-react';
import { storage } from '../../services/storage';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    organization,
    subscription,
    language,
    setLanguage,
    t,
    viewMode,
    setViewMode,
    isOnline,
    setIsOnlineManual,
    syncStatus,
    triggerManualSync,
    setIsSubscriptionModalOpen,
    allUsers,
    setCurrentScreen,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const notifications = storage.getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const isTrial = subscription.status !== 'active';
  const remainingInvoices = Math.max(0, subscription.trialUsage.maxTrialInvoices - subscription.trialUsage.invoicesCount);
  const remainingQuotes = Math.max(0, subscription.trialUsage.maxTrialQuotes - subscription.trialUsage.quotesCount);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-900/95 px-4 backdrop-blur-md transition-colors lg:px-6">
      {/* Left: Brand & Mobile indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentScreen('landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          title="Retourner à la page d'accueil d'EBEN Technologies SARL"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-950/40 group-hover:scale-105 transition-transform">
            <span className="font-mono text-base font-black tracking-tight text-white">E</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white lg:text-base">
                EBEN <span className="text-blue-400 font-bold">INVOICES</span>
              </span>
              <span className="hidden rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30 sm:inline-block">
                Bénin & UEMOA
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 sm:block truncate max-w-[200px]">
              {organization.name}
            </p>
          </div>
        </button>

        {/* Home / Landing Page Button */}
        <button
          onClick={() => setCurrentScreen('landing')}
          className="hidden xl:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all ml-2"
          title="Voir la page de présentation & badges de confiance"
        >
          <Home className="h-3.5 w-3.5 text-blue-400" />
          <span>Site Vitrine</span>
        </button>

        {/* Online / Offline Sync status pill */}
        <div className="ml-2 hidden items-center md:flex">
          <button
            onClick={() => setIsOnlineManual(!isOnline)}
            title={isOnline ? "Cliquez pour simuler le mode Hors-ligne" : "Cliquez pour reconnecter"}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
              isOnline 
                ? syncStatus === 'syncing' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30' 
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse'
            }`}
          >
            {isOnline ? (
              syncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                  <span>{t.dashboard.syncStatusSyncing}</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 text-blue-400" />
                  <span>{t.common.online}</span>
                </>
              )
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-rose-400" />
                <span>{t.common.offline}</span>
              </>
            )}
          </button>

          {isOnline && (
            <button
              onClick={triggerManualSync}
              className="ml-1.5 p-1 text-slate-400 hover:text-blue-400 transition-colors"
              title="Forcer la synchronisation cloud"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Center / Right: Trial Counter, Plan, Tools, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Free Trial Banner / Counter Widget */}
        {isTrial ? (
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Essai :</span>
            <span className="font-mono font-semibold">
              {remainingInvoices}F / {remainingQuotes}D
            </span>
            <span className="hidden lg:inline text-amber-400 underline ml-1">
              $15/mois
            </span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300 border border-blue-500/30">
            <Crown className="h-3.5 w-3.5 text-blue-400" />
            <span>EBEN Premium Actif</span>
          </div>
        )}

        {/* View Mode Switcher: Mobile frame vs Desktop Web */}
        <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              viewMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Aperçu Application Mobile (Android / iOS)"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setViewMode('web')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              viewMode === 'web'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Aperçu Dashboard Web & Admin"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Web</span>
          </button>
        </div>

        {/* Language Toggle (FR / EN) */}
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white"
          title="Changer de langue (Français / Anglais)"
        >
          <Globe className="h-3.5 w-3.5 text-blue-400" />
          <span className="uppercase">{language}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:border-slate-600 hover:text-white"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-2">
                <span className="text-xs font-bold text-slate-200">Notifications</span>
                <span className="text-[10px] text-slate-400">{notifications.length} au total</span>
              </div>
              <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <p className="p-3 text-center text-xs text-slate-500">Aucune notification</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => storage.markNotificationRead(n.id)}
                      className={`p-2 text-left text-xs cursor-pointer hover:bg-slate-800/50 rounded-lg transition-colors ${
                        !n.read ? 'bg-blue-950/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{n.title}</span>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2">{n.message}</p>
                      <span className="mt-1 block text-[9px] text-slate-500">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-left text-xs hover:border-slate-600 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-slate-200 text-[11px] leading-tight truncate max-w-[110px]">
                {currentUser.fullName.split(' ')[0]}
              </p>
              <p className="text-[9px] text-blue-400 font-mono leading-tight">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50">
              <div className="border-b border-slate-800 pb-2 px-2">
                <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                <span className="mt-1 inline-block rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                  Rôle : {currentUser.role}
                </span>
              </div>

              <div className="py-2">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Changer de compte / Profil de test
                </p>
                {allUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowUserDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-blue-600/20 text-blue-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-200">{u.fullName}</div>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </div>
                    {u.id === currentUser.id && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    setCurrentScreen('landing');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Retour à la page d'accueil</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

