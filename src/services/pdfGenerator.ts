import { jsPDF } from 'jspdf';
import { Invoice, Quote, Organization, Language } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export function generateDocumentPdf(
  doc: Invoice | Quote,
  type: 'invoice' | 'quote',
  org: Organization,
  language: Language = 'fr'
): void {
  const isInvoice = type === 'invoice';
  const invoice = isInvoice ? (doc as Invoice) : undefined;
  const quote = !isInvoice ? (doc as Quote) : undefined;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = margin;

  // Colors
  const primaryColor = org.settings.primaryColor || '#059669'; // Emerald
  // Convert hex to rgb
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const pRgb = hexToRgb(primaryColor);

  // 1. Header Banner / Brand Bar
  pdf.setFillColor(pRgb.r, pRgb.g, pRgb.b);
  pdf.rect(margin, currentY, pageWidth - margin * 2, 4, 'F');
  currentY += 8;

  // 2. Company Info (Left)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(30, 41, 59); // Slate-800
  pdf.text(org.name.toUpperCase(), margin, currentY);
  currentY += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139); // Slate-500
  if (org.businessType) {
    pdf.text(org.businessType, margin, currentY);
    currentY += 4;
  }
  if (org.ifuNumber) {
    pdf.text(`N° IFU : ${org.ifuNumber}${org.rccmNumber ? ` | RCCM : ${org.rccmNumber}` : ''}`, margin, currentY);
    currentY += 4;
  }
  pdf.text(`${org.address}`, margin, currentY);
  currentY += 4;
  pdf.text(`Tél : ${org.phone} | Email : ${org.email}`, margin, currentY);

  // 3. Document Title & Number (Right Aligned)
  const docTitle = isInvoice
    ? (language === 'fr' ? 'FACTURE DE VENTE' : 'SALES INVOICE')
    : (language === 'fr' ? 'DEVIS COMMERCIAL' : 'QUOTATION');

  const docNumber = isInvoice ? invoice!.invoiceNumber : quote!.quoteNumber;
  const issueDateStr = formatDate(doc.issueDate, language);
  const secondDateLabel = isInvoice
    ? (language === 'fr' ? "Date d'échéance" : 'Due Date')
    : (language === 'fr' ? 'Date de validité' : 'Valid Until');
  const secondDateStr = formatDate(isInvoice ? invoice!.dueDate : quote!.expiryDate, language);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  pdf.text(docTitle, pageWidth - margin, margin + 8, { align: 'right' });

  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`N° ${docNumber}`, pageWidth - margin, margin + 14, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`${language === 'fr' ? "Date d'émission" : 'Issue Date'} : ${issueDateStr}`, pageWidth - margin, margin + 20, { align: 'right' });
  pdf.text(`${secondDateLabel} : ${secondDateStr}`, pageWidth - margin, margin + 25, { align: 'right' });

  currentY += 10;

  // 4. Customer Card Box
  pdf.setFillColor(248, 250, 252); // Slate-50
  pdf.setDrawColor(226, 232, 240); // Slate-200
  pdf.roundedRect(margin, currentY, pageWidth - margin * 2, 26, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  pdf.text(language === 'fr' ? 'DESTINATAIRE / CLIENT :' : 'BILL TO :', margin + 4, currentY + 6);

  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text(doc.customerName, margin + 4, currentY + 11);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`${doc.customerAddress || ''}`, margin + 4, currentY + 16);
  pdf.text(`Tél : ${doc.customerPhone || 'N/A'} | Email : ${doc.customerEmail || 'N/A'}${doc.customerTaxId ? ` | IFU : ${doc.customerTaxId}` : ''}`, margin + 4, currentY + 21);

  currentY += 32;

  // 5. Line Items Table Header
  const colDescX = margin + 2;
  const colQtyX = 115;
  const colUnitX = 132;
  const colPriceX = 152;
  const colTotalX = pageWidth - margin - 2;

  pdf.setFillColor(pRgb.r, pRgb.g, pRgb.b);
  pdf.rect(margin, currentY, pageWidth - margin * 2, 7, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text(language === 'fr' ? 'DÉSIGNATION' : 'DESCRIPTION', colDescX, currentY + 5);
  pdf.text(language === 'fr' ? 'QTÉ' : 'QTY', colQtyX, currentY + 5, { align: 'center' });
  pdf.text(language === 'fr' ? 'UNITÉ' : 'UNIT', colUnitX, currentY + 5, { align: 'center' });
  pdf.text(language === 'fr' ? 'PRIX UNIT.' : 'PRICE', colPriceX, currentY + 5, { align: 'right' });
  pdf.text(language === 'fr' ? 'TOTAL HT' : 'TOTAL', colTotalX, currentY + 5, { align: 'right' });

  currentY += 8;

  // Table Rows
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);

  doc.items.forEach((item, index) => {
    // Alternating row background
    if (index % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, currentY - 1, pageWidth - margin * 2, 7, 'F');
    }

    pdf.setTextColor(30, 41, 59);
    // Split long description
    const splitDesc = pdf.splitTextToSize(item.description, 90);
    pdf.text(splitDesc[0], colDescX, currentY + 4);

    pdf.setTextColor(71, 85, 105);
    pdf.text(item.quantity.toString(), colQtyX, currentY + 4, { align: 'center' });
    pdf.text(item.unit || '-', colUnitX, currentY + 4, { align: 'center' });
    pdf.text(formatCurrency(item.unitPrice, doc.currency, language), colPriceX, currentY + 4, { align: 'right' });
    pdf.text(formatCurrency(item.total, doc.currency, language), colTotalX, currentY + 4, { align: 'right' });

    currentY += 7;
  });

  // Divider
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // 6. Totals Box (Right) & Payment Notes (Left)
  const totalsBoxX = 115;
  const totalsBoxW = pageWidth - margin - totalsBoxX;

  // Notes on left
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(language === 'fr' ? 'INSTRUCTIONS & MODES DE RÈGLEMENT :' : 'PAYMENT INSTRUCTIONS :', margin, currentY + 4);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  const notesText = org.settings.paymentInstructions || 'Paiement par Mobile Money (MTN/Moov) ou Virement Bancaire.';
  const splitNotes = pdf.splitTextToSize(notesText, 95);
  pdf.text(splitNotes, margin, currentY + 9);

  // Totals calculations
  let subY = currentY + 2;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);

  pdf.text(language === 'fr' ? 'Sous-total HT :' : 'Subtotal :', totalsBoxX, subY);
  pdf.text(formatCurrency(doc.subtotal, doc.currency, language), pageWidth - margin, subY, { align: 'right' });
  subY += 5;

  if (doc.discountAmount > 0) {
    pdf.text(language === 'fr' ? 'Remise accordée :' : 'Discount :', totalsBoxX, subY);
    pdf.text(`-${formatCurrency(doc.discountAmount, doc.currency, language)}`, pageWidth - margin, subY, { align: 'right' });
    subY += 5;
  }

  if (doc.taxAmount > 0) {
    pdf.text(`${language === 'fr' ? 'TVA' : 'Tax'} (${doc.taxRate}%) :`, totalsBoxX, subY);
    pdf.text(formatCurrency(doc.taxAmount, doc.currency, language), pageWidth - margin, subY, { align: 'right' });
    subY += 5;
  }

  if (doc.shippingFee > 0) {
    pdf.text(language === 'fr' ? 'Frais de transport :' : 'Shipping :', totalsBoxX, subY);
    pdf.text(formatCurrency(doc.shippingFee, doc.currency, language), pageWidth - margin, subY, { align: 'right' });
    subY += 5;
  }

  // Grand Total Banner
  pdf.setFillColor(pRgb.r, pRgb.g, pRgb.b);
  pdf.roundedRect(totalsBoxX - 2, subY, totalsBoxW + 2, 9, 1.5, 1.5, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text(language === 'fr' ? 'TOTAL NET :' : 'GRAND TOTAL :', totalsBoxX + 2, subY + 6);
  pdf.text(formatCurrency(doc.total, doc.currency, language), pageWidth - margin - 2, subY + 6, { align: 'right' });
  subY += 14;

  if (isInvoice) {
    if (invoice!.amountPaid > 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(5, 150, 105);
      pdf.text(language === 'fr' ? 'Montant déjà encaissé :' : 'Paid Amount :', totalsBoxX, subY);
      pdf.text(formatCurrency(invoice!.amountPaid, doc.currency, language), pageWidth - margin, subY, { align: 'right' });
      subY += 5;

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(invoice!.amountRemaining > 0 ? 225 : 5, invoice!.amountRemaining > 0 ? 29 : 150, invoice!.amountRemaining > 0 ? 72 : 105);
      pdf.text(language === 'fr' ? 'SOLDE RESTANT DÛ :' : 'BALANCE DUE :', totalsBoxX, subY);
      pdf.text(formatCurrency(invoice!.amountRemaining, doc.currency, language), pageWidth - margin, subY, { align: 'right' });
    }
  }

  // 7. Footer
  const footerY = pageHeight - 12;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(148, 163, 184);
  const footerText = `${org.name} • ${org.businessType || ''} • IFU: ${org.ifuNumber || 'N/A'} • Tél: ${org.phone} • Généré via EBEN Invoices & Quotes`;
  pdf.text(footerText, pageWidth / 2, footerY, { align: 'center' });

  // Save the PDF
  const filename = `${isInvoice ? 'Facture' : 'Devis'}_${docNumber}_EBEN.pdf`;
  pdf.save(filename);
}
