'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Send } from 'lucide-react';

export const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        // In a real app, show success toast here
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold mb-6 text-slate-900">მოგვწერეთ</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">სახელი</Label>
                        <Input id="firstName" placeholder="გიორგი" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">გვარი</Label>
                        <Input id="lastName" placeholder="ბერიძე" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">ელ-ფოსტა</Label>
                    <Input id="email" type="email" placeholder="giorgi@company.ge" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">ინტერესის სფერო</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>აუქციონში მონაწილეობა</option>
                        <option>ლოგისტიკური მომსახურება</option>
                        <option>ზოგადი საკითხები</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">შეტყობინება</Label>
                    <Textarea id="message" placeholder="გთხოვთ, მოგვწერეთ დეტალურად..." className="min-h-[120px]" required />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'იგზავნება...' : (
                        <>
                            გაგზავნა <Send className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};
