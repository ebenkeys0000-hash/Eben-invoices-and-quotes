import { CurrencyCode, Language } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'XOF', language: Language = 'fr'): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  if (currency === 'XOF') {
    // West African CFA Franc formatting
    const formatted = new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(safeAmount);
    return `${formatted} FCFA`;
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(safeAmount);
  }

  if (currency === 'USD' || currency === 'CAD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(safeAmount);
  }

  return `${new Intl.NumberFormat('fr-FR').format(safeAmount)} ${currency}`;
}

export function formatDate(dateString: string, language: Language = 'fr'): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string, language: Language = 'fr'): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function calculateDocumentTotals(
  items: Array<{ quantity: number; unitPrice: number; discountPercentage?: number; taxRate?: number }>,
  globalDiscountType: 'percentage' | 'fixed' = 'percentage',
  globalDiscountValue: number = 0,
  globalTaxRate: number = 18,
  shippingFee: number = 0
) {
  // 1. Calculate item subtotals
  let itemsSubtotal = 0;
  let itemsTaxTotal = 0;

  items.forEach(item => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const itemDiscPct = Number(item.discountPercentage) || 0;
    const itemTaxPct = Number(item.taxRate) !== undefined ? Number(item.taxRate) : globalTaxRate;

    const base = qty * price;
    const afterItemDiscount = base * (1 - itemDiscPct / 100);
    const itemTax = afterItemDiscount * (itemTaxPct / 100);

    itemsSubtotal += afterItemDiscount;
    itemsTaxTotal += itemTax;
  });

  // 2. Global Discount
  let discountAmount = 0;
  if (globalDiscountType === 'percentage') {
    discountAmount = itemsSubtotal * ((Number(globalDiscountValue) || 0) / 100);
  } else {
    discountAmount = Number(globalDiscountValue) || 0;
  }

  const subtotalAfterDiscount = Math.max(0, itemsSubtotal - discountAmount);

  // Global Tax on remaining subtotal (if item taxes weren't individually set, we adjust)
  const taxAmount = globalTaxRate > 0 ? (subtotalAfterDiscount * (globalTaxRate / 100)) : itemsTaxTotal;
  const shipping = Number(shippingFee) || 0;
  const grandTotal = Math.round(subtotalAfterDiscount + taxAmount + shipping);

  return {
    subtotal: Math.round(itemsSubtotal),
    discountAmount: Math.round(discountAmount),
    taxAmount: Math.round(taxAmount),
    shippingFee: shipping,
    total: grandTotal,
  };
}

export function generateWhatsAppMessage(
  type: 'invoice' | 'quote',
  docNumber: string,
  customerName: string,
  total: number,
  currency: CurrencyCode,
  dueDateOrExpiry: string,
  businessName: string,
  language: Language = 'fr'
): string {
  const formattedAmount = formatCurrency(total, currency, language);
  const formattedDate = formatDate(dueDateOrExpiry, language);

  if (language === 'fr') {
    if (type === 'invoice') {
      return `Bonjour ${customerName},\n\nVeuillez trouver votre facture N° *${docNumber}* émise par *${businessName}*.\n\n` +
        `💵 *Montant Total :* ${formattedAmount}\n` +
        `📅 *Date d'échéance :* ${formattedDate}\n\n` +
        `Merci de votre confiance !\n_${businessName}_`;
    } else {
      return `Bonjour ${customerName},\n\nVoici votre devis N° *${docNumber}* de la part de *${businessName}*.\n\n` +
        `💵 *Montant Estimé :* ${formattedAmount}\n` +
        `⏳ *Offre valable jusqu'au :* ${formattedDate}\n\n` +
        `Restant à votre entière disposition pour toute question.\n_${businessName}_`;
    }
  } else {
    if (type === 'invoice') {
      return `Hello ${customerName},\n\nPlease find attached invoice *${docNumber}* from *${businessName}*.\n\n` +
        `💵 *Total Amount:* ${formattedAmount}\n` +
        `📅 *Due Date:* ${formattedDate}\n\n` +
        `Thank you for your business!\n_${businessName}_`;
    } else {
      return `Hello ${customerName},\n\nHere is your quotation *${docNumber}* from *${businessName}*.\n\n` +
        `💵 *Estimated Total:* ${formattedAmount}\n` +
        `⏳ *Valid until:* ${formattedDate}\n\n` +
        `Feel free to reach out with any questions.\n_${businessName}_`;
    }
  }
}
