import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavbar } from './components/layout/MobileNavbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { QuotesView } from './components/quotes/QuotesView';
import { CustomersView } from './components/customers/CustomersView';
import { ProductsView } from './components/products/ProductsView';
import { PaymentsView } from './components/payments/PaymentsView';
import { TeamView } from './components/team/TeamView';
import { SettingsView } from './components/settings/SettingsView';
import { SuperAdminView } from './components/superadmin/SuperAdminView';
import { StorePublicationHub } from './components/store/StorePublicationHub';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { DocumentViewer } from './components/documents/DocumentViewer';
import { InvoiceFormModal } from './components/invoices/InvoiceFormModal';
import { QuoteFormModal } from './components/quotes/QuoteFormModal';
import { CustomerModal } from './components/customers/CustomerModal';
import { ProductModal } from './components/products/ProductModal';
import { RecordPaymentModal } from './components/invoices/RecordPaymentModal';
import { Invoice, Quote, Customer, Product } from './types';
import { storage } from './services/storage';
import confetti from 'canvas-confetti';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, viewMode, t } = useApp();

  // Onboarding modal check
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('eben_onboarding_completed');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem('eben_onboarding_completed', 'true');
    setIsOnboardingOpen(false);
  };

  // Modals & State
  const [viewingDoc, setViewingDoc] = useState<{ doc: Invoice | Quote; type: 'invoice' | 'quote' } | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Handlers
  const handleOpenNewInvoice = () => {
    setEditingInvoice(null);
    setInvoiceModalOpen(true);
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setInvoiceModalOpen(true);
  };

  const handleOpenNewQuote = () => {
    setEditingQuote(null);
    setQuoteModalOpen(true);
  };

  const handleEditQuote = (q: Quote) => {
    setEditingQuote(q);
    setQuoteModalOpen(true);
  };

  const handleOpenNewCustomer = () => {
    setEditingCustomer(null);
    setCustomerModalOpen(true);
  };

  const handleEditCustomer = (c: Customer) => {
    setEditingCustomer(c);
    setCustomerModalOpen(true);
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleConvertQuote = (q: Quote) => {
    const newInvoice = storage.convertQuoteToInvoice(q.id);
    if (newInvoice) {
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 },
      });
      setViewingDoc({ doc: newInvoice, type: 'invoice' });
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewInvoice={handleOpenNewInvoice}
            onOpenNewQuote={handleOpenNewQuote}
            onOpenNewCustomer={handleOpenNewCustomer}
            onViewInvoice={inv => setViewingDoc({ doc: inv, type: 'invoice' })}
            onViewQuote={q => setViewingDoc({ doc: q, type: 'quote' })}
            onConvertQuote={handleConvertQuote}
          />
        );
      case 'invoices':
        return (
          <InvoicesView
            onOpenNewInvoice={handleOpenNewInvoice}
            onViewInvoice={inv => setViewingDoc({ doc: inv, type: 'invoice' })}
            onEditInvoice={handleEditInvoice}
            onRecordPayment={inv => setPaymentModalInvoice(inv)}
          />
        );
      case 'quotes':
        return (
          <QuotesView
            onOpenNewQuote={handleOpenNewQuote}
            onViewQuote={q => setViewingDoc({ doc: q, type: 'quote' })}
            onEditQuote={handleEditQuote}
            onConvertQuote={handleConvertQuote}
          />
        );
      case 'customers':
        return (
          <CustomersView
            onOpenNewCustomer={handleOpenNewCustomer}
            onEditCustomer={handleEditCustomer}
          />
        );
      case 'products':
        return (
          <ProductsView
            onOpenNewProduct={handleOpenNewProduct}
            onEditProduct={handleEditProduct}
          />
        );
      case 'payments':
        return <PaymentsView />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;
      case 'superAdmin':
        return <SuperAdminView />;
      case 'storePublication':
        return <StorePublicationHub />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Frame */}
      {viewMode === 'mobile' ? (
        /* Mobile Simulated Phone Frame Layout */
        <div className="flex flex-1 items-center justify-center bg-slate-950 p-2 sm:p-6 overflow-hidden">
          <div className="relative flex h-full max-h-[840px] w-full max-w-[420px] flex-col rounded-[40px] border-4 border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Phone Notch & Speaker bar */}
            <div className="relative z-20 flex h-6 w-full items-center justify-between px-6 pt-2 text-[10px] font-semibold text-slate-400">
              <span>9:41</span>
              <div className="h-4 w-28 rounded-full bg-slate-950" />
              <span className="font-mono">5G 100%</span>
            </div>

            {/* Scrollable View Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {renderActiveView()}
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNavbar
              onOpenNewInvoice={handleOpenNewInvoice}
              onOpenNewQuote={handleOpenNewQuote}
              onOpenNewCustomer={handleOpenNewCustomer}
            />
          </div>
        </div>
      ) : (
        /* Full Desktop & Web SaaS Dashboard Layout */
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-10 custom-scrollbar">
            <div className="mx-auto max-w-7xl">
              {renderActiveView()}
            </div>
          </main>

          {/* Mobile Bottom Navbar when viewport is small even in web mode */}
          <div className="block md:hidden">
            <MobileNavbar
              onOpenNewInvoice={handleOpenNewInvoice}
              onOpenNewQuote={handleOpenNewQuote}
              onOpenNewCustomer={handleOpenNewCustomer}
            />
          </div>
        </div>
      )}

      {/* Subscription Upgrade Modal */}
      <SubscriptionModal />

      {/* Onboarding Guide Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />

      {/* Document Previewer Modal (A4 Print & PDF) */}
      {viewingDoc && (
        <DocumentViewer
          document={viewingDoc.doc}
          type={viewingDoc.type}
          onClose={() => setViewingDoc(null)}
          onRecordPayment={inv => {
            setViewingDoc(null);
            setPaymentModalInvoice(inv);
          }}
          onConvertQuote={q => {
            setViewingDoc(null);
            handleConvertQuote(q);
          }}
        />
      )}

      {/* Invoice Create / Edit Modal */}
      {invoiceModalOpen && (
        <InvoiceFormModal
          invoiceToEdit={editingInvoice}
          onClose={() => {
            setInvoiceModalOpen(false);
            setEditingInvoice(null);
          }}
          onSaved={saved => {
            setInvoiceModalOpen(false);
            setEditingInvoice(null);
            setViewingDoc({ doc: saved, type: 'invoice' });
          }}
          onOpenNewCustomer={() => {
            setCustomerModalOpen(true);
          }}
        />
      )}

      {/* Quote Create / Edit Modal */}
      {quoteModalOpen && (
        <QuoteFormModal
          quoteToEdit={editingQuote}
          onClose={() => {
            setQuoteModalOpen(false);
            setEditingQuote(null);
          }}
          onSaved={saved => {
            setQuoteModalOpen(false);
            setEditingQuote(null);
            setViewingDoc({ doc: saved, type: 'quote' });
          }}
          onOpenNewCustomer={() => {
            setCustomerModalOpen(true);
          }}
        />
      )}

      {/* Record Payment Modal */}
      {paymentModalInvoice && (
        <RecordPaymentModal
          invoice={paymentModalInvoice}
          onClose={() => setPaymentModalInvoice(null)}
          onPaymentRecorded={updated => {
            setPaymentModalInvoice(null);
            setViewingDoc({ doc: updated, type: 'invoice' });
          }}
        />
      )}

      {/* Customer Create / Edit Modal */}
      {customerModalOpen && (
        <CustomerModal
          customerToEdit={editingCustomer}
          onClose={() => {
            setCustomerModalOpen(false);
            setEditingCustomer(null);
          }}
          onSaved={() => {
            setCustomerModalOpen(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Product Create / Edit Modal */}
      {productModalOpen && (
        <ProductModal
          productToEdit={editingProduct}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
