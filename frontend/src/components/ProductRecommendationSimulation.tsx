import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, DollarSign, Building, TrendingUp } from 'lucide-react';
import { emitter } from '@/agentSdk';

type RecommendationResult = {
    recommendations: Array<{
        productName: string;
        reason: string;
        benefits?: string[];
    }>;
    bestMatch?: string;
};

export const ProductRecommendationSimulation = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RecommendationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const simulateRecommendation = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await emitter.emit({
                agentId: '3b4ec709-d050-4020-975a-11c3e24a2516',
                event: 'Recommendation_Request',
                payload: {
                    businessProfile: {
                        annualRevenue: '$100,000 USD',
                        businessType: 'Small Business',
                        industry: 'General Business',
                        loanPurpose: 'Equipment Finance',
                        loanAmount: 'Not specified'
                    },
                    customerQuery: 'I have an annual revenue of 1 lac USD and need loan for equipment finance',
                    requestType: 'business_loan_recommendation'
                }
            });

            if (response) {
                setResult(response as RecommendationResult);
            } else {
                setError('No recommendations received from the agent');
            }
        } catch (err) {
            console.error('Error getting recommendations:', err);
            setError('Failed to get product recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-6 space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Building className='h-5 w-5' />
                        Product Recommendation Simulation
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='bg-blue-50 dark:bg-blue-950 p-4 rounded-lg'>
                        <h3 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>Business Scenario:</h3>
                        <div className='text-blue-700 dark:text-blue-300 space-y-1'>
                            <p>• Annual Revenue: $100,000 USD</p>
                            <p>• Business Type: Small Business</p>
                            <p>• Financing Need: Equipment Finance Loan</p>
                        </div>
                    </div>

                    <Button
                        onClick={simulateRecommendation}
                        disabled={loading}
                        className='w-full'
                        size='lg'
                    >
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Getting AI Recommendations...
                            </>
                        ) : (
                            <>
                                <TrendingUp className='mr-2 h-4 w-4' />
                                Get Product Recommendations
                            </>
                        )}
                    </Button>

                    {error && (
                        <Alert variant='destructive'>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {result && (
                        <div className='space-y-4'>
                            <Alert>
                                <DollarSign className='h-4 w-4' />
                                <AlertDescription>
                                    <strong>AI Agent Response Received!</strong> Below are the personalized product
                                    recommendations based on your business profile.
                                </AlertDescription>
                            </Alert>

                            {result.bestMatch && (
                                <Card className='border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800'>
                                    <CardHeader>
                                        <CardTitle className='text-green-800 dark:text-green-200 text-lg'>
                                            🎯 Best Match
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-green-700 dark:text-green-300 font-medium'>
                                            {result.bestMatch}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            <div className='space-y-3'>
                                <h3 className='text-lg font-semibold'>Recommended Products:</h3>
                                {result.recommendations.map((rec, index) => (
                                    <Card
                                        key={index}
                                        className='hover:shadow-md transition-shadow'
                                    >
                                        <CardContent className='p-4'>
                                            <h4 className='font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300'>
                                                {rec.productName}
                                            </h4>
                                            <p className='text-gray-600 dark:text-gray-400 mb-3'>{rec.reason}</p>
                                            {rec.benefits && rec.benefits.length > 0 && (
                                                <div>
                                                    <p className='font-medium text-sm mb-2'>Key Benefits:</p>
                                                    <ul className='list-disc list-inside text-sm space-y-1 text-gray-600 dark:text-gray-400'>
                                                        {rec.benefits.map((benefit, idx) => (
                                                            <li key={idx}>{benefit}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
