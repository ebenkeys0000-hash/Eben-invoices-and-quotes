import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  Crown, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Sparkles, 
  Lock, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentService } from '../services/paymentService';
import { formatCurrency } from '../utils/formatters';
import { PrivacyPolicyModal } from './compliance/PrivacyPolicyModal';
import { TermsOfServiceModal } from './compliance/TermsOfServiceModal';

export const SubscriptionModal: React.FC = () => {
  const { 
    isSubscriptionModalOpen, 
    setIsSubscriptionModalOpen, 
    subscription, 
    refreshSubscription,
    organization,
    t,
    language 
  } = useApp();

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<'mtn_benin' | 'moov_benin' | 'fedapay' | 'card'>('mtn_benin');
  const [phoneNumber, setPhoneNumber] = useState('+229 97 45 60 12');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ussdMessage, setUssdMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  if (!isSubscriptionModalOpen) return null;

  const monthlyPrice = 10000; // 10,000 XOF ($15)
  const annualPrice = 100000; // 100,000 XOF (2 months free)
  const activePrice = billingPeriod === 'annual' ? annualPrice : monthlyPrice;

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setUssdMessage(null);

    try {
      const res = await PaymentService.initiateSubscriptionPayment({
        orgId: organization.id,
        planId: billingPeriod === 'annual' ? 'premium_annual' : 'premium_monthly',
        provider: selectedProvider,
        phoneNumber,
        cardNumber,
        cardExp,
        cardCvv,
        currency: 'XOF',
      });

      if (res.success) {
        if (res.ussdPrompt) {
          setUssdMessage(res.ussdPrompt);
        }
        refreshSubscription();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          setIsProcessing(false);
          setIsSubscriptionModalOpen(false);
        }, 1800);
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Erreur de traitement du paiement.');
    }
  };

  const isTrial = subscription.status !== 'active';
  const remainingInvoices = Math.max(0, subscription.trialUsage.maxTrialInvoices - subscription.trialUsage.invoicesCount);
  const remainingQuotes = Math.max(0, subscription.trialUsage.maxTrialQuotes - subscription.trialUsage.quotesCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsSubscriptionModalOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 shadow-lg shadow-amber-950/40">
            <Crown className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">EBEN Premium</h3>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                SaaS Professionnel
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Débloquez la facturation illimitée et les paiements Mobile Money
            </p>
          </div>
        </div>

        {/* Current Trial Status Alert */}
        {isTrial && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-200">
            <div className="flex items-center justify-between font-semibold">
              <span>Quota restant sur votre essai :</span>
              <span className="font-mono">{remainingInvoices} Factures • {remainingQuotes} Devis</span>
            </div>
          </div>
        )}

        {/* Billing Period Selector */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-800/80 p-1 border border-slate-700">
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mensuel (10 000 FCFA / $15)
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod('annual')}
            className={`flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold transition-all ${
              billingPeriod === 'annual'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Annuel (100 000 FCFA)</span>
            <span className="rounded bg-amber-400 px-1 py-0.2 text-[9px] font-black text-slate-950">
              -17%
            </span>
          </button>
        </div>

        {/* Plan Features Checklist */}
        <div className="mt-4 space-y-2 rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Inclus dans l'abonnement :
          </p>
          {t.pricing.features.slice(0, 5).map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Payment Methods Selection */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Moyen de Paiement Sécurisé :
          </label>
          <div className="grid grid-cols-2 gap-2">
            {/* MTN MoMo Bénin */}
            <button
              type="button"
              onClick={() => setSelectedProvider('mtn_benin')}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                selectedProvider === 'mtn_benin'
                  ? 'border-yellow-400 bg-yellow-950/30 text-yellow-300 shadow-sm'
                  : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 text-slate-950 font-black text-xs">
                M
              </div>
              <div>
                <div>MTN MoMo</div>
                <div className="text-[10px] opacity-75">Bénin (*880#)</div>
              </div>
            </button>

            {/* Moov Money Bénin */}
            <button
              type="button"
              onClick={() => setSelectedProvider('moov_benin')}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                selectedProvider === 'moov_benin'
                  ? 'border-blue-400 bg-blue-950/30 text-blue-300 shadow-sm'
                  : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white font-black text-xs">
                M
              </div>
              <div>
                <div>Moov Money</div>
                <div className="text-[10px] opacity-75">Bénin (*855#)</div>
              </div>
            </button>

            {/* FedaPay / KKiaPay */}
            <button
              type="button"
              onClick={() => setSelectedProvider('fedapay')}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                selectedProvider === 'fedapay'
                  ? 'border-emerald-400 bg-emerald-950/30 text-emerald-300 shadow-sm'
                  : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white font-black text-xs">
                FP
              </div>
              <div>
                <div>FedaPay Bénin</div>
                <div className="text-[10px] opacity-75">Agrégateur local</div>
              </div>
            </button>

            {/* Carte Bancaire */}
            <button
              type="button"
              onClick={() => setSelectedProvider('card')}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                selectedProvider === 'card'
                  ? 'border-indigo-400 bg-indigo-950/30 text-indigo-300 shadow-sm'
                  : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-white font-black text-xs">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <div>Carte Bancaire</div>
                <div className="text-[10px] opacity-75">Visa / Mastercard</div>
              </div>
            </button>
          </div>
        </div>

        {/* Input Details according to selected provider */}
        <div className="mt-4">
          {selectedProvider === 'mtn_benin' || selectedProvider === 'moov_benin' || selectedProvider === 'fedapay' ? (
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Numéro Mobile Money (+229) :
              </label>
              <div className="flex rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                <Smartphone className="h-4 w-4 text-emerald-400 mr-2 my-auto" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full bg-transparent outline-hidden font-mono"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Vous recevrez une notification USSD sur votre téléphone pour valider avec votre code PIN.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Numéro de Carte :
                </label>
                <div className="flex rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                  <CreditCard className="h-4 w-4 text-indigo-400 mr-2 my-auto" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-transparent outline-hidden font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Expiration :</label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={e => setCardExp(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">CVV :</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* USSD feedback if any */}
        {ussdMessage && (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-200">
            <p className="font-semibold">{ussdMessage}</p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Payment CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-950/50 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>Traitement du paiement en cours...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>
                  Payer {formatCurrency(activePrice, 'XOF', language)} ({billingPeriod === 'annual' ? '1 an' : '1 mois'})
                </span>
              </>
            )}
          </button>
          
          {/* Apple App Store Guideline 3.1.2 Compliance Disclosures */}
          <div className="mt-3 space-y-1.5 text-center text-[10px] text-slate-400">
            <p className="flex items-center justify-center gap-1 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Abonnement à renouvellement automatique. Résiliable à tout moment.</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-emerald-400 hover:underline cursor-pointer"
              >
                Politique de Confidentialité
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                Conditions d'Utilisation (EULA)
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Modals */}
        <PrivacyPolicyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
        />
        <TermsOfServiceModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
      </div>
    </div>
  );
};
