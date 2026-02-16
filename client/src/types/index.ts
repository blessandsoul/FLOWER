// Two-role system matching server schema
export type Role = 'USER' | 'ADMIN';

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    roles: Role[];              // Multi-role support via array
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
};

export type PriceTier = {
    minQuantity: number;
    price: number;
};

export type Product = {
    id: string;
    name: string;
    photoUrl: string;
    price: number;        // Price in GEL
    minBoxSize: number;   // Minimum order quantity (orderPer from server)
    stock: number;        // Available stock
    color: string;
    category: string;
    grower?: string;
    origin?: string;
    priceTiers: PriceTier[];
};

export type ProductDetail = Product & {
    images: string[];     // Array of full image URLs
    tags: string[];       // All tag names
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
