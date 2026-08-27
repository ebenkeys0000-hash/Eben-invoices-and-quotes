import React from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  TrendingUp, 
  FileText, 
  FileSpreadsheet, 
  Users, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Crown, 
  ArrowUpRight, 
  ArrowRight,
  Download,
  Eye,
  CreditCard,
  Building,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Invoice, Quote } from '../../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface DashboardViewProps {
  onOpenNewInvoice: () => void;
  onOpenNewQuote: () => void;
  onOpenNewCustomer: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onViewQuote: (quote: Quote) => void;
  onConvertQuote: (quote: Quote) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewInvoice,
  onOpenNewQuote,
  onOpenNewCustomer,
  onViewInvoice,
  onViewQuote,
  onConvertQuote,
}) => {
  const { 
    organization, 
    subscription, 
    setIsSubscriptionModalOpen, 
    setActiveTab, 
    language, 
    t 
  } = useApp();

  const metrics = storage.getDashboardMetrics();
  const invoices = storage.getInvoices();
  const quotes = storage.getQuotes();
  const customers = storage.getCustomers();

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentQuotes = [...quotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const isTrial = subscription.status !== 'active';
  const remainingInvoices = Math.max(0, subscription.trialUsage.maxTrialInvoices - subscription.trialUsage.invoicesCount);
  const remainingQuotes = Math.max(0, subscription.trialUsage.maxTrialQuotes - subscription.trialUsage.quotesCount);

  // Revenue chart dataset (last 6 months simulation)
  const chartData = [
    { month: 'Mars', encaisse: 1200000, facture: 1500000 },
    { month: 'Avr', encaisse: 1850000, facture: 2100000 },
    { month: 'Mai', encaisse: 2400000, facture: 2800000 },
    { month: 'Juin', encaisse: 1950000, facture: 2300000 },
    { month: 'Juil', encaisse: 3100000, facture: 3600000 },
    { month: 'Août', encaisse: metrics.totalSales, facture: metrics.totalSales + metrics.totalPending },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Organization Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{organization.name}</span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              {organization.settings.defaultCurrency}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Aperçu général de votre facturation, devis et flux de trésorerie
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewInvoice}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Nouvelle Facture</span>
          </button>
          <button
            onClick={onOpenNewQuote}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-teal-300 border border-teal-500/30 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-teal-400" />
            <span>Nouveau Devis</span>
          </button>
        </div>
      </div>

      {/* Trial Expiration Warning Bar if in trial */}
      {isTrial && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Compte en Période d'Essai Gratuit</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-mono text-amber-300">
                  {remainingInvoices} Factures • {remainingQuotes} Devis restants
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Passez au forfait illimité à seulement 10 000 FCFA / mois ($15) payable par MTN MoMo, Moov ou Carte.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="flex items-center gap-1.5 shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-black text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Passer à Premium</span>
          </button>
        </div>
      )}

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Sales / Encaissé */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Encaissé</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-lg sm:text-xl font-mono font-black text-white">
            {formatCurrency(metrics.totalSales, 'XOF', language)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>{metrics.paidInvoicesCount} factures soldées</span>
          </div>
        </div>

        {/* 2. Total Pending / En attente */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">En Attente de Règlement</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-lg sm:text-xl font-mono font-black text-blue-300">
            {formatCurrency(metrics.totalPending, 'XOF', language)}
          </p>
          <div className="mt-1 text-[11px] text-slate-400">
            <span>{metrics.pendingInvoicesCount} factures en cours</span>
          </div>
        </div>

        {/* 3. Overdue / En Retard */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Factures en Retard</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-lg sm:text-xl font-mono font-black text-rose-400">
            {formatCurrency(metrics.totalOverdue, 'XOF', language)}
          </p>
          <div className="mt-1 text-[11px] text-rose-400/80">
            <span>{metrics.overdueInvoicesCount} facture(s) échue(s)</span>
          </div>
        </div>

        {/* 4. Active Quotes / Devis */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Devis & Proformas</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-lg sm:text-xl font-mono font-black text-teal-300">
            {formatCurrency(metrics.activeQuotesValue, 'XOF', language)}
          </p>
          <div className="mt-1 text-[11px] text-teal-400/80">
            <span>{metrics.quotesCount} devis émis</span>
          </div>
        </div>
      </div>

      {/* Revenue Evolution Chart */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Évolution de la Facturation (6 Derniers Mois)</h2>
            <p className="text-[11px] text-slate-400">Comparatif montants facturés vs montants encaissés</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-600"></span> Facturé
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Encaissé
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEncaisse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFacture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={val => `${val / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: number) => [`${formatCurrency(val, 'XOF', language)}`, '']}
              />
              <Area type="monotone" dataKey="facture" stroke="#64748b" fillOpacity={1} fill="url(#colorFacture)" />
              <Area type="monotone" dataKey="encaisse" stroke="#10b981" fillOpacity={1} fill="url(#colorEncaisse)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Recent Invoices & Recent Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Dernières Factures</h2>
            </div>
            <button
              onClick={() => setActiveTab('invoices')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
            >
              <span>Voir tout</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-800/60">
            {recentInvoices.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">Aucune facture enregistrée.</p>
            ) : (
              recentInvoices.map(inv => (
                <div
                  key={inv.id}
                  onClick={() => onViewInvoice(inv)}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{inv.invoiceNumber}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : inv.status === 'partially_paid'
                          ? 'bg-blue-500/15 text-blue-400'
                          : inv.status === 'overdue'
                          ? 'bg-rose-500/15 text-rose-400'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}>
                        {t.invoices.statuses[inv.status]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{inv.customerName}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-slate-100">
                      {formatCurrency(inv.total, inv.currency, language)}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Échéance : {formatDate(inv.dueDate, language)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-teal-400" />
              <h2 className="text-sm font-bold text-white">Devis & Proformas Récents</h2>
            </div>
            <button
              onClick={() => setActiveTab('quotes')}
              className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:underline"
            >
              <span>Voir tout</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-800/60">
            {recentQuotes.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">Aucun devis enregistré.</p>
            ) : (
              recentQuotes.map(q => (
                <div
                  key={q.id}
                  className="flex items-center justify-between py-3 rounded-xl px-2 hover:bg-slate-800/40 transition-colors"
                >
                  <div onClick={() => onViewQuote(q)} className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{q.quoteNumber}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        q.status === 'accepted'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : q.status === 'converted'
                          ? 'bg-teal-500/15 text-teal-300'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}>
                        {t.quotes.statuses[q.status]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{q.customerName}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono text-xs font-bold text-slate-100">
                        {formatCurrency(q.total, q.currency, language)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Valide : {formatDate(q.expiryDate, language)}
                      </p>
                    </div>

                    {q.status !== 'converted' && (
                      <button
                        onClick={() => onConvertQuote(q)}
                        title="Convertir en facture"
                        className="rounded-lg bg-teal-600/20 p-1.5 text-teal-300 border border-teal-500/30 hover:bg-teal-600 hover:text-white transition-colors"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
