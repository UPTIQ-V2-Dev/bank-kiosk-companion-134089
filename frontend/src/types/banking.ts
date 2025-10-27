export interface Customer {
    id: string;
    customerId: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    accountNumber: string;
    accountType: string;
    branch: string;
    lastVisit: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerLoginRequest {
    customerIdOrMobile: string;
}

export interface OTPRequest {
    customerIdOrMobile: string;
    otp: string;
}

export interface CustomerAuthResponse {
    customer: Customer;
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface Transaction {
    id: string;
    customerId: string;
    type: 'debit' | 'credit';
    amount: number;
    description: string;
    date: string;
    balance: number;
    reference: string;
}

export interface Bill {
    id: string;
    customerId: string;
    type: 'utility' | 'credit_card' | 'loan' | 'insurance';
    provider: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    accountNumber: string;
}

export interface Product {
    id: string;
    name: string;
    category: 'loan' | 'deposit' | 'insurance' | 'card' | 'investment';
    description: string;
    features: string[];
    interestRate?: number;
    minAmount?: number;
    maxAmount?: number;
    tenure?: string;
    eligibility: string[];
    isRecommended?: boolean;
    priority?: number;
    icon: string;
}

export interface ProductRecommendation {
    productId: string;
    customerId: string;
    score: number;
    reason: string;
    priority: number;
    personalizedBenefits?: string[];
    userProfile?: {
        income?: number;
        savings?: number;
        creditScore?: number;
        age?: number;
        occupation?: string;
    };
    specificReasons?: {
        financialGoal?: string;
        riskProfile?: string;
        currentNeed?: string;
        potentialSavings?: number;
    };
}

export interface DashboardData {
    customer: Customer;
    lastVisit: {
        date: string;
        branch: string;
        purpose: string;
    };
    recentTransactions: Transaction[];
    upcomingBills: Bill[];
    totalBalance: number;
    savingsBalance: number;
    checkingBalance: number;
}
