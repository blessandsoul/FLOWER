'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, X } from 'lucide-react';
import { paymentApi } from '../services/wallet.api';
import { walletKeys, transactionKeys, paymentOrderKeys } from '../hooks';

interface MockPaymentModalProps {
    bogOrderId: string;
    amount: number;
    currency: string;
    onClose: () => void;
}

export function MockPaymentModal({ bogOrderId, amount, currency, onClose }: MockPaymentModalProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [processing, setProcessing] = useState(false);

    const handlePayment = async (status: 'completed' | 'rejected') => {
        setProcessing(true);
        try {
            await paymentApi.simulateBogCallback(bogOrderId, amount, currency, status);

            // Invalidate caches so wallet data refreshes
            queryClient.invalidateQueries({ queryKey: walletKeys.all });
            queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            queryClient.invalidateQueries({ queryKey: paymentOrderKeys.all });

            if (status === 'completed') {
                toast.success('გადახდა წარმატებით დასრულდა! ბალანსი განახლდა.');
            } else {
                toast.error('გადახდა გაუქმდა.');
            }

            onClose();
            router.replace(`/wallet?payment=${status === 'completed' ? 'success' : 'failed'}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'შეცდომა გადახდისას');
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={onClose}
                        disabled={processing}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="h-5 w-5" />
                        BOG გადახდა (ტესტი)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-1">გადასახდელი თანხა</p>
                        <p className="text-4xl font-bold">{amount.toFixed(2)} {currency}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => handlePayment('rejected')}
                            disabled={processing}
                        >
                            გაუქმება
                        </Button>
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handlePayment('completed')}
                            disabled={processing}
                        >
                            {processing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            გადახდა
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        ეს არის სატესტო გადახდის გვერდი
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
