'use client';

import { Users, Flower, Award } from 'lucide-react';

export const AboutHero = () => {
    return (
        <section className="relative w-full bg-slate-50 overflow-hidden py-24 md:py-32">
            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                            <Users className="mr-2 h-4 w-4" />
                            ჩვენ შესახებ
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
                            ჩვენ ვქმნით ხიდს
                            <span className="block text-primary">ჰოლანდიასა და საქართველოს შორის</span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Florca არის ინოვაციური პლატფორმა, რომელიც აერთიანებს 20 წლიან გამოცდილებას ფლორისტიკაში
                            და თანამედროვე ციფრულ ტექნოლოგიებს. ჩვენი მისიაა გავხადოთ უმაღლესი ხარისხის ყვავილები
                            ხელმისაწვდომი ყველა ქართული ბიზნესისთვის.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-primary mb-1">5,000+</span>
                                <span className="text-sm text-slate-500">კმაყოფილი კლიენტი</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-primary mb-1">20+</span>
                                <span className="text-sm text-slate-500">წლიანი გამოცდილება</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
                            {/* Placeholder for Team/Warehouse Image */}
                            <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center">
                                <Flower className="h-16 w-16 text-slate-400" />
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom duration-700 delay-300">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">#1 იმპორტიორი</div>
                                <div className="text-xs text-slate-500">საქართველოს ბაზარზე</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
