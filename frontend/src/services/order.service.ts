import api from '@/lib/api';
import { Address } from '@/types';

export interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    // Add product name/image if needed for display, though normally fetched via productId
    productName?: string;
    productImage?: string;
    designImageUrl?: string; // Base64 or URL of custom design
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    IN_PRODUCTION = 'IN_PRODUCTION',
    QUALITY_CHECK = 'QUALITY_CHECK',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export interface Order {
    id: string;
    customerId: string;
    customerEmail?: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    qrCodeUrl?: string;
    createdAt: string;
    shippingAddress?: Address; // Ensure backend supports this if we add it
}

export const orderService = {
    // Determine if we need public tracking or just authenticated
    // Currently backend requires auth for /api/orders
    getMyOrders: async () => {
        const response = await api.get<Order[]>('/orders');
        return response.data;
    },

    getOrderById: async (id: string) => {
        const response = await api.get<Order>(`/orders/${id}`);
        return response.data;
    },

    createOrder: async (orderData: Partial<Order>) => {
        const response = await api.post<Order>('/orders', orderData);
        return response.data;
    },

    updateStatus: async (id: string, status: OrderStatus) => {
        // Backend expects @RequestBody OrderStatus status (Enum)
        // Sending just the string value in quotes is the standard way for Spring Boot to deserialize an Enum from @RequestBody
        const response = await api.put<Order>(`/orders/${id}/status`, JSON.stringify(status), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },


    // For Admin/Scan
    getAllOrders: async () => {
        const response = await api.get<Order[]>('/orders/all');
        return response.data;
    }
};
