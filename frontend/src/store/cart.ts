import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
    id: string; // unique cart item id (product id + size + color)
    productId: string;
    product: Product;
    quantity: number;
    size: string;
    color: string;
    customNotes?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,

            addItem: (item) => {
                const id = `${item.productId}-${item.size}-${item.color}`;
                const existingItem = get().items.find((i) => i.id === id);

                if (existingItem) {
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    }));
                } else {
                    set((state) => ({
                        items: [...state.items, { ...item, id }],
                    }));
                }
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }));
            },

            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
