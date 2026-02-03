'use client';

import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export function FeaturedCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 bg-slate-50 border-y">
            <div className="container px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">კვირის რჩეული</h2>
                        <p className="text-muted-foreground mt-2 text-lg">აუქციონის საუკეთესო ფასი/ხარისხის შეთავაზებები</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => scroll('left')} className="h-10 w-10 rounded-full hover:bg-white hover:shadow-lg transition-all">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => scroll('right')} className="h-10 w-10 rounded-full hover:bg-white hover:shadow-lg transition-all">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide py-4 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {MOCK_PRODUCTS.map((product) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center hover:-translate-y-2 transition-transform duration-300">
                            <ProductCard
                                product={product}
                            // Logic is now internal to ProductCard 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
