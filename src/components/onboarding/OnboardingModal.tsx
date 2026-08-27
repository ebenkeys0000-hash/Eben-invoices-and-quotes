import React, { useState } from 'react';
import { 
  FileText, 
  WifiOff, 
  Smartphone, 
  FileSpreadsheet, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Sparkles,
  ShieldCheck,
  Zap,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: FileText,
      badge: 'Étape 1/4 • Facturation Instantanée',
      color: 'from-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      title: 'Créez vos Devis & Factures en 30 secondes',
      description: 'Générez des factures et devis professionnels prêts à l\'impression ou au partage WhatsApp en format vectoriel A4. Convertissez un devis accepté en facture en un seul clic !',
      features: [
        'Calculs automatiques (Sous-total, Remises, TVA 18% UEMOA)',
        'Conversion Devis ➜ Facture instantanée',
        'Personnalisation avec votre Logo & Thèmes graphiques',
        'Partage direct PDF & WhatsApp'
      ]
    },
    {
      icon: WifiOff,
      badge: 'Étape 2/4 • Offline-First',
      color: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      title: 'Travaillez 100% Hors-Ligne sans coupure',
      description: 'Même sans connexion internet (dans vos déplacements ou en zone à faible réseau), créez vos documents et enregistrez vos encaissements. Tout se synchronise automatiquement dès le retour du réseau.',
      features: [
        'Accès instantané à vos données en local',
        'File d\'attente de synchronisation transparente',
        'Indicateur réseau dynamique en direct',
        'Aucune perte de données en cas de panne réseau'
      ]
    },
    {
      icon: Smartphone,
      badge: 'Étape 3/4 • Règlements Locaux',
      color: 'from-amber-600 to-orange-600',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: 'Encaissez par Mobile Money & Cartes',
      description: 'Recevez les paiements de vos clients via MTN Mobile Money (*880#), Moov Money (*855#), cartes bancaires ou espèces avec mise à jour immédiate du solde client.',
      features: [
        'Intégration MTN MoMo & Moov Africa Bénin',
        'Passerelles FedaPay, KKiaPay & Virements',
        'Reçus de paiement avec référence de transaction',
        'Suivi des impayés et créances en temps réel'
      ]
    },
    {
      icon: FileSpreadsheet,
      badge: 'Étape 4/4 • Fiscalité & Comptabilité',
      color: 'from-purple-600 to-pink-600',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      title: 'Conformité Fiscale & Exports Comptables',
      description: 'Respectez la législation béninoise avec l\'intégration de vos numéros IFU, RCCM et QR Codes de vérification. Exportez vos livres de ventes au format CSV pour votre comptable.',
      features: [
        'Mentions légales Bénin (IFU, RCCM, QR Code)',
        'Exports CSV Excel / SYSCOHADA (Factures, Devis, Clients)',
        'Journal général de vente Débit/Crédit équilibré',
        'Multi-utilisateurs avec gestion fine des rôles (RBAC)'
      ]
    }
  ];

  const stepData = steps[currentStep];
  const StepIcon = stepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      localStorage.setItem('eben_has_completed_onboarding', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 my-8 text-slate-200">
        {/* Top bar with Close & Skip */}
        <div className="flex items-center justify-between mb-4">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-300 border border-slate-700">
            {stepData.badge}
          </span>
          <button
            onClick={() => {
              localStorage.setItem('eben_has_completed_onboarding', 'true');
              onClose();
            }}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Passer l'introduction"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Visual Header */}
        <div className="text-center py-4 space-y-3">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${stepData.iconBg} border shadow-lg`}>
            <StepIcon className="h-10 w-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {stepData.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {stepData.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="my-5 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2.5">
          {stepData.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStep 
                  ? 'w-8 bg-emerald-500' 
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${stepData.color} px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-all cursor-pointer ml-auto`}
          >
            <span>{currentStep === steps.length - 1 ? 'Commencer à Facturer' : 'Suivant'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
