import { MOCK_BATCHES } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BATCH_STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    ORDERED: { label: 'შეკვეთილი', variant: 'secondary' },
    IN_TRANSIT: { label: 'ტრანზიტში', variant: 'outline' },
    RECEIVED: { label: 'მიღებული', variant: 'default' },
    CANCELLED: { label: 'გაუქმებული', variant: 'destructive' },
};

interface BatchesTableProps {
    showActions?: boolean;
}

export function BatchesTable({ showActions }: BatchesTableProps) {
    return (
        <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">პარტია #</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">წარმოშობა</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მომწოდებელი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მოსვლის თარიღი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ერთეული</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ღირებულება</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">სტატუსი</th>
                                {showActions && <th className="h-10 px-4 text-right font-medium text-muted-foreground">მოქმედებები</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_BATCHES.map(batch => {
                                const st = BATCH_STATUS_MAP[batch.status];
                                return (
                                    <tr key={batch.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3 font-mono text-xs">{batch.batchNumber}</td>
                                        <td className="p-3">
                                            <Badge variant="outline" className={batch.origin === 'HOLLAND' ? 'border-orange-300 text-orange-700' : 'border-green-300 text-green-700'}>
                                                {batch.origin === 'HOLLAND' ? 'ჰოლანდია' : 'ეკვადორი'}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-xs">{batch.supplier}</td>
                                        <td className="p-3">{batch.expectedArrival}</td>
                                        <td className="p-3">{batch.totalItems}</td>
                                        <td className="p-3 font-semibold">{batch.totalCostEur} EUR</td>
                                        <td className="p-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                                        {showActions && (
                                            <td className="p-3 text-right">
                                                {batch.status === 'IN_TRANSIT' && <Button size="sm" className="h-7 text-xs">მიღებულად მონიშვნა</Button>}
                                                {batch.status === 'ORDERED' && <Button size="sm" variant="outline" className="h-7 text-xs">თვალყური</Button>}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
