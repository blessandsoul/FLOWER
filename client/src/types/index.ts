export type Role = 'USER' | 'RESELLER' | 'OPERATOR' | 'LOGISTICS' | 'ACCOUNTANT' | 'ADMIN';

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    balance: number;
    isVip: boolean;
    isReseller: boolean;
    emailVerified: boolean;
    phone?: string | null;
    address?: string | null;
    companyName?: string | null;
    taxId?: string | null;
    personalId?: string | null;
};

export type Product = {
    id: string;
    name: string;
    description?: string;
    photoUrl: string;
    priceEur: number;
    priceGel: number;
    minBoxSize: number; // e.g., 20, 50, 100
    totalAvailable: number; // Original quantity at auction
    currentCollected: number; // How much users have already ordered in our system
    color: string;
    lengthCm: number;
    category: string;
};

export type CartItem = {
    productId: string;
    product: Product;
    quantity: number;
};

export type OrderStatus = 'PENDING' | 'APPROVED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type Order = {
    id: string;
    date: string;
    status: OrderStatus;
    totalAmount: number;
    items: CartItem[];
};

// ============================================
// INVOICE TYPES
// ============================================

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'CANCELLED';

export type SellerDetails = {
    companyName: string;
    taxId: string;
    address: string;
    phone: string;
    bankName: string;
    iban: string;
    email: string;
};

export type InvoiceItem = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPriceGel: string;
    vatAmount: string;
    totalGel: string;
};

export type Invoice = {
    id: string;
    invoiceNumber: string;
    orderId: string;
    orderNumber: string;
    userId: string;
    status: InvoiceStatus;
    issueDate: string;
    buyerName: string;
    buyerTaxId: string | null;
    buyerPersonalId: string | null;
    buyerAddress: string | null;
    buyerPhone: string | null;
    buyerEmail: string | null;
    seller: SellerDetails;
    subtotalGel: string;
    vatAmount: string;
    discountGel: string;
    creditsUsedGel: string;
    totalGel: string;
    items: InvoiceItem[];
    notes: string | null;
    createdAt: string;
};

export type InvoiceSummary = {
    id: string;
    invoiceNumber: string;
    orderNumber: string;
    buyerName: string;
    totalGel: string;
    issueDate: string;
    status: InvoiceStatus;
};
