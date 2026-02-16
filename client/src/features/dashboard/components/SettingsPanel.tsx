import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SettingsPanel() {
    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>გლობალური პარამეტრები</CardTitle>
                <CardDescription>მხოლოდ ადმინი</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {[
                        { label: 'მარაგის ხილვადობა', value: '40%', sub: '60% დამალულია ბუფერად' },
                        { label: 'სტანდარტული ნაფასარი', value: '40%', sub: 'EUR-GEL ნაფასარი' },
                        { label: 'EUR/GEL კურსი', value: '3.50', sub: 'გაცვლის კურსი' },
                        { label: 'შეკვეთის ბოლო ვადა', value: '18:00', sub: 'დღიური ლიმიტი' },
                    ].map(s => (
                        <div key={s.label} className="p-4 rounded-lg border space-y-1">
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.sub}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
