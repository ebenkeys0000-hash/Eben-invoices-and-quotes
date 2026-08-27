import React, { useState, useEffect } from 'react';
import { Invoice, DocumentItem, Customer, Product, CurrencyCode } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  X, 
  Plus, 
  Trash2, 
  Calculator, 
  UserPlus, 
  Calendar, 
  FileText, 
  DollarSign, 
  AlertCircle,
  Save,
  CheckCircle2,
  Package
} from 'lucide-react';
import { calculateDocumentTotals, formatCurrency } from '../../utils/formatters';

interface InvoiceFormModalProps {
  invoiceToEdit?: Invoice | null;
  onClose: () => void;
  onSaved: (invoice: Invoice) => void;
  onOpenNewCustomer: () => void;
}

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  invoiceToEdit,
  onClose,
  onSaved,
  onOpenNewCustomer,
}) => {
  const { organization, currentUser, subscription, setIsSubscriptionModalOpen, language, t } = useApp();
  
  const isEditing = !!invoiceToEdit;
  const customers = storage.getCustomers();
  const products = storage.getProducts();

  // Check trial limits for new invoice
  useEffect(() => {
    if (!isEditing) {
      const check = storage.canCreateInvoice();
      if (!check.allowed) {
        setIsSubscriptionModalOpen(true);
      }
    }
  }, [isEditing]);

  const [customerId, setCustomerId] = useState<string>(
    invoiceToEdit?.customerId || (customers.length > 0 ? customers[0].id : '')
  );
  const [invoiceNumber, setInvoiceNumber] = useState<string>(() => {
    if (invoiceToEdit) return invoiceToEdit.invoiceNumber;
    const nextNum = organization.settings.nextInvoiceNumber;
    return `${organization.settings.invoicePrefix}${nextNum.toString().padStart(3, '0')}`;
  });
  const [issueDate, setIssueDate] = useState<string>(
    invoiceToEdit?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState<string>(() => {
    if (invoiceToEdit?.dueDate) return invoiceToEdit.dueDate;
    const d = new Date();
    d.setDate(d.getDate() + (organization.settings.defaultPaymentTermsDays || 30));
    return d.toISOString().split('T')[0];
  });
  const [currency, setCurrency] = useState<CurrencyCode>(
    invoiceToEdit?.currency || organization.settings.defaultCurrency || 'XOF'
  );
  const [items, setItems] = useState<DocumentItem[]>(() => {
    if (invoiceToEdit?.items && invoiceToEdit.items.length > 0) return invoiceToEdit.items;
    return [
      {
        id: `item_${Date.now()}_1`,
        description: 'Prestation de services informatiques / conseil',
        quantity: 1,
        unit: 'forfait',
        unitPrice: 250000,
        discountPercentage: 0,
        taxRate: organization.settings.defaultTaxRate || 18,
        total: 250000,
      },
    ];
  });

  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    invoiceToEdit?.discountType || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState<number>(
    invoiceToEdit?.discountValue || 0
  );
  const [taxRate, setTaxRate] = useState<number>(
    invoiceToEdit?.taxRate !== undefined ? invoiceToEdit.taxRate : (organization.settings.defaultTaxRate || 18)
  );
  const [shippingFee, setShippingFee] = useState<number>(
    invoiceToEdit?.shippingFee || 0
  );
  const [notes, setNotes] = useState<string>(
    invoiceToEdit?.notes || organization.settings.defaultNotes || ''
  );
  const [paymentInstructions, setPaymentInstructions] = useState<string>(
    invoiceToEdit?.paymentInstructions || organization.settings.paymentInstructions || ''
  );
  const [status, setStatus] = useState<Invoice['status']>(
    invoiceToEdit?.status || 'draft'
  );
  const [error, setError] = useState<string | null>(null);

  // Totals calculations
  const totals = calculateDocumentTotals(items, discountType, discountValue, taxRate, shippingFee);

  // Line item handlers
  const handleItemChange = (index: number, field: keyof DocumentItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    
    // recalculate line total
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const disc = Number(item.discountPercentage) || 0;
    const lineTotal = Math.round(qty * price * (1 - disc / 100));
    item.total = lineTotal;

    updated[index] = item;
    setItems(updated);
  };

  const handleSelectProduct = (index: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const updated = [...items];
    updated[index] = {
      ...updated[index],
      productId: prod.id,
      description: `${prod.name}${prod.description ? ` - ${prod.description}` : ''}`,
      unitPrice: prod.unitPrice,
      unit: prod.unit,
      taxRate: prod.taxRate,
      total: updated[index].quantity * prod.unitPrice,
    };
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}_${items.length + 1}`,
        description: '',
        quantity: 1,
        unit: 'pièce',
        unitPrice: 0,
        discountPercentage: 0,
        taxRate,
        total: 0,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (saveStatus: Invoice['status'] = status) => {
    setError(null);
    if (!customerId) {
      setError('Veuillez sélectionner un client.');
      return;
    }
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (!selectedCustomer) {
      setError('Client introuvable.');
      return;
    }
    if (items.length === 0 || !items[0].description) {
      setError('Veuillez renseigner au moins une ligne de facturation.');
      return;
    }

    const newInvoice: Invoice = {
      id: invoiceToEdit?.id || `inv_${Date.now()}`,
      orgId: organization.id,
      invoiceNumber,
      quoteId: invoiceToEdit?.quoteId,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      customerTaxId: selectedCustomer.taxId,
      issueDate,
      dueDate,
      items,
      subtotal: totals.subtotal,
      discountType,
      discountValue,
      discountAmount: totals.discountAmount,
      taxRate,
      taxAmount: totals.taxAmount,
      shippingFee: totals.shippingFee,
      total: totals.total,
      amountPaid: invoiceToEdit?.amountPaid || 0,
      amountRemaining: Math.max(0, totals.total - (invoiceToEdit?.amountPaid || 0)),
      currency,
      status: saveStatus,
      notes,
      paymentInstructions,
      templateId: organization.settings.templateId,
      payments: invoiceToEdit?.payments || [],
      createdByUserId: currentUser.id,
      createdAt: invoiceToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = storage.saveInvoice(newInvoice, !isEditing);
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-900 p-5 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isEditing ? `Modifier Facture ${invoiceToEdit?.invoiceNumber}` : 'Nouvelle Facture de Vente'}
              </h2>
              <p className="text-xs text-slate-400">
                Créez une facture conforme avec calcul automatique de la TVA et remises
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Customer & Invoice Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
          {/* Customer Picker */}
          <div className="md:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Client :</label>
              <button
                type="button"
                onClick={onOpenNewCustomer}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
              >
                <Plus className="h-3 w-3" />
                Nouveau
              </button>
            </div>
            <select
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.companyName ? `(${c.companyName})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Number & Currency */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              N° Facture :
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Devise :
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as CurrencyCode)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            >
              <option value="XOF">FCFA (XOF) - Bénin / UEMOA</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar US ($)</option>
              <option value="CAD">Dollar Canadien ($)</option>
            </select>
          </div>

          {/* Issue Date & Due Date */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Date d'émission :
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Date d'échéance :
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Statut initial :
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
            >
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyée au client</option>
              <option value="paid">Déjà Payée</option>
            </select>
          </div>
        </div>

        {/* Section 2: Line Items Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Articles & Prestations
            </h3>
            <button
              type="button"
              onClick={addItemRow}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter une ligne
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 space-y-2"
              >
                {/* Quick product catalog picker */}
                {products.length > 0 && (
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-[10px] text-slate-400">Choisir depuis le catalogue :</span>
                    <select
                      onChange={e => handleSelectProduct(idx, e.target.value)}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700 outline-hidden"
                    >
                      <option value="">Sélectionner un produit...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.unitPrice} XOF)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Description de la prestation / produit..."
                      value={item.description}
                      onChange={e => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qté"
                        value={item.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-2 text-xs text-white font-mono text-center outline-hidden focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Unité"
                        value={item.unit}
                        onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                        className="w-16 rounded-xl border border-slate-700 bg-slate-800 px-1.5 py-2 text-[11px] text-slate-300 text-center outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Prix Unitaire"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-2 text-xs text-white font-mono text-right outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1 flex items-center justify-end font-mono text-xs font-bold text-emerald-400">
                    {formatCurrency(item.total, currency, language)}
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      disabled={items.length <= 1}
                      className="text-slate-500 hover:text-rose-400 disabled:opacity-30 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Summary Totals & Discounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-4 rounded-2xl border border-slate-800 mb-6">
          {/* Notes & Bank details */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Instructions de Paiement (MoMo, RIB) :
              </label>
              <textarea
                rows={2}
                value={paymentInstructions}
                onChange={e => setPaymentInstructions(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-hidden focus:border-emerald-500"
                placeholder="Ex: MTN MoMo +229 97 00 00 00 / RIB Bancaire..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notes publiques pour le client :
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-hidden focus:border-emerald-500"
                placeholder="Ex: Merci pour votre confiance..."
              />
            </div>
          </div>

          {/* Calculations */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 py-1">
              <span>Sous-total HT :</span>
              <span className="font-mono font-semibold text-slate-200">
                {formatCurrency(totals.subtotal, currency, language)}
              </span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between gap-2 py-1">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Remise globale :</span>
                <select
                  value={discountType}
                  onChange={e => setDiscountType(e.target.value as any)}
                  className="rounded bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300 border border-slate-700"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">Montant fixe</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white font-mono text-right"
                />
                <span className="font-mono text-emerald-400">
                  -{formatCurrency(totals.discountAmount, currency, language)}
                </span>
              </div>
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1 text-slate-400">
                <span>TVA (%) :</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-16 rounded-lg border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-white font-mono text-right"
                />
              </div>
              <span className="font-mono font-semibold text-slate-200">
                {formatCurrency(totals.taxAmount, currency, language)}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Frais de livraison :</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={shippingFee}
                  onChange={e => setShippingFee(parseFloat(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white font-mono text-right"
                />
              </div>
            </div>

            {/* Total Grand */}
            <div className="flex justify-between items-center rounded-xl bg-slate-800 p-3 text-white border border-slate-700 mt-2">
              <span className="font-bold uppercase tracking-wider text-xs">Total Net à Payer :</span>
              <span className="text-base font-extrabold font-mono text-emerald-400">
                {formatCurrency(totals.total, currency, language)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="w-full sm:w-auto rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/40 transition-colors"
          >
            Enregistrer en Brouillon
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('sent')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Finaliser la Facture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
