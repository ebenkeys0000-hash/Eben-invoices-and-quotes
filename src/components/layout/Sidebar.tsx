import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Users,
  Package,
  CreditCard,
  UserCheck,
  Settings,
  ShieldCheck,
  Crown,
  Wifi,
  WifiOff,
  RefreshCw,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { storage } from '../../services/storage';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    subscription,
    isOnline,
    setIsOnlineManual,
    syncStatus,
    triggerManualSync,
    setIsSubscriptionModalOpen,
    t,
  } = useApp();

  const invoices = storage.getInvoices();
  const quotes = storage.getQuotes();
  const syncQueue = storage.getSyncQueue();

  const isTrial = subscription.status !== 'active';
  const remainingInvoices = Math.max(0, subscription.trialUsage.maxTrialInvoices - subscription.trialUsage.invoicesCount);
  const remainingQuotes = Math.max(0, subscription.trialUsage.maxTrialQuotes - subscription.trialUsage.quotesCount);

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string | number; superAdminOnly?: boolean }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'invoices', label: t.nav.invoices, icon: FileText, badge: invoices.length },
    { id: 'quotes', label: t.nav.quotes, icon: FileSpreadsheet, badge: quotes.length },
    { id: 'customers', label: t.nav.customers, icon: Users },
    { id: 'products', label: t.nav.products, icon: Package },
    { id: 'payments', label: t.nav.payments, icon: CreditCard },
    { id: 'team', label: t.nav.team, icon: UserCheck },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  // Super Admin Boss portal
  const showSuperAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.isSuperAdmin;

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-800 bg-slate-900/95 p-4 text-slate-300">
      <div>
        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Gestion Quotidienne
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive ? 'bg-emerald-700/80 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Super Admin Boss Portal Link & Store Submission */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-500/90 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Administration & Déploiement
          </p>
          <button
            onClick={() => setActiveTab('superAdmin')}
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'superAdmin'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-950/40'
                : 'text-amber-400/90 hover:bg-amber-950/30 border border-amber-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4" />
              <span>{t.nav.superAdmin}</span>
            </div>
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
              BOSS
            </span>
          </button>

          <button
            onClick={() => setActiveTab('storePublication')}
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'storePublication'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/40'
                : 'text-indigo-300 hover:bg-indigo-950/30 border border-indigo-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-indigo-400" />
              <span>Stores Play & App Store</span>
            </div>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
              PROD
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Trial Counter + Offline Sync Status */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        {/* Trial Status Card */}
        {isTrial ? (
          <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 to-slate-900 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Crown className="h-3.5 w-3.5" />
                Essai Gratuit
              </span>
              <span className="text-[10px] font-mono font-semibold text-amber-400">
                {remainingInvoices}F / {remainingQuotes}D restants
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Passez à la formule illimitée avec Mobile Money Bénin ou Carte.
            </p>
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 py-1.5 text-xs font-bold text-slate-950 shadow hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Activer Premium ($15)
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Crown className="h-4 w-4 text-emerald-400" />
              <span>EBEN Premium Actif</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Factures et devis illimités • Support 24/7
            </p>
          </div>
        )}

        {/* Offline & Sync Engine Card */}
        <div className="rounded-xl bg-slate-800/60 p-2.5 text-xs border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-rose-400" />
              )}
              <span className="font-semibold text-slate-300">
                {isOnline ? 'En ligne' : 'Hors-ligne'}
              </span>
            </div>
            <button
              onClick={() => setIsOnlineManual(!isOnline)}
              className="text-[10px] text-slate-400 underline hover:text-slate-200"
            >
              {isOnline ? 'Couper net' : 'Reconnecter'}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>File d'attente sync :</span>
            <span className="font-mono font-bold text-slate-200">
              {syncQueue.length} {syncQueue.length === 1 ? 'action' : 'actions'}
            </span>
          </div>

          {syncQueue.length > 0 && isOnline && (
            <button
              onClick={triggerManualSync}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded bg-slate-700 py-1 text-[11px] font-medium text-emerald-300 hover:bg-slate-600"
            >
              <RefreshCw className={`h-3 w-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              Synchroniser maintenant
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
