import React, { useState } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Users,
  MoreHorizontal,
  Plus,
  Package,
  CreditCard,
  UserCheck,
  Settings,
  ShieldCheck,
  X,
  Smartphone
} from 'lucide-react';

interface MobileNavbarProps {
  onOpenNewInvoice: () => void;
  onOpenNewQuote: () => void;
  onOpenNewCustomer: () => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  onOpenNewInvoice,
  onOpenNewQuote,
  onOpenNewCustomer,
}) => {
  const { activeTab, setActiveTab, t } = useApp();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'quotes', label: 'Devis', icon: FileSpreadsheet },
    { id: 'customers', label: 'Clients', icon: Users },
  ];

  return (
    <>
      {/* Floating Quick Action Drawer Backdrop */}
      {showQuickMenu && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-xs transition-opacity"
          onClick={() => setShowQuickMenu(false)}
        />
      )}

      {/* Floating Quick Action Options Menu */}
      {showQuickMenu && (
        <div className="fixed bottom-20 left-1/2 z-50 w-[90%] max-w-xs -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 px-1">
            <span className="text-xs font-bold text-white">Création Rapide</span>
            <button
              onClick={() => setShowQuickMenu(false)}
              className="rounded-full p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => {
                setShowQuickMenu(false);
                onOpenNewInvoice();
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-emerald-600/15 p-2.5 text-left text-xs font-semibold text-emerald-300 border border-emerald-500/20 hover:bg-emerald-600/25 transition-colors"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <div>
                <div>Nouvelle Facture</div>
                <div className="text-[10px] text-slate-400 font-normal">Facturer une prestation ou vente</div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onOpenNewQuote();
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-teal-600/15 p-2.5 text-left text-xs font-semibold text-teal-300 border border-teal-500/20 hover:bg-teal-600/25 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-teal-400" />
              <div>
                <div>Nouveau Devis / Proforma</div>
                <div className="text-[10px] text-slate-400 font-normal">Proposition commerciale convertible</div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onOpenNewCustomer();
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-blue-600/15 p-2.5 text-left text-xs font-semibold text-blue-300 border border-blue-500/20 hover:bg-blue-600/25 transition-colors"
            >
              <Users className="h-4 w-4 text-blue-400" />
              <div>
                <div>Nouveau Client</div>
                <div className="text-[10px] text-slate-400 font-normal">Enregistrer coordonnées & IFU</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* "More..." Menu Drawer */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-xs"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {showMoreMenu && (
        <div className="fixed bottom-18 left-0 right-0 z-50 rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5 shadow-2xl">
          <div className="mx-auto h-1 w-12 rounded-full bg-slate-700 mb-4" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Autres Modules
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setActiveTab('products');
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-left text-xs font-medium text-slate-200"
            >
              <Package className="h-4 w-4 text-emerald-400" />
              <span>Produits & Services</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('payments');
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-left text-xs font-medium text-slate-200"
            >
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <span>Paiements Reçus</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('team');
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-left text-xs font-medium text-slate-200"
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Équipe & Accès</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-left text-xs font-medium text-slate-200"
            >
              <Settings className="h-4 w-4 text-emerald-400" />
              <span>Paramètres Entreprise</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('superAdmin');
                setShowMoreMenu(false);
              }}
              className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-left text-xs font-bold text-amber-300"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Super Admin BOSS</span>
              </div>
              <span className="text-[10px] rounded bg-amber-500/20 px-1.5 py-0.5">SaaS</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('storePublication');
                setShowMoreMenu(false);
              }}
              className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3 text-left text-xs font-bold text-indigo-300"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-indigo-400" />
                <span>Publication Stores</span>
              </div>
              <span className="text-[10px] rounded bg-indigo-500/20 px-1.5 py-0.5">PROD</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="sticky bottom-0 z-30 flex h-16 w-full items-center justify-around border-t border-slate-800 bg-slate-900/95 px-2 backdrop-blur-md">
        {mainTabs.slice(0, 2).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Floating Add Center Button */}
        <div className="relative -top-3">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all"
            title="Création rapide"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {mainTabs.slice(2).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
            ['products', 'payments', 'team', 'settings', 'superAdmin'].includes(activeTab)
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MoreHorizontal className="h-5 w-5 mb-0.5" />
          <span>Plus</span>
        </button>
      </nav>
    </>
  );
};
