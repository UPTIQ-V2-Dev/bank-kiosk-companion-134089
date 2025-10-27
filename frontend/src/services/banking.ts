import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import {
    mockCustomerAuthResponse,
    mockDashboardData,
    mockProducts,
    mockProductRecommendations
} from '@/data/bankingMockData';
import { emitter } from '@/agentSdk';
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
        try {
            // Use agent sync event for recommendations
            const agentResponse = await emitter.emit({
                agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                event: 'Recommendation_Request',
                payload: {
                    customerId,
                    query: 'I need product recommendations based on my profile',
                    context: 'customer_recommendations'
                }
            });

            if (agentResponse?.recommendations) {
                // Transform agent response to ProductRecommendation format
                return agentResponse.recommendations.map((rec: any, index: number) => ({
                    productId: (index + 1).toString(), // Map to product IDs
                    customerId: customerId,
                    score: 85 + index * 5, // Generate scores
                    reason: rec.reason || 'AI-recommended product',
                    priority: index + 1
                }));
            }
        } catch (error) {
            console.error('Agent recommendation request failed:', error);
        }

        // Fallback to traditional API/mock
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
        // First get the basic product from mock/API
        let product: Product;
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getProductDetails ---', { productId });
            await mockApiDelay();
            const foundProduct = mockProducts.find(p => p.id === productId);
            if (!foundProduct) {
                throw new Error('Product not found');
            }
            product = foundProduct;
        } else {
            const response = await api.get(`/products/${productId}`);
            product = response.data;
        }

        try {
            // Enhance product details with agent information
            const agentResponse = await emitter.emit({
                agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                event: 'Information_Request',
                payload: {
                    productId,
                    productName: product.name,
                    query: `tell me about ${product.name}`,
                    context: 'product_details'
                }
            });

            if (agentResponse?.productInfo) {
                // Enhance product with agent insights
                return {
                    ...product,
                    description: agentResponse.productInfo || product.description,
                    features: agentResponse.features || product.features,
                    eligibility: agentResponse.eligibility ? [agentResponse.eligibility] : product.eligibility
                };
            }
        } catch (error) {
            console.error('Agent information request failed:', error);
        }

        return product;
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
    },

    // Get product rates and fees using agent
    getProductRatesAndFees: async (productId: string, productName: string) => {
        try {
            // Use agent sync event for rate and fee information
            const agentResponse = await emitter.emit({
                agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                event: 'Rate_Term_Fee',
                payload: {
                    productId,
                    productName,
                    query: `What are the interest rates and fees for ${productName}?`,
                    context: 'rate_inquiry'
                }
            });

            return agentResponse;
        } catch (error) {
            console.error('Agent rate/fee request failed:', error);
            return null;
        }
    },

    // Check product eligibility using agent
    checkProductEligibility: async (customerId: string, productId: string, productName: string) => {
        try {
            // Use agent sync event for eligibility check
            const agentResponse = await emitter.emit({
                agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                event: 'Eligibility_Request',
                payload: {
                    customerId,
                    productId,
                    productName,
                    query: `Do I qualify for ${productName}? What are the eligibility criteria?`,
                    context: 'eligibility_check'
                }
            });

            return agentResponse;
        } catch (error) {
            console.error('Agent eligibility request failed:', error);
            return null;
        }
    },

    // Compare products using agent
    compareProducts: async (productIds: string[], productNames: string[]) => {
        try {
            // Use agent sync event for product comparison
            const agentResponse = await emitter.emit({
                agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                event: 'Comparison_Request',
                payload: {
                    productIds,
                    productNames,
                    query: `Compare these products: ${productNames.join(', ')}. Which is better?`,
                    context: 'product_comparison'
                }
            });

            return agentResponse;
        } catch (error) {
            console.error('Agent comparison request failed:', error);
            return null;
        }
    }
};
