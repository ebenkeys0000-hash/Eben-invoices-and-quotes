import React, { useState } from 'react';
import { Invoice } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpDown,
  Share2
} from 'lucide-react';
import { formatCurrency, formatDate, generateWhatsAppMessage } from '../../utils/formatters';
import { generateDocumentPdf } from '../../services/pdfGenerator';

interface InvoicesViewProps {
  onOpenNewInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  onOpenNewInvoice,
  onViewInvoice,
  onEditInvoice,
  onRecordPayment,
}) => {
  const { organization, language, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const invoices = storage.getInvoices();

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.items.some(i => i.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return inv.status === statusFilter;
  });

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalDue = invoices.reduce((sum, inv) => sum + inv.amountRemaining, 0);

  const handleDelete = (id: string, invNum: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invNum} ?`)) {
      storage.deleteInvoice(id);
    }
  };

  const handleDownloadPdf = (e: React.MouseEvent, inv: Invoice) => {
    e.stopPropagation();
    generateDocumentPdf(inv, 'invoice', organization, language);
  };

  const handleWhatsApp = (e: React.MouseEvent, inv: Invoice) => {
    e.stopPropagation();
    const msg = generateWhatsAppMessage(
      'invoice',
      inv.invoiceNumber,
      inv.customerName,
      inv.total,
      inv.currency,
      inv.dueDate,
      organization.name,
      language
    );
    const phoneClean = inv.customerPhone ? inv.customerPhone.replace(/[^0-9]/g, '') : '';
    const url = phoneClean 
      ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-400" />
            <span>Factures de Vente</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Créez, gérez et suivez les règlements de vos factures clients
          </p>
        </div>

        <button
          onClick={onOpenNewInvoice}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Nouvelle Facture</span>
        </button>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400">Total Facturé</span>
          <p className="mt-1 font-mono text-base sm:text-lg font-black text-white">
            {formatCurrency(totalAmount, 'XOF', language)}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-emerald-400">Total Encaissé</span>
          <p className="mt-1 font-mono text-base sm:text-lg font-black text-emerald-300">
            {formatCurrency(totalPaid, 'XOF', language)}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-rose-400">Solde Restant Dû</span>
          <p className="mt-1 font-mono text-base sm:text-lg font-black text-rose-300">
            {formatCurrency(totalDue, 'XOF', language)}
          </p>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher par n° de facture, client..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'draft', label: 'Brouillons' },
            { id: 'sent', label: 'Envoyées' },
            { id: 'partially_paid', label: 'Partielles' },
            { id: 'paid', label: 'Payées' },
            { id: 'overdue', label: 'En retard' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-300">Aucune facture trouvée</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Créez votre première facture de vente ou ajustez vos critères de recherche.
            </p>
            <button
              onClick={onOpenNewInvoice}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500"
            >
              <Plus className="h-4 w-4" />
              Créer une Facture
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredInvoices.map(inv => (
              <div
                key={inv.id}
                onClick={() => onViewInvoice(inv)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-800/40 transition-colors cursor-pointer gap-3"
              >
                {/* Left: Doc info & Customer */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      {inv.invoiceNumber}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      inv.status === 'paid'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : inv.status === 'partially_paid'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : inv.status === 'overdue'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                    }`}>
                      {t.invoices.statuses[inv.status]}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300">
                    {inv.customerName}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Émise le {formatDate(inv.issueDate, language)} • Échéance : {formatDate(inv.dueDate, language)}
                  </p>
                </div>

                {/* Right: Amounts & Quick Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-sm font-black text-white">
                      {formatCurrency(inv.total, inv.currency, language)}
                    </p>
                    {inv.amountRemaining > 0 && inv.status !== 'draft' ? (
                      <p className="text-[11px] font-mono text-rose-400">
                        Reste : {formatCurrency(inv.amountRemaining, inv.currency, language)}
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-400">
                        Payée à 100%
                      </p>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1">
                    {inv.amountRemaining > 0 && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onRecordPayment(inv);
                        }}
                        title="Encaisser paiement"
                        className="rounded-lg bg-emerald-600/20 p-2 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={e => handleWhatsApp(e, inv)}
                      title="Envoyer par WhatsApp"
                      className="rounded-lg bg-slate-800 p-2 text-emerald-400 hover:bg-slate-700 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={e => handleDownloadPdf(e, inv)}
                      title="Télécharger PDF"
                      className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onEditInvoice(inv);
                      }}
                      title="Modifier"
                      className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(inv.id, inv.invoiceNumber);
                      }}
                      title="Supprimer"
                      className="rounded-lg bg-slate-800 p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
