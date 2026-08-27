import React from 'react';
import { X, FileText, CreditCard, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-indigo-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 my-8 text-slate-200 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Conditions Générales d'Utilisation & Abonnement (EULA)</h2>
              <p className="text-xs text-slate-400">
                Conforme aux exigences Apple App Store Guideline 3.1.2 & Google Play Billing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-2 space-y-5 py-4 text-xs leading-relaxed text-slate-300">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 text-indigo-200">
            <p className="font-semibold">
              Bienvenue sur <strong>EBEN Invoices & Quotes</strong>. En accédant ou en utilisant l'application, vous acceptez d'être lié par les présentes Conditions d'Utilisation et le Contrat de Licence Utilisateur Final (EULA).
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-400" />
              <span>1. Formules d'Abonnement & Tarification</span>
            </h3>
            <p>
              L'accès aux fonctionnalités illimitées d'EBEN Invoices & Quotes est proposé sous forme d'abonnements à renouvellement automatique :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 font-mono">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-emerald-400 font-bold block text-xs">Abonnement Premium Mensuel</span>
                <span className="text-base font-black text-white">10 000 FCFA / mois ($15 USD)</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-sans">Facturation récurrente mensuelle, sans engagement.</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-indigo-400 font-bold block text-xs">Abonnement Premium Annuel (2 mois offerts)</span>
                <span className="text-base font-black text-white">100 000 FCFA / an ($150 USD)</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-sans">Facturation récurrente annuelle avec remise avantageuse.</span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-indigo-400" />
              <span>2. Modalités de Renouvellement Automatique & Résiliation (Apple Guideline 3.1.2)</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Le paiement est débité sur votre compte Mobile Money ou carte bancaire au moment de la confirmation d'achat.</li>
              <li>L'abonnement se renouvelle automatiquement à moins qu'il ne soit annulé au moins 24 heures avant la fin de la période en cours.</li>
              <li>Vous pouvez gérer et résilier votre abonnement à tout moment directement depuis la section <strong>Paramètres de l'Entreprise</strong> de l'application ou en contactant notre support technique.</li>
              <li>Toute portion inutilisée d'une période d'essai gratuit sera perdue lors de l'achat d'un abonnement.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>3. Période d'Essai Gratuit</span>
            </h3>
            <p>
              Chaque nouvelle entreprise bénéficie automatiquement d'un quota d'essai gratuit (5 factures et 5 devis complets avec génération de PDF et encaissements sans carte bancaire requise) pour évaluer l'application en conditions réelles.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>4. Propriété des Données & Responsabilité Fiscale</span>
            </h3>
            <p>
              L'utilisateur conserve la pleine et entière propriété de l'ensemble de ses données, devis, factures et fichiers clients. L'utilisateur est seul responsable de l'exactitude de ses mentions légales (numéro IFU, TVA applicable, RCCM).
            </p>
          </section>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-400">
            <strong>Éditeur :</strong> EBEN Tech / Eben Keys — Cotonou, République du Bénin<br />
            <strong>Contact Support :</strong> support@eben.bj / ebenezeramedendi@gmail.com
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-800 pt-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Fermer les Conditions
          </button>
        </div>
      </div>
    </div>
  );
};
