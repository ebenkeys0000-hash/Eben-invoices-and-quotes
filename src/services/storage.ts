import {
  Organization,
  User,
  Subscription,
  Customer,
  Product,
  Invoice,
  Quote,
  AuditLog,
  AppNotification,
  PlatformTransaction,
  PlatformPayout,
  SyncQueueItem,
  PaymentRecord,
} from '../types';
import {
  INITIAL_ORGANIZATION,
  INITIAL_USERS,
  INITIAL_SUBSCRIPTION,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_INVOICES,
  INITIAL_QUOTES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLATFORM_TRANSACTIONS,
  INITIAL_PLATFORM_PAYOUTS,
} from './mockData';

const STORAGE_KEYS = {
  ORG: 'eben_org',
  USERS: 'eben_users',
  CURRENT_USER: 'eben_current_user',
  SUBSCRIPTION: 'eben_subscription',
  CUSTOMERS: 'eben_customers',
  PRODUCTS: 'eben_products',
  INVOICES: 'eben_invoices',
  QUOTES: 'eben_quotes',
  AUDIT_LOGS: 'eben_audit_logs',
  NOTIFICATIONS: 'eben_notifications',
  SYNC_QUEUE: 'eben_sync_queue',
  TRANSACTIONS: 'eben_platform_tx',
  PAYOUTS: 'eben_platform_payouts',
  FORCE_OFFLINE: 'eben_force_offline',
  PLATFORM_SETTINGS: 'eben_platform_settings',
};

export interface PlatformSettings {
  monthlyPrice: number; // e.g. 10000 XOF ($15)
  annualPrice: number; // e.g. 100000 XOF
  maxTrialInvoices: number; // default 5
  maxTrialQuotes: number; // default 5
  isMaintenanceMode: boolean;
  activePaymentProviders: {
    mtnMoMo: boolean;
    moovMoney: boolean;
    fedaPay: boolean;
    kkiapay: boolean;
    stripeCards: boolean;
  };
}

