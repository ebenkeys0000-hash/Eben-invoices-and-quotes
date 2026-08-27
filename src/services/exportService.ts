import { Invoice, Quote, Customer, PaymentRecord } from '../types';

export type CSVDelimiter = ';' | ',';

// Helper to escape CSV fields according to RFC 4180
const escapeCSVField = (val: string | number | boolean | null | undefined, delimiter: CSVDelimiter): string => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // If string contains delimiter, double quote, or newlines, wrap in quotes and escape internal quotes
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Trigger browser file download with UTF-8 BOM
export const downloadCSV = (filename: string, content: string): void => {
  // UTF-8 BOM (\uFEFF) ensures Excel and accounting tools render accented characters (é, è, à, etc.) properly
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'paid': return 'Payée';
    case 'partially_paid': return 'Partiellement payée';
    case 'sent': return 'Envoyée';
    case 'viewed': return 'Consultée';
    case 'draft': return 'Brouillon';
    case 'overdue': return 'En retard';
    case 'cancelled': return 'Annulée';
    case 'accepted': return 'Accepté';
    case 'rejected': return 'Refusé';
    case 'converted': return 'Converti en facture';
    case 'expired': return 'Expiré';
    default: return status;
  }
};

const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'mtn_momo': return 'MTN Mobile Money';
    case 'moov_money': return 'Moov Money';
    case 'card': return 'Carte bancaire';
    case 'bank_transfer': return 'Virement bancaire';
    case 'cash': return 'Espèces';
    case 'cheque': return 'Chèque';
    default: return method;
  }
};

/**
 * Export Invoices to CSV formatted for accounting
 */
export const exportInvoicesToCSV = (
  invoices: Invoice[],
  options?: {
    delimiter?: CSVDelimiter;
    startDate?: string;
    endDate?: string;
    status?: string;
  }
): { rowCount: number; filename: string } => {
  const delimiter = options?.delimiter || ';';
  
  let filtered = [...invoices];
  if (options?.startDate) {
    filtered = filtered.filter(i => i.issueDate >= options.startDate!);
  }
  if (options?.endDate) {
    filtered = filtered.filter(i => i.issueDate <= options.endDate!);
  }
  if (options?.status && options.status !== 'all') {
    filtered = filtered.filter(i => i.status === options.status);
  }

  const headers = [
    'Numéro Facture',
    'Date Émission',
    'Date Échéance',
    'Statut',
    'Client',
    'IFU Client',
    'Email Client',
    'Téléphone Client',
    'Adresse Client',
    'Sous-total HT',
    'Type Remise',
    'Valeur Remise',
    'Montant Remise',
    'Taux TVA (%)',
    'Montant TVA',
    'Frais Supplémentaires',
    'Total TTC',
    'Montant Encaissé',
    'Solde Restant Dû',
    'Devise',
    'Modes de Paiement',
    'Nombre Règlements',
    'Devis d\'Origine',
    'Date Création'
  ];

  const rows = filtered.map(inv => {
    const paymentMethods = inv.payments && inv.payments.length > 0
      ? Array.from(new Set(inv.payments.map(p => getPaymentMethodLabel(p.paymentMethod)))).join(', ')
      : 'Aucun';

    return [
      escapeCSVField(inv.invoiceNumber, delimiter),
      escapeCSVField(inv.issueDate, delimiter),
      escapeCSVField(inv.dueDate, delimiter),
      escapeCSVField(getStatusLabel(inv.status), delimiter),
      escapeCSVField(inv.customerName, delimiter),
      escapeCSVField(inv.customerTaxId || 'Non renseigné', delimiter),
      escapeCSVField(inv.customerEmail || '', delimiter),
      escapeCSVField(inv.customerPhone || '', delimiter),
      escapeCSVField(inv.customerAddress || '', delimiter),
      escapeCSVField(inv.subtotal.toFixed(2), delimiter),
      escapeCSVField(inv.discountType === 'percentage' ? 'Pourcentage (%)' : 'Montant Fixe', delimiter),
      escapeCSVField(inv.discountValue || 0, delimiter),
      escapeCSVField(inv.discountAmount.toFixed(2), delimiter),
      escapeCSVField(inv.taxRate || 0, delimiter),
      escapeCSVField(inv.taxAmount.toFixed(2), delimiter),
      escapeCSVField((inv.shippingFee || 0).toFixed(2), delimiter),
      escapeCSVField(inv.total.toFixed(2), delimiter),
      escapeCSVField(inv.amountPaid.toFixed(2), delimiter),
      escapeCSVField(inv.amountRemaining.toFixed(2), delimiter),
      escapeCSVField(inv.currency, delimiter),
      escapeCSVField(paymentMethods, delimiter),
      escapeCSVField(inv.payments?.length || 0, delimiter),
      escapeCSVField(inv.quoteId || 'Direct', delimiter),
      escapeCSVField(inv.createdAt ? inv.createdAt.split('T')[0] : '', delimiter),
    ].join(delimiter);
  });

  const csvContent = [headers.join(delimiter), ...rows].join('\r\n');
  const todayStr = new Date().toISOString().split('T')[0];
  const filename = `export_factures_${todayStr}.csv`;
  
  downloadCSV(filename, csvContent);
  return { rowCount: filtered.length, filename };
};

