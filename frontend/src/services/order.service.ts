import api from '@/lib/api';

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    size: string;
    color: string;
    customNotes?: string;
}

export interface Order {
    items: OrderItem[];
    totalAmount: number;
    // Payment details would go here
}

export const OrderService = {
    createOrder: async (orderData: Order) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (e) {
            console.warn('Backend unavailable, returning mock order', e);
            return {
                id: 'ord_' + Math.random().toString(36).substr(2, 9),
                ...orderData,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MockOrder'
            };
        }
    },

    getUserOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch {
            return [];
        }
    },

    getOrder: async (id: string) => {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        } catch {
            // Mock Return
            return {
                id: id,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + id,
                items: [
                    { productName: 'Mock Product', quantity: 1, unitPrice: 49.99, size: 'M' }
                ],
                totalAmount: 49.99
            };
        }
    }
};
