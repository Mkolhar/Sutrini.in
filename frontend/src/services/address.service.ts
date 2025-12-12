import api from '@/lib/api';
import { Address } from '@/types';

export const AddressService = {
    getAddresses: async () => {
        const response = await api.get<Address[]>('/addresses');
        return response.data;
    },

    addAddress: async (address: Partial<Address>) => {
        const response = await api.post<Address>('/addresses', address);
        return response.data;
    },

    updateAddress: async (id: string, address: Partial<Address>) => {
        const response = await api.put<Address>(`/addresses/${id}`, address);
        return response.data;
    },

    deleteAddress: async (id: string) => {
        await api.delete(`/addresses/${id}`);
    }
};
