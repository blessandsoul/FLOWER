import { Product, User, Order, InvoiceSummary } from '../types';

// ============================================
// TEST ACCOUNTS
// ============================================

export const TEST_ACCOUNTS: User[] = [
    {
        id: 'u-admin',
        email: 'admin@florca.ge',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        balance: 0,
        isVip: false,
        isReseller: false,
        emailVerified: true,
    },
    {
        id: 'u-operator',
        email: 'operator@florca.ge',
        firstName: 'Operator',
        lastName: 'User',
        role: 'OPERATOR',
        balance: 0,
        isVip: false,
        isReseller: false,
        emailVerified: true,
    },
    {
        id: 'u-logistics',
        email: 'logistics@florca.ge',
        firstName: 'Logistics',
        lastName: 'Manager',
        role: 'LOGISTICS',
        balance: 0,
        isVip: false,
        isReseller: false,
        emailVerified: true,
    },
    {
        id: 'u-accountant',
        email: 'accountant@florca.ge',
        firstName: 'Accountant',
        lastName: 'User',
        role: 'ACCOUNTANT',
        balance: 0,
        isVip: false,
        isReseller: false,
        emailVerified: true,
    },
    {
        id: 'u-user',
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'Customer',
        role: 'USER',
        balance: 150.0,
        isVip: false,
        isReseller: false,
        emailVerified: true,
    },
    {
        id: 'u-reseller',
        email: 'reseller@example.com',
        firstName: 'Reseller',
        lastName: 'Business',
        role: 'RESELLER',
        balance: 500.0,
        isVip: false,
        isReseller: true,
        emailVerified: true,
    },
    {
        id: 'u-vip',
        email: 'vip@example.com',
        firstName: 'VIP',
        lastName: 'Customer',
        role: 'USER',
        balance: 1000.0,
        isVip: true,
        isReseller: false,
        emailVerified: true,
    },
];

export const MOCK_USER = TEST_ACCOUNTS[4]; // Regular user as default

// ============================================
// PRODUCTS
// ============================================

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p-1',
        name: 'ვარდი რედ ნაომი',
        category: 'ვარდი',
        color: 'წითელი',
        lengthCm: 60,
        minBoxSize: 80,
        priceEur: 0.45,
        priceGel: 1.45,
        totalAvailable: 1000,
        currentCollected: 240,
        photoUrl: '/images/red-naomi.png',
    },
    {
        id: 'p-2',
        name: 'ვარდი ავალანჟი',
        category: 'ვარდი',
        color: 'თეთრი',
        lengthCm: 70,
        minBoxSize: 60,
        priceEur: 0.55,
        priceGel: 1.75,
        totalAvailable: 800,
        currentCollected: 55,
        photoUrl: '/images/cat-roses.png',
    },
    {
        id: 'p-3',
        name: 'ვარდი პინკ ფლოიდი',
        category: 'ვარდი',
        color: 'ვარდისფერი',
        lengthCm: 50,
        minBoxSize: 100,
        priceEur: 0.35,
        priceGel: 1.15,
        totalAvailable: 2000,
        currentCollected: 850,
        photoUrl: '/images/cat-peonies.png',
    },
    {
        id: 'p-4',
        name: 'ტიტა სტრონგ გოლდი',
        category: 'ტიტა',
        color: 'ყვითელი',
        lengthCm: 35,
        minBoxSize: 500,
        priceEur: 0.15,
        priceGel: 0.55,
        totalAvailable: 5000,
        currentCollected: 1200,
        photoUrl: '/images/cat-tulips.png',
    },
    {
        id: 'p-5',
        name: 'ევკალიპტი სინერეა',
        category: 'მწვანე',
        color: 'მწვანე',
        lengthCm: 80,
        minBoxSize: 20,
        priceEur: 2.50,
        priceGel: 7.80,
        totalAvailable: 200,
        currentCollected: 18,
        photoUrl: '/images/cat-greenery.png',
    },
];

// ============================================
// ORDERS
// ============================================

