import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ProductsTable() {
    return (
        <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">სახელი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">კატეგორია</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ფასი (₾)</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მარაგი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მინ. ყუთი</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_PRODUCTS.map(p => (
                                <tr key={p.id} className="border-b hover:bg-muted/50">
                                    <td className="p-3 font-medium">{p.name}</td>
                                    <td className="p-3"><Badge variant="outline">{p.category}</Badge></td>
                                    <td className="p-3 font-mono">{p.price.toFixed(2)}</td>
                                    <td className="p-3">{p.stock}</td>
                                    <td className="p-3">{p.minBoxSize}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
