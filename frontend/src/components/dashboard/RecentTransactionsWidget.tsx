import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate, getTransactionTypeColor, getTransactionSymbol } from '@/utils/formatters';
import type { Transaction } from '@/types/banking';

interface RecentTransactionsWidgetProps {
    transactions: Transaction[];
}

export const RecentTransactionsWidget = ({ transactions }: RecentTransactionsWidgetProps) => {
    return (
        <Card className='h-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
                <CardTitle className='text-lg font-semibold'>Recent Transactions</CardTitle>
                <Badge
                    variant='secondary'
                    className='text-xs'
                >
                    {transactions.length} transactions
                </Badge>
            </CardHeader>
            <CardContent className='p-0'>
                <ScrollArea className='h-[300px]'>
                    <div className='p-6 pt-0 space-y-3'>
                        {transactions.length === 0 ? (
                            <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                                <p>No recent transactions</p>
                            </div>
                        ) : (
                            transactions.map(transaction => (
                                <div
                                    key={transaction.id}
                                    className='flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                                >
                                    <div className='flex items-center gap-3'>
                                        <div
                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                transaction.type === 'credit'
                                                    ? 'bg-green-100 dark:bg-green-900'
                                                    : 'bg-red-100 dark:bg-red-900'
                                            }`}
                                        >
                                            {transaction.type === 'credit' ? (
                                                <ArrowDownRight className='h-4 w-4 text-green-600 dark:text-green-400' />
                                            ) : (
                                                <ArrowUpRight className='h-4 w-4 text-red-600 dark:text-red-400' />
                                            )}
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                                                {transaction.description}
                                            </p>
                                            <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                                                <span>{formatDate(transaction.date, 'MMM dd')}</span>
                                                <span>•</span>
                                                <span>Ref: {transaction.reference}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='text-right flex-shrink-0'>
                                        <p
                                            className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}
                                        >
                                            {getTransactionSymbol(transaction.type)}
                                            {formatCurrency(transaction.amount)}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            Balance: {formatCurrency(transaction.balance)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
