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
    accountType: 'Business Account Plus',
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
        id: '6',
        name: 'SME Business Loan',
        category: 'loan',
        description: 'Quick business financing for small and medium enterprises',
        features: [
            'Competitive rates starting at 9.5%',
            'Flexible repayment up to 7 years',
            'Quick approval in 48 hours',
            'Minimal documentation required'
        ],
        interestRate: 9.5,
        minAmount: 50000,
        maxAmount: 5000000,
        tenure: '1-7 years',
        eligibility: ['Business vintage 2+ years', 'ITR for last 2 years', 'Business turnover 10L+'],
        isRecommended: true,
        priority: 1,
        icon: 'trending-up'
    },
    {
        id: '7',
        name: 'Business Current Account',
        category: 'deposit',
        description: 'Feature-rich current account designed for business operations',
        features: [
            'Free cash deposits up to 2L per month',
            'Unlimited online transactions',
            'Overdraft facility available',
            'Multi-user access with role-based permissions'
        ],
        minAmount: 25000,
        eligibility: ['Business registration documents', 'KYC compliance'],
        isRecommended: true,
        priority: 3,
        icon: 'home'
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
        productId: '6',
        customerId: '1',
        score: 98,
        reason: 'As a small business owner, this SME loan can help expand your operations and improve cash flow.',
        priority: 1,
        personalizedBenefits: [
            'Get up to ₹50L funding based on your business turnover',
            'Quick 48-hour approval with minimal documentation',
            'Flexible repayment options that align with your business cycle',
            'No collateral required for loans up to ₹25L'
        ],
        userProfile: {
            income: 200000,
            savings: 825000,
            creditScore: 780,
            age: 35,
            occupation: 'Business Owner'
        },
        specificReasons: {
            financialGoal: 'Business expansion and working capital management',
            riskProfile: 'Moderate risk with established business',
            currentNeed: 'Access to quick funding for business opportunities',
            potentialSavings: 0
        }
    },
    {
        productId: '7',
        customerId: '1',
        score: 95,
        reason: 'Your business needs a dedicated current account for better financial management and operations.',
        priority: 2,
        personalizedBenefits: [
            'Free cash deposits up to ₹2L per month saves ₹12,000 annually',
            'Overdraft facility up to ₹10L for managing cash flow gaps',
            'Multi-user access for your team members',
            'Integrated payment gateway for online business'
        ],
        userProfile: {
            income: 200000,
            savings: 825000,
            creditScore: 780,
            age: 35,
            occupation: 'Business Owner'
        },
        specificReasons: {
            financialGoal: 'Streamline business banking and reduce operational costs',
            riskProfile: 'Low risk with steady business income',
            currentNeed: 'Separate business and personal finances effectively',
            potentialSavings: 12000
        }
    },
    {
        productId: '1',
        customerId: '1',
        score: 92,
        reason: 'Based on your savings balance and income profile, you are eligible for our best home loan rates.',
        priority: 3,
        personalizedBenefits: [
            'Save ₹2.5L in interest over loan tenure with your income bracket',
            'Pre-approved for ₹50L based on your savings history',
            'No processing fees due to your premium customer status'
        ],
        userProfile: {
            income: 200000,
            savings: 825000,
            creditScore: 780,
            age: 35,
            occupation: 'Business Owner'
        },
        specificReasons: {
            financialGoal: 'Home ownership with optimal EMI structure',
            riskProfile: 'Low risk with stable income',
            currentNeed: 'Looking to upgrade from current rental property',
            potentialSavings: 250000
        }
    },
    {
        productId: '4',
        customerId: '1',
        score: 85,
        reason: 'Your transaction patterns show business-related expenses. A business credit card could save you money.',
        priority: 2,
        personalizedBenefits: [
            'Earn ₹18,000 cashback annually based on your spending pattern',
            'Get 45-day interest-free period for business purchases',
            'Build business credit history separate from personal credit'
        ],
        userProfile: {
            income: 120000,
            savings: 625000,
            creditScore: 780,
            age: 32,
            occupation: 'Software Engineer'
        },
        specificReasons: {
            financialGoal: 'Optimize business expenses and cash flow',
            riskProfile: 'Moderate risk with consistent business income',
            currentNeed: 'Better management of business-related expenses',
            potentialSavings: 18000
        }
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