const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  monthlyPrice: 10000,
  annualPrice: 100000,
  maxTrialInvoices: 5,
  maxTrialQuotes: 5,
  isMaintenanceMode: false,
  activePaymentProviders: {
    mtnMoMo: true,
    moovMoney: true,
    fedaPay: true,
    kkiapay: true,
    stripeCards: true,
  },
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initIfEmpty();
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Storage subscriber error:', err);
      }
    });
  }

  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving to localStorage [${key}]:`, err);
    }
  }

  public initIfEmpty(forceReset = false): void {
    if (forceReset || !localStorage.getItem(STORAGE_KEYS.ORG)) {
      this.setItem(STORAGE_KEYS.ORG, INITIAL_ORGANIZATION);
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
      this.setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1]); // Default to Business Owner
      this.setItem(STORAGE_KEYS.SUBSCRIPTION, INITIAL_SUBSCRIPTION);
      this.setItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
      this.setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      this.setItem(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
      this.setItem(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
      this.setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      this.setItem(STORAGE_KEYS.SYNC_QUEUE, [] as SyncQueueItem[]);
      this.setItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_PLATFORM_TRANSACTIONS);
      this.setItem(STORAGE_KEYS.PAYOUTS, INITIAL_PLATFORM_PAYOUTS);
      this.setItem(STORAGE_KEYS.PLATFORM_SETTINGS, DEFAULT_PLATFORM_SETTINGS);
      this.notify();
    } else {
      // Sync names and company for existing storage
      const users = this.getUsers();
      let updated = false;
      const updatedUsers = users.map(u => {
        if (u.id === 'user_owner_01' && (u.fullName.includes('David Dossou') || !u.fullName.includes('Eben Keys'))) {
          updated = true;
          return { ...u, fullName: 'Eben Keys (Directeur & Propriétaire)', email: 'eben@eben-tech.bj' };
        }
        if (u.id === 'user_boss_01' && (u.fullName.includes('Ebenezer') || !u.fullName.includes('Eben Keys'))) {
          updated = true;
          return { ...u, fullName: 'Eben Keys (Super Admin)' };
        }
        return u;
      });

      const currentOrg = this.getOrganization();
      if (currentOrg.name !== 'EBEN Technologies SARL' || !currentOrg.address.includes('Abomey-Calavi')) {
        const updatedOrg: Organization = {
          ...currentOrg,
          name: 'EBEN Technologies SARL',
          city: 'Abomey-Calavi',
          address: 'Carrefour IITA, Tankpè, Abomey-Calavi, République du Bénin',
          rccmNumber: currentOrg.rccmNumber || 'RB/ABC/22 B 31094',
          ifuNumber: currentOrg.ifuNumber || '3201948572834',
          settings: {
            ...currentOrg.settings,
            primaryColor: '#2563EB',
          }
        };
        this.setItem(STORAGE_KEYS.ORG, updatedOrg);
        updated = true;
      }

      if (updated) {
        this.setItem(STORAGE_KEYS.USERS, updatedUsers);
        const currentUser = this.getCurrentUser();
        if (currentUser.id === 'user_owner_01' || currentUser.id === 'user_boss_01') {
          const fresh = updatedUsers.find(u => u.id === currentUser.id);
          if (fresh) this.setItem(STORAGE_KEYS.CURRENT_USER, fresh);
        }
        this.notify();
      }
    }
  }

  // Dashboard Metrics aggregation
  public getDashboardMetrics() {
    const invoices = this.getInvoices();
    const quotes = this.getQuotes();
    const customers = this.getCustomers();

    const totalSales = invoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
    const totalPending = invoices.reduce((acc, inv) => acc + inv.amountRemaining, 0);
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((acc, inv) => acc + inv.amountRemaining, 0);
    const totalQuotesValue = quotes.reduce((acc, q) => acc + q.total, 0);
    const activeQuotesValue = quotes.filter(q => q.status === 'sent' || q.status === 'draft').reduce((acc, q) => acc + q.total, 0);
    const quotesCount = quotes.length;
    const totalCustomers = customers.length;

    const paidInvoicesCount = invoices.filter(i => i.status === 'paid').length;
    const pendingInvoicesCount = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').length;
    const overdueInvoicesCount = invoices.filter(i => i.status === 'overdue').length;

    return {
      totalSales,
      totalRevenue,
      totalPending,
      totalOverdue,
      totalQuotesValue,
      activeQuotesValue,
      quotesCount,
      totalCustomers,
      paidInvoicesCount,
      pendingInvoicesCount,
      overdueInvoicesCount,
    };
  }

  // Super Admin stats and tenant directory
  public getSuperAdminStats() {
    const transactions = this.getPlatformTransactions();
    const tenants = this.getTenants();
    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const gatewayFeesTotal = transactions.reduce((sum, tx) => sum + tx.feeAmount, 0);
    const activeSubscribers = tenants.filter(t => t.subscriptionStatus === 'active').length;
    const totalInvoicesCreated = tenants.reduce((sum, t) => sum + t.invoicesCount, 0);
    const totalVolumeProcessed = tenants.reduce((sum, t) => sum + t.totalVolume, 0);

    return {
      mrr: activeSubscribers * 10000,
      totalRevenue,
      gatewayFeesTotal,
      activeSubscribers,
      totalTenants: tenants.length,
      conversionRate: tenants.length > 0 ? Math.round((activeSubscribers / tenants.length) * 100) : 0,
      totalInvoicesCreated,
      totalVolumeProcessed,
    };
  }

  public getTenants() {
    const currentOrg = this.getOrganization();
    const currentSub = this.getSubscription();
    const currentInvoices = this.getInvoices();
    const currentQuotes = this.getQuotes();

    const defaultTenants = [
      {
        id: currentOrg.id,
        name: currentOrg.name,
        email: currentOrg.email,
        phone: currentOrg.phone,
        subscriptionStatus: currentSub.status,
        invoicesCount: currentInvoices.length,
        quotesCount: currentQuotes.length,
        totalVolume: currentInvoices.reduce((sum, i) => sum + i.total, 0),
      },
      {
        id: 'org_benin_consulting',
        name: 'Bénin Consulting Group SARL',
        email: 'contact@beninconsulting.bj',
        phone: '+229 97 45 88 12',
        subscriptionStatus: 'active',
        invoicesCount: 24,
        quotesCount: 18,
        totalVolume: 12500000,
      },
      {
        id: 'org_agro_bio',
        name: 'Agro-Bio Cotonou Distribution',
        email: 'info@agrobio-benin.com',
        phone: '+229 95 12 34 56',
        subscriptionStatus: 'trial',
        invoicesCount: 4,
        quotesCount: 3,
        totalVolume: 1850000,
      },
      {
        id: 'org_atlantic_logistics',
        name: 'Atlantic Logistics & Transit Bénin',
        email: 'transit@atlantic-logistics.bj',
        phone: '+229 96 89 00 11',
        subscriptionStatus: 'active',
        invoicesCount: 42,
        quotesCount: 31,
        totalVolume: 34200000,
      },
    ];

    return this.getItem('eben_mock_tenants', defaultTenants);
  }

  public saveTenants(tenants: any[]) {
    this.setItem('eben_mock_tenants', tenants);
    this.notify();
  }

  public savePlatformSettings(settings: PlatformSettings) {
    return this.updatePlatformSettings(settings);
  }

  // ================= ONLINE / OFFLINE STATUS =================
  public isOfflineForced(): boolean {
    return this.getItem<boolean>(STORAGE_KEYS.FORCE_OFFLINE, false);
  }

  public setForceOffline(offline: boolean): void {
    this.setItem(STORAGE_KEYS.FORCE_OFFLINE, offline);
    this.notify();
  }

  public isEffectivelyOnline(): boolean {
    if (this.isOfflineForced()) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // ================= CURRENT USER & ORG =================
  public getCurrentUser(): User {
    return this.getItem<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1]);
  }

  public setCurrentUser(user: User): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    this.logAudit({
      action: 'USER_SWITCH',
      category: 'AUTH',
      details: `Session basculée sur : ${user.fullName} (${user.role})`,
    });
    this.notify();
  }

  public getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.setItem(STORAGE_KEYS.USERS, users);
    this.logAudit({
      action: idx >= 0 ? 'USER_UPDATED' : 'USER_CREATED',
      category: 'TEAM',
      details: `Utilisateur : ${user.fullName} (${user.email}) - Rôle: ${user.role}`,
    });
    this.notify();
  }

  public saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
    this.notify();
  }

  public deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.setItem(STORAGE_KEYS.USERS, users);
    this.notify();
  }

  public getOrganization(): Organization {
    return this.getItem<Organization>(STORAGE_KEYS.ORG, INITIAL_ORGANIZATION);
  }

  public saveOrganization(org: Organization): Organization {
    return this.updateOrganization(org);
  }

  public updateOrganization(org: Partial<Organization>): Organization {
    const current = this.getOrganization();
    const updated = { ...current, ...org };
    this.setItem(STORAGE_KEYS.ORG, updated);
    this.logAudit({
      action: 'ORGANIZATION_UPDATED',
      category: 'ADMIN',
      details: `Mise à jour des informations de l'entreprise : ${updated.name}`,
    });
    this.enqueueSync('UPDATE', 'settings', updated.id, updated);
    this.notify();
    return updated;
  }

  // ================= SUBSCRIPTION & TRIAL =================
  public getSubscription(): Subscription {
    return this.getItem<Subscription>(STORAGE_KEYS.SUBSCRIPTION, INITIAL_SUBSCRIPTION);
  }

  public updateSubscription(sub: Partial<Subscription>): Subscription {
    const current = this.getSubscription();
    const updated = { ...current, ...sub };
    this.setItem(STORAGE_KEYS.SUBSCRIPTION, updated);
    this.logAudit({
      action: 'SUBSCRIPTION_UPDATED',
      category: 'SUBSCRIPTION',
      details: `Statut d'abonnement : ${updated.status} (Plan: ${updated.planName})`,
    });
    this.notify();
    return updated;
  }

  public canCreateInvoice(): { allowed: boolean; reason?: string } {
    const sub = this.getSubscription();
    if (sub.status === 'active') return { allowed: true };
    if (sub.trialUsage.invoicesCount < sub.trialUsage.maxTrialInvoices) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: `Limite de l'essai gratuit atteinte (${sub.trialUsage.invoicesCount}/${sub.trialUsage.maxTrialInvoices} factures créées). Veuillez souscrire à EBEN Premium pour continuer.`,
    };
  }

  public canCreateQuote(): { allowed: boolean; reason?: string } {
    const sub = this.getSubscription();
    if (sub.status === 'active') return { allowed: true };
    if (sub.trialUsage.quotesCount < sub.trialUsage.maxTrialQuotes) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: `Limite de l'essai gratuit atteinte (${sub.trialUsage.quotesCount}/${sub.trialUsage.maxTrialQuotes} devis créés). Veuillez souscrire à EBEN Premium pour continuer.`,
    };
  }

  // ================= INVOICES =================
  public getInvoices(): Invoice[] {
    return this.getItem<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.getInvoices().find(i => i.id === id);
  }

  public saveInvoice(invoice: Invoice, isNew = false): Invoice {
    const invoices = this.getInvoices();
    const org = this.getOrganization();
    let savedInvoice = { ...invoice };

    if (isNew) {
      // Increment trial counter if applicable
      const sub = this.getSubscription();
      if (sub.status !== 'active') {
        sub.trialUsage.invoicesCount += 1;
        this.updateSubscription(sub);
      }

      // Increment org next invoice number
      org.settings.nextInvoiceNumber += 1;
      this.setItem(STORAGE_KEYS.ORG, org);

      invoices.unshift(savedInvoice);
      this.logAudit({
        action: 'INVOICE_CREATED',
        category: 'INVOICE',
        documentId: savedInvoice.id,
        details: `Création facture ${savedInvoice.invoiceNumber} pour ${savedInvoice.customerName} (${savedInvoice.total} ${savedInvoice.currency})`,
      });
      this.enqueueSync('CREATE', 'invoices', savedInvoice.id, savedInvoice);
    } else {
      const idx = invoices.findIndex(i => i.id === invoice.id);
      if (idx >= 0) {
        invoices[idx] = savedInvoice;
        this.logAudit({
          action: 'INVOICE_UPDATED',
          category: 'INVOICE',
          documentId: savedInvoice.id,
          details: `Modification facture ${savedInvoice.invoiceNumber} (${savedInvoice.status})`,
        });
        this.enqueueSync('UPDATE', 'invoices', savedInvoice.id, savedInvoice);
      } else {
        invoices.unshift(savedInvoice);
      }
    }

    this.setItem(STORAGE_KEYS.INVOICES, invoices);
    this.updateCustomerBalances(savedInvoice.customerId);
    this.notify();
    return savedInvoice;
  }

  public deleteInvoice(id: string): void {
    const invoice = this.getInvoiceById(id);
    const invoices = this.getInvoices().filter(i => i.id !== id);
    this.setItem(STORAGE_KEYS.INVOICES, invoices);
    if (invoice) {
      this.logAudit({
        action: 'INVOICE_DELETED',
        category: 'INVOICE',
        documentId: id,
        details: `Suppression facture ${invoice.invoiceNumber}`,
      });
      this.updateCustomerBalances(invoice.customerId);
      this.enqueueSync('DELETE', 'invoices', id, { id });
    }
    this.notify();
  }

  public recordInvoicePayment(invoiceId: string, payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'recordedByUserId'>): Invoice {
    const invoice = this.getInvoiceById(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const currentUser = this.getCurrentUser();
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      recordedByUserId: currentUser.id,
    };

    const updatedPayments = [...(invoice.payments || []), newPayment];
    const totalPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);
    const amountRemaining = Math.max(0, invoice.total - totalPaid);

    let status = invoice.status;
    if (amountRemaining <= 0) {
      status = 'paid';
    } else if (totalPaid > 0) {
      status = 'partially_paid';
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      payments: updatedPayments,
      amountPaid: totalPaid,
      amountRemaining,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.saveInvoice(updatedInvoice, false);

    this.logAudit({
      action: 'PAYMENT_RECORDED',
      category: 'PAYMENT',
      documentId: invoice.id,
      details: `Paiement de ${payment.amount} ${payment.currency} enregistré sur facture ${invoice.invoiceNumber} (${payment.paymentMethod})`,
    });

    this.notify();
    return updatedInvoice;
  }

  public recordPayment(invoiceId: string, paymentData: { amount: number; paymentMethod: any; date?: string; transactionReference?: string; notes?: string }): { invoice: Invoice; payment: PaymentRecord } {
    const invoice = this.getInvoiceById(invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    const paymentDate = paymentData.date || new Date().toISOString().split('T')[0];
    const newPayment: Omit<PaymentRecord, 'id' | 'createdAt' | 'recordedByUserId'> = {
      orgId: invoice.orgId,
      invoiceId: invoice.id,
      amount: paymentData.amount,
      currency: invoice.currency,
      date: paymentDate,
      paymentDate: paymentDate,
      paymentMethod: paymentData.paymentMethod,
      transactionReference: paymentData.transactionReference,
      notes: paymentData.notes,
    };
    const updatedInvoice = this.recordInvoicePayment(invoiceId, newPayment);
    const recordedPayment = updatedInvoice.payments[updatedInvoice.payments.length - 1];
    return { invoice: updatedInvoice, payment: recordedPayment };
  }

  public getAllPayments(): PaymentRecord[] {
    const invoices = this.getInvoices();
    const allPayments: PaymentRecord[] = [];
    invoices.forEach(inv => {
      if (inv.payments && Array.isArray(inv.payments)) {
        inv.payments.forEach(p => {
          allPayments.push({
            ...p,
            paymentDate: p.paymentDate || p.date,
          });
        });
      }
    });
    // sort by date descending
    return allPayments.sort((a, b) => new Date(b.date || b.paymentDate || '').getTime() - new Date(a.date || a.paymentDate || '').getTime());
  }

  // ================= QUOTES =================
  public getQuotes(): Quote[] {
    return this.getItem<Quote[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
  }

  public getQuoteById(id: string): Quote | undefined {
    return this.getQuotes().find(q => q.id === id);
  }

  public saveQuote(quote: Quote, isNew = false): Quote {
    const quotes = this.getQuotes();
    const org = this.getOrganization();
    let savedQuote = { ...quote };

    if (isNew) {
      const sub = this.getSubscription();
      if (sub.status !== 'active') {
        sub.trialUsage.quotesCount += 1;
        this.updateSubscription(sub);
      }

      org.settings.nextQuoteNumber += 1;
      this.setItem(STORAGE_KEYS.ORG, org);

      quotes.unshift(savedQuote);
      this.logAudit({
        action: 'QUOTE_CREATED',
        category: 'QUOTE',
        documentId: savedQuote.id,
        details: `Création devis ${savedQuote.quoteNumber} pour ${savedQuote.customerName} (${savedQuote.total} ${savedQuote.currency})`,
      });
      this.enqueueSync('CREATE', 'quotes', savedQuote.id, savedQuote);
    } else {
      const idx = quotes.findIndex(q => q.id === quote.id);
      if (idx >= 0) {
        quotes[idx] = savedQuote;
        this.logAudit({
          action: 'QUOTE_UPDATED',
          category: 'QUOTE',
          documentId: savedQuote.id,
          details: `Modification devis ${savedQuote.quoteNumber} (${savedQuote.status})`,
        });
        this.enqueueSync('UPDATE', 'quotes', savedQuote.id, savedQuote);
      } else {
        quotes.unshift(savedQuote);
      }
    }

    this.setItem(STORAGE_KEYS.QUOTES, quotes);
    this.notify();
    return savedQuote;
  }

  public deleteQuote(id: string): void {
    const quote = this.getQuoteById(id);
    const quotes = this.getQuotes().filter(q => q.id !== id);
    this.setItem(STORAGE_KEYS.QUOTES, quotes);
    if (quote) {
      this.logAudit({
        action: 'QUOTE_DELETED',
        category: 'QUOTE',
        documentId: id,
        details: `Suppression devis ${quote.quoteNumber}`,
      });
      this.enqueueSync('DELETE', 'quotes', id, { id });
    }
    this.notify();
  }

  public convertQuoteToInvoice(quoteId: string): Invoice {
    const quote = this.getQuoteById(quoteId);
    if (!quote) throw new Error('Quote not found');

    const org = this.getOrganization();
    const currentUser = this.getCurrentUser();
    const nextNum = org.settings.nextInvoiceNumber;
    const invNumber = `${org.settings.invoicePrefix}${nextNum.toString().padStart(3, '0')}`;

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      orgId: org.id,
      invoiceNumber: invNumber,
      quoteId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      customerAddress: quote.customerAddress,
      customerTaxId: quote.customerTaxId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: quote.items.map(item => ({ ...item, id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` })),
      subtotal: quote.subtotal,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      discountAmount: quote.discountAmount,
      taxRate: quote.taxRate,
      taxAmount: quote.taxAmount,
      shippingFee: quote.shippingFee,
      total: quote.total,
      amountPaid: 0,
      amountRemaining: quote.total,
      currency: quote.currency,
      status: 'draft',
      notes: quote.notes || org.settings.defaultNotes,
      paymentTerms: org.settings.defaultTerms,
      paymentInstructions: org.settings.paymentInstructions,
      templateId: quote.templateId || org.settings.templateId,
      payments: [],
      createdByUserId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save newly created invoice
    this.saveInvoice(newInvoice, true);

    // Update Quote status to converted
    const updatedQuote: Quote = {
      ...quote,
      status: 'converted',
      convertedInvoiceId: newInvoice.id,
      convertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveQuote(updatedQuote, false);

    this.logAudit({
      action: 'QUOTE_CONVERTED',
      category: 'QUOTE',
      documentId: quote.id,
      details: `Devis ${quote.quoteNumber} converti en facture ${newInvoice.invoiceNumber}`,
    });

    this.notify();
    return newInvoice;
  }

  // ================= CUSTOMERS =================
  public getCustomers(): Customer[] {
    return this.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find(c => c.id === id);
  }

  public saveCustomer(customer: Customer): Customer {
    const customers = this.getCustomers();
    const idx = customers.findIndex(c => c.id === customer.id);
    if (idx >= 0) {
      customers[idx] = { ...customer, updatedAt: new Date().toISOString() };
    } else {
      customers.unshift({ ...customer, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
    this.logAudit({
      action: idx >= 0 ? 'CUSTOMER_UPDATED' : 'CUSTOMER_CREATED',
      category: 'ADMIN',
      details: `Client : ${customer.name} (${customer.companyName || 'Particulier'})`,
    });
    this.enqueueSync(idx >= 0 ? 'UPDATE' : 'CREATE', 'customers', customer.id, customer);
    this.notify();
    return customer;
  }

  public deleteCustomer(id: string): void {
    const customer = this.getCustomerById(id);
    const customers = this.getCustomers().filter(c => c.id !== id);
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
    if (customer) {
      this.logAudit({
        action: 'CUSTOMER_DELETED',
        category: 'ADMIN',
        details: `Suppression client : ${customer.name}`,
      });
      this.enqueueSync('DELETE', 'customers', id, { id });
    }
    this.notify();
  }

  private updateCustomerBalances(customerId: string) {
    const customers = this.getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const invoices = this.getInvoices().filter(i => i.customerId === customerId && i.status !== 'cancelled');
    const totalInvoiced = invoices.reduce((acc, i) => acc + i.total, 0);
    const totalPaid = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
    const outstandingBalance = Math.max(0, totalInvoiced - totalPaid);

    customer.totalInvoiced = totalInvoiced;
    customer.totalPaid = totalPaid;
    customer.outstandingBalance = outstandingBalance;
    customer.updatedAt = new Date().toISOString();

    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // ================= PRODUCTS =================
  public getProducts(): Product[] {
    return this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  public saveProduct(product: Product): Product {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
    } else {
      products.unshift(product);
    }
    this.setItem(STORAGE_KEYS.PRODUCTS, products);
    this.logAudit({
      action: idx >= 0 ? 'PRODUCT_UPDATED' : 'PRODUCT_CREATED',
      category: 'ADMIN',
      details: `Article catalogue : ${product.name} (${product.unitPrice} XOF)`,
    });
    this.enqueueSync(idx >= 0 ? 'UPDATE' : 'CREATE', 'products', product.id, product);
    this.notify();
    return product;
  }

  public deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PRODUCTS, products);
    this.enqueueSync('DELETE', 'products', id, { id });
    this.notify();
  }

  // ================= NOTIFICATIONS & AUDIT =================
  public getNotifications(): AppNotification[] {
    return this.getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  public markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const item = notifs.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
      this.notify();
    }
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'createdAt'>): void {
    const notifs = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    this.notify();
  }

  public getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  public logAudit(entry: {
    action: string;
    category: AuditLog['category'];
    details: string;
    documentId?: string;
  }): void {
    const currentUser = this.getCurrentUser();
    const org = this.getOrganization();
    const logs = this.getAuditLogs();

    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      orgId: org.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action: entry.action,
      category: entry.category,
      documentId: entry.documentId,
      details: entry.details,
      ipAddress: '197.234.221.45 (Cotonou, Bénin)',
      timestamp: new Date().toISOString(),
    };

    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // ================= OFFLINE SYNC QUEUE =================
  public getSyncQueue(): SyncQueueItem[] {
    return this.getItem<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
  }

  public enqueueSync(action: SyncQueueItem['action'], entity: SyncQueueItem['entity'], entityId: string, payload: any): void {
    const queue = this.getSyncQueue();
    const item: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      orgId: this.getOrganization().id,
      action,
      entity,
      entityId,
      payload,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };
    queue.push(item);
    this.setItem(STORAGE_KEYS.SYNC_QUEUE, queue);
  }

  public processSyncQueue(): Promise<{ processed: number; failed: number }> {
    return new Promise(resolve => {
      const queue = this.getSyncQueue();
      if (queue.length === 0) {
        resolve({ processed: 0, failed: 0 });
        return;
      }

      // Simulate network sync roundtrip
      setTimeout(() => {
        const count = queue.length;
        this.setItem(STORAGE_KEYS.SYNC_QUEUE, [] as SyncQueueItem[]);
        this.addNotification({
          orgId: this.getOrganization().id,
          title: 'Synchronisation Cloud Terminée ☁️',
          message: `${count} modification(s) hors-ligne synchronisée(s) avec succès avec le serveur sécurisé EBEN.`,
          type: 'security',
          read: false,
        });
        this.notify();
        resolve({ processed: count, failed: 0 });
      }, 1200);
    });
  }

  // ================= SUPER ADMIN PLATFORM =================
  public getPlatformSettings(): PlatformSettings {
    return this.getItem<PlatformSettings>(STORAGE_KEYS.PLATFORM_SETTINGS, DEFAULT_PLATFORM_SETTINGS);
  }

  public updatePlatformSettings(settings: Partial<PlatformSettings>): PlatformSettings {
    const current = this.getPlatformSettings();
    const updated = { ...current, ...settings };
    this.setItem(STORAGE_KEYS.PLATFORM_SETTINGS, updated);
    this.notify();
    return updated;
  }

  public getPlatformTransactions(): PlatformTransaction[] {
    return this.getItem<PlatformTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_PLATFORM_TRANSACTIONS);
  }

  public recordPlatformTransaction(tx: Omit<PlatformTransaction, 'id' | 'createdAt'>): PlatformTransaction {
    const txs = this.getPlatformTransactions();
    const newTx: PlatformTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    txs.unshift(newTx);
    this.setItem(STORAGE_KEYS.TRANSACTIONS, txs);
    this.notify();
    return newTx;
  }

  public getPlatformPayouts(): PlatformPayout[] {
    return this.getItem<PlatformPayout[]>(STORAGE_KEYS.PAYOUTS, INITIAL_PLATFORM_PAYOUTS);
  }

  public requestPayout(amount: number, recipientAccount: string, provider: string): PlatformPayout {
    const payouts = this.getPlatformPayouts();
    const newPayout: PlatformPayout = {
      id: `payout_${Date.now()}`,
      amount,
      currency: 'XOF',
      recipientAccount,
      provider,
      status: 'completed',
      reference: `PAYOUT-${Date.now().toString().slice(-6)}`,
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };
    payouts.unshift(newPayout);
    this.setItem(STORAGE_KEYS.PAYOUTS, payouts);
    this.notify();
    return newPayout;
  }
}

export const storage = new StorageService();
