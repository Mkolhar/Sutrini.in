import api from '@/lib/api';

export interface DesignAsset {
    id: string;
    name: string;
    type: string;
    mockupImageUrl: string;
    basePrice: number;
    printAreaTop: string;
    printAreaLeft: string;
    printAreaWidth: string;
    printAreaHeight: string;
}

export const designAssetService = {
    getAllAssets: async () => {
        const response = await api.get<DesignAsset[]>('/design-assets');
        return response.data;
    },

    createAsset: async (asset: Partial<DesignAsset>) => {
        const response = await api.post<DesignAsset>('/design-assets', asset);
        return response.data;
    },

    updateAsset: async (id: string, asset: Partial<DesignAsset>) => {
        const response = await api.put<DesignAsset>(`/design-assets/${id}`, asset);
        return response.data;
    },

    deleteAsset: async (id: string) => {
        await api.delete(`/design-assets/${id}`);
    }
};
