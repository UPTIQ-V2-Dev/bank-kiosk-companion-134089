import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/Header';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { bankingService } from '@/services/banking';
import { formatCurrency } from '@/utils/formatters';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Home,
    PiggyBank,
    Plane,
    CreditCard,
    TrendingUp,
    Award,
    Star,
    Info,
    Calculator,
    FileText,
    Phone
} from 'lucide-react';

const getProductIcon = (category: string, iconName?: string) => {
    if (iconName) {
        switch (iconName) {
            case 'home':
                return <Home className='h-6 w-6' />;
            case 'piggy-bank':
                return <PiggyBank className='h-6 w-6' />;
            case 'plane':
                return <Plane className='h-6 w-6' />;
            case 'credit-card':
                return <CreditCard className='h-6 w-6' />;
            case 'trending-up':
                return <TrendingUp className='h-6 w-6' />;
            default:
                break;
        }
    }

    switch (category) {
        case 'loan':
            return <Home className='h-6 w-6' />;
        case 'deposit':
            return <PiggyBank className='h-6 w-6' />;
        case 'insurance':
            return <Plane className='h-6 w-6' />;
        case 'card':
            return <CreditCard className='h-6 w-6' />;
        case 'investment':
            return <TrendingUp className='h-6 w-6' />;
        default:
            return <Award className='h-6 w-6' />;
    }
};

const getCategoryColor = (category: string): string => {
    switch (category) {
        case 'loan':
            return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
        case 'deposit':
            return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
        case 'insurance':
            return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400';
        case 'card':
            return 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400';
        case 'investment':
            return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400';
        default:
            return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
    }
};

