'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard } from 'lucide-react';
import { useTopUp } from '../hooks';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export function TopUpForm() {
    const [amount, setAmount] = useState<string>('');
    const topUpMutation = useTopUp();

    const handlePreset = (preset: number) => {
        setAmount(String(preset));
    };

    const handleSubmit = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount < 0.5 || numericAmount > 50000) {
            toast.error('თანხა უნდა იყოს 0.50-დან 50,000-მდე');
            return;
        }

        try {
            const { redirectUrl } = await topUpMutation.mutateAsync(numericAmount);
            toast.info('გადამისამართება საგადახდო გვერდზე...');
            window.location.href = redirectUrl;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'შეცდომა შევსებისას');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    ბალანსის შევსება
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((preset) => (
                        <Button
                            key={preset}
                            variant={amount === String(preset) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePreset(preset)}
                        >
                            {preset} ₾
                        </Button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="თანხა (₾)"
                        min={0.5}
                        max={50000}
                        step={0.01}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={topUpMutation.isPending || !amount}
                        className="min-w-[120px]"
                    >
                        {topUpMutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        შევსება
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    მინიმუმ: 0.50 ₾ &middot; მაქსიმუმ: 50,000 ₾
                </p>
            </CardContent>
        </Card>
    );
}
