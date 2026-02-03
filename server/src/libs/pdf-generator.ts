/**
 * PDF Invoice Generator
 * Generates Georgian-language invoice PDFs using pdfkit with Premium Modern Design
 * FLORCA Blue branding with subtle botanical accents
 */

import PDFDocument from 'pdfkit';
import path from 'path';
import type { InvoiceResponse, InvoiceStatus } from '@/modules/invoices/invoices.types';

import fs from 'fs';

// Try to find the fonts directory in multiple possible locations
const getFontsDir = () => {
  const possiblePaths = [
    path.join(__dirname, '..', 'assets', 'fonts'), // Standard relative path (works in src/libs or dist/libs if assets copied)
    path.join(process.cwd(), 'src', 'assets', 'fonts'), // Dev environment from root
    path.join(process.cwd(), 'dist', 'assets', 'fonts'), // Prod environment from root (if assets copied)
    path.join(process.cwd(), 'assets', 'fonts'), // Potential docker/deployment root
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log(`PDF Generator: Found fonts at ${p}`);
      return p;
    }
  }

  console.error('PDF Generator: Could not find fonts directory. Tried:', possiblePaths);
  // Fallback to the standard relative path even if it doesn't exist, to let the error bubble up naturally or default
  return path.join(__dirname, '..', 'assets', 'fonts');
};

const FONTS_DIR = getFontsDir();
const FONT_REGULAR = path.join(FONTS_DIR, 'NotoSansGeorgian-Regular.ttf');
const FONT_BOLD = path.join(FONTS_DIR, 'NotoSansGeorgian-Bold.ttf');

// Page layout constants
const PAGE_WIDTH = 595.28; // A4 width in points
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Premium Modern Design Color Palette (RGB values for pdfkit)
const COLORS = {
  // Primary Brand Colors
  FLORCA_BLUE: [23, 94, 235],
  DEEP_NAVY: [30, 58, 138],
  SKY_BLUE: [224, 231, 255],

  // Accent Colors
  SAGE_GREEN: [16, 185, 129],
  GREEN_BG: [209, 250, 229],
  ROSE_GOLD: [245, 158, 11],

  // Neutrals
  WHITE: [255, 255, 255],
  DEEP_BLACK: [9, 9, 11],
  SLATE_GRAY: [100, 116, 139],
  BORDER_GRAY: [226, 232, 240],
  LIGHT_GRAY_BG: [249, 250, 251],

  // Status Badge Colors
  STATUS_ISSUED_BG: [224, 231, 255],
  STATUS_ISSUED_TEXT: [23, 94, 235],
  STATUS_PAID_BG: [209, 250, 229],
  STATUS_PAID_TEXT: [16, 185, 129],
  STATUS_CANCELLED_BG: [254, 226, 226],
  STATUS_CANCELLED_TEXT: [239, 68, 68],
  STATUS_DRAFT_BG: [243, 244, 246],
  STATUS_DRAFT_TEXT: [100, 116, 139],
} as const;

/**
 * Generate a PDF invoice buffer with Premium Modern Design
 */
