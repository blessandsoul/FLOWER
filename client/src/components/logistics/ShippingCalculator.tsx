'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Package, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const ShippingCalculator = () => {
    const [volume, setVolume] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        // Mock calculation: Volume * 150 + Weight * 2.5
        const vol = parseFloat(volume) || 0;
        const w = parseFloat(weight) || 0;
        setResult((vol * 150) + (w * 2.5));
    };

    return (
        <section className="py-24 bg-slate-50" id="calculator">
            <div className="container max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">გამოთვალეთ ტრანსპორტირების ღირებულება</h2>
                    <p className="text-muted-foreground text-lg">
                        მარტივი კალკულატორი წინასწარი ბიუჯეტირებისთვის
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Calculator Card */}
                    <Card className="shadow-xl border-none">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Calculator className="h-5 w-5" />
                                </div>
                                <CardTitle>კალკულატორი</CardTitle>
                            </div>
                            <CardDescription>
                                შეიყვანეთ მონაცემები სავარაუდო ფასის გასაგებად
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        ტვირთის მოცულობა
                                    </Label>
                                    <select className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50">
                                        <option>AA ყუთი (სტანდარტული)</option>
                                        <option>EKT ვედრო (თაიგულებისთვის)</option>
                                        <option>ევრო პალეტი (სრული)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">რაოდენობა</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            placeholder="0"
                                            className="h-11"
                                            value={volume}
                                            onChange={(e) => setVolume(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">წონა (კგ)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="0"
                                            className="h-11"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button onClick={calculate} className="w-full h-11 text-base mt-2" size="lg">
                                    გამოთვლა
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Result Card */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />

                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                            სავარაუდო ღირებულება
                        </span>

                        {result !== null ? (
                            <div className="animate-in zoom-in duration-300">
                                <span className="text-6xl font-extrabold text-slate-900 block mb-2 tracking-tight">
                                    {result.toFixed(0)} <span className="text-3xl text-slate-400 font-normal">₾</span>
                                </span>
                                <div className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold mt-4">
                                    დღგ-ს ჩათვლით
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center opacity-30">
                                <span className="text-6xl font-extrabold text-slate-300 block mb-2">0</span>
                                <span className="text-sm">შეიყვანეთ მონაცემები</span>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-100 w-full text-left">
                            <div className="flex gap-3 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
                                <Info className="h-5 w-5 text-primary shrink-0" />
                                <p className="leading-relaxed">
                                    ფასი მოიცავს ტრანსპორტირებას, განბაჟებას და დაზღვევას. ზუსტი ღირებულების დასადგენად დაგვიკავშირდით მენეჯერთან.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