export const MOCK_ORDERS: Order[] = [
    {
        id: 'ord-101',
        date: '2026-01-28',
        status: 'APPROVED',
        totalAmount: 435.0,
        items: [
            { productId: 'p-1', quantity: 160, product: MOCK_PRODUCTS[0] },
            { productId: 'p-4', quantity: 200, product: MOCK_PRODUCTS[3] },
        ],
    },
    {
        id: 'ord-102',
        date: '2026-01-30',
        status: 'PENDING',
        totalAmount: 115.0,
        items: [{ productId: 'p-3', quantity: 100, product: MOCK_PRODUCTS[2] }],
    },
    {
        id: 'ord-103',
        date: '2026-02-01',
        status: 'SHIPPED',
        totalAmount: 290.0,
        items: [
            { productId: 'p-2', quantity: 60, product: MOCK_PRODUCTS[1] },
            { productId: 'p-5', quantity: 20, product: MOCK_PRODUCTS[4] },
        ],
    },
    {
        id: 'ord-104',
        date: '2026-02-02',
        status: 'DELIVERED',
        totalAmount: 550.0,
        items: [
            { productId: 'p-1', quantity: 200, product: MOCK_PRODUCTS[0] },
        ],
    },
    {
        id: 'ord-105',
        date: '2026-02-03',
        status: 'CANCELLED',
        totalAmount: 196.0,
        items: [
            { productId: 'p-3', quantity: 50, product: MOCK_PRODUCTS[2] },
        ],
    },
];

// ============================================
// MOCK BATCHES (for operator/logistics)
// ============================================

export const MOCK_BATCHES = [
    {
        id: 'b-1',
        batchNumber: 'BATCH-2026-01-001',
        origin: 'HOLLAND' as const,
        supplier: 'Dutch Flower Auctions',
        expectedArrival: '2026-02-10',
        status: 'IN_TRANSIT' as const,
        totalItems: 500,
        totalCostEur: 850,
    },
    {
        id: 'b-2',
        batchNumber: 'BATCH-2026-01-002',
        origin: 'ECUADOR' as const,
        supplier: 'Ecuador Premium Roses',
        expectedArrival: '2026-02-12',
        status: 'ORDERED' as const,
        totalItems: 300,
        totalCostEur: 540,
    },
    {
        id: 'b-3',
        batchNumber: 'BATCH-2026-01-003',
        origin: 'HOLLAND' as const,
        supplier: 'Dutch Flower Auctions',
        expectedArrival: '2026-01-28',
        status: 'RECEIVED' as const,
        totalItems: 400,
        totalCostEur: 620,
    },
];

// ============================================
// MOCK CREDIT TRANSACTIONS
// ============================================

export const MOCK_TRANSACTIONS = [
    { id: 't-1', type: 'DEPOSIT' as const, amount: 200, description: 'სტარტ ბონუსი', date: '2026-01-15' },
    { id: 't-2', type: 'SPEND' as const, amount: -50, description: 'შეკვეთა #ord-101', date: '2026-01-28' },
    { id: 't-3', type: 'DEPOSIT' as const, amount: 196, description: 'გაუქმებული შეკვეთა #ord-105', date: '2026-02-03' },
    { id: 't-4', type: 'SPEND' as const, amount: -100, description: 'შეკვეთა #ord-103', date: '2026-02-01' },
    { id: 't-5', type: 'REFUND' as const, amount: 50, description: 'ბრუნვა - დაზიანებული', date: '2026-02-02' },
];

// ============================================
// MOCK DASHBOARD STATS
// ============================================

export const MOCK_DASHBOARD_STATS = {
    orders: { pending: 8, approved: 12, shipped: 5, todayTotal: 15 },
    products: { total: 23, lowStock: 4, outOfStock: 2 },
    batches: { inTransit: 1, expectedThisWeek: 2 },
    revenue: { today: '2,340', thisWeek: '12,580', thisMonth: '48,200' },
};

// ============================================
// INVOICES
// ============================================

export const MOCK_INVOICES: InvoiceSummary[] = [
    {
        id: 'inv-1',
        invoiceNumber: 'INV-202602-00001',
        orderNumber: 'ORD-202602-00001',
        buyerName: 'შპს ფლორა მარკეტი',
        totalGel: '1250.00',
        issueDate: '2026-02-01T10:00:00Z',
        status: 'ISSUED',
    },
    {
        id: 'inv-2',
        invoiceNumber: 'INV-202602-00002',
        orderNumber: 'ORD-202602-00003',
        buyerName: 'თამარ გოგიშვილი',
        totalGel: '340.50',
        issueDate: '2026-02-02T14:30:00Z',
        status: 'ISSUED',
    },
    {
        id: 'inv-3',
        invoiceNumber: 'INV-202601-00005',
        orderNumber: 'ORD-202601-00012',
        buyerName: 'შპს გრინ გარდენი',
        totalGel: '4580.00',
        issueDate: '2026-01-28T09:15:00Z',
        status: 'ISSUED',
    },
    {
        id: 'inv-4',
        invoiceNumber: 'INV-202601-00004',
        orderNumber: 'ORD-202601-00010',
        buyerName: 'ნინო ბერიძე',
        totalGel: '180.00',
        issueDate: '2026-01-25T16:00:00Z',
        status: 'CANCELLED',
    },
];