export async function generateInvoicePdf(invoice: InvoiceResponse): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 0, // We'll handle margins manually for full-width elements
        info: {
          Title: `Invoice ${invoice.invoiceNumber}`,
          Author: invoice.seller.companyName,
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Register Georgian fonts
      doc.registerFont('Georgian', FONT_REGULAR);
      doc.registerFont('Georgian-Bold', FONT_BOLD);

      // Render invoice with new premium design
      renderHeaderBanner(doc, invoice);
      renderStatusBadge(doc, invoice.status);
      renderDetailsCards(doc, invoice);
      renderOrderInfoBar(doc, invoice);
      renderLineItems(doc, invoice);
      renderTotals(doc, invoice);
      renderFooter(doc, invoice);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Draw a subtle flower icon for branding
 */
function drawFlowerIcon(doc: PDFKit.PDFDocument, x: number, y: number): void {
  const petalRadius = 4;
  const centerRadius = 2;
  const petalDistance = 6;

  doc.opacity(0.25); // Subtle transparency

  // Center circle
  doc
    .circle(x, y, centerRadius)
    .fillAndStroke(COLORS.WHITE, COLORS.WHITE);

  // 5 petals in a circle (72° apart)
  for (let i = 0; i < 5; i++) {
    const angle = ((i * 72 - 90) * Math.PI) / 180;
    const petalX = x + Math.cos(angle) * petalDistance;
    const petalY = y + Math.sin(angle) * petalDistance;
    doc.circle(petalX, petalY, petalRadius).fillAndStroke(COLORS.WHITE, COLORS.WHITE);
  }

  doc.opacity(1); // Reset opacity
}

/**
 * Render full-width FLORCA Blue header banner with company branding
 */
function renderHeaderBanner(doc: PDFKit.PDFDocument, invoice: InvoiceResponse): void {
  const bannerHeight = 60;

  // Full-width FLORCA Blue background
  doc.rect(0, 0, PAGE_WIDTH, bannerHeight).fill(COLORS.FLORCA_BLUE);

  // Draw subtle flower icon (left side, near company name)
  drawFlowerIcon(doc, MARGIN + 70, 20);

  // Company name (left side, large and bold)
  doc
    .fill(COLORS.WHITE)
    .font('Georgian-Bold')
    .fontSize(28)
    .text('FLORCA', MARGIN, 12);

  // Tagline (left side, small)
  doc.fontSize(9).font('Georgian').text('PREMIUM FLOWERS & LOGISTICS', MARGIN, 42);

  // Invoice title (right side, large)
  doc
    .font('Georgian-Bold')
    .fontSize(18)
    .text('ინვოისი', PAGE_WIDTH - MARGIN - 100, 12, {
      width: 100,
      align: 'right',
    });

  // Invoice number (right side, smaller)
  doc
    .fontSize(10)
    .font('Georgian')
    .text(invoice.invoiceNumber, PAGE_WIDTH - MARGIN - 100, 36, {
      width: 100,
      align: 'right',
    });

  // Move cursor below banner
  doc.y = bannerHeight + 5;
}

/**
 * Render status badge (pill shape) in top right
 */
function renderStatusBadge(doc: PDFKit.PDFDocument, status: InvoiceStatus): void {
  const badgeConfig = {
    ISSUED: {
      bg: COLORS.STATUS_ISSUED_BG,
      text: COLORS.STATUS_ISSUED_TEXT,
      label: 'გამოწერილი',
    },
    PAID: {
      bg: COLORS.STATUS_PAID_BG,
      text: COLORS.STATUS_PAID_TEXT,
      label: 'გადახდილი',
    },
    CANCELLED: {
      bg: COLORS.STATUS_CANCELLED_BG,
      text: COLORS.STATUS_CANCELLED_TEXT,
      label: 'გაუქმებული',
    },
    DRAFT: {
      bg: COLORS.STATUS_DRAFT_BG,
      text: COLORS.STATUS_DRAFT_TEXT,
      label: 'დრაფტი',
    },
  };

  const config = badgeConfig[status] || badgeConfig.ISSUED;
  const badgeWidth = 80;
  const badgeHeight = 24;
  const radius = badgeHeight / 2; // Full pill shape
  const badgeX = PAGE_WIDTH - MARGIN - badgeWidth;
  const badgeY = 75;

  // Badge background with colored border
  doc
    .roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, radius, radius)
    .fillAndStroke(config.bg, config.text);

  // Badge text (centered)
  doc
    .fill(config.text)
    .font('Georgian-Bold')
    .fontSize(9)
    .text(config.label, badgeX, badgeY + 8, {
      width: badgeWidth,
      align: 'center',
    });

  // Move cursor below badge
  doc.y = badgeY + badgeHeight + 10;
}

/**
 * Render seller and buyer details as side-by-side cards
 */
