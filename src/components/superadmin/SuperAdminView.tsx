import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storage, PlatformSettings } from '../../services/storage';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building, 
  CreditCard, 
  ArrowDownToLine, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Globe, 
  RefreshCw, 
  Download, 
  Lock, 
  Check, 
  Send
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import confetti from 'canvas-confetti';

export const SuperAdminView: React.FC = () => {
  const { language, t } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'subscribers' | 'transactions' | 'payouts' | 'settings' | 'audit'>('overview');

  const transactions = storage.getPlatformTransactions();
  const payouts = storage.getPlatformPayouts();
  const auditLogs = storage.getAuditLogs();
  const platformSettings = storage.getPlatformSettings();
  const organization = storage.getOrganization();
  const subscription = storage.getSubscription();

  // Payout form state
  const [payoutAmount, setPayoutAmount] = useState<number>(150000);
  const [payoutRecipient, setPayoutRecipient] = useState<string>('MTN Mobile Money Bénin (+229 97 00 00 00 - Eben Keys)');
  const [payoutProvider, setPayoutProvider] = useState<string>('MTN MoMo Bénin');
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);

  // Settings form state
  const [settings, setSettings] = useState<PlatformSettings>(platformSettings);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // Calculate SaaS Financials
  const totalRevenue = transactions.reduce((sum, tx) => tx.status === 'completed' ? sum + tx.netAmount : sum, 0);
  const totalPaidOut = payouts.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0);
  const availableBalance = Math.max(0, totalRevenue - totalPaidOut);

  const activeTenantsCount = 14; // Mock multi-tenant count
  const payingSubscribersCount = 9;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0 || payoutAmount > availableBalance) {
      alert("Le montant demandé dépasse le solde disponible.");
      return;
    }

    storage.requestPayout(payoutAmount, payoutRecipient, payoutProvider);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updatePlatformSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Portail Propriétaire & Super Admin BOSS</span>
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                  EBEN SAAS
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Surveillance globale, revenus des abonnements, passerelles de paiement et retraits
              </p>
            </div>
          </div>
        </div>

        {/* Available Wallet Balance Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 px-5 py-2.5 text-right shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Solde Revenus Retirable (Eben Keys)
          </span>
          <span className="font-mono text-lg sm:text-xl font-black text-white">
            {formatCurrency(availableBalance, 'XOF', language)}
          </span>
        </div>
      </div>

      {/* Super Admin Navigation Subtabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Vue d\'Ensemble & KPIs', icon: TrendingUp },
          { id: 'subscribers', label: 'Entreprises & Abonnés', icon: Building },
          { id: 'transactions', label: 'Flux Passerelles (MoMo/Cards)', icon: CreditCard },
          { id: 'payouts', label: 'Retraits & Virements', icon: ArrowDownToLine },
          { id: 'settings', label: 'Tarification & Passerelles', icon: Sliders },
          { id: 'audit', label: 'Logs d\'Audit & Sécurité', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <span className="text-xs font-semibold text-slate-400">Total Encaissé Abonnements</span>
              <p className="mt-1 font-mono text-lg sm:text-xl font-black text-amber-300">
                {formatCurrency(totalRevenue, 'XOF', language)}
              </p>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                +18.5% ce mois
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <span className="text-xs font-semibold text-slate-400">MRR (Revenu Récurrent Mensuel)</span>
              <p className="mt-1 font-mono text-lg sm:text-xl font-black text-white">
                {formatCurrency(payingSubscribersCount * platformSettings.monthlyPrice, 'XOF', language)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {payingSubscribersCount} abonnés actifs
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <span className="text-xs font-semibold text-slate-400">Entreprises Inscrites</span>
              <p className="mt-1 font-mono text-lg sm:text-xl font-black text-teal-300">
                {activeTenantsCount} PME / Indépendants
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Bénin, Togo, Côte d'Ivoire, Sénégal
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <span className="text-xs font-semibold text-slate-400">Total Retraits Effectués</span>
              <p className="mt-1 font-mono text-lg sm:text-xl font-black text-emerald-400">
                {formatCurrency(totalPaidOut, 'XOF', language)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {payouts.length} retraits validés
              </span>
            </div>
          </div>

          {/* Quick Gateway Distribution */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Répartition des Encaissements par Opérateur</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-300">MTN MoMo Bénin</span>
                  <span className="text-[10px] font-bold rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-200">62%</span>
                </div>
                <p className="mt-2 font-mono text-base font-bold text-white">
                  {formatCurrency(totalRevenue * 0.62, 'XOF', language)}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300">Moov Money Bénin</span>
                  <span className="text-[10px] font-bold rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-200">26%</span>
                </div>
                <p className="mt-2 font-mono text-base font-bold text-white">
                  {formatCurrency(totalRevenue * 0.26, 'XOF', language)}
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">Cartes Bancaires / Stripe</span>
                  <span className="text-[10px] font-bold rounded bg-indigo-500/20 px-1.5 py-0.5 text-indigo-200">12%</span>
                </div>
                <p className="mt-2 font-mono text-base font-bold text-white">
                  {formatCurrency(totalRevenue * 0.12, 'XOF', language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBERS & TENANTS */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
            <h3 className="text-sm font-bold text-white mb-1">Comptes Clients & Abonnements</h3>
            <p className="text-xs text-slate-400 mb-4">Gérez les accès et licences de toutes les entreprises inscrites</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Entreprise</th>
                    <th className="py-2.5 px-3">Propriétaire</th>
                    <th className="py-2.5 px-3">Pays</th>
                    <th className="py-2.5 px-3">Formule</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { id: '1', name: organization.name, owner: 'Eben Keys', country: 'Bénin 🇧🇯', plan: 'Premium Mensuel ($15)', status: subscription.status },
                    { id: '2', name: 'Cabinet Fiscal Bénin', owner: 'M. Houndékon', country: 'Bénin 🇧🇯', plan: 'Business Annuel', status: 'active' },
                    { id: '3', name: 'Logistique & Transit Cotonou', owner: 'S. Dossou', country: 'Bénin 🇧🇯', plan: 'Premium Mensuel', status: 'active' },
                    { id: '4', name: 'Digital Hub Lomé', owner: 'K. Lawson', country: 'Togo 🇹🇬', plan: 'Essai Gratuit', status: 'trial' },
                    { id: '5', name: 'Abidjan Créatif Studio', owner: 'Y. Kouassi', country: 'Côte d\'Ivoire 🇨🇮', plan: 'Premium Mensuel', status: 'active' },
                  ].map(tenant => (
                    <tr key={tenant.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{tenant.name}</td>
                      <td className="py-3 px-3 text-slate-300">{tenant.owner}</td>
                      <td className="py-3 px-3 text-slate-400">{tenant.country}</td>
                      <td className="py-3 px-3 font-medium text-amber-300">{tenant.plan}</td>
                      <td className="py-3 px-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          tenant.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {tenant.status === 'active' ? 'Actif' : 'Essai'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (tenant.status === 'trial') {
                              storage.updateSubscription({ status: 'active' });
                              alert(`Licence activée pour ${tenant.name}`);
                            } else {
                              storage.updateSubscription({ status: 'trial' });
                              alert(`Licence basculée en essai pour test.`);
                            }
                          }}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                          Basculer Statut
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTIONS */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
            <h3 className="text-sm font-bold text-white mb-1">Journal des Abonnements Payés</h3>
            <p className="text-xs text-slate-400 mb-4">Paiements reçus via MTN Mobile Money, Moov Money, FedaPay et Cartes</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">N° Trans.</th>
                    <th className="py-2.5 px-3">Entreprise</th>
                    <th className="py-2.5 px-3">Opérateur</th>
                    <th className="py-2.5 px-3 text-right">Montant Brut</th>
                    <th className="py-2.5 px-3 text-right">Frais Passerelle</th>
                    <th className="py-2.5 px-3 text-right">Net Reçu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono text-slate-400">{formatDate(tx.createdAt, language)}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{tx.providerTransactionId}</td>
                      <td className="py-3 px-3 font-semibold text-white">{tx.orgName}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-slate-700">
                          {tx.provider}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {formatCurrency(tx.amount, tx.currency, language)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-rose-400">
                        -{formatCurrency(tx.feeAmount, tx.currency, language)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                        +{formatCurrency(tx.netAmount, tx.currency, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYOUTS & WITHDRAWALS */}
      {activeSubTab === 'payouts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payout Request Form */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ArrowDownToLine className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Effectuer un Retrait</h2>
            </div>

            {payoutSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Demande de virement envoyée avec succès sur votre compte !</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Solde disponible :
                </label>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 font-mono text-base font-bold text-amber-300">
                  {formatCurrency(availableBalance, 'XOF', language)}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Montant du retrait (XOF) * :
                </label>
                <input
                  type="number"
                  min="1000"
                  max={availableBalance}
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Moyen de Réception * :
                </label>
                <select
                  value={payoutProvider}
                  onChange={e => setPayoutProvider(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-amber-500"
                >
                  <option value="MTN MoMo Bénin">MTN Mobile Money Bénin (*880#)</option>
                  <option value="Moov Money Bénin">Moov Money Bénin (*855#)</option>
                  <option value="Virement Bancaire (UBA / BOA / Orabank)">Virement Bancaire RIB Bénin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Coordonnées du compte bénéficiaire * :
                </label>
                <input
                  type="text"
                  required
                  value={payoutRecipient}
                  onChange={e => setPayoutRecipient(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={availableBalance <= 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>Transférer sur mon compte</span>
              </button>
            </form>
          </div>

          {/* Payout History List */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-1">Historique des Retraits</h3>
            <p className="text-xs text-slate-400 mb-4">Virements effectués vers vos comptes Mobile Money et bancaires</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Réf. Virement</th>
                    <th className="py-2.5 px-3">Compte Réception</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payouts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono text-slate-400">{formatDate(p.requestedAt, language)}</td>
                      <td className="py-3 px-3 font-mono text-slate-300 font-bold">{p.reference}</td>
                      <td className="py-3 px-3 text-slate-300">
                        <div>{p.recipientAccount}</div>
                        <span className="text-[10px] text-slate-500">{p.provider}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-300">
                        {formatCurrency(p.amount, p.currency, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS & PRICING */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Tarifs des Abonnements SaaS EBEN</h2>
              </div>
              {settingsSaved && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Enregistré !
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Prix Abonnement Mensuel (FCFA) - [Défaut: 10 000 FCFA / $15] :
                </label>
                <input
                  type="number"
                  value={settings.monthlyPrice}
                  onChange={e => setSettings({ ...settings, monthlyPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Prix Abonnement Annuel (FCFA) - [Défaut: 100 000 FCFA / $150] :
                </label>
                <input
                  type="number"
                  value={settings.annualPrice}
                  onChange={e => setSettings({ ...settings, annualPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Limite Factures Essai Gratuit (par entreprise) :
                </label>
                <input
                  type="number"
                  value={settings.maxTrialInvoices}
                  onChange={e => setSettings({ ...settings, maxTrialInvoices: parseInt(e.target.value) || 5 })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Limite Devis Essai Gratuit :
                </label>
                <input
                  type="number"
                  value={settings.maxTrialQuotes}
                  onChange={e => setSettings({ ...settings, maxTrialQuotes: parseInt(e.target.value) || 5 })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateways Config */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Passerelles de Paiement Intégrées</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'mtnMoMo', name: 'MTN Mobile Money Bénin (*880#)' },
                { key: 'moovMoney', name: 'Moov Money Bénin (*855#)' },
                { key: 'fedaPay', name: 'Passerelle FedaPay Bénin' },
                { key: 'kkiapay', name: 'Passerelle KKiaPay Bénin' },
                { key: 'stripeCards', name: 'Cartes Visa / MasterCard (Stripe)' },
              ].map(gw => (
                <label
                  key={gw.key}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(settings.activePaymentProviders as any)[gw.key]}
                    onChange={e => {
                      setSettings({
                        ...settings,
                        activePaymentProviders: {
                          ...settings.activePaymentProviders,
                          [gw.key]: e.target.checked,
                        },
                      });
                    }}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  <span className="font-semibold">{gw.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Enregistrer la Configuration Plateforme</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
          <h3 className="text-sm font-bold text-white mb-1">Journal d'Audit et Sécurité</h3>
          <p className="text-xs text-slate-400 mb-4">Traçabilité complète des actions utilisateur, création de factures et paiements</p>

          <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-amber-300 font-semibold">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Par {log.userName} ({log.userRole}) • IP : {log.ipAddress}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {formatDate(log.timestamp, language)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
