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
    },

    createProduct: async (product: Partial<Product>) => {
        const response = await api.post<Product>('/products', product);
        return response.data;
    },

    updateProduct: async (id: string, product: Partial<Product>) => {
        const response = await api.put<Product>(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/products/${id}`);
        return response.data;
    }
};
