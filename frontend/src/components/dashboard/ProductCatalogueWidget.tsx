import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, ArrowRight, Home, PiggyBank, Plane, CreditCard, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { emitter } from '@/agentSdk';
import type { Product } from '@/types/banking';

interface ProductCatalogueWidgetProps {
    products: Product[];
    recommendations?: Array<{ productId: string; score: number; reason: string; priority: number }>;
}

const getProductIcon = (category: Product['category'], iconName?: string) => {
    if (iconName) {
        switch (iconName) {
            case 'home':
                return <Home className='h-5 w-5' />;
            case 'piggy-bank':
                return <PiggyBank className='h-5 w-5' />;
            case 'plane':
                return <Plane className='h-5 w-5' />;
            case 'credit-card':
                return <CreditCard className='h-5 w-5' />;
            case 'trending-up':
                return <TrendingUp className='h-5 w-5' />;
            default:
                break;
        }
    }

    switch (category) {
        case 'loan':
            return <Home className='h-5 w-5' />;
        case 'deposit':
            return <PiggyBank className='h-5 w-5' />;
        case 'insurance':
            return <Plane className='h-5 w-5' />;
        case 'card':
            return <CreditCard className='h-5 w-5' />;
        case 'investment':
            return <TrendingUp className='h-5 w-5' />;
        default:
            return <Award className='h-5 w-5' />;
    }
};

const getCategoryColor = (category: Product['category']): string => {
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

export const ProductCatalogueWidget = ({ products, recommendations = [] }: ProductCatalogueWidgetProps) => {
    // Sort products: recommended first, then by priority
    const sortedProducts = [...products].sort((a, b) => {
        const aRecommended = recommendations.some(r => r.productId === a.id);
        const bRecommended = recommendations.some(r => r.productId === b.id);

        if (aRecommended && !bRecommended) return -1;
        if (!aRecommended && bRecommended) return 1;

        return (a.priority || 999) - (b.priority || 999);
    });

    const getRecommendation = (productId: string) => {
        return recommendations.find(r => r.productId === productId);
    };

    const handleProductClick = async (product: Product) => {
        try {
            // Trigger Information_Request event when user shows interest in a product
            emitter.emit({
                agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                event: 'Information_Request',
                payload: {
                    productId: product.id,
                    productName: product.name,
                    productCategory: product.category,
                    userAction: 'product_click',
                    interestRate: product.interestRate,
                    query: `User clicked on ${product.name}. They want to learn more about this ${product.category}.`
                }
            });
        } catch (error) {
            console.error('Failed to emit product click event:', error);
        }
    };

    return (
        <Card className='h-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
                <CardTitle className='text-lg font-semibold'>Banking Products</CardTitle>
                <Badge
                    variant='secondary'
                    className='text-xs'
                >
                    {products.length} products
                </Badge>
            </CardHeader>
            <CardContent className='p-0'>
                <ScrollArea className='h-[400px]'>
                    <div className='p-6 pt-0 space-y-4'>
                        {sortedProducts.length === 0 ? (
                            <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                                <p>No products available</p>
                            </div>
                        ) : (
                            sortedProducts.map(product => {
                                const recommendation = getRecommendation(product.id);
                                const isRecommended = !!recommendation;

                                return (
                                    <div
                                        key={product.id}
                                        className={`relative p-4 rounded-lg border transition-all hover:shadow-md ${
                                            isRecommended
                                                ? 'border-gold-200 dark:border-gold-800 bg-gradient-to-r from-gold-50 to-yellow-50 dark:from-gold-950 dark:to-yellow-950'
                                                : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {isRecommended && (
                                            <div className='absolute -top-2 -right-2'>
                                                <div className='bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1'>
                                                    <Star className='h-3 w-3 fill-current' />
                                                    Recommended
                                                </div>
                                            </div>
                                        )}

                                        <div className='flex items-start justify-between gap-4'>
                                            <div className='flex items-start gap-3 flex-1'>
                                                <div
                                                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(product.category)}`}
                                                >
                                                    {getProductIcon(product.category, product.icon)}
                                                </div>

                                                <div className='flex-1 min-w-0'>
                                                    <div className='flex items-center gap-2 mb-1'>
                                                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 truncate'>
                                                            {product.name}
                                                        </h3>
                                                        <Badge
                                                            variant='outline'
                                                            className='text-xs'
                                                        >
                                                            {product.category}
                                                        </Badge>
                                                    </div>

                                                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2'>
                                                        {product.description}
                                                    </p>

                                                    {product.interestRate && (
                                                        <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                                            Interest Rate: {product.interestRate}% p.a.
                                                        </p>
                                                    )}

                                                    {product.minAmount && (
                                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                            Starting from {formatCurrency(product.minAmount)}
                                                        </p>
                                                    )}

                                                    {isRecommended && recommendation && (
                                                        <div className='mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gold-200 dark:border-gold-700'>
                                                            <p className='text-xs text-gold-600 dark:text-gold-400 font-medium'>
                                                                Why recommended: {recommendation.reason}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='flex-shrink-0'>
                                                <Button
                                                    asChild
                                                    size='sm'
                                                    variant={isRecommended ? 'default' : 'outline'}
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    <Link to={`/products/${product.id}`}>
                                                        Learn More
                                                        <ArrowRight className='ml-1 h-3 w-3' />
                                                    </Link>
                                                </Button>
                                            </div>
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
