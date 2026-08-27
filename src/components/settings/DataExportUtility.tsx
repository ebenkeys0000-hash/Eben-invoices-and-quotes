import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  exportInvoicesToCSV, 
  exportQuotesToCSV, 
  exportCustomersToCSV, 
  exportAccountingJournalToCSV,
  CSVDelimiter 
} from '../../services/exportService';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  Settings2,
  Layers,
  ArrowDownToLine,
  TableProperties,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DataExportUtility: React.FC = () => {
  const { currentUser, language, organization } = useApp();

  // Roles authorized for financial and customer accounting export
  const authorizedRoles = ['SUPER_ADMIN', 'OWNER', 'ADMIN', 'ACCOUNTANT', 'MANAGER'];
  const isAuthorized = authorizedRoles.includes(currentUser.role) || currentUser.isSuperAdmin;

  // Filter & Export states
  const [datePreset, setDatePreset] = useState<'all' | 'this_month' | 'last_month' | 'this_year' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [onlyIndebtedCustomers, setOnlyIndebtedCustomers] = useState<boolean>(false);
  const [delimiter, setDelimiter] = useState<CSVDelimiter>(';');
  
  // Notification toast
  const [lastExportMessage, setLastExportMessage] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'invoices' | 'quotes' | 'customers' | 'journal'>('invoices');

  // Retrieve raw data
  const invoices = storage.getInvoices();
  const quotes = storage.getQuotes();
  const customers = storage.getCustomers();
  const payments = storage.getAllPayments();

  // Compute active date filters
  const effectiveDates = useMemo(() => {
    const now = new Date();
    if (datePreset === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      return { start: firstDay, end: lastDay };
    }
    if (datePreset === 'last_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      return { start: firstDay, end: lastDay };
    }
    if (datePreset === 'this_year') {
      const firstDay = `${now.getFullYear()}-01-01`;
      const lastDay = `${now.getFullYear()}-12-31`;
      return { start: firstDay, end: lastDay };
    }
    if (datePreset === 'custom') {
      return { start: startDate, end: endDate };
    }
    return { start: undefined, end: undefined };
  }, [datePreset, startDate, endDate]);

  // Filtered dataset counts
  const filteredInvoices = useMemo(() => {
    let list = [...invoices];
    if (effectiveDates.start) list = list.filter(i => i.issueDate >= effectiveDates.start!);
    if (effectiveDates.end) list = list.filter(i => i.issueDate <= effectiveDates.end!);
    if (invoiceStatusFilter !== 'all') list = list.filter(i => i.status === invoiceStatusFilter);
    return list;
  }, [invoices, effectiveDates, invoiceStatusFilter]);

  const filteredQuotes = useMemo(() => {
    let list = [...quotes];
    if (effectiveDates.start) list = list.filter(q => q.issueDate >= effectiveDates.start!);
    if (effectiveDates.end) list = list.filter(q => q.issueDate <= effectiveDates.end!);
    if (quoteStatusFilter !== 'all') list = list.filter(q => q.status === quoteStatusFilter);
    return list;
  }, [quotes, effectiveDates, quoteStatusFilter]);

  const filteredCustomers = useMemo(() => {
    let list = [...customers];
    if (onlyIndebtedCustomers) list = list.filter(c => c.outstandingBalance > 0);
    return list;
  }, [customers, onlyIndebtedCustomers]);

  const triggerExportToast = (message: string) => {
    setLastExportMessage(message);
    setTimeout(() => {
      setLastExportMessage(null);
    }, 4000);
  };

  const handleExportInvoices = () => {
    const res = exportInvoicesToCSV(invoices, {
      delimiter,
      startDate: effectiveDates.start,
      endDate: effectiveDates.end,
      status: invoiceStatusFilter,
    });
    triggerExportToast(`${res.rowCount} factures exportées dans « ${res.filename} »`);
  };

  const handleExportQuotes = () => {
    const res = exportQuotesToCSV(quotes, {
      delimiter,
      startDate: effectiveDates.start,
      endDate: effectiveDates.end,
      status: quoteStatusFilter,
    });
    triggerExportToast(`${res.rowCount} devis exportés dans « ${res.filename} »`);
  };

  const handleExportCustomers = () => {
    const res = exportCustomersToCSV(customers, {
      delimiter,
      minOutstanding: onlyIndebtedCustomers,
    });
    triggerExportToast(`${res.rowCount} clients exportés dans « ${res.filename} »`);
  };

  const handleExportJournal = () => {
    const res = exportAccountingJournalToCSV(invoices, payments, {
      delimiter,
      startDate: effectiveDates.start,
      endDate: effectiveDates.end,
    });
    triggerExportToast(`Journal comptable généré : ${res.rowCount} lignes d'écritures exportées dans « ${res.filename} »`);
  };

  const handleExportAll = () => {
    handleExportInvoices();
    setTimeout(() => handleExportQuotes(), 300);
    setTimeout(() => handleExportCustomers(), 600);
    setTimeout(() => handleExportJournal(), 900);
    triggerExportToast(`Export global initié : 4 fichiers CSV comptables en cours de téléchargement !`);
  };

  if (!isAuthorized) {
    return (
      <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 text-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Accès restreint aux exports comptables</h3>
            <p className="text-xs text-slate-400 mt-1">
              Votre rôle actuel (<span className="font-semibold text-amber-300">{currentUser.role}</span>) ne dispose pas des privilèges d'exportation de données financières.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          Pour télécharger les exports CSV de factures, devis, répertoire clients et journaux comptables, veuillez vous connecter avec un compte <strong>Propriétaire (Owner)</strong>, <strong>Administrateur</strong>, <strong>Comptable (Accountant)</strong> ou <strong>Gestionnaire (Manager)</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Authorization & Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Exports de Données & Rapports Comptables (CSV)</h2>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Accès Autorisé ({currentUser.role})</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Exportez vos factures, devis, fichiers clients et journaux de ventes au format CSV compatible Excel, SYSCOHADA et logiciels comptables.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportAll}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer whitespace-nowrap"
        >
          <Layers className="h-4 w-4" />
          <span>Tout Exporter en 1 Clic</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {lastExportMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/50 p-4 text-xs font-bold text-emerald-200 animate-in fade-in shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{lastExportMessage}</span>
        </div>
      )}

      {/* Filters & Configuration Controls */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Paramètres de Filtrage & Format d'Exportation
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Séparateur CSV :</span>
            <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setDelimiter(';')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  delimiter === ';' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Format standard Excel Francophone / UEMOA"
              >
                Point-virgule ( ; )
              </button>
              <button
                type="button"
                onClick={() => setDelimiter(',')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  delimiter === ',' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Format standard International (Google Sheets, Python)"
              >
                Virgule ( , )
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Date Range Preset */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Période temporelle :
            </label>
            <select
              value={datePreset}
              onChange={e => setDatePreset(e.target.value as any)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            >
              <option value="all">Toutes les dates (Historique complet)</option>
              <option value="this_month">Mois en cours ({new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })})</option>
              <option value="last_month">Mois précédent</option>
              <option value="this_year">Année en cours ({new Date().getFullYear()})</option>
              <option value="custom">Période personnalisée...</option>
            </select>
          </div>

          {/* Custom Date Range if active */}
          {datePreset === 'custom' ? (
            <>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Date de début :
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Date de fin :
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </>
          ) : (
            <>
              {/* Invoice Status Filter */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Filtre Factures :
                </label>
                <select
                  value={invoiceStatusFilter}
                  onChange={e => setInvoiceStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                >
                  <option value="all">Tous les statuts de factures</option>
                  <option value="paid">Payées uniquement</option>
                  <option value="partially_paid">Partiellement payées</option>
                  <option value="sent">Envoyées / En attente</option>
                  <option value="overdue">En retard d'échéance</option>
                  <option value="draft">Brouillons</option>
                </select>
              </div>

              {/* Quote Status Filter */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Filtre Devis :
                </label>
                <select
                  value={quoteStatusFilter}
                  onChange={e => setQuoteStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                >
                  <option value="all">Tous les statuts de devis</option>
                  <option value="accepted">Acceptés</option>
                  <option value="converted">Convertis en factures</option>
                  <option value="sent">Envoyés aux clients</option>
                  <option value="draft">Brouillons</option>
                </select>
              </div>
            </>
          )}

          {/* Customer Filter */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={onlyIndebtedCustomers}
                onChange={e => setOnlyIndebtedCustomers(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Clients avec impayés seulement</span>
            </label>
          </div>
        </div>
      </div>

      {/* Grid of 4 Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Factures Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Factures Clients (Ventes)</h3>
                  <span className="text-[11px] text-slate-400">
                    {filteredInvoices.length} facture(s) sélectionnée(s) sur {invoices.length}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/20">
                Livre des Ventes
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Export exhaustif avec détails complets : numéros de facture, IFU client, dates, montants HT, TVA, remises, montants réglés, soldes restants et modes de paiement.
            </p>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Total Facturé</span>
                <span className="font-bold text-white">
                  {formatCurrency(filteredInvoices.reduce((acc, i) => acc + i.total, 0), organization.settings.defaultCurrency, language)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Total Réglé</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(filteredInvoices.reduce((acc, i) => acc + i.amountPaid, 0), organization.settings.defaultCurrency, language)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Reste Dû</span>
                <span className="font-bold text-amber-400">
                  {formatCurrency(filteredInvoices.reduce((acc, i) => acc + i.amountRemaining, 0), organization.settings.defaultCurrency, language)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportInvoices}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-500 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger Factures (.CSV)</span>
          </button>
        </div>

        {/* 2. Devis Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Devis & Estimations Proforma</h3>
                  <span className="text-[11px] text-slate-400">
                    {filteredQuotes.length} devis sélectionné(s) sur {quotes.length}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/20">
                Pipeline Commercial
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Export de vos propositions commerciales : numéros de devis, dates de validité, coordonnées clients, montants prévisionnels, taux de remise et suivi des conversions en factures.
            </p>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Valeur Proforma</span>
                <span className="font-bold text-white">
                  {formatCurrency(filteredQuotes.reduce((acc, q) => acc + q.total, 0), organization.settings.defaultCurrency, language)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Acceptés / Convertis</span>
                <span className="font-bold text-indigo-300">
                  {filteredQuotes.filter(q => q.status === 'accepted' || q.status === 'converted').length} devis
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportQuotes}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger Devis (.CSV)</span>
          </button>
        </div>

        {/* 3. Clients Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Répertoire & Fichier Clients</h3>
                  <span className="text-[11px] text-slate-400">
                    {filteredCustomers.length} client(s) exportable(s) sur {customers.length}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/20">
                CRM & Tiers
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Base de données complète des tiers : Noms, Raisons sociales, IFU client, téléphones, emails, adresses, volumes d'achats cumulés et balances de créances.
            </p>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Créance Totale Due</span>
                <span className="font-bold text-amber-400">
                  {formatCurrency(filteredCustomers.reduce((acc, c) => acc + c.outstandingBalance, 0), organization.settings.defaultCurrency, language)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Clients Débiteurs</span>
                <span className="font-bold text-purple-300">
                  {filteredCustomers.filter(c => c.outstandingBalance > 0).length} client(s)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportCustomers}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger Clients (.CSV)</span>
          </button>
        </div>

        {/* 4. Journal Comptable Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Journal Comptable (SYSCOHADA)</h3>
                  <span className="text-[11px] text-slate-400">
                    Écritures équilibrées Débit / Crédit
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                Grand Livre & Trésorerie
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Génération du journal général de vente et d'encaissement avec numérotation de comptes SYSCOHADA (411 Clients, 706 Ventes, 4431 TVA, 521 Banque / 585 Mobile Money).
            </p>

            <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Règlements Enregistrés</span>
                <span className="font-bold text-emerald-400">
                  {payments.length} opérations
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Comptabilité</span>
                <span className="font-bold text-white">
                  Conforme SYSCOHADA
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportJournal}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger Journal Comptable (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Live Data Preview Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TableProperties className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Aperçu en Direct des Données Sélectionnées
            </h3>
          </div>

          {/* Sub-tabs for preview */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-950/80 p-1 text-xs">
            <button
              onClick={() => setPreviewTab('invoices')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                previewTab === 'invoices' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Factures ({filteredInvoices.length})
            </button>
            <button
              onClick={() => setPreviewTab('quotes')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                previewTab === 'quotes' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Devis ({filteredQuotes.length})
            </button>
            <button
              onClick={() => setPreviewTab('customers')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                previewTab === 'customers' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clients ({filteredCustomers.length})
            </button>
          </div>
        </div>

        {/* Invoices Preview Table */}
        {previewTab === 'invoices' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[11px] font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">N° Facture</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">IFU Client</th>
                  <th className="p-3 text-right">Sous-total HT</th>
                  <th className="p-3 text-right">TVA</th>
                  <th className="p-3 text-right">Total TTC</th>
                  <th className="p-3 text-right">Réglé</th>
                  <th className="p-3 text-right">Solde Dû</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredInvoices.slice(0, 5).map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="p-3 text-slate-400">{inv.issueDate}</td>
                    <td className="p-3 font-sans text-white">{inv.customerName}</td>
                    <td className="p-3 text-slate-400">{inv.customerTaxId || '-'}</td>
                    <td className="p-3 text-right">{formatCurrency(inv.subtotal, inv.currency, language)}</td>
                    <td className="p-3 text-right">{formatCurrency(inv.taxAmount, inv.currency, language)}</td>
                    <td className="p-3 text-right font-bold text-teal-300">{formatCurrency(inv.total, inv.currency, language)}</td>
                    <td className="p-3 text-right text-emerald-400">{formatCurrency(inv.amountPaid, inv.currency, language)}</td>
                    <td className="p-3 text-right text-amber-400 font-bold">{formatCurrency(inv.amountRemaining, inv.currency, language)}</td>
                    <td className="p-3 font-sans">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' :
                        inv.status === 'partially_paid' ? 'bg-amber-500/20 text-amber-300' :
                        inv.status === 'overdue' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInvoices.length > 5 && (
              <p className="p-2.5 text-center text-[11px] text-slate-500 italic bg-slate-900/40 border-t border-slate-800">
                ... et {filteredInvoices.length - 5} autres factures incluses dans le fichier d'export CSV.
              </p>
            )}
          </div>
        )}

        {/* Quotes Preview Table */}
        {previewTab === 'quotes' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[11px] font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">N° Devis</th>
                  <th className="p-3">Date Émission</th>
                  <th className="p-3">Date Validité</th>
                  <th className="p-3">Client</th>
                  <th className="p-3 text-right">Sous-total HT</th>
                  <th className="p-3 text-right">TVA</th>
                  <th className="p-3 text-right">Total TTC</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredQuotes.slice(0, 5).map(q => (
                  <tr key={q.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-white">{q.quoteNumber}</td>
                    <td className="p-3 text-slate-400">{q.issueDate}</td>
                    <td className="p-3 text-slate-400">{q.expiryDate}</td>
                    <td className="p-3 font-sans text-white">{q.customerName}</td>
                    <td className="p-3 text-right">{formatCurrency(q.subtotal, q.currency, language)}</td>
                    <td className="p-3 text-right">{formatCurrency(q.taxAmount, q.currency, language)}</td>
                    <td className="p-3 text-right font-bold text-indigo-300">{formatCurrency(q.total, q.currency, language)}</td>
                    <td className="p-3 font-sans">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        q.status === 'accepted' || q.status === 'converted' ? 'bg-emerald-500/20 text-emerald-300' :
                        q.status === 'sent' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredQuotes.length > 5 && (
              <p className="p-2.5 text-center text-[11px] text-slate-500 italic bg-slate-900/40 border-t border-slate-800">
                ... et {filteredQuotes.length - 5} autres devis inclus dans le fichier d'export CSV.
              </p>
            )}
          </div>
        )}

        {/* Customers Preview Table */}
        {previewTab === 'customers' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[11px] font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Client / Société</th>
                  <th className="p-3">IFU Client</th>
                  <th className="p-3">Téléphone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-right">Total Facturé</th>
                  <th className="p-3 text-right">Total Réglé</th>
                  <th className="p-3 text-right">Solde Dû</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredCustomers.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-sans font-bold text-white">{c.name}</td>
                    <td className="p-3 text-slate-400">{c.taxId || '-'}</td>
                    <td className="p-3 text-slate-300">{c.phone || '-'}</td>
                    <td className="p-3 font-sans text-slate-400">{c.email}</td>
                    <td className="p-3 text-right">{formatCurrency(c.totalInvoiced, organization.settings.defaultCurrency, language)}</td>
                    <td className="p-3 text-right text-emerald-400">{formatCurrency(c.totalPaid, organization.settings.defaultCurrency, language)}</td>
                    <td className="p-3 text-right font-bold text-amber-400">{formatCurrency(c.outstandingBalance, organization.settings.defaultCurrency, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length > 5 && (
              <p className="p-2.5 text-center text-[11px] text-slate-500 italic bg-slate-900/40 border-t border-slate-800">
                ... et {filteredCustomers.length - 5} autres clients inclus dans le fichier d'export CSV.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