function renderDetailsCards(doc: PDFKit.PDFDocument, invoice: InvoiceResponse): void {
  const startY = doc.y;
  const cardWidth = (CONTENT_WIDTH - 10) / 2; // 10pt gap between cards
  const cardHeight = 95;
  const cardPadding = 12;
  const radius = 8;

  // === SELLER CARD (Left) ===
  const sellerX = MARGIN;

  // Card background and border
  doc
    .roundedRect(sellerX, startY, cardWidth, cardHeight, radius, radius)
    .lineWidth(1)
    .fillAndStroke(COLORS.LIGHT_GRAY_BG, COLORS.BORDER_GRAY);

  let textY = startY + cardPadding;

  // Section header
  doc
    .fill(COLORS.SLATE_GRAY)
    .font('Georgian-Bold')
    .fontSize(8)
    .text('გამყიდველი / SELLER', sellerX + cardPadding, textY);

  textY += 12;

  // Company name (larger, bold, black)
  doc.fill(COLORS.DEEP_BLACK).fontSize(11).text(invoice.seller.companyName, sellerX + cardPadding, textY);

  textY += 14;

  // Details (smaller, gray)
  doc.font('Georgian').fontSize(8).fill(COLORS.SLATE_GRAY);

  const sellerDetails = [
    `ს/კ: ${invoice.seller.taxId}`,
    `${invoice.seller.address}`,
    `ტელ: ${invoice.seller.phone}`,
    `${invoice.seller.email}`,
    `${invoice.seller.bankName}`,
  ];

  for (const detail of sellerDetails) {
    doc.text(detail, sellerX + cardPadding, textY, {
      width: cardWidth - cardPadding * 2,
    });
    textY += 9;
  }

  // === BUYER CARD (Right) ===
  const buyerX = MARGIN + cardWidth + 10;

  // Card background and border
  doc
    .roundedRect(buyerX, startY, cardWidth, cardHeight, radius, radius)
    .lineWidth(1)
    .fillAndStroke(COLORS.LIGHT_GRAY_BG, COLORS.BORDER_GRAY);

  textY = startY + cardPadding;

  // Section header
  doc
    .fill(COLORS.SLATE_GRAY)
    .font('Georgian-Bold')
    .fontSize(8)
    .text('მყიდველი / BUYER', buyerX + cardPadding, textY);

  textY += 12;

  // Buyer name (larger, bold, black)
  doc.fill(COLORS.DEEP_BLACK).fontSize(11).text(invoice.buyerName, buyerX + cardPadding, textY);

  textY += 14;

  // Details (smaller, gray)
  doc.font('Georgian').fontSize(8).fill(COLORS.SLATE_GRAY);

  const buyerDetails: string[] = [];

  if (invoice.buyerTaxId) {
    buyerDetails.push(`ს/კ: ${invoice.buyerTaxId}`);
  }
  if (invoice.buyerPersonalId) {
    buyerDetails.push(`პ/ნ: ${invoice.buyerPersonalId}`);
  }
  if (invoice.buyerAddress) {
    buyerDetails.push(invoice.buyerAddress);
  }
  if (invoice.buyerPhone) {
    buyerDetails.push(`ტელ: ${invoice.buyerPhone}`);
  }
  if (invoice.buyerEmail) {
    buyerDetails.push(invoice.buyerEmail);
  }

  for (const detail of buyerDetails) {
    doc.text(detail, buyerX + cardPadding, textY, {
      width: cardWidth - cardPadding * 2,
    });
    textY += 9;
  }

  // Move cursor below both cards
  doc.y = startY + cardHeight + 15;
}

/**
 * Render order information as a 4-column bar
 */
function renderOrderInfoBar(doc: PDFKit.PDFDocument, invoice: InvoiceResponse): void {
  const startY = doc.y;
  const colWidth = CONTENT_WIDTH / 4;

  const issueDate = new Date(invoice.issueDate);
  const formattedDate = issueDate.toLocaleDateString('ka-GE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const items = [
    { label: 'შეკვეთა', value: invoice.orderNumber },
    { label: 'თარიღი', value: formattedDate },
    { label: 'ვალუტა', value: 'GEL (₾)' },
    { label: 'ინვოისი', value: invoice.invoiceNumber },
  ];

  // Render 4 columns
  items.forEach((item, index) => {
    const x = MARGIN + index * colWidth;

    // Label (small, uppercase, gray, bold)
    doc
      .font('Georgian-Bold')
      .fontSize(7)
      .fill(COLORS.SLATE_GRAY)
      .text(item.label.toUpperCase(), x, startY);

    // Value (larger, black)
    doc.font('Georgian').fontSize(9).fill(COLORS.DEEP_BLACK).text(item.value, x, startY + 10);
  });

  // Move cursor down and add separator line
  doc.y = startY + 30;
  drawLine(doc, doc.y);
  doc.y += 5;
}

