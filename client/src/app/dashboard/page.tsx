'use client';

import { useState } from 'react';
import { TEST_ACCOUNTS, MOCK_ORDERS, MOCK_BATCHES, MOCK_TRANSACTIONS, MOCK_PRODUCTS, MOCK_DASHBOARD_STATS, MOCK_INVOICES } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    CreditCard, Package, Clock, DollarSign, ShieldCheck, Users, TrendingUp,
    Truck, AlertTriangle, Settings, ArrowUpRight, ArrowDownRight, BarChart3,
    Boxes, Eye, CheckCircle2, XCircle, Plane, Lock, Unlock, ShoppingCart,
    FileText, Database, Percent, Receipt, UserCog, PackageSearch, Globe,
} from 'lucide-react';
import type { User } from '@/types';
import { InvoicesTable } from '@/features/invoices/components/InvoicesTable';
import { DemoInvoiceGenerator } from '@/features/invoices/components/DemoInvoiceGenerator';


// ============================================
// ROLE CONFIG
// ============================================

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; activeBg: string; ring: string; border: string; description: string; icon: React.ReactNode }> = {
    ADMIN: { label: 'ადმინი', color: 'text-red-700', bg: 'bg-red-50', activeBg: 'bg-red-100', ring: 'ring-red-400', border: 'border-red-300', description: 'სრული წვდომა სისტემაზე', icon: <ShieldCheck className="h-5 w-5" /> },
    OPERATOR: { label: 'ოპერატორი', color: 'text-orange-700', bg: 'bg-orange-50', activeBg: 'bg-orange-100', ring: 'ring-orange-400', border: 'border-orange-300', description: 'შეკვეთებისა და პარტიების მართვა', icon: <PackageSearch className="h-5 w-5" /> },
    LOGISTICS: { label: 'ლოგისტიკა', color: 'text-amber-700', bg: 'bg-amber-50', activeBg: 'bg-amber-100', ring: 'ring-amber-400', border: 'border-amber-300', description: 'საწყობი და მიწოდება', icon: <Truck className="h-5 w-5" /> },
    ACCOUNTANT: { label: 'ბუღალტერი', color: 'text-purple-700', bg: 'bg-purple-50', activeBg: 'bg-purple-100', ring: 'ring-purple-400', border: 'border-purple-300', description: 'შემოსავლები და ტრანზაქციები', icon: <Receipt className="h-5 w-5" /> },
    USER: { label: 'მომხმარებელი', color: 'text-blue-700', bg: 'bg-blue-50', activeBg: 'bg-blue-100', ring: 'ring-blue-400', border: 'border-blue-300', description: 'დათვალიერება და შეკვეთა', icon: <ShoppingCart className="h-5 w-5" /> },
    RESELLER: { label: 'გადამყიდველი', color: 'text-green-700', bg: 'bg-green-50', activeBg: 'bg-green-100', ring: 'ring-green-400', border: 'border-green-300', description: 'საბითუმო ფასები', icon: <TrendingUp className="h-5 w-5" /> },
    VIP: { label: 'VIP', color: 'text-amber-800', bg: 'bg-yellow-50', activeBg: 'bg-yellow-100', ring: 'ring-amber-500', border: 'border-amber-400', description: 'პრიორიტეტული წვდომა', icon: <ShieldCheck className="h-5 w-5" /> },
};

function getAccountKey(user: User): string {
    if (user.isVip) return 'VIP';
    return user.role;
}

// ============================================
// PERMISSIONS DATA
// ============================================

