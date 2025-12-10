import api from '@/lib/api';
import { Product } from '@/types';

export const ProductService = {
    getAllProducts: async (category?: string) => {
        const params = category ? { category } : {};
        const response = await api.get<Product[]>('/products', { params });
        return response.data;
    },

    getProductById: async (id: string) => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    searchProducts: async (query: string) => {
        const response = await api.get<Product[]>('/products/search', { params: { query } });
        return response.data;
    }
};