/**
 * Export Quotes to CSV formatted for accounting and sales analysis
 */
export const exportQuotesToCSV = (
  quotes: Quote[],
  options?: {
    delimiter?: CSVDelimiter;
    startDate?: string;
    endDate?: string;
    status?: string;
  }
): { rowCount: number; filename: string } => {
  const delimiter = options?.delimiter || ';';

  let filtered = [...quotes];
  if (options?.startDate) {
    filtered = filtered.filter(q => q.issueDate >= options.startDate!);
  }
  if (options?.endDate) {
    filtered = filtered.filter(q => q.issueDate <= options.endDate!);
  }
  if (options?.status && options.status !== 'all') {
    filtered = filtered.filter(q => q.status === options.status);
  }

  const headers = [
    'Numéro Devis',
    'Date Émission',
    'Date Validité',
    'Statut',
    'Client',
    'IFU Client',
    'Email Client',
    'Téléphone Client',
    'Adresse Client',
    'Sous-total HT',
    'Type Remise',
    'Valeur Remise',
    'Montant Remise',
    'Taux TVA (%)',
    'Montant TVA',
    'Frais Supplémentaires',
    'Total TTC',
    'Devise',
    'Facture Issue',
    'Date Conversion',
    'Date Création'
  ];

  const rows = filtered.map(q => {
    return [
      escapeCSVField(q.quoteNumber, delimiter),
      escapeCSVField(q.issueDate, delimiter),
      escapeCSVField(q.expiryDate, delimiter),
      escapeCSVField(getStatusLabel(q.status), delimiter),
      escapeCSVField(q.customerName, delimiter),
      escapeCSVField(q.customerTaxId || 'Non renseigné', delimiter),
      escapeCSVField(q.customerEmail || '', delimiter),
      escapeCSVField(q.customerPhone || '', delimiter),
      escapeCSVField(q.customerAddress || '', delimiter),
      escapeCSVField(q.subtotal.toFixed(2), delimiter),
      escapeCSVField(q.discountType === 'percentage' ? 'Pourcentage (%)' : 'Montant Fixe', delimiter),
      escapeCSVField(q.discountValue || 0, delimiter),
      escapeCSVField(q.discountAmount.toFixed(2), delimiter),
      escapeCSVField(q.taxRate || 0, delimiter),
      escapeCSVField(q.taxAmount.toFixed(2), delimiter),
      escapeCSVField((q.shippingFee || 0).toFixed(2), delimiter),
      escapeCSVField(q.total.toFixed(2), delimiter),
      escapeCSVField(q.currency, delimiter),
      escapeCSVField(q.convertedInvoiceId || 'Non converti', delimiter),
      escapeCSVField(q.convertedAt ? q.convertedAt.split('T')[0] : '', delimiter),
      escapeCSVField(q.createdAt ? q.createdAt.split('T')[0] : '', delimiter),
    ].join(delimiter);
  });

  const csvContent = [headers.join(delimiter), ...rows].join('\r\n');
  const todayStr = new Date().toISOString().split('T')[0];
  const filename = `export_devis_${todayStr}.csv`;

  downloadCSV(filename, csvContent);
  return { rowCount: filtered.length, filename };
};

