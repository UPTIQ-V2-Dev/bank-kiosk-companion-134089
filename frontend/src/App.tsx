import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { ProductRecommendationSimulation } from '@/components/ProductRecommendationSimulation';
import { Toaster } from '@/components/ui/sonner';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000 // 5 minutes
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                    <Routes>
                        {/* Default redirect to auth */}
                        <Route
                            path='/'
                            element={
                                <Navigate
                                    to='/auth'
                                    replace
                                />
                            }
                        />

                        {/* Authentication */}
                        <Route
                            path='/auth'
                            element={<AuthPage />}
                        />

                        {/* Dashboard */}
                        <Route
                            path='/dashboard'
                            element={<DashboardPage />}
                        />

                        {/* Product Details */}
                        <Route
                            path='/products/:id'
                            element={<ProductDetailsPage />}
                        />

                        {/* Product Recommendation Simulation */}
                        <Route
                            path='/simulation'
                            element={<ProductRecommendationSimulation />}
                        />

                        {/* Catch all - redirect to auth */}
                        <Route
                            path='*'
                            element={
                                <Navigate
                                    to='/auth'
                                    replace
                                />
                            }
                        />
                    </Routes>

                    {/* Toast notifications */}
                    <Toaster
                        position='top-center'
                        richColors
                    />
                </div>
            </Router>
        </QueryClientProvider>
    );
};
