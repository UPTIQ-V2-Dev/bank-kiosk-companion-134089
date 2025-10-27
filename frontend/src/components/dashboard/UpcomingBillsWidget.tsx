import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Zap, CreditCard, Shield, Calendar } from 'lucide-react';
import { formatCurrency, getBillStatusColor } from '@/utils/formatters';
import type { Bill } from '@/types/banking';

interface UpcomingBillsWidgetProps {
    bills: Bill[];
}

const getBillIcon = (type: Bill['type']) => {
    switch (type) {
        case 'utility':
            return <Zap className='h-4 w-4' />;
        case 'credit_card':
            return <CreditCard className='h-4 w-4' />;
        case 'insurance':
            return <Shield className='h-4 w-4' />;
        case 'loan':
            return <Calendar className='h-4 w-4' />;
        default:
            return <Calendar className='h-4 w-4' />;
    }
};

const getBillTypeColor = (type: Bill['type']): string => {
    switch (type) {
        case 'utility':
            return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400';
        case 'credit_card':
            return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
        case 'insurance':
            return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
        case 'loan':
            return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400';
        default:
            return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
    }
};

const getDaysUntilDue = (dueDate: string): number => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const UpcomingBillsWidget = ({ bills }: UpcomingBillsWidgetProps) => {
    const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const overdueBills = bills.filter(bill => bill.status === 'overdue').length;

    return (
        <Card className='h-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
                <CardTitle className='text-lg font-semibold'>Upcoming Bills</CardTitle>
                <div className='flex gap-2'>
                    {overdueBills > 0 && (
                        <Badge
                            variant='destructive'
                            className='text-xs'
                        >
                            {overdueBills} overdue
                        </Badge>
                    )}
                    <Badge
                        variant='secondary'
                        className='text-xs'
                    >
                        {bills.length} total
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className='p-0'>
                <ScrollArea className='h-[300px]'>
                    <div className='p-6 pt-0 space-y-3'>
                        {sortedBills.length === 0 ? (
                            <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                                <p>No upcoming bills</p>
                            </div>
                        ) : (
                            sortedBills.map(bill => {
                                const daysUntilDue = getDaysUntilDue(bill.dueDate);
                                const isUrgent = daysUntilDue <= 3 && bill.status === 'pending';

                                return (
                                    <div
                                        key={bill.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                            bill.status === 'overdue'
                                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'
                                                : isUrgent
                                                  ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950'
                                                  : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div
                                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getBillTypeColor(bill.type)}`}
                                            >
                                                {getBillIcon(bill.type)}
                                            </div>

                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2'>
                                                    <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                                                        {bill.provider}
                                                    </p>
                                                    {bill.status === 'overdue' && (
                                                        <AlertTriangle className='h-4 w-4 text-red-500' />
                                                    )}
                                                </div>
                                                <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                                                    <span>{bill.accountNumber}</span>
                                                    <span>•</span>
                                                    <span className={getBillStatusColor(bill.status)}>
                                                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text-right flex-shrink-0'>
                                            <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                                                {formatCurrency(bill.amount)}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                {bill.status === 'overdue'
                                                    ? `${Math.abs(daysUntilDue)} days overdue`
                                                    : daysUntilDue <= 0
                                                      ? 'Due today'
                                                      : `Due in ${daysUntilDue} days`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
