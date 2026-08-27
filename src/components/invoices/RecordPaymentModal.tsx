import React, { useState } from 'react';
import { Invoice, PaymentRecord, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { X, CreditCard, CheckCircle2, Smartphone, DollarSign, Building } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';

interface RecordPaymentModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPaymentRecorded: (updatedInvoice: Invoice) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  invoice,
  onClose,
  onPaymentRecorded,
}) => {
  const { currentUser, language, t } = useApp();
  
  const [amount, setAmount] = useState<number>(invoice.amountRemaining);
  const [method, setMethod] = useState<PaymentRecord['paymentMethod']>('mtn_momo');
  const [reference, setReference] = useState<string>(`MOMO-${Date.now().toString().slice(-6)}`);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('Règlement reçu du client');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Le montant doit être supérieur à zéro.');
      return;
    }
    if (amount > invoice.amountRemaining) {
      setError(`Le montant ne peut pas dépasser le solde restant (${formatCurrency(invoice.amountRemaining, invoice.currency, language)}).`);
      return;
    }

    const result = storage.recordPayment(invoice.id, {
      amount,
      paymentMethod: method,
      date: paymentDate,
      transactionReference: reference,
      notes,
    });

    const updated = result.invoice;
    if (updated) {
      if (updated.status === 'paid') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
      onPaymentRecorded(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Enregistrer un Encaissement</h3>
            <p className="text-xs text-slate-400">
              Facture N° {invoice.invoiceNumber} • {invoice.customerName}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800 mb-5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Total Facture :</span>
            <span className="font-mono font-semibold text-slate-200">
              {formatCurrency(invoice.total, invoice.currency, language)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-emerald-400 mt-1">
            <span>Déjà Encaissé :</span>
            <span className="font-mono font-semibold">
              {formatCurrency(invoice.amountPaid, invoice.currency, language)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-rose-400 mt-2 pt-2 border-t border-slate-800">
            <span>Solde Restant Dû :</span>
            <span className="font-mono">
              {formatCurrency(invoice.amountRemaining, invoice.currency, language)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Montant à encaisser ({invoice.currency}) :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={invoice.amountRemaining}
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm font-mono font-bold text-emerald-400 outline-hidden focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setAmount(invoice.amountRemaining)}
                className="shrink-0 rounded-xl bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-300 border border-slate-700 hover:bg-slate-700"
              >
                Solde total
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Mode de Règlement :
            </label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            >
              <option value="mtn_momo">MTN Mobile Money Bénin</option>
              <option value="moov_money">Moov Money Bénin</option>
              <option value="cash">Espèces / Cash</option>
              <option value="bank_transfer">Virement Bancaire (RIB)</option>
              <option value="cheque">Chèque Bancaire</option>
              <option value="card">Carte Bancaire / TPE</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Date de Paiement :
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                N° Réf. / Transaction :
              </label>
              <input
                type="text"
                value={reference}
                onChange={e => setReference(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Notes & Commentaires :
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Valider l'Encaissement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
