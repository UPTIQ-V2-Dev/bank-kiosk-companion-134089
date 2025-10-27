import type {
    Customer,
    CustomerAuthResponse,
    Transaction,
    Bill,
    Product,
    DashboardData,
    ProductRecommendation
} from '@/types/banking';

export const mockCustomer: Customer = {
    id: '1',
    customerId: 'CUST001234',
    firstName: 'John',
    lastName: 'Smith',
    mobile: '+1234567890',
    email: 'john.smith@email.com',
    accountNumber: '1234567890123456',
    accountType: 'Savings Plus',
    branch: 'Downtown Main Branch',
    lastVisit: '2024-10-20T10:30:00Z',
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2024-10-20T10:30:00Z'
};

export const mockCustomerAuthResponse: CustomerAuthResponse = {
    customer: mockCustomer,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    message: 'Login successful'
};

export const mockTransactions: Transaction[] = [
    {
        id: '1',
        customerId: '1',
        type: 'credit',
        amount: 2500.0,
        description: 'Salary Deposit',
        date: '2024-10-25T09:00:00Z',
        balance: 8750.0,
        reference: 'SAL001'
    },
    {
        id: '2',
        customerId: '1',
        type: 'debit',
        amount: 125.5,
        description: 'Online Purchase - Amazon',
        date: '2024-10-24T14:30:00Z',
        balance: 6250.0,
        reference: 'PUR002'
    },
    {
        id: '3',
        customerId: '1',
        type: 'debit',
        amount: 850.0,
        description: 'Rent Payment',
        date: '2024-10-22T08:15:00Z',
        balance: 6375.5,
        reference: 'RENT003'
    },
    {
        id: '4',
        customerId: '1',
        type: 'credit',
        amount: 45.0,
        description: 'Interest Credit',
        date: '2024-10-20T00:01:00Z',
        balance: 7225.5,
        reference: 'INT004'
    }
];

export const mockBills: Bill[] = [
    {
        id: '1',
        customerId: '1',
        type: 'utility',
        provider: 'City Electric Company',
        amount: 185.75,
        dueDate: '2024-11-05T23:59:00Z',
        status: 'pending',
        accountNumber: 'ELEC-789123'
    },
    {
        id: '2',
        customerId: '1',
        type: 'credit_card',
        provider: 'Premium Credit Card',
        amount: 1245.3,
        dueDate: '2024-11-12T23:59:00Z',
        status: 'pending',
        accountNumber: '**** 4567'
    },
    {
        id: '3',
        customerId: '1',
        type: 'insurance',
        provider: 'Life Guardian Insurance',
        amount: 95.0,
        dueDate: '2024-11-15T23:59:00Z',
        status: 'pending',
        accountNumber: 'POL-456789'
    }
];

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Premium Home Loan',
        category: 'loan',
        description: 'Low interest home loan with flexible repayment options',
        features: [
            'Competitive interest rates starting from 6.5%',
            'Up to 30-year tenure',
            'No prepayment penalties',
            'Quick approval process'
        ],
        interestRate: 6.5,
        minAmount: 100000,
        maxAmount: 2000000,
        tenure: '5-30 years',
        eligibility: ['Minimum age: 21 years', 'Stable income for 2+ years', 'Good credit score (700+)'],
        isRecommended: true,
        priority: 1,
        icon: 'home'
    },
    {
        id: '2',
        name: 'Fixed Deposit Plus',
        category: 'deposit',
        description: 'High-yield fixed deposit with guaranteed returns',
        features: [
            'Attractive interest rates up to 7.2%',
            'Flexible tenure options',
            'Auto-renewal facility',
            'Loan against FD available'
        ],
        interestRate: 7.2,
        minAmount: 1000,
        tenure: '1 month - 10 years',
        eligibility: ['Any age', 'Minimum deposit amount'],
        priority: 3,
        icon: 'piggy-bank'
    },
    {
        id: '3',
        name: 'Travel Insurance Pro',
        category: 'insurance',
        description: 'Comprehensive travel protection for domestic and international trips',
        features: [
            'Medical coverage up to $100,000',
            'Trip cancellation protection',
            'Lost baggage compensation',
            '24/7 emergency assistance'
        ],
        eligibility: ['Age 6 months to 75 years', 'Valid travel documents required'],
        priority: 4,
        icon: 'plane'
    },
    {
        id: '4',
        name: 'Business Credit Card',
        category: 'card',
        description: 'Designed for business expenses with rewards and benefits',
        features: [
            '2% cashback on business purchases',
            'Higher credit limits',
            'Expense tracking tools',
            'No foreign transaction fees'
        ],
        eligibility: ['Business ownership proof', 'Good credit history', 'Minimum annual revenue'],
        isRecommended: true,
        priority: 2,
        icon: 'credit-card'
    },
    {
        id: '5',
        name: 'Wealth Builder SIP',
        category: 'investment',
        description: 'Systematic investment plan for long-term wealth creation',
        features: [
            'Diversified portfolio management',
            'Professional fund management',
            'Tax benefits under 80C',
            'Flexible SIP amounts'
        ],
        minAmount: 500,
        tenure: '3+ years recommended',
        eligibility: ['Age 18+', 'KYC compliance', 'Risk profiling completed'],
        priority: 5,
        icon: 'trending-up'
    }
];

export const mockProductRecommendations: ProductRecommendation[] = [
    {
        productId: '1',
        customerId: '1',
        score: 95,
        reason: 'Based on your savings balance and income profile, you are eligible for our best home loan rates.',
        priority: 1
    },
    {
        productId: '4',
        customerId: '1',
        score: 85,
        reason: 'Your transaction patterns show business-related expenses. A business credit card could save you money.',
        priority: 2
    }
];

export const mockDashboardData: DashboardData = {
    customer: mockCustomer,
    lastVisit: {
        date: '2024-10-20T10:30:00Z',
        branch: 'Downtown Main Branch',
        purpose: 'Account Statement & Loan Inquiry'
    },
    recentTransactions: mockTransactions,
    upcomingBills: mockBills,
    totalBalance: 8750.0,
    savingsBalance: 6250.0,
    checkingBalance: 2500.0
};
