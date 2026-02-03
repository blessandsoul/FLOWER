import Link from 'next/link';
import { Flower2, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container py-8 md:py-12 px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Flower2 className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight">Florca</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            პირდაპირი წვდომა ჰოლანდიურ აუქციონებზე. საუკეთესო ფასები და ხარისხი.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm">ნავიგაცია</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/catalog" className="hover:text-primary transition-colors">კატალოგი</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">დაფა</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">ჩვენს შესახებ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm">დახმარება</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">კონტაქტი</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">ხშირად დასმული კითხვები</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">წესები და პირობები</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm">გამოგვყევით</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
                    <p>&copy; 2024 Florca. ყველა უფლება დაცულია.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-primary">კონფიდენციალურობა</Link>
                        <Link href="#" className="hover:text-primary">პირობები</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
