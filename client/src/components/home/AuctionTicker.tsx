'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const TICKER_ITEMS = [
    {
        name: 'Red Naomi',
        nameKa: 'რედ ნაომი',
        price: '0.45€',
        change: 'down',
        image: '/images/red-naomi.png',
        desc: 'პრემიუმ კლასის წითელი ვარდი'
    },
    {
        name: 'Mondial',
        nameKa: 'მონდიალი',
        price: '0.52€',
        change: 'up',
        image: '/images/cat-roses.png',
        desc: 'თეთრი კლასიკური ვარდი'
    },
    {
        name: 'Tulip Strong Gold',
        nameKa: 'ტიტა სტრონგ გოლდი', // Transliteration
        price: '0.18€',
        change: 'down',
        image: '/images/cat-tulips.png',
        desc: 'ყვითელი ჰოლანდიური ტიტა'
    },
    {
        name: 'Eucalyptus Cinerea',
        nameKa: 'ევკალიპტი',
        price: '2.80€',
        change: 'up',
        image: '/images/cat-greenery.png',
        desc: 'არომატული მწვანე მცენარე'
    },
    {
        name: 'Hydrangea White',
        nameKa: 'ჰორტენზია',
        price: '1.20€',
        change: 'down',
        image: '/images/cat-greenery.png', // Fallback
        desc: 'დიდი თეთრი ყვავილედი'
    },
    {
        name: 'Pink Floyd',
        nameKa: 'პინკ ფლოიდი',
        price: '0.38€',
        change: 'down',
        image: '/images/cat-peonies.png', // Fallback/Placeholder
        desc: 'ინტენსიური ვარდისფერი'
    },
];

export function AuctionTicker() {
    const [hoveredItem, setHoveredItem] = useState<typeof TICKER_ITEMS[0] | null>(null);

    return (
        <div className="relative w-full bg-foreground text-background overflow-visible py-2 border-b border-white/5 cursor-default z-50">

            <div className="flex whitespace-nowrap overflow-hidden">
                <div
                    className="flex gap-12 items-center w-max animate-ticker on-hover-pause"
                >
                    {/* Repeated logic */}
                    {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                        <div
                            key={idx}
                            className="relative flex items-center gap-3 text-xs md:text-sm font-medium text-white/70 hover:text-white transition-colors py-2"
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <span className="font-semibold">{item.nameKa}</span>
                            <span className="font-mono text-primary-foreground/90">{item.price}</span>
                            {item.change === 'down' ? (
                                <TrendingDown className="h-3 w-3 text-emerald-400" />
                            ) : (
                                <TrendingUp className="h-3 w-3 text-rose-400" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Popover Window */}
            <AnimatePresence>
                {/* ... (comments removed for brevity) ... */}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 60s linear infinite;
                }
                .group:hover .animate-ticker,
                .animate-ticker:hover {
                    animation-play-state: paused !important;
                }
            `}</style>

            <AnimatePresence>
                {hoveredItem && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-12 left-1/2 -translate-x-1/2 z-50 w-64 bg-card text-card-foreground rounded-xl shadow-2xl border border-border overflow-hidden"
                    >
                        <div className="relative h-32 w-full bg-muted">
                            <Image
                                src={hoveredItem.image}
                                alt={hoveredItem.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-3 text-white">
                                <p className="font-bold text-lg">{hoveredItem.price}</p>
                            </div>
                        </div>
                        <div className="p-3">
                            <h4 className="font-bold text-lg">{hoveredItem.nameKa}</h4>
                            <p className="text-xs text-muted-foreground">{hoveredItem.name}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-primary font-medium bg-primary/10 p-1.5 rounded-lg">
                                <Info className="w-3 h-3" />
                                {hoveredItem.desc}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

}