const ProductDetailsSkeleton = () => (
    <div className='space-y-6'>
        <div className='flex items-center gap-4'>
            <Skeleton className='h-10 w-24' />
            <Skeleton className='h-8 w-48' />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
                <Card>
                    <CardHeader>
                        <Skeleton className='h-6 w-32' />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className='h-20 w-full' />
                    </CardContent>
                </Card>
            </div>
            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <Skeleton className='h-6 w-32' />
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3'>
                            {[1, 2, 3].map(i => (
                                <Skeleton
                                    key={i}
                                    className='h-4 w-full'
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { customer, isAuthenticated } = useCustomerAuth();

    const {
        data: product,
        isLoading: isProductLoading,
        error: productError
    } = useQuery({
        queryKey: ['product', id],
        queryFn: () => bankingService.getProductDetails(id!),
        retry: 2,
        enabled: !!id && isAuthenticated && !!customer
    });

    const {
        data: eligibilityData,
        isLoading: isEligibilityLoading,
        error: eligibilityError
    } = useQuery({
        queryKey: ['eligibility', customer?.id, id, product?.name],
        queryFn: () => bankingService.checkProductEligibility(customer!.id, id!, product!.name),
        enabled: !!product && !!customer && !!id && isAuthenticated,
        retry: 2
    });

    const { data: ratesAndFees, isLoading: isRatesLoading } = useQuery({
        queryKey: ['rates-fees', id, product?.name],
        queryFn: () => bankingService.getProductRatesAndFees(id!, product!.name),
        enabled: !!product && !!id && isAuthenticated,
        retry: 2
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

    if (!id) {
        return (
            <Navigate
                to='/dashboard'
                replace
            />
        );
    }

    const isLoading = isProductLoading || isEligibilityLoading || isRatesLoading;

    if (productError) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <Header />
                <div className='container mx-auto px-4 py-8'>
                    <Alert variant='destructive'>
                        <XCircle className='h-4 w-4' />
                        <AlertDescription>
                            Product not found or failed to load. Please try again or go back to the dashboard.
                        </AlertDescription>
                    </Alert>
                    <Button
                        asChild
                        className='mt-4'
                    >
                        <Link to='/dashboard'>
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Header />

            <main className='container mx-auto px-4 py-8'>
                {isLoading ? (
                    <ProductDetailsSkeleton />
                ) : (
                    <>
                        {/* Navigation */}
                        <div className='flex items-center gap-4 mb-6'>
                            <Button
                                variant='outline'
                                size='sm'
                                asChild
                            >
                                <Link to='/dashboard'>
                                    <ArrowLeft className='mr-2 h-4 w-4' />
                                    Back to Dashboard
                                </Link>
                            </Button>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>Product Details</span>
                                <span className='text-sm text-gray-400'>•</span>
                                <span className='text-sm font-medium'>{product?.name}</span>
                            </div>
                        </div>

                        {/* Product Header */}
                        <div className='mb-8'>
                            <div className='flex items-start gap-4 mb-4'>
                                <div
                                    className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${product ? getCategoryColor(product.category) : 'bg-gray-100'}`}
                                >
                                    {product && getProductIcon(product.category, product.icon)}
                                </div>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                            {product?.name}
                                        </h1>
                                        <Badge
                                            variant='outline'
                                            className='text-sm'
                                        >
                                            {product?.category}
                                        </Badge>
                                        {product?.isRecommended && (
                                            <Badge
                                                variant='default'
                                                className='bg-gold-500 text-white'
                                            >
                                                <Star className='mr-1 h-3 w-3 fill-current' />
                                                Recommended
                                            </Badge>
                                        )}
                                    </div>
                                    <p className='text-lg text-gray-600 dark:text-gray-400'>{product?.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                            {/* Main Content */}
                            <div className='lg:col-span-2 space-y-6'>
                                {/* Eligibility Check Results */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            {eligibilityData?.eligible ? (
                                                <CheckCircle className='h-5 w-5 text-green-500' />
                                            ) : (
                                                <XCircle className='h-5 w-5 text-red-500' />
                                            )}
                                            Eligibility Status for {customer.firstName}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {eligibilityError ? (
                                            <Alert>
                                                <Info className='h-4 w-4' />
                                                <AlertDescription>
                                                    Unable to check eligibility at the moment. Please contact our
                                                    support team.
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className='space-y-4'>
                                                <div
                                                    className={`p-4 rounded-lg ${eligibilityData?.eligible ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}
                                                >
                                                    <p
                                                        className={`font-semibold ${eligibilityData?.eligible ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}
                                                    >
                                                        {eligibilityData?.eligible
                                                            ? '🎉 Great news! You are eligible for this product.'
                                                            : '⚠️ You may not be eligible for this product at the moment.'}
                                                    </p>
                                                    {eligibilityData?.additionalInfo && (
                                                        <p
                                                            className={`text-sm mt-2 ${eligibilityData?.eligible ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}
                                                        >
                                                            {eligibilityData.additionalInfo}
                                                        </p>
                                                    )}
                                                </div>

                                                {eligibilityData?.requirements &&
                                                    eligibilityData.requirements.length > 0 && (
                                                        <div>
                                                            <h4 className='font-semibold mb-3'>
                                                                Eligibility Requirements:
                                                            </h4>
                                                            <ul className='space-y-2'>
                                                                {eligibilityData.requirements.map(
                                                                    (req: string, index: number) => (
                                                                        <li
                                                                            key={index}
                                                                            className='flex items-start gap-2 text-sm'
                                                                        >
                                                                            <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                                                                            <span>{req}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {eligibilityData?.documentsRequired &&
                                                    eligibilityData.documentsRequired.length > 0 && (
                                                        <div>
                                                            <h4 className='font-semibold mb-3'>Required Documents:</h4>
                                                            <ul className='space-y-2'>
                                                                {eligibilityData.documentsRequired.map(
                                                                    (doc: string, index: number) => (
                                                                        <li
                                                                            key={index}
                                                                            className='flex items-start gap-2 text-sm'
                                                                        >
                                                                            <FileText className='h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0' />
                                                                            <span>{doc}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Product Features */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Key Features</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {product?.features && product.features.length > 0 ? (
                                            <ul className='space-y-3'>
                                                {product.features.map((feature, index) => (
                                                    <li
                                                        key={index}
                                                        className='flex items-start gap-3'
                                                    >
                                                        <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                                                        <span className='text-sm'>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className='text-gray-500 dark:text-gray-400'>No features available</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Rates and Fees */}
                                {ratesAndFees && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='flex items-center gap-2'>
                                                <Calculator className='h-5 w-5' />
                                                Rates & Fees
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='space-y-4'>
                                                {ratesAndFees.rates && ratesAndFees.rates.length > 0 && (
                                                    <div>
                                                        <h4 className='font-semibold mb-3'>Interest Rates</h4>
                                                        <div className='space-y-2'>
                                                            {ratesAndFees.rates.map((rate: any, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
                                                                >
                                                                    <div>
                                                                        <span className='font-medium'>{rate.type}</span>
                                                                        {rate.conditions && (
                                                                            <p className='text-xs text-gray-500 mt-1'>
                                                                                {rate.conditions}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <span className='font-bold text-lg text-blue-600'>
                                                                        {rate.rate}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {ratesAndFees.fees && ratesAndFees.fees.length > 0 && (
                                                    <div>
                                                        <h4 className='font-semibold mb-3'>Fees & Charges</h4>
                                                        <div className='space-y-2'>
                                                            {ratesAndFees.fees.map((fee: any, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
                                                                >
                                                                    <div>
                                                                        <span className='font-medium'>
                                                                            {fee.feeType}
                                                                        </span>
                                                                        {fee.description && (
                                                                            <p className='text-xs text-gray-500 mt-1'>
                                                                                {fee.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <span className='font-bold text-lg text-orange-600'>
                                                                        {fee.amount}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {ratesAndFees.terms && ratesAndFees.terms.length > 0 && (
                                                    <div>
                                                        <h4 className='font-semibold mb-3'>Terms & Conditions</h4>
                                                        <ul className='space-y-1'>
                                                            {ratesAndFees.terms.map((term: string, index: number) => (
                                                                <li
                                                                    key={index}
                                                                    className='text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2'
                                                                >
                                                                    <span className='text-gray-400 mt-1'>•</span>
                                                                    <span>{term}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className='space-y-6'>
                                {/* Product Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        {product?.interestRate && (
                                            <div className='flex justify-between'>
                                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                    Interest Rate
                                                </span>
                                                <span className='font-semibold'>{product.interestRate}% p.a.</span>
                                            </div>
                                        )}

                                        {product?.minAmount && (
                                            <div className='flex justify-between'>
                                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                    Minimum Amount
                                                </span>
                                                <span className='font-semibold'>
                                                    {formatCurrency(product.minAmount)}
                                                </span>
                                            </div>
                                        )}

                                        {product?.maxAmount && (
                                            <div className='flex justify-between'>
                                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                    Maximum Amount
                                                </span>
                                                <span className='font-semibold'>
                                                    {formatCurrency(product.maxAmount)}
                                                </span>
                                            </div>
                                        )}

                                        {product?.tenure && (
                                            <div className='flex justify-between'>
                                                <span className='text-sm text-gray-600 dark:text-gray-400'>Tenure</span>
                                                <span className='font-semibold'>{product.tenure}</span>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className='flex justify-between'>
                                            <span className='text-sm text-gray-600 dark:text-gray-400'>Category</span>
                                            <Badge variant='outline'>{product?.category}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact Agent */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <Phone className='h-5 w-5' />
                                            Need Help?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                                            Have questions about this product or need assistance with your application?
                                        </p>

                                        <div className='space-y-3'>
                                            <Button
                                                className='w-full'
                                                size='sm'
                                            >
                                                <Phone className='mr-2 h-4 w-4' />
                                                Contact Agent
                                            </Button>

                                            <Button
                                                variant='outline'
                                                className='w-full'
                                                size='sm'
                                            >
                                                Schedule Appointment
                                            </Button>
                                        </div>

                                        <div className='text-center pt-2'>
                                            <p className='text-xs text-gray-500'>
                                                Our agents are available 24/7 to assist you
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Apply Now */}
                                {eligibilityData?.eligible && (
                                    <Card className='border-green-200 dark:border-green-800'>
                                        <CardContent className='p-6 text-center space-y-4'>
                                            <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto'>
                                                <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
                                            </div>

                                            <div>
                                                <h3 className='font-semibold text-green-800 dark:text-green-200'>
                                                    You're Eligible!
                                                </h3>
                                                <p className='text-sm text-green-600 dark:text-green-400 mt-1'>
                                                    Ready to get started?
                                                </p>
                                            </div>

                                            <Button className='w-full bg-green-600 hover:bg-green-700'>
                                                Apply Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
