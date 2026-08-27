import React, { useState } from 'react';
import { Quote } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  ArrowRightCircle, 
  Edit3, 
  Trash2, 
  Share2, 
  CheckCircle2, 
  Clock, 
  XCircle
} from 'lucide-react';
import { formatCurrency, formatDate, generateWhatsAppMessage } from '../../utils/formatters';
import { generateDocumentPdf } from '../../services/pdfGenerator';
import confetti from 'canvas-confetti';

interface QuotesViewProps {
  onOpenNewQuote: () => void;
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onConvertQuote: (quote: Quote) => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  onOpenNewQuote,
  onViewQuote,
  onEditQuote,
  onConvertQuote,
}) => {
  const { organization, language, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const quotes = storage.getQuotes();

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.items.some(i => i.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return q.status === statusFilter;
  });

  const totalValue = quotes.reduce((sum, q) => sum + q.total, 0);
  const activeQuotesCount = quotes.filter(q => q.status === 'sent' || q.status === 'accepted').length;

  const handleDelete = (id: string, quoteNum: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le devis ${quoteNum} ?`)) {
      storage.deleteQuote(id);
    }
  };

  const handleDownloadPdf = (e: React.MouseEvent, q: Quote) => {
    e.stopPropagation();
    generateDocumentPdf(q, 'quote', organization, language);
  };

  const handleWhatsApp = (e: React.MouseEvent, q: Quote) => {
    e.stopPropagation();
    const msg = generateWhatsAppMessage(
      'quote',
      q.quoteNumber,
      q.customerName,
      q.total,
      q.currency,
      q.expiryDate,
      organization.name,
      language
    );
    const phoneClean = q.customerPhone ? q.customerPhone.replace(/[^0-9]/g, '') : '';
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
            <FileSpreadsheet className="h-6 w-6 text-teal-400" />
            <span>Devis & Proformas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Émettez des propositions commerciales et transformez-les en factures d'un clic
          </p>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-950/40 hover:from-teal-500 hover:to-emerald-500 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Nouveau Devis</span>
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400">Total Proposé</span>
          <p className="mt-1 font-mono text-base sm:text-lg font-black text-white">
            {formatCurrency(totalValue, 'XOF', language)}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-teal-400">Devis Actifs</span>
          <p className="mt-1 font-mono text-base sm:text-lg font-black text-teal-300">
            {activeQuotesCount} proposition(s)
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-emerald-400">Taux de Conversion</span>
          <p className="mt-1 font-mono text-base sm:text-lg font-black text-emerald-300">
            {quotes.length > 0 
              ? `${Math.round((quotes.filter(q => q.status === 'converted' || q.status === 'accepted').length / quotes.length) * 100)}%`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher devis, client..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2 text-xs text-white outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'draft', label: 'Brouillons' },
            { id: 'sent', label: 'Envoyés' },
            { id: 'accepted', label: 'Acceptés' },
            { id: 'converted', label: 'Convertis' },
            { id: 'rejected', label: 'Refusés' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        {filteredQuotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-300">Aucun devis trouvé</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Créez votre première proposition commerciale ou modifiez vos filtres.
            </p>
            <button
              onClick={onOpenNewQuote}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-500"
            >
              <Plus className="h-4 w-4" />
              Créer un Devis
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredQuotes.map(q => (
              <div
                key={q.id}
                onClick={() => onViewQuote(q)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-800/40 transition-colors cursor-pointer gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      {q.quoteNumber}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      q.status === 'accepted'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : q.status === 'converted'
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20'
                        : q.status === 'rejected'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                    }`}>
                      {t.quotes.statuses[q.status]}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300">
                    {q.customerName}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Émis le {formatDate(q.issueDate, language)} • Validité : {formatDate(q.expiryDate, language)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-sm font-black text-white">
                      {formatCurrency(q.total, q.currency, language)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {q.items.length} prestation(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Convert to Invoice trigger button */}
                    {q.status !== 'converted' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onConvertQuote(q);
                        }}
                        title="Convertir en Facture"
                        className="flex items-center gap-1 rounded-lg bg-teal-600/20 px-2.5 py-1.5 text-xs font-bold text-teal-300 border border-teal-500/30 hover:bg-teal-600 hover:text-white transition-colors"
                      >
                        <ArrowRightCircle className="h-4 w-4" />
                        <span className="hidden md:inline">Convertir</span>
                      </button>
                    )}

                    <button
                      onClick={e => handleWhatsApp(e, q)}
                      title="Envoyer par WhatsApp"
                      className="rounded-lg bg-slate-800 p-2 text-emerald-400 hover:bg-slate-700 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={e => handleDownloadPdf(e, q)}
                      title="Télécharger PDF"
                      className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onEditQuote(q);
                      }}
                      title="Modifier"
                      className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(q.id, q.quoteNumber);
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
