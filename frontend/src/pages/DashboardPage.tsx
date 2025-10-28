import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/Header';
import { LastVisitWidget } from '@/components/dashboard/LastVisitWidget';
import { RecentTransactionsWidget } from '@/components/dashboard/RecentTransactionsWidget';
import { UpcomingBillsWidget } from '@/components/dashboard/UpcomingBillsWidget';
import { ProductCatalogueWidget } from '@/components/dashboard/ProductCatalogueWidget';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { bankingService } from '@/services/banking';
import { AlertTriangle, Wallet, Activity, Calendar, Package } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { emitter } from '@/agentSdk';

const LoadingSkeleton = () => (
    <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map(i => (
                <Card key={i}>
                    <CardContent className='p-6'>
                        <Skeleton className='h-6 w-24 mb-2' />
                        <Skeleton className='h-8 w-32' />
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {[1, 2, 3, 4].map(i => (
                <Card
                    key={i}
                    className='h-[400px]'
                >
                    <CardContent className='p-6'>
                        <Skeleton className='h-6 w-32 mb-4' />
                        <div className='space-y-3'>
                            {[1, 2, 3, 4, 5].map(j => (
                                <Skeleton
                                    key={j}
                                    className='h-16 w-full'
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export const DashboardPage = () => {
    const { customer, isAuthenticated } = useCustomerAuth();

    const {
        data: dashboardData,
        isLoading: isDashboardLoading,
        error: dashboardError
    } = useQuery({
        queryKey: ['dashboard', customer?.id],
        queryFn: () => bankingService.getDashboardData(customer!.id),
        retry: 2,
        enabled: !!customer && isAuthenticated
    });

    const {
        data: products = [],
        isLoading: isProductsLoading,
        error: productsError
    } = useQuery({
        queryKey: ['products'],
        queryFn: () => bankingService.getProducts(),
        retry: 2,
        enabled: isAuthenticated
    });

    const { data: recommendations = [], isLoading: isRecommendationsLoading } = useQuery({
        queryKey: ['recommendations', customer?.id],
        queryFn: async () => {
            // First trigger agent recommendation request for business users
            try {
                await emitter.emit({
                    agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                    event: 'Recommendation_Request',
                    payload: {
                        customerId: customer!.id,
                        customerProfile: {
                            accountType: customer!.accountType,
                            occupation: 'Small and Medium Business Owner',
                            businessType: 'SME',
                            totalBalance: dashboardData?.totalBalance || 0,
                            savingsBalance: dashboardData?.savingsBalance || 0
                        },
                        query: 'I need banking product recommendations for my small and medium business. What products would be ideal for my business operations and growth?',
                        context: 'sme_business_recommendations'
                    }
                });
            } catch (error) {
                console.error('Failed to emit business recommendation request:', error);
            }

            return bankingService.getProductRecommendations(customer!.id);
        },
        retry: 2,
        enabled: !!customer && isAuthenticated && !!dashboardData
    });

    // Redirect to auth if not authenticated
    if (!isAuthenticated || !customer) {
        return (
            <Navigate
                to='/auth'
                replace
            />
        );
    }

    const isLoading = isDashboardLoading || isProductsLoading || isRecommendationsLoading;
    const hasError = dashboardError || productsError;

    if (hasError) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <Header />
                <div className='container mx-auto px-4 py-8'>
                    <Alert variant='destructive'>
                        <AlertTriangle className='h-4 w-4' />
                        <AlertDescription>
                            Failed to load dashboard data. Please try refreshing the page or contact support.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Header totalBalance={dashboardData?.totalBalance} />

            <main className='container mx-auto px-4 py-8'>
                {isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className='space-y-6'>
                        {/* Welcome Section */}
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                                Welcome back, {customer.firstName}!
                            </h1>
                            <p className='text-gray-600 dark:text-gray-400 mb-3'>
                                Here's an overview of your account and available services
                            </p>
                            <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                                <p className='text-blue-700 dark:text-blue-300 text-sm font-medium'>
                                    💼 <strong>Business Banking:</strong> Discover banking products specially designed
                                    for small and medium businesses like yours. Our AI assistant has analyzed your
                                    profile to recommend the best products for your business growth.
                                </p>
                            </div>
                        </div>

                        {/* Account Summary Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                            <Card className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
                                <CardContent className='p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-blue-100 text-sm font-medium'>Total Balance</p>
                                            <p className='text-2xl font-bold'>
                                                {formatCurrency(dashboardData?.totalBalance || 0)}
                                            </p>
                                        </div>
                                        <Wallet className='h-8 w-8 text-blue-200' />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
                                <CardContent className='p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-green-100 text-sm font-medium'>Savings</p>
                                            <p className='text-2xl font-bold'>
                                                {formatCurrency(dashboardData?.savingsBalance || 0)}
                                            </p>
                                        </div>
                                        <Activity className='h-8 w-8 text-green-200' />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
                                <CardContent className='p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-orange-100 text-sm font-medium'>Checking</p>
                                            <p className='text-2xl font-bold'>
                                                {formatCurrency(dashboardData?.checkingBalance || 0)}
                                            </p>
                                        </div>
                                        <Calendar className='h-8 w-8 text-orange-200' />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
                                <CardContent className='p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-purple-100 text-sm font-medium'>Products</p>
                                            <p className='text-2xl font-bold'>{products.length}</p>
                                        </div>
                                        <Package className='h-8 w-8 text-purple-200' />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Widgets Grid */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            {/* Last Visit Widget */}
                            {dashboardData?.lastVisit && <LastVisitWidget lastVisit={dashboardData.lastVisit} />}

                            {/* Recent Transactions Widget */}
                            <RecentTransactionsWidget transactions={dashboardData?.recentTransactions || []} />

                            {/* Upcoming Bills Widget */}
                            <UpcomingBillsWidget bills={dashboardData?.upcomingBills || []} />

                            {/* Product Catalogue Widget */}
                            <ProductCatalogueWidget
                                products={products}
                                recommendations={recommendations}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
