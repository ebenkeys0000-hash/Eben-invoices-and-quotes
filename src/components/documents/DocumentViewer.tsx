import React, { useState } from 'react';
import { Invoice, Quote, DocumentTemplateId } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Download, 
  Printer, 
  Share2, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  CreditCard, 
  ArrowRightCircle, 
  ChevronLeft,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate, generateWhatsAppMessage } from '../../utils/formatters';
import { generateDocumentPdf } from '../../services/pdfGenerator';
import { storage } from '../../services/storage';

interface DocumentViewerProps {
  document: Invoice | Quote;
  type: 'invoice' | 'quote';
  onClose: () => void;
  onRecordPayment?: (invoice: Invoice) => void;
  onConvertQuote?: (quote: Quote) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document: initialDoc,
  type,
  onClose,
  onRecordPayment,
  onConvertQuote,
}) => {
  const { organization, language, t } = useApp();
  const [doc, setDoc] = useState<Invoice | Quote>(initialDoc);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplateId>(
    doc.templateId || organization.settings.templateId || 'modern_emerald'
  );

  const isInvoice = type === 'invoice';
  const invoice = isInvoice ? (doc as Invoice) : undefined;
  const quote = !isInvoice ? (doc as Quote) : undefined;

  const docNumber = isInvoice ? invoice!.invoiceNumber : quote!.quoteNumber;
  const issueDate = formatDate(doc.issueDate, language);
  const secondDate = formatDate(isInvoice ? invoice!.dueDate : quote!.expiryDate, language);

  const handleDownloadPdf = () => {
    generateDocumentPdf(doc, type, organization, language);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = generateWhatsAppMessage(
      type,
      docNumber,
      doc.customerName,
      doc.total,
      doc.currency,
      isInvoice ? invoice!.dueDate : quote!.expiryDate,
      organization.name,
      language
    );
    const phoneClean = doc.customerPhone ? doc.customerPhone.replace(/[^0-9]/g, '') : '';
    const url = phoneClean 
      ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = isInvoice 
      ? `Facture N° ${docNumber} — ${organization.name}`
      : `Devis N° ${docNumber} — ${organization.name}`;
    const body = `Bonjour ${doc.customerName},\n\nVeuillez trouver le document N° ${docNumber} d'un montant de ${formatCurrency(doc.total, doc.currency, language)}.\n\nCordialement,\n${organization.name}\n${organization.phone}`;
    window.open(`mailto:${doc.customerEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/#doc=${doc.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status badge styling
  const getStatusBadge = () => {
    const status = doc.status;
    if (status === 'paid' || status === 'accepted') {
      return (
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {isInvoice ? t.invoices.statuses.paid : t.quotes.statuses.accepted}
        </span>
      );
    }
    if (status === 'partially_paid' || status === 'sent') {
      return (
        <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
          <Clock className="h-3.5 w-3.5" />
          {isInvoice ? t.invoices.statuses.partially_paid : t.quotes.statuses.sent}
        </span>
      );
    }
    if (status === 'overdue' || status === 'rejected') {
      return (
        <span className="flex items-center gap-1 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/30">
          <AlertCircle className="h-3.5 w-3.5" />
          {isInvoice ? t.invoices.statuses.overdue : t.quotes.statuses.rejected}
        </span>
      );
    }
    if (status === 'converted') {
      return (
        <span className="flex items-center gap-1 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-500/30">
          <Check className="h-3.5 w-3.5" />
          {t.quotes.statuses.converted}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 rounded-full bg-slate-500/20 px-3 py-1 text-xs font-bold text-slate-300 border border-slate-500/30">
        {isInvoice ? t.invoices.statuses.draft : t.quotes.statuses.draft}
      </span>
    );
  };

  // Theme color accents
  const getThemeHeaderStyle = () => {
    switch (selectedTemplate) {
      case 'modern_emerald':
        return 'border-emerald-600 bg-emerald-700 text-white';
      case 'executive_dark':
        return 'border-slate-900 bg-slate-900 text-amber-300';
      case 'classic_clean':
        return 'border-slate-400 bg-slate-100 text-slate-900 border-b-2';
      case 'bold_indigo':
        return 'border-indigo-600 bg-indigo-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md overflow-hidden">
      {/* Top Action Control Header */}
      <div className="no-print flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Retour</span>
          </button>
          <div>
            <h2 className="text-sm font-bold text-white lg:text-base flex items-center gap-2">
              <span>{isInvoice ? 'Facture' : 'Devis'} {docNumber}</span>
              {getStatusBadge()}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Record payment button if invoice */}
          {isInvoice && invoice!.amountRemaining > 0 && onRecordPayment && (
            <button
              onClick={() => onRecordPayment(invoice!)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Encaisser</span>
            </button>
          )}

          {/* Convert Quote button */}
          {!isInvoice && quote!.status !== 'converted' && onConvertQuote && (
            <button
              onClick={() => onConvertQuote(quote!)}
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-teal-500 transition-colors"
            >
              <ArrowRightCircle className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Convertir en Facture</span>
            </button>
          )}

          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600/20 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
            title="Partager sur WhatsApp"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">WhatsApp</span>
          </button>

          {/* Email Share */}
          <button
            onClick={handleEmail}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600/20 px-3 py-1.5 text-xs font-bold text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
            title="Envoyer par Email"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Email</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:from-emerald-500 hover:to-teal-500 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
            title="Imprimer"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Content Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center">
        {/* Printable & Screen High-Resolution A4 Sheet */}
        <div className="w-full max-w-3xl rounded-2xl bg-white text-slate-900 shadow-2xl p-6 sm:p-10 border border-slate-200 transition-all font-sans">
          
          {/* Top Brand Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-mono font-black text-base shadow-sm shadow-blue-500/30">
                  E
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    {organization.name || 'EBEN Technologies SARL'}
                  </h1>
                  <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Solutions Digitales & Facturation Bénin
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {organization.businessType || 'SARL au capital de 10 000 000 FCFA'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">N° IFU :</span> {organization.ifuNumber || '3201948572834'}
                <span className="ml-2 font-semibold text-slate-700">RCCM :</span> {organization.rccmNumber || 'RB/ABC/22 B 31094'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {organization.address || 'Carrefour IITA, Tankpè, Abomey-Calavi, République du Bénin'}
              </p>
              <p className="text-xs text-slate-500">
                Tél : <span className="font-medium text-slate-700">{organization.phone || '+229 97 45 60 12'}</span> • Email : <span className="text-blue-600">{organization.email || 'contact@eben-tech.bj'}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block rounded-xl bg-blue-50 px-4 py-2 border border-blue-200 shadow-xs">
                <h2 className="text-base font-black text-blue-900 tracking-tight">
                  {isInvoice ? 'FACTURE DE VENTE' : 'DEVIS COMMERCIAL'}
                </h2>
                <p className="text-sm font-mono font-bold text-blue-700">
                  N° {docNumber}
                </p>
              </div>

              <div className="mt-2.5 text-xs text-slate-600 space-y-0.5">
                <p>
                  <span className="font-semibold text-slate-700">Date d'émission :</span> {issueDate}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">
                    {isInvoice ? "Date d'échéance :" : 'Date de validité :'}
                  </span>{' '}
                  {secondDate}
                </p>
              </div>
            </div>
          </div>

          {/* Customer / Bill To Box */}
          <div className="my-6 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
              Destinataire / Client :
            </p>
            <h3 className="text-sm font-bold text-slate-900">{doc.customerName}</h3>
            {doc.customerAddress && (
              <p className="text-xs text-slate-600 mt-0.5">{doc.customerAddress}</p>
            )}
            <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-500">
              {doc.customerPhone && <span>Tél : <strong className="text-slate-700">{doc.customerPhone}</strong></span>}
              {doc.customerEmail && <span>Email : {doc.customerEmail}</span>}
              {doc.customerTaxId && <span>IFU : <strong className="text-slate-700">{doc.customerTaxId}</strong></span>}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={getThemeHeaderStyle()}>
                  <th className="py-2.5 px-3 font-bold rounded-l-lg">Désignation</th>
                  <th className="py-2.5 px-3 text-center font-bold">Qté</th>
                  <th className="py-2.5 px-3 text-center font-bold">Unité</th>
                  <th className="py-2.5 px-3 text-right font-bold">Prix Unitaire</th>
                  <th className="py-2.5 px-3 text-right font-bold rounded-r-lg">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {doc.items.map((item, idx) => (
                  <tr key={item.id || idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{item.description}</p>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500">
                      {item.unit || '-'}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 font-mono">
                      {formatCurrency(item.unitPrice, doc.currency, language)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                      {formatCurrency(item.total, doc.currency, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary & Bank Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            {/* Left: Payment Notes / Mobile Money / Legal terms */}
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs">
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-emerald-600" />
                  Instructions de Paiement :
                </p>
                <p className="text-slate-600 whitespace-pre-line text-[11px] leading-relaxed">
                  {organization.settings.paymentInstructions || 'Paiement par Mobile Money (MTN / Moov) ou Virement Bancaire.'}
                </p>
              </div>

              {doc.notes && (
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Remarques :</p>
                  <p className="text-[11px] mt-0.5">{doc.notes}</p>
                </div>
              )}
            </div>

            {/* Right: Subtotal, Taxes, Discounts, Grand Total */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                <span>Sous-total HT :</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatCurrency(doc.subtotal, doc.currency, language)}
                </span>
              </div>

              {doc.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 py-1 border-b border-slate-100">
                  <span>Remise accordée :</span>
                  <span className="font-mono font-semibold">
                    -{formatCurrency(doc.discountAmount, doc.currency, language)}
                  </span>
                </div>
              )}

              {doc.taxAmount > 0 && (
                <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                  <span>TVA ({doc.taxRate}%) :</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatCurrency(doc.taxAmount, doc.currency, language)}
                  </span>
                </div>
              )}

              {doc.shippingFee > 0 && (
                <div className="flex justify-between text-slate-600 py-1 border-b border-slate-100">
                  <span>Frais de transport / livraison :</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {formatCurrency(doc.shippingFee, doc.currency, language)}
                  </span>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex justify-between items-center rounded-xl bg-slate-900 p-3 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Total Net à Payer :
                </span>
                <span className="text-base font-extrabold font-mono text-emerald-400">
                  {formatCurrency(doc.total, doc.currency, language)}
                </span>
              </div>

              {/* Invoice payment breakdown */}
              {isInvoice && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Montant déjà réglé :</span>
                    <span className="font-mono font-bold">
                      {formatCurrency(invoice!.amountPaid, doc.currency, language)}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-bold border-t border-slate-200 pt-1">
                    <span>Solde Restant Dû :</span>
                    <span className="font-mono text-sm">
                      {formatCurrency(invoice!.amountRemaining, doc.currency, language)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer & Official Legal Signature Mention */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left gap-4 text-[10px] text-slate-500">
            <div className="space-y-1 max-w-md">
              <p className="font-semibold text-slate-700">
                {organization.name || 'EBEN Technologies SARL'} • {organization.businessType || 'SARL au capital de 10 000 000 FCFA'}
              </p>
              <p>
                IFU : <span className="font-bold text-slate-700">{organization.ifuNumber || '3201948572834'}</span> • RCCM : <span className="font-bold text-slate-700">{organization.rccmNumber || 'RB/ABC/22 B 31094'}</span>
              </p>
              <p>
                Siège social : {organization.address || 'Carrefour IITA, Tankpè, Abomey-Calavi, République du Bénin'}
              </p>
              <p className="text-slate-400 text-[9px] pt-1 border-t border-slate-100">
                Facture commerciale établie conformément à la réglementation fiscale UEMOA en vigueur en République du Bénin.
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <p className="font-bold text-slate-700">Pour {organization.name || 'EBEN Technologies SARL'}</p>
              <p className="text-[9px] text-slate-400">Direction Générale / Service Comptabilité</p>
              <div className="mt-2 h-14 w-32 border border-dashed border-blue-300 rounded-xl bg-blue-50/50 flex flex-col items-center justify-center text-[9px] text-blue-700">
                <span className="font-bold">EBEN TECH SARL</span>
                <span className="text-[8px] text-slate-400">Cachet & Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
