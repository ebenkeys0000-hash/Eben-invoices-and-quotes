import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { storage } from '../../services/storage';

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    if (confirmationInput.trim().toUpperCase() !== 'SUPPRIMER') {
      return;
    }

    setIsDeleting(true);

    setTimeout(() => {
      // Clear all local storage keys
      localStorage.clear();
      setIsDeleting(false);
      setDeletionSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-rose-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 my-8 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {deletionSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Compte et données effacés avec succès</h3>
            <p className="text-xs text-slate-300">
              Toutes les données associées à votre entreprise ont été définitivement purgées. L'application va redémarrer dans un instant...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Suppression Définitive du Compte</h3>
                <p className="text-xs text-rose-400 font-semibold">
                  Conformité Apple Guideline 5.1.1(v) & Google Play
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Attention : cette action est irréversible</span>
              </div>
              <p>
                La suppression de votre compte effacera instantanément et de manière définitive :
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-rose-300/90">
                <li>L'ensemble de vos factures et devis générés</li>
                <li>Votre répertoire clients et balances de créances</li>
                <li>Vos identifiants d'entreprise (IFU, RCCM, logos)</li>
                <li>L'historique des règlements et écritures comptables</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Veuillez taper <strong className="text-rose-400 font-mono">SUPPRIMER</strong> pour confirmer la suppression :
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="SUPPRIMER"
                disabled={isDeleting}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-hidden focus:border-rose-500 font-mono uppercase tracking-wider"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmationInput.trim().toUpperCase() !== 'SUPPRIMER' || isDeleting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Purge en cours...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Confirmer la suppression</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