/**
 * Render line items table with FLORCA Blue header and alternating rows
 */
function renderLineItems(doc: PDFKit.PDFDocument, invoice: InvoiceResponse): void {
  const colWidths = {
    name: CONTENT_WIDTH * 0.35,
    qty: CONTENT_WIDTH * 0.1,
    unitPrice: CONTENT_WIDTH * 0.18,
    vat: CONTENT_WIDTH * 0.18,
    total: CONTENT_WIDTH * 0.19,
  };

  const tableTop = doc.y;
  const headerHeight = 24;
  const rowHeight = 20;

  // === TABLE HEADER (FLORCA Blue) ===
  doc.rect(MARGIN, tableTop, CONTENT_WIDTH, headerHeight).fill(COLORS.FLORCA_BLUE);

  // Header text (white, bold)
  doc.fill(COLORS.WHITE).font('Georgian-Bold').fontSize(9);

  let x = MARGIN + 8;
  const headerY = tableTop + 8;

  doc.text('პროდუქტი', x, headerY, { width: colWidths.name });
  x += colWidths.name;
  doc.text('რაოდ.', x, headerY, { width: colWidths.qty, align: 'center' });
  x += colWidths.qty;
  doc.text('ერთ. ფასი', x, headerY, { width: colWidths.unitPrice, align: 'right' });
  x += colWidths.unitPrice;
  doc.text('დღგ', x, headerY, { width: colWidths.vat, align: 'right' });
  x += colWidths.vat;
  doc.text('ჯამი', x, headerY, { width: colWidths.total, align: 'right' });

  let rowY = tableTop + headerHeight;

  doc.font('Georgian').fontSize(9);

  // === TABLE ROWS (alternating backgrounds) ===
  for (let i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];

    // Alternating row background (white / light gray)
    if (i % 2 === 0) {
      doc.rect(MARGIN, rowY, CONTENT_WIDTH, rowHeight).fill(COLORS.WHITE);
    } else {
      doc.rect(MARGIN, rowY, CONTENT_WIDTH, rowHeight).fill(COLORS.LIGHT_GRAY_BG);
    }

    // Row text (deep black)
    doc.fill(COLORS.DEEP_BLACK);
    x = MARGIN + 8;
    const textY = rowY + 6;

    doc.text(item.productName, x, textY, { width: colWidths.name });
    x += colWidths.name;
    doc.text(String(item.quantity), x, textY, { width: colWidths.qty, align: 'center' });
    x += colWidths.qty;
    doc.text(`${formatGel(item.unitPriceGel)}`, x, textY, { width: colWidths.unitPrice, align: 'right' });
    x += colWidths.unitPrice;
    doc.text(`${formatGel(item.vatAmount)}`, x, textY, { width: colWidths.vat, align: 'right' });
    x += colWidths.vat;
    doc.text(`${formatGel(item.totalGel)}`, x, textY, { width: colWidths.total, align: 'right' });

    rowY += rowHeight;

    // Border line between rows
    doc
      .strokeColor(COLORS.BORDER_GRAY)
      .lineWidth(0.5)
      .moveTo(MARGIN, rowY)
      .lineTo(MARGIN + CONTENT_WIDTH, rowY)
      .stroke();

    // Check if we need a new page
    if (rowY > 700) {
      doc.addPage();
      rowY = MARGIN;
    }
  }

  doc.y = rowY + 10;
}

/**
 * Render totals section with sky blue background box for grand total
 */
