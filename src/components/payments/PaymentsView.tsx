import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  CreditCard, 
  Search, 
  Smartphone, 
  Building, 
  DollarSign, 
  Calendar, 
  CheckCircle2,
  Download
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PaymentsView: React.FC = () => {
  const { language, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const payments = storage.getAllPayments();
  const invoices = storage.getInvoices();

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter(p => {
    const inv = invoices.find(i => i.id === p.invoiceId);
    const matchesSearch = 
      (p.transactionReference && p.transactionReference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv && inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv && inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (methodFilter === 'all') return true;
    return p.paymentMethod === methodFilter;
  });

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'mtn_momo':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs font-bold text-yellow-300 border border-yellow-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
            MTN MoMo (*880#)
          </span>
        );
      case 'moov_money':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            Moov Money (*855#)
          </span>
        );
      case 'bank_transfer':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30">
            <Building className="h-3 w-3" />
            Virement Bancaire
          </span>
        );
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <DollarSign className="h-3 w-3" />
            Espèces / Cash
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2.5 py-0.5 text-xs font-bold text-slate-300">
            {method}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-emerald-400" />
            <span>Historique des Paiements Reçus</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Journal comptable des encaissements Mobile Money, virements et espèces
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Encaissé</span>
          <span className="font-mono text-base sm:text-lg font-black text-white">
            {formatCurrency(totalCollected, 'XOF', language)}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher par référence, n° facture, client..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'mtn_momo', label: 'MTN MoMo' },
            { id: 'moov_money', label: 'Moov Money' },
            { id: 'bank_transfer', label: 'Virement' },
            { id: 'cash', label: 'Espèces' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMethodFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                methodFilter === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-300">Aucun paiement trouvé</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Les encaissements enregistrés sur vos factures apparaîtront automatiquement ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">N° Transaction / Réf.</th>
                  <th className="py-3 px-4">Facture & Client</th>
                  <th className="py-3 px-4">Mode de Règlement</th>
                  <th className="py-3 px-4 text-right">Montant Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPayments.map(p => {
                  const inv = invoices.find(i => i.id === p.invoiceId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {formatDate(p.paymentDate, language)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-200">
                        {p.transactionReference || p.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">
                          {inv ? inv.invoiceNumber : 'Facture'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {inv ? inv.customerName : 'Client'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getMethodBadge(p.paymentMethod)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-sm font-black text-emerald-400">
                        +{formatCurrency(p.amount, inv ? inv.currency : 'XOF', language)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
