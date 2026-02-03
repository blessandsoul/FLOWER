'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CountdownTimer() {
    // Mock target date: Next Friday at 12:00 PM
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 35, secs: 12 });

    // Simple countdown logic simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, mins, secs } = prev;
                if (secs > 0) secs--;
                else {
                    secs = 59;
                    if (mins > 0) mins--;
                    else {
                        mins = 59;
                        if (hours > 0) hours--;
                        else {
                            hours = 23;
                            if (days > 0) days--;
                        }
                    }
                }
                return { days, hours, mins, secs };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimerBox = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-slate-900 text-white font-mono text-3xl md:text-5xl font-bold p-4 md:p-6 rounded-xl shadow-2xl min-w-[80px] md:min-w-[120px] text-center border border-white/10">
                {value.toString().padStart(2, '0')}
            </div>
            <span className="text-white/60 text-xs md:text-sm mt-3 uppercase tracking-widest font-medium">{label}</span>
        </div>
    );

    return (
        <section className="bg-primary py-20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="container px-4 relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-medium mb-6">
                    <Clock className="w-4 h-4" />
                    <span>შემდეგი პარტია იკეტება მალე</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 tracking-tight">
                    მოასწარი შეკვეთა პარასკევს <br className="hidden md:inline" /> ჩამოსვლისთვის
                </h2>

                <div className="flex gap-4 md:gap-8 mb-12">
                    <TimerBox value={timeLeft.days} label="დღე" />
                    <TimerBox value={timeLeft.hours} label="საათი" />
                    <TimerBox value={timeLeft.mins} label="წუთი" />
                    <TimerBox value={timeLeft.secs} label="წამი" />
                </div>

                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link href="/catalog">
                        შეკვეთის გაფორმება
                    </Link>
                </Button>

                {/* Additional Details */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center w-full max-w-4xl border-t border-white/20 pt-8">
                    <div className="space-y-2">
                        <p className="text-white font-bold text-lg">გარანტირებული ხარისხი</p>
                        <p className="text-white/70 text-sm">ყველა ყვავილი მოწმდება ექსპერტების მიერ</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold text-lg">დაზღვეული ტრანსპორტირება</p>
                        <p className="text-white/70 text-sm">სრული პასუხისმგებლობა ჩამოტანამდე</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold text-lg">საუკეთესო ფასი</p>
                        <p className="text-white/70 text-sm">დაზოგეთ 40%-მდე საბაზრო ღირებულებიდან</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