function renderTotals(doc: PDFKit.PDFDocument, invoice: InvoiceResponse): void {
  const rightColX = MARGIN + CONTENT_WIDTH * 0.6;
  const valueX = MARGIN + CONTENT_WIDTH - 10;
  const labelWidth = CONTENT_WIDTH * 0.3;
  const valueWidth = CONTENT_WIDTH * 0.1;

  doc.font('Georgian').fontSize(9);

  let y = doc.y;

  // Subtotal (excl VAT)
  doc.fill(COLORS.SLATE_GRAY).text('ქვეჯამი (დღგ-ს გარეშე):', rightColX, y, { width: labelWidth });
  doc.fill(COLORS.DEEP_BLACK).text(`${formatGel(invoice.subtotalGel)}`, valueX - valueWidth, y, {
    width: valueWidth,
    align: 'right',
  });
  y += 12;

  // VAT
  doc.fill(COLORS.SLATE_GRAY).text('დღგ (18%):', rightColX, y, { width: labelWidth });
  doc.fill(COLORS.DEEP_BLACK).text(`${formatGel(invoice.vatAmount)}`, valueX - valueWidth, y, {
    width: valueWidth,
    align: 'right',
  });
  y += 12;

  // Discount (if any) - green color
  if (parseFloat(invoice.discountGel) > 0) {
    doc.fill(COLORS.SAGE_GREEN).text('ფასდაკლება:', rightColX, y, { width: labelWidth });
    doc.text(`-${formatGel(invoice.discountGel)}`, valueX - valueWidth, y, {
      width: valueWidth,
      align: 'right',
    });
    y += 12;
  }

  // Credits used (if any) - FLORCA blue color
  if (parseFloat(invoice.creditsUsedGel) > 0) {
    doc.fill(COLORS.FLORCA_BLUE).text('კრედიტები:', rightColX, y, { width: labelWidth });
    doc.text(`-${formatGel(invoice.creditsUsedGel)}`, valueX - valueWidth, y, {
      width: valueWidth,
      align: 'right',
    });
    y += 12;
  }

  y += 5;

  // === GRAND TOTAL BOX (Sky blue background with FLORCA blue border) ===
  const boxWidth = CONTENT_WIDTH * 0.4;
  const boxHeight = 30;
  const boxX = rightColX - 10;
  const boxY = y;
  const radius = 6;

  // Background box
  doc
    .roundedRect(boxX, boxY, boxWidth, boxHeight, radius, radius)
    .lineWidth(1.5)
    .fillAndStroke(COLORS.SKY_BLUE, COLORS.FLORCA_BLUE);

  // Total label and value (FLORCA Blue, bold, larger)
  doc.fill(COLORS.FLORCA_BLUE).font('Georgian-Bold').fontSize(14);

  doc.text('მთლიანი ჯამი:', boxX + 12, boxY + 9);

  doc.text(`${formatGel(invoice.totalGel)}`, boxX + boxWidth - 90, boxY + 9, {
    width: 80,
    align: 'right',
  });

  doc.y = boxY + boxHeight + 20;
}

/**
 * Render footer with light gray background and centered text
 */
function renderFooter(doc: PDFKit.PDFDocument, invoice: InvoiceResponse): void {
  doc.moveDown(2);

  const pageHeight = 841.89; // A4 height in points
  const footerHeight = 40;
  const footerY = pageHeight - footerHeight;

  // Light gray background bar (full width)
  doc.rect(0, footerY, PAGE_WIDTH, footerHeight).fill(COLORS.LIGHT_GRAY_BG);

  // Footer text (centered, slate gray, small)
  doc
    .fill(COLORS.SLATE_GRAY)
    .font('Georgian')
    .fontSize(7)
    .text('ეს ინვოისი ავტომატურად გენერირებულია FLORCA-ს სისტემის მიერ.', MARGIN, footerY + 12, {
      width: CONTENT_WIDTH,
      align: 'center',
    });

  doc.text(`${invoice.seller.companyName} | ${invoice.seller.phone} | ${invoice.seller.email}`, MARGIN, footerY + 22, {
    width: CONTENT_WIDTH,
    align: 'center',
  });
}

/**
 * Draw a horizontal line separator
 */
function drawLine(doc: PDFKit.PDFDocument, y: number, startX?: number): void {
  doc
    .strokeColor(COLORS.BORDER_GRAY)
    .lineWidth(0.5)
    .moveTo(startX ?? MARGIN, y)
    .lineTo(MARGIN + CONTENT_WIDTH, y)
    .stroke();
}

/**
 * Format a decimal string as GEL currency
 */
function formatGel(amount: string): string {
  const num = parseFloat(amount);
  return `${num.toFixed(2)} ₾`;
}
