import { format, parseISO, isValid } from 'date-fns';

export const formatCurrency = (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

export const formatDate = (dateString: string, formatStr = 'MMM dd, yyyy'): string => {
    try {
        const date = parseISO(dateString);
        if (!isValid(date)) {
            return 'Invalid date';
        }
        return format(date, formatStr);
    } catch {
        return 'Invalid date';
    }
};

export const formatDateTime = (dateString: string): string => {
    return formatDate(dateString, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        if (!isValid(date)) {
            return 'Invalid date';
        }

        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return formatDate(dateString);
        }
    } catch {
        return 'Invalid date';
    }
};

export const formatAccountNumber = (accountNumber: string): string => {
    if (accountNumber.length <= 4) {
        return accountNumber;
    }
    return `****${accountNumber.slice(-4)}`;
};

export const getBillStatusColor = (status: 'pending' | 'paid' | 'overdue'): string => {
    switch (status) {
        case 'paid':
            return 'text-green-600 dark:text-green-400';
        case 'overdue':
            return 'text-red-600 dark:text-red-400';
        case 'pending':
        default:
            return 'text-yellow-600 dark:text-yellow-400';
    }
};

export const getTransactionTypeColor = (type: 'credit' | 'debit'): string => {
    return type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
};

export const getTransactionSymbol = (type: 'credit' | 'debit'): string => {
    return type === 'credit' ? '+' : '-';
};
