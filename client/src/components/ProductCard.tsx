'use client';

import { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/store/useCart';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    // Removed legacy callback, using store directly
}

export function ProductCard({ product }: ProductCardProps) {
    const { totalAvailable, currentCollected, minBoxSize } = product;
    const [qty, setQty] = useState(product.minBoxSize);
    const addItem = useCart((state) => state.addItem);

    const fillPercent = Math.min(100, (currentCollected / minBoxSize) * 100);
    const isBoxFilled = currentCollected >= minBoxSize;

    const handleAddToCart = () => {
        addItem(product, qty);
        toast.success(`${qty} ცალი ${product.name} დაემატა კალათაში`);
        setQty(product.minBoxSize); // Reset to min
    };

    return (
        <Card className="overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                    src={product.photoUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    <Badge variant={isBoxFilled ? "default" : "secondary"} className="backdrop-blur-md bg-white/90 text-black shadow-sm">
                        ყუთი: {product.minBoxSize}
                    </Badge>
                    {isBoxFilled && (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            გარანტირებული
                        </Badge>
                    )}
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            {product.category} • {product.color}
                        </p>
                        <h3 className="font-bold text-lg leading-tight mt-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{product.lengthCm} სმ</p>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-xl text-primary">{product.priceGel.toFixed(2)} ₾</div>
                        <div className="text-xs text-muted-foreground">€{product.priceEur.toFixed(2)}</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>შეგროვდა</span>
                        <span className="font-medium">{product.currentCollected} / {product.minBoxSize} ცალი</span>
                    </div>
                    <Progress value={fillPercent} className="h-2" />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 gap-3">
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
