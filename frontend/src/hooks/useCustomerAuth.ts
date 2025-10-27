import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer } from '@/types/banking';

interface CustomerAuthState {
    customer: Customer | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setCustomerAuth: (customer: Customer, accessToken: string) => void;
    logout: () => void;
}

export const useCustomerAuth = create<CustomerAuthState>()(
    persist(
        set => ({
            customer: null,
            accessToken: null,
            isAuthenticated: false,
            setCustomerAuth: (customer: Customer, accessToken: string) =>
                set({ customer, accessToken, isAuthenticated: true }),
            logout: () => set({ customer: null, accessToken: null, isAuthenticated: false })
        }),
        {
            name: 'customer-auth-storage'
        }
    )
);
