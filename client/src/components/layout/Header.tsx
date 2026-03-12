'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flower2, LayoutDashboard, Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
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
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
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
                                    <Button variant="ghost" size="sm" onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        გასვლა
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
            </nav>

            {/* Mobile Navigation - rendered outside nav to avoid stacking context issues */}
            {/* Backdrop - starts below header (top-16), transitions opacity */}
            <div
                className={cn(
                    "fixed inset-0 top-16 z-[998] bg-black/60 transition-opacity duration-300 md:hidden",
                    isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu panel - slides in/out */}
            <div
                className={cn(
                    "fixed inset-x-0 top-16 z-[999] overflow-y-auto max-h-[calc(100vh-4rem)] border-t bg-background p-4 transition-all duration-300 md:hidden",
                    isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
                )}
            >
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
                            <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                გასვლა
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
        </>
    );
};
