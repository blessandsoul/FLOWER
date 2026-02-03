'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const schedule = [
    { day: 'ორშაბათი', time: '06:00 - 11:00', location: 'Royal FloraHolland (Aalsmeer)', status: 'active' },
    { day: 'სამშაბათი', time: '06:00 - 11:00', location: 'Royal FloraHolland (Naaldwijk)', status: 'upcoming' },
    { day: 'ოთხშაბათი', time: '06:00 - 11:00', location: 'Rijnsburg', status: 'upcoming' },
    { day: 'ხუთშაბათი', time: '06:00 - 11:00', location: 'Royal FloraHolland (Aalsmeer)', status: 'upcoming' },
    { day: 'პარასკევი', time: '06:00 - 10:00', location: 'Eelde', status: 'upcoming' },
];

export const AuctionSchedule = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">აუქციონების განრიგი</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        ჩვენი პლატფორმა დაკავშირებულია ყველა მსხვილ ნიდერლანდურ აუქციონთან.
                        ვაჭრობა მიმდინარეობს ყოველ სამუშაო დღეს დილის საათებში.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {schedule.map((slot) => (
                        <Card key={slot.day} className={`border transition-all hover:shadow-lg ${slot.status === 'active' ? 'border-primary/50 bg-primary/5 ring-1 ring-primary' : 'border-slate-100'}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant={slot.status === 'active' ? "default" : "secondary"}>
                                        {slot.day}
                                    </Badge>
                                    {slot.status === 'active' && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="text-sm font-medium">{slot.time}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="text-sm text-muted-foreground leading-tight">{slot.location}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
