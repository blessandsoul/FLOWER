'use client';

import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/store/useCart';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, ImageOff } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    // Removed legacy callback, using store directly
}

export function ProductCard({ product }: ProductCardProps) {
    const { minBoxSize, stock } = product;
    const [qty, setQty] = useState(product.minBoxSize);
    const [imageError, setImageError] = useState(false);
    const addItem = useCart((state) => state.addItem);

    const isInStock = stock > 0;
    const hasValidImage = product.photoUrl && !imageError;

    const handleAddToCart = () => {
        addItem(product, qty);
        toast.success(`${qty} ცალი ${product.name} დაემატა კალათაში`);
        setQty(product.minBoxSize); // Reset to min
    };

    return (
        <Card className="overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
            <Link href={`/catalog/${product.id}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {hasValidImage ? (
                        <Image
                            src={product.photoUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-contain transition-transform duration-500 group-hover:scale-105 p-2"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                            <ImageOff className="h-12 w-12 mb-2" />
                            <span className="text-sm font-medium">სურათი არ არის</span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-black shadow-sm">
                            ყუთი: {product.minBoxSize}
                        </Badge>
                        {isInStock && (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                მარაგშია
                            </Badge>
                        )}
                    </div>
                </div>

                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                {product.category} • {product.color}
                            </p>
                            <h3 className="font-bold text-lg leading-tight mt-1 line-clamp-2">{product.name}</h3>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="font-bold text-xl text-primary">{product.price.toFixed(2)} ₾</div>
                            <div className="text-xs text-muted-foreground">მარაგი: {product.stock}</div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 flex-grow">
                    {product.origin && (
                        <p className="text-xs text-muted-foreground">
                            წარმოშობა: {product.origin}
                        </p>
                    )}
                </CardContent>
            </Link>

            <CardFooter className="p-4 pt-0 gap-3 mt-auto">
                <div className="flex items-center border rounded-md">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-r-none"
                        onClick={() => setQty(Math.max(10, qty - 10))}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <div className="w-12 text-center text-sm font-medium">{qty}</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-l-none"
                        onClick={() => setQty(qty + 10)}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
                <Button
                    className="flex-1 font-semibold"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" /> დამატება
                </Button>
            </CardFooter>
        </Card>
    );
}
