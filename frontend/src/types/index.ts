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

export interface Address {
    id?: string;
    userId?: string;
    fullName: string;
    streetAddress: string;
    aptSuite?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    isDefault: boolean;
    active?: boolean;
    latitude?: number;
    longitude?: number;
}
