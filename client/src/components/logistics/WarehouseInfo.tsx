'use client';

import { Thermometer, Droplets, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WarehouseInfo = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">დასაწყობების სტანდარტები</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        ჩვენი საწყობი აღჭურვილია უახლესი კლიმატ-კონტროლის სისტემებით, რაც უზრუნველყოფს ყვავილების იდეალურ მდგომარეობას.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="border-0 shadow-lg bg-blue-50/50">
                        <CardHeader className="pb-2">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                                <Thermometer className="h-6 w-6" />
                            </div>
                            <CardTitle>ტემპერატურა</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-slate-900 mb-2">2°C - 4°C</div>
                            <p className="text-sm text-slate-600">
                                მუდმივი მონიტორინგი 24/7 რეჟიმში. ავტომატური გაგრილების სისტემა.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-cyan-50/50">
                        <CardHeader className="pb-2">
                            <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4 text-cyan-600">
                                <Droplets className="h-6 w-6" />
                            </div>
                            <CardTitle>ტენიანობა</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-slate-900 mb-2">85%</div>
                            <p className="text-sm text-slate-600">
                                იდეალური ტენიანობის დონე ყვავილების სიცოცხლის ხანგრძლივობისთვის.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-green-50/50">
                        <CardHeader className="pb-2">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 text-green-600">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <CardTitle>ჰიგიენა</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-slate-900 mb-2">ISO 22000</div>
                            <p className="text-sm text-slate-600">
                                რეგულარული დეზინფექცია და ეთილენის კონტროლის სისტემები.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};
