'use client';

import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/store/useCart';
import { toast } from 'sonner';
import { Plus, Minus, ShoppingCart, Flower2 } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { minBoxSize } = product;
    const [qty, setQty] = useState(minBoxSize);
    const [imageError, setImageError] = useState(false);
    const addItem = useCart((state) => state.addItem);

    const isInStock = product.stock > 0;
    const hasValidImage = product.photoUrl && !imageError;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, qty);
        toast.success(`${qty} ცალი ${product.name} დაემატა კალათაში`);
        setQty(minBoxSize);
    };

    return (
        <div className="group relative bg-white rounded-xl border border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
            <Link href={`/catalog/${product.id}`} className="block">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-50/80">
                    {hasValidImage ? (
                        <Image
                            src={product.photoUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex flex-col items-center justify-center gap-1.5">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Flower2 className="h-6 w-6 text-primary/40" />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground/60">ფოტო არ არის</span>
                        </div>
                    )}
                    {!isInStock && (
                        <div className="absolute inset-0 bg-white/60" />
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-2.5 sm:p-3 flex flex-col gap-1.5 flex-1">
                <Link href={`/catalog/${product.id}`} className="block">
                    {/* Product name */}
                    <h3 className="text-[13px] sm:text-sm font-semibold leading-snug line-clamp-2 text-foreground">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <span className="text-base sm:text-lg font-bold text-primary tracking-tight">
                    {product.price.toFixed(2)} ₾
                </span>

                {/* Quantity + Cart */}
                <div className="flex items-center gap-1.5 mt-auto pt-1">
                    <div className="flex items-center border border-border/60 rounded-lg overflow-hidden shrink-0">
                        <button
                            type="button"
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:bg-muted"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(Math.max(minBoxSize, qty - minBoxSize)); }}
                            aria-label="შემცირება"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-semibold tabular-nums select-none border-x border-border/60">
                            {qty}
                        </span>
                        <button
                            type="button"
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:bg-muted"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(qty + minBoxSize); }}
                            aria-label="გაზრდა"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 active:bg-primary/80 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">დამატება</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
