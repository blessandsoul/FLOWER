'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

const mockSales = [
    { id: 1, item: 'Red Naomi Roses (80cm)', price: '0.45€', drop: true },
    { id: 2, item: 'Tulip Strong Gold', price: '0.18€', drop: true },
    { id: 3, item: 'Hydrangea White', price: '2.50€', drop: false },
    { id: 4, item: 'Phalaenopsis Orchid', price: '4.20€', drop: true },
    { id: 5, item: 'Eucalyptus Cinerea', price: '1.80€', drop: false },
    { id: 6, item: 'Peony Sarah Bernhardt', price: '0.95€', drop: true },
    { id: 7, item: 'Lilium Oriental', price: '0.88€', drop: true },
];

export const LiveTicker = () => {
    return (
        <div className="w-full bg-slate-100 border-y overflow-hidden py-3">
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
                    {/* Replicated content for seamless loop */}
                    {[...mockSales, ...mockSales, ...mockSales].map((sale, i) => (
                        <div key={`${sale.id}-${i}`} className="inline-flex items-center space-x-2 text-sm font-medium text-slate-700">
                            <span className="font-bold">{sale.item}</span>
                            <span className="text-slate-500">-</span>
                            <span className={sale.drop ? 'text-green-600' : 'text-red-500'}>
                                {sale.price}
                            </span>
                            {sale.drop ? (
                                <TrendingDown className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingUp className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-slate-300 mx-2">|</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
