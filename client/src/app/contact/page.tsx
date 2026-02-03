import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { SocialLinks } from '@/components/contact/SocialLinks';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Florca',
    description: 'Get in touch with Florca. Visit our office in Tbilisi or contact us for wholesale inquiries.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-24">
            <div className="container max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <ContactInfo />
                        <SocialLinks />
                    </div>
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
