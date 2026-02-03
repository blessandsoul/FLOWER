'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SocialLinks = () => {
    return (
        <div className="grid grid-cols-2 gap-4 mt-8">
            <Button variant="outline" className="h-14 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" asChild>
                <a href="https://wa.me/995000000000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                </a>
            </Button>
            <Button variant="outline" className="h-14 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800" asChild>
                <a href="https://t.me/florcage" target="_blank" rel="noopener noreferrer">
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-2.02-1.23-2.02-1.23-.9-.63-.35-1.28.25-1.9l2.7-2.6s.45-.42-.08-.15c-.53.27-2.3 1.4-3.1 1.95-.8.55-1.5.8-2.1.8-.62 0-1.8-.35-1.8-.35-1.6-.5-1.8-.82-.75-1.25.6-.25 2.5-1 6.5-2.7 3.3-1.4 4.05-1.65 4.6-1.65.13 0 .4.03.58.18s.2.35.2.55c0 .05 0 .1-.02.13z" />
                    </svg>
                    Telegram
                </a>
            </Button>
        </div>
    );
};