interface Permission {
    label: string;
    icon: React.ReactNode;
    allowed: boolean;
    note?: string;
}

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
    ADMIN: [
        { label: 'მომხმარებლებისა და როლების მართვა', icon: <UserCog className="h-4 w-4" />, allowed: true },
        { label: 'პროდუქტებისა და კატალოგის მართვა', icon: <Package className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთების დამუშავება', icon: <PackageSearch className="h-4 w-4" />, allowed: true },
        { label: 'პარტიებისა და იმპორტის მართვა', icon: <Plane className="h-4 w-4" />, allowed: true },
        { label: 'მარაგის იმპორტი და მართვა', icon: <Database className="h-4 w-4" />, allowed: true },
        { label: 'კრედიტებისა და ბალანსის მართვა', icon: <CreditCard className="h-4 w-4" />, allowed: true },
        { label: 'გლობალური პარამეტრები', icon: <Settings className="h-4 w-4" />, allowed: true },
        { label: 'ფინანსური ანგარიშები', icon: <BarChart3 className="h-4 w-4" />, allowed: true },
        { label: 'მარაგის ხილვადობის კონტროლი', icon: <Eye className="h-4 w-4" />, allowed: true },
        { label: 'ფასები და ფასდაკლებები', icon: <Percent className="h-4 w-4" />, allowed: true },
    ],
    OPERATOR: [
        { label: 'მომლოდინე შეკვეთების დამუშავება', icon: <PackageSearch className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთის სტატუსის განახლება', icon: <CheckCircle2 className="h-4 w-4" />, allowed: true },
        { label: 'პარტიების ნახვა', icon: <Plane className="h-4 w-4" />, allowed: true },
        { label: 'პროდუქტებისა და მარაგის ნახვა', icon: <Package className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთის გაუქმება + კრედიტის დარიცხვა', icon: <XCircle className="h-4 w-4" />, allowed: true, note: 'ავტო-კრედიტი გაუქმებისას' },
        { label: 'ჰოლანდიურ საიტზე განთავსება', icon: <Globe className="h-4 w-4" />, allowed: true, note: 'ხელით განთავსება' },
        { label: 'მომხმარებლებისა და როლების მართვა', icon: <UserCog className="h-4 w-4" />, allowed: false },
        { label: 'გლობალური პარამეტრები', icon: <Settings className="h-4 w-4" />, allowed: false },
        { label: 'მარაგის მონაცემების იმპორტი', icon: <Database className="h-4 w-4" />, allowed: false },
        { label: 'ფინანსური ანგარიშები', icon: <BarChart3 className="h-4 w-4" />, allowed: false },
    ],
    LOGISTICS: [
        { label: 'მარაგის იმპორტი (JSON)', icon: <Database className="h-4 w-4" />, allowed: true },
        { label: 'პარტიის მიღება', icon: <Boxes className="h-4 w-4" />, allowed: true },
        { label: 'მარაგის დონეების ნახვა', icon: <Package className="h-4 w-4" />, allowed: true },
        { label: 'გაგზავნილი შეკვეთების ნახვა', icon: <Truck className="h-4 w-4" />, allowed: true },
        { label: 'შემომავალი პარტიების თვალყურის დევნება', icon: <Plane className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთების დამუშავება', icon: <PackageSearch className="h-4 w-4" />, allowed: false },
        { label: 'მომხმარებლებისა და როლების მართვა', icon: <UserCog className="h-4 w-4" />, allowed: false },
        { label: 'გლობალური პარამეტრები', icon: <Settings className="h-4 w-4" />, allowed: false },
        { label: 'ფინანსური ანგარიშები', icon: <BarChart3 className="h-4 w-4" />, allowed: false },
        { label: 'ფასები და ფასდაკლებები', icon: <Percent className="h-4 w-4" />, allowed: false },
    ],
    ACCOUNTANT: [
        { label: 'ყველა ტრანზაქციის ნახვა', icon: <FileText className="h-4 w-4" />, allowed: true },
        { label: 'ყველა შეკვეთის ნახვა', icon: <Receipt className="h-4 w-4" />, allowed: true },
        { label: 'პარტიის ხარჯების ნახვა', icon: <DollarSign className="h-4 w-4" />, allowed: true },
        { label: 'კრედიტის ისტორიის ნახვა', icon: <CreditCard className="h-4 w-4" />, allowed: true },
        { label: 'შემოსავლის ანგარიშები', icon: <BarChart3 className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთების დამუშავება', icon: <PackageSearch className="h-4 w-4" />, allowed: false },
        { label: 'მარაგის მართვა', icon: <Database className="h-4 w-4" />, allowed: false },
        { label: 'მომხმარებლებისა და როლების მართვა', icon: <UserCog className="h-4 w-4" />, allowed: false },
        { label: 'გლობალური პარამეტრები', icon: <Settings className="h-4 w-4" />, allowed: false },
        { label: 'პროდუქტების მართვა', icon: <Package className="h-4 w-4" />, allowed: false },
    ],
    USER: [
        { label: 'პროდუქტების დათვალიერება', icon: <Package className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთის გაფორმება', icon: <ShoppingCart className="h-4 w-4" />, allowed: true },
        { label: 'ჩემი შეკვეთების ნახვა', icon: <FileText className="h-4 w-4" />, allowed: true },
        { label: 'ბალანსისა და კრედიტების ნახვა', icon: <CreditCard className="h-4 w-4" />, allowed: true },
        { label: 'კრედიტების გამოყენება გადახდისას', icon: <DollarSign className="h-4 w-4" />, allowed: true },
        { label: 'ადმინ პანელი', icon: <Settings className="h-4 w-4" />, allowed: false },
        { label: 'შეკვეთების დამუშავება', icon: <PackageSearch className="h-4 w-4" />, allowed: false },
        { label: 'მარაგის მართვა', icon: <Database className="h-4 w-4" />, allowed: false },
        { label: 'სხვა მომხმარებლების ნახვა', icon: <Users className="h-4 w-4" />, allowed: false },
        { label: 'საბითუმო ფასები', icon: <Percent className="h-4 w-4" />, allowed: false },
    ],
    RESELLER: [
        { label: 'პროდუქტების დათვალიერება', icon: <Package className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთის გაფორმება', icon: <ShoppingCart className="h-4 w-4" />, allowed: true },
        { label: 'საბითუმო ფასები', icon: <Percent className="h-4 w-4" />, allowed: true, note: 'გადამყიდველის ტარიფი' },
        { label: 'ფასდაკლება მოცულობაზე', icon: <TrendingUp className="h-4 w-4" />, allowed: true, note: '100+ / 500+ / 1000+' },
        { label: 'ჩემი შეკვეთების ნახვა', icon: <FileText className="h-4 w-4" />, allowed: true },
        { label: 'ბალანსისა და კრედიტების ნახვა', icon: <CreditCard className="h-4 w-4" />, allowed: true },
        { label: 'ადმინ პანელი', icon: <Settings className="h-4 w-4" />, allowed: false },
        { label: 'შეკვეთების დამუშავება', icon: <PackageSearch className="h-4 w-4" />, allowed: false },
        { label: 'მარაგის მართვა', icon: <Database className="h-4 w-4" />, allowed: false },
        { label: 'სხვა მომხმარებლების ნახვა', icon: <Users className="h-4 w-4" />, allowed: false },
    ],
    VIP: [
        { label: 'პროდუქტების დათვალიერება', icon: <Package className="h-4 w-4" />, allowed: true },
        { label: 'შეკვეთის გაფორმება', icon: <ShoppingCart className="h-4 w-4" />, allowed: true },
        { label: 'პრიორიტეტული დამუშავება', icon: <ShieldCheck className="h-4 w-4" />, allowed: true, note: 'შეკვეთები პრიორიტეტულია' },
        { label: 'ექსკლუზიური ფასდაკლებები', icon: <Percent className="h-4 w-4" />, allowed: true, note: 'VIP ტარიფი' },
        { label: 'წინასწარ გადახდა არ არის საჭირო', icon: <Unlock className="h-4 w-4" />, allowed: true, note: 'გადახდა მიწოდების შემდეგ' },
        { label: 'ჩემი შეკვეთების ნახვა', icon: <FileText className="h-4 w-4" />, allowed: true },
        { label: 'ბალანსისა და კრედიტების ნახვა', icon: <CreditCard className="h-4 w-4" />, allowed: true },
        { label: 'ადმინ პანელი', icon: <Settings className="h-4 w-4" />, allowed: false },
        { label: 'შეკვეთების დამუშავება', icon: <PackageSearch className="h-4 w-4" />, allowed: false },
        { label: 'მარაგის მართვა', icon: <Database className="h-4 w-4" />, allowed: false },
    ],
};

// ============================================
// STATUS HELPERS
// ============================================

const ORDER_STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'მომლოდინე', variant: 'secondary' },
    APPROVED: { label: 'დამტკიცებული', variant: 'default' },
    SHIPPED: { label: 'გაგზავნილი', variant: 'outline' },
    DELIVERED: { label: 'ჩაბარებული', variant: 'default' },
    CANCELLED: { label: 'გაუქმებული', variant: 'destructive' },
};

const BATCH_STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    ORDERED: { label: 'შეკვეთილი', variant: 'secondary' },
    IN_TRANSIT: { label: 'ტრანზიტში', variant: 'outline' },
    RECEIVED: { label: 'მიღებული', variant: 'default' },
    CANCELLED: { label: 'გაუქმებული', variant: 'destructive' },
};

// ============================================
// MAIN PAGE
// ============================================

export default function DashboardPage() {
    const [activeUser, setActiveUser] = useState<User>(TEST_ACCOUNTS[0]);
    const [showPermissions, setShowPermissions] = useState(false);
    const roleKey = getAccountKey(activeUser);
    const config = ROLE_CONFIG[roleKey];
    const permissions = ROLE_PERMISSIONS[roleKey];
    const allowedCount = permissions.filter(p => p.allowed).length;
    const deniedCount = permissions.filter(p => !p.allowed).length;

    return (
        <div className="container py-6 px-4 space-y-6">

            {/* ─── HEADER WITH ROLE PILLS ─── */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                    {TEST_ACCOUNTS.map((account) => {
                        const key = getAccountKey(account);
                        const cfg = ROLE_CONFIG[key];
                        const isActive = activeUser.id === account.id;

                        return (
                            <button
                                key={account.id}
                                onClick={() => setActiveUser(account)}
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                                    ${isActive
                                        ? `${cfg.activeBg} ${cfg.color} ${cfg.border} border shadow-sm`
                                        : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted'
                                    }
                                `}
                            >
                                {cfg.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── PERMISSIONS PANEL ─── */}
            <div className={`rounded-xl border ${config.border} overflow-hidden`}>
                {/* Collapsible Header */}
                <button
                    onClick={() => setShowPermissions(!showPermissions)}
                    className={`w-full ${config.bg} px-5 py-4 flex items-center justify-between transition-colors hover:brightness-95`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg ${config.activeBg} flex items-center justify-center ${config.color}`}>
                            {config.icon}
                        </div>
                        <div className="text-left">
                            <h2 className={`text-lg font-bold ${config.color}`}>
                                {config.label} &mdash; უფლებები
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {config.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                <Unlock className="h-3 w-3" />{allowedCount}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                                <Lock className="h-3 w-3" />{deniedCount}
                            </span>
                        </div>
                        <svg
                            className={`h-5 w-5 text-muted-foreground transition-transform ${showPermissions ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {/* Permissions Grid */}
                {showPermissions && (
                    <div className="px-5 py-4 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {permissions.map((perm, i) => (
                                <div
                                    key={i}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors
                                        ${perm.allowed
                                            ? 'border-green-200 bg-green-50/60'
                                            : 'border-gray-100 bg-gray-50/40'
                                        }
                                    `}
                                >
                                    <div className={`
                                        h-7 w-7 rounded-md flex items-center justify-center shrink-0
                                        ${perm.allowed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                                    `}>
                                        {perm.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-sm font-medium ${perm.allowed ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {perm.label}
                                        </span>
                                        {perm.note && (
                                            <span className={`block text-[11px] ${perm.allowed ? 'text-green-600' : 'text-gray-400'}`}>
                                                {perm.note}
                                            </span>
                                        )}
                                    </div>
                                    {perm.allowed
                                        ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                        : <XCircle className="h-4 w-4 text-gray-300 shrink-0" />
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ─── ROLE-SPECIFIC CONTENT ─── */}
            {activeUser.role === 'ADMIN' && <AdminDashboard />}
            {activeUser.role === 'OPERATOR' && <OperatorDashboard />}
            {activeUser.role === 'LOGISTICS' && <LogisticsDashboard />}
            {activeUser.role === 'ACCOUNTANT' && <AccountantDashboard />}
            {(activeUser.role === 'USER' || activeUser.role === 'RESELLER') && (
                <CustomerDashboard user={activeUser} />
            )}
        </div>
    );
}

// ============================================
// ADMIN DASHBOARD
// ============================================

function AdminDashboard() {
    const stats = MOCK_DASHBOARD_STATS;
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<Clock />} label="მომლოდინე შეკვეთები" value={stats.orders.pending} sub="დასამტკიცებელი" accent="text-orange-600" />
                <StatCard icon={<TrendingUp />} label="დღევანდელი შემოსავალი" value={`${stats.revenue.today} ₾`} sub={`კვირა: ${stats.revenue.thisWeek} ₾`} accent="text-green-600" />
                <StatCard icon={<Users />} label="აქტიური პროდუქტები" value={stats.products.total} sub={`${stats.products.lowStock} მცირე მარაგი`} accent="text-blue-600" />
                <StatCard icon={<Plane />} label="პარტიები ტრანზიტში" value={stats.batches.inTransit} sub={`${stats.batches.expectedThisWeek} ამ კვირას`} accent="text-purple-600" />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
                <DemoInvoiceGenerator />
            </div>

            <Tabs defaultValue="orders">
                <TabsList>
                    <TabsTrigger value="orders">ყველა შეკვეთა</TabsTrigger>
                    <TabsTrigger value="invoices">ინვოისები</TabsTrigger>
                    <TabsTrigger value="products">პროდუქტები</TabsTrigger>
                    <TabsTrigger value="batches">პარტიები</TabsTrigger>
                    <TabsTrigger value="settings">პარამეტრები</TabsTrigger>
                </TabsList>
                <TabsContent value="orders"><OrdersTable orders={MOCK_ORDERS} showUser /></TabsContent>
                <TabsContent value="invoices"><InvoicesTable invoices={MOCK_INVOICES} /></TabsContent>
                <TabsContent value="products"><ProductsTable /></TabsContent>
                <TabsContent value="batches"><BatchesTable /></TabsContent>
                <TabsContent value="settings"><SettingsPanel /></TabsContent>
            </Tabs>
        </div>
    );
}

// ============================================
// OPERATOR DASHBOARD
// ============================================

function OperatorDashboard() {
    const stats = MOCK_DASHBOARD_STATS;
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<Clock />} label="მომლოდინე შეკვეთები" value={stats.orders.pending} sub="საჭიროა თქვენი მოქმედება" accent="text-red-600" />
                <StatCard icon={<CheckCircle2 />} label="დამტკიცებული" value={stats.orders.approved} sub="მზადაა გასაგზავნად" accent="text-green-600" />
                <StatCard icon={<Boxes />} label="დღევანდელი ჯამი" value={stats.orders.todayTotal} sub="დღევანდელი შეკვეთები" accent="text-blue-600" />
                <StatCard icon={<Plane />} label="შემომავალი პარტიები" value={stats.batches.expectedThisWeek} sub="ამ კვირას" accent="text-purple-600" />
            </div>
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">მომლოდინე ({stats.orders.pending})</TabsTrigger>
                    <TabsTrigger value="all">ყველა შეკვეთა</TabsTrigger>
                    <TabsTrigger value="batches">პარტიები</TabsTrigger>
                </TabsList>
                <TabsContent value="pending"><OrdersTable orders={MOCK_ORDERS.filter(o => o.status === 'PENDING')} showUser showActions /></TabsContent>
                <TabsContent value="all"><OrdersTable orders={MOCK_ORDERS} showUser /></TabsContent>
                <TabsContent value="batches"><BatchesTable showActions /></TabsContent>
            </Tabs>
        </div>
    );
}

// ============================================
// LOGISTICS DASHBOARD
// ============================================

function LogisticsDashboard() {
    const stats = MOCK_DASHBOARD_STATS;
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={<Plane />} label="ტრანზიტში" value={stats.batches.inTransit} sub="გზაშია" accent="text-blue-600" />
                <StatCard icon={<Truck />} label="მოსალოდნელი ამ კვირას" value={stats.batches.expectedThisWeek} sub="მალე ჩამოვა" accent="text-orange-600" />
                <StatCard icon={<AlertTriangle />} label="მცირე მარაგი" value={stats.products.lowStock} sub="საჭიროა შევსება" accent="text-red-600" />
            </div>
            <Tabs defaultValue="batches">
                <TabsList>
                    <TabsTrigger value="batches">შემომავალი პარტიები</TabsTrigger>
                    <TabsTrigger value="stock">მარაგის დონეები</TabsTrigger>
                    <TabsTrigger value="shipped">გაგზავნილი შეკვეთები</TabsTrigger>
                </TabsList>
                <TabsContent value="batches"><BatchesTable showActions /></TabsContent>
                <TabsContent value="stock"><StockLevelsPanel /></TabsContent>
                <TabsContent value="shipped"><OrdersTable orders={MOCK_ORDERS.filter(o => o.status === 'SHIPPED')} showUser /></TabsContent>
            </Tabs>
        </div>
    );
}

// ============================================
// ACCOUNTANT DASHBOARD
// ============================================

function AccountantDashboard() {
    const stats = MOCK_DASHBOARD_STATS;
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<DollarSign />} label="დღეს" value={`${stats.revenue.today} ₾`} sub="შემოსავალი" accent="text-green-600" />
                <StatCard icon={<BarChart3 />} label="ამ კვირას" value={`${stats.revenue.thisWeek} ₾`} sub="კვირის" accent="text-blue-600" />
                <StatCard icon={<TrendingUp />} label="ამ თვეს" value={`${stats.revenue.thisMonth} ₾`} sub="თვის" accent="text-purple-600" />
                <StatCard icon={<CreditCard />} label="დღევანდელი შეკვეთები" value={stats.orders.todayTotal} sub="რაოდენობა" accent="text-orange-600" />
            </div>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">ტრანზაქციები</TabsTrigger>
                    <TabsTrigger value="invoices">ინვოისები</TabsTrigger>
                    <TabsTrigger value="orders">გადახდილი შეკვეთები</TabsTrigger>
                    <TabsTrigger value="costs">პარტიის ხარჯები</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions"><TransactionsPanel /></TabsContent>
                <TabsContent value="invoices"><InvoicesTable invoices={MOCK_INVOICES} /></TabsContent>
                <TabsContent value="orders"><OrdersTable orders={MOCK_ORDERS.filter(o => o.status !== 'CANCELLED')} showUser /></TabsContent>
                <TabsContent value="costs"><BatchCostsPanel /></TabsContent>
            </Tabs>
        </div>
    );
}

// ============================================
// CUSTOMER / RESELLER / VIP
// ============================================

function CustomerDashboard({ user }: { user: User }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<DollarSign />} label="ბალანსი" value={`${user.balance.toFixed(2)} ₾`} sub="ხელმისაწვდომი" accent="text-green-600" />
                <StatCard icon={<Clock />} label="აქტიური შეკვეთები" value={MOCK_ORDERS.filter(o => o.status === 'PENDING' || o.status === 'APPROVED').length} sub="მიმდინარე" accent="text-blue-600" />
                <StatCard icon={<Package />} label="ჯამური შეკვეთები" value={MOCK_ORDERS.length} sub="სულ" accent="text-purple-600" />
                <StatCard
                    icon={<ShieldCheck />}
                    label="სტატუსი"
                    value={user.isVip ? 'VIP' : user.isReseller ? 'გადამყიდველი' : 'სტანდარტი'}
                    sub={user.isVip ? 'პრიორიტეტი' : user.isReseller ? 'საბითუმო' : 'ჩვეულებრივი'}
                    accent={user.isVip ? 'text-amber-600' : user.isReseller ? 'text-green-600' : 'text-blue-600'}
                />
            </div>

            {user.isReseller && (
                <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-green-800">გადამყიდველის ფასდაკლება აქტიურია</p>
                                <p className="text-sm text-green-600">საბითუმო ფასები. მოცულობა: 100+ (5%), 500+ (10%), 1000+ (15%)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {user.isVip && (
                <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-amber-800">VIP სტატუსი აქტიურია</p>
                                <p className="text-sm text-amber-600">პრიორიტეტული დამუშავება, ექსკლუზიური ფასდაკლებები, წინასწარ გადახდის გარეშე.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="orders">
                <TabsList>
                    <TabsTrigger value="orders">ჩემი შეკვეთები</TabsTrigger>
                    <TabsTrigger value="invoices">ინვოისები</TabsTrigger>
                    <TabsTrigger value="transactions">კრედიტები</TabsTrigger>
                </TabsList>
                <TabsContent value="orders"><OrdersTable orders={MOCK_ORDERS} /></TabsContent>
                <TabsContent value="invoices"><InvoicesTable invoices={MOCK_INVOICES} /></TabsContent>
                <TabsContent value="transactions"><TransactionsPanel /></TabsContent>
            </Tabs>
        </div>
    );
}

// ============================================
// SHARED COMPONENTS
// ============================================

function StatCard({ icon, label, value, sub, accent }: {
    icon: React.ReactNode; label: string; value: string | number; sub: string; accent: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">{icon}</span>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${accent}`}>{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
        </Card>
    );
}

function OrdersTable({ orders, showUser, showActions }: { orders: typeof MOCK_ORDERS; showUser?: boolean; showActions?: boolean }) {
    return (
        <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ID</th>
                                {showUser && <th className="h-10 px-4 text-left font-medium text-muted-foreground">მომხმარებელი</th>}
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">თარიღი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ერთეული</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">თანხა</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">სტატუსი</th>
                                {showActions && <th className="h-10 px-4 text-right font-medium text-muted-foreground">მოქმედებები</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const st = ORDER_STATUS_MAP[order.status];
                                return (
                                    <tr key={order.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3 font-mono text-xs">#{order.id}</td>
                                        {showUser && <td className="p-3 text-xs text-muted-foreground">customer@...</td>}
                                        <td className="p-3">{order.date}</td>
                                        <td className="p-3">{order.items.length}</td>
                                        <td className="p-3 font-semibold">{order.totalAmount.toFixed(2)} ₾</td>
                                        <td className="p-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                                        {showActions && (
                                            <td className="p-3 text-right space-x-1">
                                                <Button size="sm" variant="default" className="h-7 text-xs">დამტკიცება</Button>
                                                <Button size="sm" variant="destructive" className="h-7 text-xs">უარყოფა</Button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr><td colSpan={showActions ? 7 : 6} className="p-8 text-center text-muted-foreground">შეკვეთები არ არის</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function BatchesTable({ showActions }: { showActions?: boolean }) {
    return (
        <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">პარტია #</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">წარმოშობა</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მომწოდებელი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მოსვლის თარიღი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ერთეული</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ღირებულება</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">სტატუსი</th>
                                {showActions && <th className="h-10 px-4 text-right font-medium text-muted-foreground">მოქმედებები</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_BATCHES.map(batch => {
                                const st = BATCH_STATUS_MAP[batch.status];
                                return (
                                    <tr key={batch.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3 font-mono text-xs">{batch.batchNumber}</td>
                                        <td className="p-3">
                                            <Badge variant="outline" className={batch.origin === 'HOLLAND' ? 'border-orange-300 text-orange-700' : 'border-green-300 text-green-700'}>
                                                {batch.origin === 'HOLLAND' ? 'ჰოლანდია' : 'ეკვადორი'}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-xs">{batch.supplier}</td>
                                        <td className="p-3">{batch.expectedArrival}</td>
                                        <td className="p-3">{batch.totalItems}</td>
                                        <td className="p-3 font-semibold">{batch.totalCostEur} EUR</td>
                                        <td className="p-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                                        {showActions && (
                                            <td className="p-3 text-right">
                                                {batch.status === 'IN_TRANSIT' && <Button size="sm" className="h-7 text-xs">მიღებულად მონიშვნა</Button>}
                                                {batch.status === 'ORDERED' && <Button size="sm" variant="outline" className="h-7 text-xs">თვალყური</Button>}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function ProductsTable() {
    return (
        <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">სახელი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">კატეგორია</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">EUR</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">GEL</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მარაგი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ყუთის შევსება</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_PRODUCTS.map(p => (
                                <tr key={p.id} className="border-b hover:bg-muted/50">
                                    <td className="p-3 font-medium">{p.name}</td>
                                    <td className="p-3"><Badge variant="outline">{p.category}</Badge></td>
                                    <td className="p-3 font-mono">{p.priceEur.toFixed(2)}</td>
                                    <td className="p-3 font-mono">{p.priceGel.toFixed(2)}</td>
                                    <td className="p-3">{p.totalAvailable}</td>
                                    <td className="p-3 w-36">
                                        <div className="flex items-center gap-2">
                                            <Progress value={(p.currentCollected / p.minBoxSize) * 100} className="h-2" />
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">{p.currentCollected}/{p.minBoxSize}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function TransactionsPanel() {
    return (
        <Card className="mt-4">
            <CardContent className="pt-6 space-y-3">
                {MOCK_TRANSACTIONS.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                {tx.amount > 0 ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : <ArrowDownRight className="h-4 w-4 text-red-600" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{tx.description}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                        </div>
                        <span className={`font-mono font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} ₾
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function StockLevelsPanel() {
    const sorted = [...MOCK_PRODUCTS].sort((a, b) => a.totalAvailable - b.totalAvailable);
    return (
        <Card className="mt-4">
            <CardContent className="pt-6 space-y-3">
                {sorted.map(p => {
                    const pct = Math.min((p.totalAvailable / 2000) * 100, 100);
                    const isLow = p.totalAvailable < 300;
                    return (
                        <div key={p.id} className={`p-3 rounded-lg border ${isLow ? 'border-red-200 bg-red-50/50' : ''}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{p.name}</span>
                                <span className={`font-mono text-sm ${isLow ? 'text-red-600 font-bold' : ''}`}>{p.totalAvailable} ღერო</span>
                            </div>
                            <Progress value={pct} className={`h-2 ${isLow ? '[&>div]:bg-red-500' : ''}`} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

function BatchCostsPanel() {
    const total = MOCK_BATCHES.reduce((s, b) => s + b.totalCostEur, 0);
    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-base">იმპორტის ჯამური ხარჯი: {total.toFixed(2)} EUR</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">პარტია</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">მომწოდებელი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ერთეული</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ხარჯი EUR</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ერთეულზე</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">სტატუსი</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_BATCHES.map(b => {
                                const st = BATCH_STATUS_MAP[b.status];
                                return (
                                    <tr key={b.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3 font-mono text-xs">{b.batchNumber}</td>
                                        <td className="p-3">{b.supplier}</td>
                                        <td className="p-3">{b.totalItems}</td>
                                        <td className="p-3 font-semibold">{b.totalCostEur.toFixed(2)}</td>
                                        <td className="p-3 font-mono">{(b.totalCostEur / b.totalItems).toFixed(2)}</td>
                                        <td className="p-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function SettingsPanel() {
    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>გლობალური პარამეტრები</CardTitle>
                <CardDescription>მხოლოდ ადმინი</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {[
                        { label: 'მარაგის ხილვადობა', value: '40%', sub: '60% დამალულია ბუფერად' },
                        { label: 'სტანდარტული ნაფასარი', value: '40%', sub: 'EUR-GEL ნაფასარი' },
                        { label: 'EUR/GEL კურსი', value: '3.50', sub: 'გაცვლის კურსი' },
                        { label: 'შეკვეთის ბოლო ვადა', value: '18:00', sub: 'დღიური ლიმიტი' },
                    ].map(s => (
                        <div key={s.label} className="p-4 rounded-lg border space-y-1">
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.sub}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
