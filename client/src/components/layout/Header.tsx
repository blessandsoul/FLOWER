'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flower2, LayoutDashboard, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartSheet } from '@/components/CartSheet';
import { cn } from '@/lib/cn';
import { useState } from 'react';
import { useAuth } from '@/hooks';
import { WalletBadge } from '@/features/wallet/components/WalletBadge';

const navItems = [
    { href: '/catalog', label: 'კატალოგი' },
    { href: '/logistics', label: 'ლოგისტიკა' },
    { href: '/about', label: 'ჩვენს შესახებ' },
    { href: '/contact', label: 'კონტაქტი' },
];

export const Header = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="mr-8 flex items-center space-x-2">
                        <Flower2 className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight">Florca</span>
                    </Link>

                    <div className="hidden md:flex gap-6 lg:gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Balance - only show when logged in */}
                    {isAuthenticated && <WalletBadge className="hidden sm:flex mr-2" />}

                    {/* Cart - only show when logged in */}
                    {isAuthenticated && <CartSheet />}

                    {/* Auth buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        დაფა
                                    </Link>
                                </Button>
                                <Button asChild size="sm" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                                    <Link href="/dashboard">
                                        მართვა
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        შესვლა
                                    </Link>
                                </Button>
                                <Button asChild size="sm" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                                    <Link href="/register">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        რეგისტრაცია
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background p-4 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-base font-medium transition-colors hover:text-primary",
                                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <hr className="my-2" />
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center justify-between py-2">
                                    <WalletBadge className="flex w-full flex-row items-center justify-between" />
                                </div>
                                <Button asChild className="w-full">
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        მართვა
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        შესვლა
                                    </Link>
                                </Button>
                                <Button asChild className="w-full">
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        რეგისტრაცია
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
