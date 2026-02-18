import type { OrderStatus } from "@prisma/client";

export type { OrderStatus } from "@prisma/client";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string;
  serviceFee: string;
  totalAmount: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderWithUser extends Order {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
