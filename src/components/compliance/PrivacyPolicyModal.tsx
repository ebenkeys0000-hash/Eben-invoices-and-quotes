import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Trash2, Database, Globe, CheckCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDeleteAccount?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onRequestDeleteAccount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 my-8 text-slate-200 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Politique de Confidentialité & Protection des Données</h2>
              <p className="text-xs text-slate-400">
                Conforme aux exigences Google Play, Apple App Store & APDP Bénin / RGPD
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

        {/* Content Body */}
        <div className="overflow-y-auto pr-2 space-y-6 py-4 text-xs leading-relaxed text-slate-300">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-emerald-200">
            <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
              <CheckCircle className="h-4 w-4" />
              <span>Engagement de Transparence et de Sécurité</span>
            </div>
            <p>
              L'application <strong>EBEN Invoices & Quotes</strong> (éditée par <strong>Eben Keys / EBEN Tech</strong>) s'engage à protéger la confidentialité de vos données d'entreprise et financières. Nous ne vendons, ne louons et ne partageons jamais vos informations avec des régies publicitaires tierces.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>1. Données Collectées & Finalités</span>
            </h3>
            <p>Dans le cadre strict du fonctionnement des services de facturation et de devis, l'application traite :</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>Informations d'Entreprise :</strong> Nom commercial, adresse, numéro fiscal IFU, RCCM, logo, coordonnées téléphoniques et bancaires.</li>
              <li><strong>Documents Financiers :</strong> Devis, factures, lignes d'articles, taux de TVA, remises et totaux TTC.</li>
              <li><strong>Répertoire Clients :</strong> Noms, emails, numéros de téléphone et adresses de facturation de vos clients.</li>
              <li><strong>Historique des Règlements :</strong> Montants encaissés, modes de paiement (MTN Mobile Money, Moov Money, Carte, Espèces) et références de transaction.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>2. Stockage Local Hors-Ligne & Sécurité des Données</span>
            </h3>
            <p>
              L'application fonctionne selon une architecture <strong>Offline-First</strong>. Vos données sont chiffrées et stockées localement sur votre appareil. Lors de la synchronisation réseau, toutes les communications transitent via des protocoles sécurisés <strong>HTTPS / TLS 1.3</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-emerald-400" />
              <span>3. Absence de Traçage Publicitaire (App Tracking Transparency)</span>
            </h3>
            <p>
              EBEN Invoices & Quotes <strong>n'utilise aucun traceur publicitaire tiers</strong> (Google AdMob, Meta Audience Network, etc.). Conformément aux directives Apple App Store (Guideline 5.1.2) et Google Play Data Safety, vos données ne sont utilisées que pour exécuter les fonctionnalités de gestion comptable que vous demandez.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>4. Partage et Prestataires Tiers</span>
            </h3>
            <p>
              Les données ne sont communiquées qu'aux prestataires d'agrégation de paiement expressément autorisés par l'utilisateur lors du règlement (MTN Bénin, Moov Africa, FedaPay, KKiaPay) pour valider les transactions USSD/Carte.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-400" />
              <span>5. Droit à l'Effacement & Suppression du Compte (Apple Guideline 5.1.1(v))</span>
            </h3>
            <p>
              Conformément aux exigences strictes de Google Play et de l'Apple App Store, vous disposez d'un droit inconditionnel et instantané d'effacement de l'intégralité de votre compte, de vos documents et de vos données locales directement depuis l'application.
            </p>
          </section>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
            <p className="text-[11px] text-slate-400">
              <strong>Responsable du Traitement :</strong> Eben Keys — EBEN Tech Bénin<br />
              <strong>Contact DPO / Support :</strong> <a href="mailto:support@eben.bj" className="text-emerald-400 hover:underline">support@eben.bj</a> / <a href="mailto:ebenezeramedendi@gmail.com" className="text-emerald-400 hover:underline">ebenezeramedendi@gmail.com</a><br />
              <strong>Dernière mise à jour :</strong> Août 2026 (Version de production certifiée pour publication Store)
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4 shrink-0">
          {onRequestDeleteAccount ? (
            <button
              onClick={() => {
                onClose();
                onRequestDeleteAccount();
              }}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-xs font-semibold py-2 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer mon compte & mes données</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer"
          >
            Fermer la Politique
          </button>
        </div>
      </div>
    </div>
  );
};