/**
 * Export Customer directory to CSV formatted for CRM and accounting
 */
export const exportCustomersToCSV = (
  customers: Customer[],
  options?: {
    delimiter?: CSVDelimiter;
    minOutstanding?: boolean;
  }
): { rowCount: number; filename: string } => {
  const delimiter = options?.delimiter || ';';

  let filtered = [...customers];
  if (options?.minOutstanding) {
    filtered = filtered.filter(c => c.outstandingBalance > 0);
  }

  const headers = [
    'Nom Client / Contact',
    'Raison Sociale / Société',
    'Numéro IFU (Fiscal)',
    'Téléphone',
    'Email',
    'Adresse',
    'Ville',
    'Pays',
    'Total Facturé TTC',
    'Total Encaissé / Réglé',
    'Solde Restant Dû (Impayé)',
    'Statut Créance',
    'Date Création'
  ];

  const rows = filtered.map(c => {
    const debtStatus = c.outstandingBalance > 0 ? 'Solde Débiteur (En attente)' : 'À Jour (Solde Nul)';
    return [
      escapeCSVField(c.name, delimiter),
      escapeCSVField(c.companyName || '', delimiter),
      escapeCSVField(c.taxId || 'Non renseigné', delimiter),
      escapeCSVField(c.phone || '', delimiter),
      escapeCSVField(c.email || '', delimiter),
      escapeCSVField(c.address || '', delimiter),
      escapeCSVField(c.city || '', delimiter),
      escapeCSVField(c.country || 'Bénin', delimiter),
      escapeCSVField(c.totalInvoiced.toFixed(2), delimiter),
      escapeCSVField(c.totalPaid.toFixed(2), delimiter),
      escapeCSVField(c.outstandingBalance.toFixed(2), delimiter),
      escapeCSVField(debtStatus, delimiter),
      escapeCSVField(c.createdAt ? c.createdAt.split('T')[0] : '', delimiter),
    ].join(delimiter);
  });

  const csvContent = [headers.join(delimiter), ...rows].join('\r\n');
  const todayStr = new Date().toISOString().split('T')[0];
  const filename = `export_clients_${todayStr}.csv`;

  downloadCSV(filename, csvContent);
  return { rowCount: filtered.length, filename };
};

/**
 * Export General Accounting Journal (Ventes et Encaissements) for external accounting software (SYSCOHADA / Sage / QuickBooks)
 */
