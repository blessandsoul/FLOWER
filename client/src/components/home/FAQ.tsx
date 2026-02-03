'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        q: "როდის მივიღებ ყვავილებს?",
        a: "შეკვეთის დახურვიდან 48 საათში. ჩვეულებრივ, პარასკევს საღამოს გამოგზავნილი შეკვეთა კვირას დილით თბილისშია."
    },
    {
        q: "როგორ ხდება ანგარიშსწორება?",
        a: "ანგარიშსწორება ხდება ინვოისის საფუძველზე, საბანკო გადარიცხვით (GEL). VIP კლიენტებისთვის მოქმედებს გადავადებული გადახდა."
    },
    {
        q: "რა არის მინიმალური შეკვეთა?",
        a: "მინიმალური შეკვეთა არ არის შეზღუდული. შეგიძლიათ შეიძინოთ თუნდაც 10 ცალი ვარდი ჩვენი ჯგუფური შესყიდვის სისტემით."
    },
    {
        q: "გვაქვს თუ არა გარანტია?",
        a: "დიახ, ყველა ყვავილი შემოწმდება აუქციონზე და ტრანსპორტირების წინ. წუნის შემთხვევაში თანხა გინაზღაურდებათ."
    }
];

export function FAQ() {
    return (
        <section className="py-24 container px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">ხშირად დასმული კითხვები</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-left text-lg font-medium">
                            {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
