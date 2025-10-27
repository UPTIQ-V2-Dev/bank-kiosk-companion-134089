import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import {
    mockCustomerAuthResponse,
    mockDashboardData,
    mockProducts,
    mockProductRecommendations
} from '@/data/bankingMockData';
import type {
    CustomerLoginRequest,
    OTPRequest,
    CustomerAuthResponse,
    DashboardData,
    Product,
    ProductRecommendation
} from '@/types/banking';

export const bankingService = {
    // Customer login with ID or mobile number
    customerLogin: async (credentials: CustomerLoginRequest): Promise<{ message: string; otpSent: boolean }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: customerLogin ---', credentials);
            await mockApiDelay();
            return {
                message: 'OTP sent to registered mobile number ending with ***90',
                otpSent: true
            };
        }
        const response = await api.post('/auth/customer/login', credentials);
        return response.data;
    },

    // Verify OTP and authenticate customer
    verifyOTP: async (otpData: OTPRequest): Promise<CustomerAuthResponse> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: verifyOTP ---', otpData);
            await mockApiDelay();
            return mockCustomerAuthResponse;
        }
        const response = await api.post('/auth/customer/verify-otp', otpData);
        return response.data;
    },

    // Get customer dashboard data
    getDashboardData: async (customerId: string): Promise<DashboardData> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getDashboardData ---', { customerId });
            await mockApiDelay();
            return mockDashboardData;
        }
        const response = await api.get(`/customer/${customerId}/dashboard`);
        return response.data;
    },

    // Get all products from catalogue
    getProducts: async (): Promise<Product[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getProducts ---');
            await mockApiDelay();
            return mockProducts;
        }
        const response = await api.get('/products/catalogue');
        return response.data;
    },

    // Get product recommendations for customer
    getProductRecommendations: async (customerId: string): Promise<ProductRecommendation[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getProductRecommendations ---', { customerId });
            await mockApiDelay();
            return mockProductRecommendations;
        }
        const response = await api.get(`/customer/${customerId}/recommendations`);
        return response.data;
    },

    // Get single product details
    getProductDetails: async (productId: string): Promise<Product> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getProductDetails ---', { productId });
            await mockApiDelay();
            const product = mockProducts.find(p => p.id === productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        }
        const response = await api.get(`/products/${productId}`);
        return response.data;
    },

    // Contact agent for product inquiry
    contactAgent: async (data: {
        customerId: string;
        productId: string;
        message: string;
        preferredContactMethod: 'phone' | 'email';
    }): Promise<{ message: string; ticketId: string }> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: contactAgent ---', data);
            await mockApiDelay();
            return {
                message: 'Your inquiry has been submitted. An agent will contact you within 24 hours.',
                ticketId: 'TKT' + Date.now()
            };
        }
        const response = await api.post('/agent/contact', data);
        return response.data;
    }
};
