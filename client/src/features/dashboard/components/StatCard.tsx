import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub: string;
    accent: string;
}

export function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">{icon}</span>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${accent}`}>{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
        </Card>
    );
}