export const exportAccountingJournalToCSV = (
  invoices: Invoice[],
  payments: PaymentRecord[],
  options?: {
    delimiter?: CSVDelimiter;
    startDate?: string;
    endDate?: string;
  }
): { rowCount: number; filename: string } => {
  const delimiter = options?.delimiter || ';';

  const entries: {
    date: string;
    journal: string;
    piece: string;
    compte: string;
    libelle: string;
    debit: number;
    credit: number;
    tva: number;
    devise: string;
  }[] = [];

  // 1. Sales entries from invoices
  invoices.forEach(inv => {
    if (inv.status === 'cancelled') return;
    if (options?.startDate && inv.issueDate < options.startDate) return;
    if (options?.endDate && inv.issueDate > options.endDate) return;

    // Client Debit (Compte 411 - Clients)
    entries.push({
      date: inv.issueDate,
      journal: 'VT (Ventes)',
      piece: inv.invoiceNumber,
      compte: '411000 - Clients',
      libelle: `Facture ${inv.invoiceNumber} - ${inv.customerName}`,
      debit: inv.total,
      credit: 0,
      tva: 0,
      devise: inv.currency,
    });

    // Sales Credit (Compte 706 - Prestations de services / 701 - Ventes)
    entries.push({
      date: inv.issueDate,
      journal: 'VT (Ventes)',
      piece: inv.invoiceNumber,
      compte: '706000 - Prestations de Services HT',
      libelle: `Vente HT ${inv.invoiceNumber}`,
      debit: 0,
      credit: inv.subtotal - inv.discountAmount,
      tva: 0,
      devise: inv.currency,
    });

    // TVA Credit if applicable (Compte 4431 - TVA Facturée)
    if (inv.taxAmount > 0) {
      entries.push({
        date: inv.issueDate,
        journal: 'VT (Ventes)',
        piece: inv.invoiceNumber,
        compte: '443100 - État, TVA Facturée',
        libelle: `TVA ${inv.taxRate}% Facture ${inv.invoiceNumber}`,
        debit: 0,
        credit: inv.taxAmount,
        tva: inv.taxAmount,
        devise: inv.currency,
      });
    }
  });

  // 2. Payment entries from payment records
  payments.forEach(p => {
    const payDate = p.date || p.paymentDate || p.createdAt?.split('T')[0] || '';
    if (options?.startDate && payDate < options.startDate) return;
    if (options?.endDate && payDate > options.endDate) return;

    const invoice = invoices.find(i => i.id === p.invoiceId);
    const piece = invoice ? invoice.invoiceNumber : p.transactionReference || 'RÈGLEMENT';
    const clientName = invoice ? invoice.customerName : 'Client';

    // Account mapping for payment method
    let treasuryAccount = '521000 - Banque';
    if (p.paymentMethod === 'mtn_momo' || p.paymentMethod === 'moov_money') {
      treasuryAccount = '585000 - Mobile Money (MTN/Moov)';
    } else if (p.paymentMethod === 'cash') {
      treasuryAccount = '571000 - Caisse Principale';
    }

    // Debit Treasury Account
    entries.push({
      date: payDate,
      journal: 'BQ/CA (Trésorerie)',
      piece: piece,
      compte: treasuryAccount,
      libelle: `Encaissement ${getPaymentMethodLabel(p.paymentMethod)} (${piece}) - ${clientName}`,
      debit: p.amount,
      credit: 0,
      tva: 0,
      devise: p.currency,
    });

    // Credit Client Account
    entries.push({
      date: payDate,
      journal: 'BQ/CA (Trésorerie)',
      piece: piece,
      compte: '411000 - Clients',
      libelle: `Règlement facture ${piece} - ${clientName}`,
      debit: 0,
      credit: p.amount,
      tva: 0,
      devise: p.currency,
    });
  });

  // Sort chronological
  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const headers = [
    'Date Écriture',
    'Code Journal',
    'Numéro Pièce',
    'Compte Comptable',
    'Libellé Écriture',
    'Débit',
    'Crédit',
    'TVA Collectée',
    'Devise'
  ];

  const rows = entries.map(e => [
    escapeCSVField(e.date, delimiter),
    escapeCSVField(e.journal, delimiter),
    escapeCSVField(e.piece, delimiter),
    escapeCSVField(e.compte, delimiter),
    escapeCSVField(e.libelle, delimiter),
    escapeCSVField(e.debit ? e.debit.toFixed(2) : '0.00', delimiter),
    escapeCSVField(e.credit ? e.credit.toFixed(2) : '0.00', delimiter),
    escapeCSVField(e.tva ? e.tva.toFixed(2) : '0.00', delimiter),
    escapeCSVField(e.devise, delimiter),
  ].join(delimiter));

  const csvContent = [headers.join(delimiter), ...rows].join('\r\n');
  const todayStr = new Date().toISOString().split('T')[0];
  const filename = `journal_comptable_${todayStr}.csv`;

  downloadCSV(filename, csvContent);
  return { rowCount: entries.length, filename };
};
