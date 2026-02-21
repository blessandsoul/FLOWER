'use client';

import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/store/useCart';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, ImageOff } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { minBoxSize, stock } = product;
    const [qty, setQty] = useState(product.minBoxSize);
    const [imageError, setImageError] = useState(false);
    const addItem = useCart((state) => state.addItem);

    const isInStock = stock > 0;
    const hasValidImage = product.photoUrl && !imageError;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, qty);
        toast.success(`${qty} ცალი ${product.name} დაემატა კალათაში`);
        setQty(product.minBoxSize);
    };

    return (
        <div className="group relative bg-white rounded-lg border border-border/40 hover:border-border hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
            <Link href={`/catalog/${product.id}`} className="block flex-1">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                    {hasValidImage ? (
                        <Image
                            src={product.photoUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                            <ImageOff className="h-8 w-8" />
                        </div>
                    )}
                    {/* Stock indicator */}
                    {isInStock && (
                        <div className="absolute top-1.5 left-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                                მარაგშია
                            </span>
                        </div>
                    )}
                    {!isInStock && (
                        <div className="absolute top-1.5 left-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-400 text-white px-1.5 py-0.5 rounded-full">
                                არ არის
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-2.5 space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium truncate">
                        {product.category} &middot; {product.color}
                    </p>
                    <h3 className="text-sm font-semibold leading-tight line-clamp-1">
                        {product.name}
                    </h3>
                    <div className="flex items-baseline justify-between gap-1">
                        <span className="text-base font-bold text-primary">
                            {product.price.toFixed(2)} ₾
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            ყუთი: {minBoxSize}
                        </span>
                    </div>
                    {product.origin && (
                        <p className="text-[10px] text-muted-foreground truncate">
                            {product.origin}
                        </p>
                    )}
                </div>
            </Link>

            {/* Cart controls */}
            <div className="px-2.5 pb-2.5 pt-0 flex items-center gap-1.5">
                <div className="flex items-center border border-border/60 rounded h-7">
                    <button
                        type="button"
                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-l"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(Math.max(minBoxSize, qty - 10)); }}
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium tabular-nums">{qty}</span>
                    <button
                        type="button"
                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-r"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(qty + 10); }}
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>
                <Button
                    size="sm"
                    className="flex-1 h-7 text-xs font-medium gap-1"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="h-3 w-3" />
                    დამატება
                </Button>
            </div>
        </div>
    );
}
