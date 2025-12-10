export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    images: string[];
    basePrice: number;
    availableSizes: string[];
    availableColors: string[];
    stockQuantity: number;
    active: boolean;
}

export interface User {
    id: string;
    email: string;
    roles: string[];
}
