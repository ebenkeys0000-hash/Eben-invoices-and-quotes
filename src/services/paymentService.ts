import { storage } from './storage';
import { CurrencyCode } from '../types';

export interface PaymentInitiateRequest {
  orgId: string;
  planId: 'premium_monthly' | 'premium_annual';
  provider: 'mtn_benin' | 'moov_benin' | 'fedapay' | 'kkiapay' | 'card';
  phoneNumber?: string;
  cardNumber?: string;
  cardExp?: string;
  cardCvv?: string;
  currency: CurrencyCode;
}

export interface PaymentInitiateResponse {
  success: boolean;
  transactionId: string;
  message: string;
  status: 'pending_ussd' | 'completed' | 'failed';
  ussdPrompt?: string;
}

export class PaymentService {
  public static async initiateSubscriptionPayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    const settings = storage.getPlatformSettings();
    const amount = req.planId === 'premium_annual' ? settings.annualPrice : settings.monthlyPrice;

    const txId = `TX_${req.provider.toUpperCase()}_${Date.now()}`;

    // USSD prompt for Benin Mobile Money
    let ussdPrompt = '';
    let providerName: 'MTN Mobile Money' | 'Moov Money' | 'FedaPay' | 'KKiaPay' | 'Card / Stripe' = 'MTN Mobile Money';

    if (req.provider === 'mtn_benin') {
      providerName = 'MTN Mobile Money';
      ussdPrompt = `Composez *880# sur votre téléphone ${req.phoneNumber || '+229 97...'} et entrez votre code PIN pour valider le prélèvement de ${amount} FCFA vers EBEN SAAS.`;
    } else if (req.provider === 'moov_benin') {
      providerName = 'Moov Money';
      ussdPrompt = `Composez *855# sur votre téléphone ${req.phoneNumber || '+229 95...'} et confirmez avec votre code secret Moov Money Bénin.`;
    } else if (req.provider === 'fedapay') {
      providerName = 'FedaPay';
      ussdPrompt = `Redirection vers la passerelle sécurisée FedaPay Bénin (Agrégateur MTN, Moov & Cartes).`;
    } else if (req.provider === 'kkiapay') {
      providerName = 'KKiaPay';
      ussdPrompt = `Widget de paiement sécurisé KKiaPay Bénin activé.`;
    } else {
      providerName = 'Card / Stripe';
      ussdPrompt = `Authentification 3D Secure bancaire validée.`;
    }

    // Simulate backend payment processing with delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Record Platform Transaction
    const org = storage.getOrganization();
    const fee = Math.round(amount * 0.02); // 2% gateway fee
    storage.recordPlatformTransaction({
      orgId: org.id,
      orgName: org.name,
      userEmail: org.email,
      amount,
      currency: req.currency,
      planId: req.planId,
      provider: providerName,
      providerTransactionId: txId,
      status: 'completed',
      feeAmount: fee,
      netAmount: amount - fee,
    });

    // Update Organization Subscription in Storage
    const now = new Date();
    const renewalDays = req.planId === 'premium_annual' ? 365 : 30;
    const renewalDate = new Date(now.getTime() + renewalDays * 24 * 60 * 60 * 1000).toISOString();

    storage.updateSubscription({
      planId: req.planId,
      planName: req.planId === 'premium_annual' ? 'EBEN Premium Annuel' : 'EBEN Premium Mensuel',
      status: 'active',
      price: amount,
      currency: req.currency,
      billingPeriod: req.planId === 'premium_annual' ? 'annual' : 'monthly',
      startDate: now.toISOString(),
      renewalDate,
      paymentProvider: req.provider === 'card' ? 'stripe' : (req.provider as 'mtn_benin' | 'moov_benin' | 'fedapay' | 'kkiapay'),
      autoRenew: true,
    });

    // Add in-app notification
    storage.addNotification({
      orgId: org.id,
      title: 'Paiement Confirmé ! 🎉',
      message: `Votre abonnement EBEN Premium a été activé avec succès via ${providerName} (${amount} ${req.currency}). Validité jusqu'au ${new Date(renewalDate).toLocaleDateString('fr-FR')}.`,
      type: 'subscription',
      read: false,
    });

    return {
      success: true,
      transactionId: txId,
      message: 'Paiement validé avec succès.',
      status: 'completed',
      ussdPrompt,
    };
  }
}
