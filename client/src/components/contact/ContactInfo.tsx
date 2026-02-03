'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const ContactInfo = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">დაგვიკავშირდით</h2>
                <p className="text-lg text-slate-600 mb-8">
                    ჩვენი გუნდი მზად არის უპასუხოს თქვენს ნებისმიერ შეკითხვას 24/7 რეჟიმში.
                </p>
            </div>

            <div className="grid gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">დაგვირეკეთ</h3>
                        <p className="text-slate-600 mb-1">ორშ-პარ, 09:00 - 18:00</p>
                        <a href="tel:+995555000000" className="text-primary font-medium hover:underline">+995 555 00 00 00</a>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">მოგვწერეთ</h3>
                        <p className="text-slate-600 mb-1">ნებისმიერ დროს</p>
                        <a href="mailto:info@florca.ge" className="text-primary font-medium hover:underline">info@florca.ge</a>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">გვეწვიეთ</h3>
                        <p className="text-slate-600">
                            ალ. ყაზბეგის გამზ. 24<br />
                            თბილისი, საქართველო
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                    <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                        <Clock className="h-4 w-4 text-primary" />
                        საწყობის სამუშაო საათები
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>ორშაბათი - პარასკევი</span>
                            <span>09:00 - 20:00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>შაბათი</span>
                            <span>10:00 - 16:00</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                            <span>კვირა</span>
                            <span>დაკეტილია</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
