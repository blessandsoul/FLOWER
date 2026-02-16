'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { productsApi } from '@/features/products/services/products.api';
import { mapServerProductsToClient } from '@/features/products/utils/productMapper';
import type { Product } from '@/types';

export function FeaturedCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await productsApi.getProducts({ limit: 10 });
                const mapped = mapServerProductsToClient(response.data.items);
                setProducts(mapped);
            } catch (err) {
                console.error('Failed to fetch featured products:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

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
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="min-w-[280px] md:min-w-[320px] snap-center">
                                <div className="space-y-3">
                                    <Skeleton className="h-48 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center hover:-translate-y-2 transition-transform duration-300">
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-12 text-muted-foreground">
                            პროდუქტები არ მოიძებნა
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
