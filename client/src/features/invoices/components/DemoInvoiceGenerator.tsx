'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const DemoInvoiceGenerator = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        try {
            setIsLoading(true);

            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();

            // --- FLORCA BLUE COLOR PALETTE (RGB) ---
            const FLORCA_BLUE = [23, 94, 235];    // FLORCA Blue (#175eeb)
            const DEEP_NAVY = [30, 58, 138];      // Deep Navy (#1e3a8a)
            const SKY_BLUE = [224, 231, 255];     // Sky Blue (#e0e7ff)
            const SAGE_GREEN = [16, 185, 129];    // Sage Green (#10b981)
            const TEXT_DARK = [9, 9, 11];         // Deep Black (#09090b)
            const TEXT_GRAY = [100, 116, 139];    // Slate Gray (#64748b)
            const BG_CARD = [249, 250, 251];      // Light Gray BG (#f9fafb)
            const BORDER_COLOR = [226, 232, 240]; // Border Gray (#e2e8f0)

            // Fonts
            doc.setFont("helvetica");

            // --- 1. HEADER BANNER ---
            // Full width banner
            doc.setFillColor(FLORCA_BLUE[0], FLORCA_BLUE[1], FLORCA_BLUE[2]);
            doc.rect(0, 0, 210, 40, 'F');

            // Logo / Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(26);
            doc.setFont("helvetica", "bold");
            doc.text('FLORCA', 15, 20); // Left align

            // Invoice Tag
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text('PREMIUM FLOWERS & LOGISTICS', 15, 30); // Tagline

            // Right side info in banner
            doc.setFontSize(22);
            doc.text('INVOICE', 195, 20, { align: 'right' });

            doc.setFontSize(10);
            const invoiceNum = 'INV-DEMO-001';
            doc.text(`# ${invoiceNum}`, 195, 30, { align: 'right' });

            // --- 2. STATUS BADGE (ISSUED - FLORCA Blue) ---
            // Draw a pill shape for status
            const statusX = 165;
            const statusY = 48;
            doc.setFillColor(SKY_BLUE[0], SKY_BLUE[1], SKY_BLUE[2]); // Sky Blue bg
            doc.setDrawColor(FLORCA_BLUE[0], FLORCA_BLUE[1], FLORCA_BLUE[2]); // FLORCA Blue border
            doc.roundedRect(statusX, statusY, 35, 8, 3, 3, 'FD');

            doc.setTextColor(FLORCA_BLUE[0], FLORCA_BLUE[1], FLORCA_BLUE[2]); // FLORCA Blue text
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.text('ISSUED', statusX + 17.5, statusY + 5.5, { align: 'center' });

            // --- 3. DETAILS CARDS ---
            const CARD_Y = 60;
            const CARD_HEIGHT = 50;
            const CARD_WIDTH = 85;

            // Reset text
            doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

            // SELLER CARD
            doc.setFillColor(BG_CARD[0], BG_CARD[1], BG_CARD[2]);
            doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
            doc.roundedRect(15, CARD_Y, CARD_WIDTH, CARD_HEIGHT, 2, 2, 'FD');

            doc.setFontSize(9);
            doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
            doc.setFont("helvetica", "bold");
            doc.text('FROM', 20, CARD_Y + 8);

            doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
            doc.setFontSize(11);
            doc.text('Florca Demo Company', 20, CARD_Y + 16);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
            doc.text('Tbilisi, Rustaveli Ave. 1', 20, CARD_Y + 23);
            doc.text('ID: 000000000', 20, CARD_Y + 28);
            doc.text('Bank: TBC | GE00TB0000000000...', 20, CARD_Y + 33);
            doc.text('info@florca.ge', 20, CARD_Y + 38);

            // BUYER CARD
            doc.setFillColor(BG_CARD[0], BG_CARD[1], BG_CARD[2]);
            doc.roundedRect(110, CARD_Y, CARD_WIDTH, CARD_HEIGHT, 2, 2, 'FD');

            doc.setFontSize(9);
            doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
            doc.setFont("helvetica", "bold");
            doc.text('BILL TO', 115, CARD_Y + 8);

            doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
            doc.setFontSize(11);
            doc.text('Demo User', 115, CARD_Y + 16);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
            doc.text('Tbilisi, Chavchavadze Ave. 10', 115, CARD_Y + 23);
            doc.text('Personal ID: 123456789', 115, CARD_Y + 28);
            doc.text('Phone: +995 555 00 00 00', 115, CARD_Y + 33);

            // --- 4. ITEMS TABLE ---
            let y = 125;

            // Table Header Bar
            doc.setFillColor(FLORCA_BLUE[0], FLORCA_BLUE[1], FLORCA_BLUE[2]);
            doc.rect(15, y, 180, 10, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text('DESCRIPTION', 20, y + 6.5);
            doc.text('QTY', 120, y + 6.5, { align: 'center' });
            doc.text('PRICE', 150, y + 6.5, { align: 'right' });
            doc.text('TOTAL', 190, y + 6.5, { align: 'right' });

            y += 10;

            // Items
            const items = [
                { name: 'Rose Red Naomi (60cm) Premium', qty: 50, price: 2.00, total: 100.00 },
                { name: 'Tulips Mix (Dutch Import)', qty: 100, price: 1.50, total: 150.00 },
            ];

            doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
            doc.setFont("helvetica", "normal");

            items.forEach((item, index) => {
                // Alternating row color
                if (index % 2 === 0) {
                    doc.setFillColor(255, 255, 255);
                } else {
                    doc.setFillColor(BG_CARD[0], BG_CARD[1], BG_CARD[2]);
                    doc.rect(15, y, 180, 10, 'F');
                }

                doc.text(item.name, 20, y + 6.5);
                doc.text(item.qty.toString(), 120, y + 6.5, { align: 'center' });
                doc.text(item.price.toFixed(2), 150, y + 6.5, { align: 'right' });
                doc.text(item.total.toFixed(2), 190, y + 6.5, { align: 'right' });

                // Bottom line
                doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
                doc.line(15, y + 10, 195, y + 10);

                y += 10;
            });

            // --- 5. SUMMARY SECTION ---
            y += 10;
            const summaryX = 140;
            const valueX = 190;

            doc.setFontSize(10);
            doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);

            doc.text('Subtotal', summaryX, y);
            doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
            doc.text('211.86', valueX, y, { align: 'right' });

            y += 6;
            doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
            doc.text('VAT (18%)', summaryX, y);
            doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
            doc.text('38.14', valueX, y, { align: 'right' });

            y += 8;
            // Total Bar
            doc.setFillColor(SKY_BLUE[0], SKY_BLUE[1], SKY_BLUE[2]);
            doc.roundedRect(summaryX - 5, y - 5, 60, 12, 1, 1, 'F');

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(FLORCA_BLUE[0], FLORCA_BLUE[1], FLORCA_BLUE[2]);
            doc.text('TOTAL', summaryX, y + 3);
            doc.text('250.00 ₾', valueX, y + 3, { align: 'right' });

            // --- 6. FOOTER ---
            const pageHeight = doc.internal.pageSize.height;
            doc.setFillColor(BG_CARD[0], BG_CARD[1], BG_CARD[2]);
            doc.rect(0, pageHeight - 20, 210, 20, 'F');

            doc.setFontSize(8);
            doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
            doc.setFont("helvetica", "normal");
            doc.text('Thank you for choosing FLORCA. For questions, contact support@florca.ge', 105, pageHeight - 8, { align: 'center' });

            doc.save('FLORCA-demo-invoice.pdf');

            toast.success('დემო ინვოისი ჩამოიტვირთა');
        } catch (error) {
            console.error(error);
            toast.error('შეცდომა PDF-ის შექმნისას');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-indigo-100 bg-indigo-50/50">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base text-indigo-900">დემო ინვოისი</CardTitle>
                        <CardDescription className="text-indigo-700/70">გენერაციის ტესტირება</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                    onClick={handleGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            გენერაცია...
                        </>
                    ) : (
                        'შექმენით დემო ინვოისი'
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};
