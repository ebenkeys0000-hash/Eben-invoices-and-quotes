import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign, 
  Crown, 
  CheckCircle2, 
  Settings, 
  Building, 
  Smartphone, 
  ArrowUpRight, 
  Sparkles,
  Save
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SuperAdminDashboard: React.FC = () => {
  const { language, t } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tenants' | 'pricing' | 'transactions'>('overview');

  const stats = storage.getSuperAdminStats();
  const tenants = storage.getTenants();
  const transactions = storage.getPlatformTransactions();
  const [platformSettings, setPlatformSettings] = useState(storage.getPlatformSettings());
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    storage.savePlatformSettings(platformSettings);
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleToggleTenantSubscription = (tenantId: string, currentStatus: string) => {
    const updatedTenants = tenants.map(tenant => {
      if (tenant.id === tenantId) {
        return {
          ...tenant,
          subscriptionStatus: currentStatus === 'active' ? ('trial' as const) : ('active' as const),
        };
      }
      return tenant;
    });
    storage.saveTenants(updatedTenants);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Boss Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Portail Propriétaire SaaS (Boss Dashboard)
            </h1>
          </div>
          <p className="text-xs text-amber-400/90 mt-0.5">
            Supervision globale de la plateforme EBEN Invoices & Quotes • Revenus MRR & Abonnés
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-800 p-1 border border-slate-700">
          {[
            { id: 'overview', label: 'Vue d\'Ensemble' },
            { id: 'tenants', label: `Entreprises (${tenants.length})` },
            { id: 'transactions', label: `Paiements (${transactions.length})` },
            { id: 'pricing', label: 'Tarifs & Quotas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* SaaS KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* MRR */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 to-slate-900 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">MRR Mensuel</span>
                <Crown className="h-4 w-4 text-amber-400" />
              </div>
              <p className="mt-2 font-mono text-xl sm:text-2xl font-black text-white">
                {formatCurrency(stats.mrr, 'XOF', language)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {stats.activeSubscribers} abonnements payants actifs
              </p>
            </div>

            {/* Total Platform Revenue */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Revenus Cumulés</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-2 font-mono text-xl sm:text-2xl font-black text-emerald-400">
                {formatCurrency(stats.totalRevenue, 'XOF', language)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Frais passerelles : {formatCurrency(stats.gatewayFeesTotal, 'XOF', language)}
              </p>
            </div>

            {/* Total Businesses / Tenants */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Entreprises Inscrites</span>
                <Building className="h-4 w-4 text-blue-400" />
              </div>
              <p className="mt-2 font-mono text-xl sm:text-2xl font-black text-blue-300">
                {stats.totalTenants}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Taux de conversion : {stats.conversionRate}%
              </p>
            </div>

            {/* Total Invoices on platform */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Factures Émises SaaS</span>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </div>
              <p className="mt-2 font-mono text-xl sm:text-2xl font-black text-purple-300">
                {stats.totalInvoicesCreated}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Volume facturé : {formatCurrency(stats.totalVolumeProcessed, 'XOF', language)}
              </p>
            </div>
          </div>

          {/* Quick Payouts Box */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                <span>Revenus Disponibles pour Reversement</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Solde net encaissé sur MTN Mobile Money Bénin & FedaPay vers votre compte bancaire BOA Bénin
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-black text-emerald-400">
                {formatCurrency(stats.totalRevenue - stats.gatewayFeesTotal, 'XOF', language)}
              </span>
              <button
                onClick={() => alert('Virement bancaire de reversement déclenché avec succès !')}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 cursor-pointer"
              >
                Transférer les Fonds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TENANTS MANAGEMENT */}
      {activeSubTab === 'tenants' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden p-5">
          <h2 className="text-sm font-bold text-white mb-4">Comptes Entreprises & Statuts SaaS</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Entreprise & Contact</th>
                  <th className="py-3 px-4">Statut Abonnement</th>
                  <th className="py-3 px-4">Consommation Factures</th>
                  <th className="py-3 px-4">Total Facturé</th>
                  <th className="py-3 px-4 text-right">Actions BOSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenants.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-[11px] text-slate-400">{t.email} • {t.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        t.subscriptionStatus === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {t.subscriptionStatus === 'active' ? 'Premium Illimité' : 'Essai Gratuit'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {t.invoicesCount} factures • {t.quotesCount} devis
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {formatCurrency(t.totalVolume, 'XOF', language)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleTenantSubscription(t.id, t.subscriptionStatus)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition-colors ${
                          t.subscriptionStatus === 'active'
                            ? 'border-rose-500/30 bg-rose-950/30 text-rose-300 hover:bg-rose-900/30'
                            : 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/30'
                        }`}
                      >
                        {t.subscriptionStatus === 'active' ? 'Basculer en Essai' : 'Offrir Premium'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: TRANSACTIONS HISTORY */}
      {activeSubTab === 'transactions' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden p-5">
          <h2 className="text-sm font-bold text-white mb-4">Journal des Paiements d'Abonnement</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client / Entreprise</th>
                  <th className="py-3 px-4">Passerelle</th>
                  <th className="py-3 px-4">N° Réf.</th>
                  <th className="py-3 px-4">Frais Passerelle</th>
                  <th className="py-3 px-4 text-right">Montant Net Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {formatDate(tx.createdAt, language)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{tx.orgName}</div>
                      <div className="text-[11px] text-slate-400">{tx.userEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-bold text-amber-300">
                        {tx.provider}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {tx.providerTransactionId}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-400">
                      -{formatCurrency(tx.feeAmount, tx.currency, language)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-400">
                      +{formatCurrency(tx.netAmount, tx.currency, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: PRICING & QUOTAS SETTINGS */}
      {activeSubTab === 'pricing' && (
        <form onSubmit={handleSavePricing} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4 max-w-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-amber-400" />
              <span>Configuration Tarifaire SaaS</span>
            </h2>
            {savedSettings && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Enregistré
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Prix Mensuel (XOF / FCFA) :
            </label>
            <input
              type="number"
              value={platformSettings.monthlyPrice}
              onChange={e => setPlatformSettings({ ...platformSettings, monthlyPrice: parseFloat(e.target.value) || 10000 })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Équivalent à $15 / mois par défaut.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Prix Annuel (XOF / FCFA) :
            </label>
            <input
              type="number"
              value={platformSettings.annualPrice}
              onChange={e => setPlatformSettings({ ...platformSettings, annualPrice: parseFloat(e.target.value) || 100000 })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Limite Factures Essai :
              </label>
              <input
                type="number"
                value={platformSettings.maxTrialInvoices}
                onChange={e => setPlatformSettings({ ...platformSettings, maxTrialInvoices: parseInt(e.target.value) || 5 })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Limite Devis Essai :
              </label>
              <input
                type="number"
                value={platformSettings.maxTrialQuotes}
                onChange={e => setPlatformSettings({ ...platformSettings, maxTrialQuotes: parseInt(e.target.value) || 5 })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 shadow hover:bg-amber-400 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Mettre à Jour la Politique Tarifaire</span>
          </button>
        </form>
      )}
    </div>
  );
};
