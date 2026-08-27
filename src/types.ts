export type Language = 'fr' | 'en';
export type CurrencyCode = 'XOF' | 'EUR' | 'USD' | 'CAD' | 'NGN' | 'GHS';

export type UserRole = 
  | 'SUPER_ADMIN' // Platform Boss / EBEN Owner
  | 'OWNER'       // Business Tenant Owner
  | 'ADMIN'       // Tenant Admin
  | 'MANAGER'     // Manager
  | 'ACCOUNTANT'  // Comptable (financials, payments, invoices)
  | 'SALES'       // Commercial (quotes, invoices, customers)
  | 'SALES_REP'   // Commercial (quotes, invoices, customers)
  | 'STAFF'       // Regular employee
  | 'VIEWER';     // Read-only

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  orgId: string;
  createdAt: string;
  lastLogin?: string;
  isSuperAdmin?: boolean;
  active?: boolean;
}

export interface OrganizationSettings {
  defaultCurrency: CurrencyCode;
  defaultTaxRate: number; // e.g. 18 for TVA Benin
  defaultPaymentTermsDays: number;
  invoicePrefix: string;
  quotePrefix: string;
  nextInvoiceNumber: number;
  nextQuoteNumber: number;
  defaultNotes?: string;
  defaultTerms?: string;
  paymentInstructions?: string;
  momoNumber?: string;
  bankAccountDetails?: string;
  templateId: DocumentTemplateId;
  primaryColor: string;
  showLogo: boolean;
  showSignature: boolean;
  showWatermark: boolean;
}

export interface Organization {
  id: string;
  name: string;
  businessType?: string; // SARL, Freelance, SAS, etc.
  ifuNumber?: string; // Benin Tax Identification Number (IFU)
  rccmNumber?: string; // Trade register number
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  logoUrl?: string;
  signatureUrl?: string;
  settings: OrganizationSettings;
  createdAt: string;
  status: 'active' | 'suspended' | 'expired';
}

export type SubscriptionPlanId = 'trial' | 'premium_monthly' | 'premium_annual' | 'business_monthly' | 'enterprise';

export interface Subscription {
  id: string;
  orgId: string;
  planId: SubscriptionPlanId;
  planName: string;
  status: 'trial' | 'active' | 'grace_period' | 'expired' | 'cancelled';
  price: number;
  currency: CurrencyCode;
  billingPeriod: 'monthly' | 'annual';
  startDate: string;
  renewalDate: string;
  paymentProvider?: 'mtn_benin' | 'moov_benin' | 'fedapay' | 'kkiapay' | 'stripe' | 'manual';
  trialUsage: {
    invoicesCount: number;
    maxTrialInvoices: number;
    quotesCount: number;
    maxTrialQuotes: number;
  };
  autoRenew: boolean;
}

export interface Customer {
  id: string;
  orgId: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  country: string;
  taxId?: string; // IFU client
  notes?: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 'service' | 'product' | 'subscription' | 'digital' | 'consulting' | 'other';
export type ProductType = 'product' | 'service';

export interface Product {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  sku?: string;
  unit: string; // 'heure', 'jour', 'forfait', 'pièce', 'kg', 'm²', 'mois'
  unitPrice: number;
  taxRate: number; // default tax percentage
  category: ProductCategory;
  type?: ProductType;
  currency?: CurrencyCode;
  active: boolean;
  createdAt: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface DocumentItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercentage: number;
  taxRate: number;
  total: number;
}

export type PaymentMethod = 'mtn_momo' | 'moov_money' | 'card' | 'bank_transfer' | 'cash' | 'cheque';

export interface PaymentRecord {
  id: string;
  orgId: string;
  invoiceId: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  paymentDate?: string;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  notes?: string;
  recordedByUserId: string;
  createdAt: string;
}

export type DocumentTemplateId = 'modern_emerald' | 'executive_dark' | 'classic_clean' | 'bold_indigo';

export interface Invoice {
  id: string;
  orgId: string;
  invoiceNumber: string;
  quoteId?: string; // If converted from quote
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerTaxId?: string;
  issueDate: string;
  dueDate: string;
  items: DocumentItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  amountPaid: number;
  amountRemaining: number;
  currency: CurrencyCode;
  status: InvoiceStatus;
  notes?: string;
  paymentTerms?: string;
  paymentInstructions?: string;
  signatureUrl?: string;
  templateId: DocumentTemplateId;
  payments: PaymentRecord[];
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  sentAt?: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted';

export interface Quote {
  id: string;
  orgId: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerTaxId?: string;
  issueDate: string;
  expiryDate: string;
  items: DocumentItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  currency: CurrencyCode;
  status: QuoteStatus;
  convertedInvoiceId?: string;
  convertedAt?: string;
  notes?: string;
  termsAndConditions?: string;
  signatureUrl?: string;
  templateId: DocumentTemplateId;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  sentAt?: string;
}

export interface SyncQueueItem {
  id: string;
  orgId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'CONVERT_QUOTE';
  entity: 'invoices' | 'quotes' | 'customers' | 'products' | 'payments' | 'settings';
  entityId: string;
  payload: any;
  timestamp: string;
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  errorMessage?: string;
}

export interface AuditLog {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'AUTH' | 'INVOICE' | 'QUOTE' | 'PAYMENT' | 'SUBSCRIPTION' | 'TEAM' | 'ADMIN' | 'EXPORT';
  documentId?: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  orgId: string;
  title: string;
  message: string;
  type: 'invoice' | 'quote' | 'subscription' | 'payment' | 'security';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface PlatformTransaction {
  id: string;
  orgId: string;
  orgName: string;
  userEmail: string;
  amount: number;
  currency: CurrencyCode;
  planId: string;
  provider: 'MTN Mobile Money' | 'Moov Money' | 'FedaPay' | 'KKiaPay' | 'Card / Stripe';
  providerTransactionId: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  feeAmount: number;
  netAmount: number;
  createdAt: string;
}

export interface PlatformPayout {
  id: string;
  amount: number;
  currency: CurrencyCode;
  recipientAccount: string; // e.g. "MTN MoMo Bénin (+229 97 00 00 00)" or "Orabank Bénin RIB..."
  provider: string;
  status: 'completed' | 'pending' | 'processing';
  reference: string;
  requestedAt: string;
  processedAt?: string;
}
