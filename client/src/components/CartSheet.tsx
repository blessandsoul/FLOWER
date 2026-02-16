'use client';

import { useState, useEffect } from 'react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export function CartSheet() {
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">კალათა</span>
            </Button>
        );
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative overflow-visible h-10 w-10 rounded-full border-border/60 hover:bg-accent hover:text-accent-foreground transition-all duration-300 group">
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {totalItems() > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary ring-2 ring-background flex items-center justify-center text-[10px] text-white font-bold shadow-sm animate-in zoom-in spin-in-12 duration-300">
                            {totalItems() > 99 ? '99+' : totalItems()}
                        </span>
                    )}
                    <span className="sr-only">კალათა</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>თქვენი კალათა ({totalItems()})</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                            <ShoppingCart className="h-12 w-12 opacity-20" />
                            <p>კალათა ცარიელია</p>
                            <Button variant="link" className="text-primary">კატალოგის ნახვა</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted border">
                                        <Image
                                            src={item.photoUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground">{item.minBoxSize} ცალი/ყუთი</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border rounded-md h-8">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-r-none"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 10)}
                                                    disabled={item.quantity <= 10}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <div className="w-10 text-center text-xs font-medium">{item.quantity}</div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-l-none"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 10)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-sm">{(item.price * item.quantity).toFixed(2)} ₾</div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-[10px] text-destructive hover:underline flex items-center justify-end gap-1"
                                                >
                                                    <Trash2 className="h-3 w-3" /> წაშლა
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">ჯამი</span>
                                <span className="font-bold">{totalPrice().toFixed(2)} ₾</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">სერვისის საკომისიო (5%)</span>
                                <span className="font-medium">{(totalPrice() * 0.05).toFixed(2)} ₾</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>სულ გადასახდელი</span>
                            <span className="text-primary">{(totalPrice() * 1.05).toFixed(2)} ₾</span>
                        </div>
                        <Button className="w-full" size="lg">შეკვეთის გაფორმება</Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
