'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import type { InvoiceSummary } from '@/types';

interface InvoicesTableProps {
    invoices: InvoiceSummary[];
    onViewInvoice?: (id: string) => void;
    onDownloadPdf?: (id: string) => void;
}

export function InvoicesTable({ invoices, onViewInvoice, onDownloadPdf }: InvoicesTableProps) {
    if (invoices.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>ინვოისები არ მოიძებნა</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">ინვოისები ({invoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-muted-foreground">
                                <th className="pb-3 pr-4 font-medium">ნომერი</th>
                                <th className="pb-3 pr-4 font-medium">შეკვეთა</th>
                                <th className="pb-3 pr-4 font-medium">მყიდველი</th>
                                <th className="pb-3 pr-4 font-medium">თარიღი</th>
                                <th className="pb-3 pr-4 font-medium text-right">ჯამი</th>
                                <th className="pb-3 pr-4 font-medium">სტატუსი</th>
                                <th className="pb-3 font-medium text-right">მოქმედება</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="py-3 pr-4 font-mono text-xs">{invoice.invoiceNumber}</td>
                                    <td className="py-3 pr-4 font-mono text-xs">{invoice.orderNumber}</td>
                                    <td className="py-3 pr-4">{invoice.buyerName}</td>
                                    <td className="py-3 pr-4 text-muted-foreground">
                                        {new Date(invoice.issueDate).toLocaleDateString('ka-GE')}
                                    </td>
                                    <td className="py-3 pr-4 text-right font-medium">
                                        {parseFloat(invoice.totalGel).toFixed(2)} ₾
                                    </td>
                                    <td className="py-3 pr-4">
                                        <InvoiceStatusBadge status={invoice.status} />
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {onViewInvoice && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onViewInvoice(invoice.id)}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onDownloadPdf && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDownloadPdf(invoice.id)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
